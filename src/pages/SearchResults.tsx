import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, Calendar, Eye } from "lucide-react";
import { postsService, type Post } from "../services/posts";
import Navbar from "../ui/navbar/Navbar";
import Footer from "../ui/footer/Footer";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    const searchPosts = async () => {
      if (!query) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await postsService.getPosts({
          search: query,
          status: "publish",
          limit: 50,
        });
        setPosts(response.posts);
        setTotalResults(response.total);
      } catch (error) {
        console.error("Error searching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    searchPosts();
  }, [query]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Mencari artikel...</p>
        </div>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Cari Artikel
          </h1>
          <p className="text-gray-600">
            Masukkan kata kunci untuk mencari artikel
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Search className="w-5 h-5" />
            <span className="text-sm">Hasil pencarian untuk:</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            "{query}"
          </h1>
          <p className="text-gray-600">Ditemukan {totalResults} artikel</p>
        </div>

        {/* Results */}
        {posts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Tidak ada hasil
            </h2>
            <p className="text-gray-600 mb-6">
              Tidak ditemukan artikel yang sesuai dengan pencarian Anda.
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition"
            >
              Kembali ke Beranda
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden group"
              >
                <Link to={`/detail-news/${post.slug}`} className="block">
                  <div className="grid md:grid-cols-[200px_1fr] gap-6 p-6">
                    {/* Thumbnail */}
                    {post.featured_image && (
                      <div className="w-full h-48 md:h-full rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex flex-col justify-between">
                      <div>
                        {/* Category */}
                        {post.categories && post.categories.length > 0 && (
                          <div className="mb-2">
                            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                              {post.categories[0].name}
                            </span>
                          </div>
                        )}

                        {/* Title */}
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2">
                          {post.title}
                        </h2>

                        {/* Excerpt */}
                        {post.excerpt && (
                          <p className="text-gray-600 line-clamp-2 mb-4">
                            {post.excerpt}
                          </p>
                        )}
                      </div>

                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {formatDate(post.published_at || post.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{post.views || post.view_count || 0}</span>
                        </div>
                        {post.author && (
                          <div className="flex items-center gap-1">
                            <span className="font-medium">
                              {post.author.username}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

        {/* Back to home */}
        {posts.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-emerald-600 text-emerald-600 font-medium rounded-lg hover:bg-emerald-50 transition"
            >
              Kembali ke Beranda
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SearchResults;
