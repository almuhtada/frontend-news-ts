import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, Calendar, Eye, AlertCircle } from "lucide-react";
import { postsService, type Post } from "../services/posts";
import { getImageUrl } from "../config/api";
import PublicPageLayout from "../components/layouts/PublicPageLayout";
import { PLACEHOLDER_IMAGE_MEDIUM } from "../config/constants";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    const searchPosts = async () => {
      if (searchError) {
        return;
      }

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
        setSearchError(null);
      } catch (error) {
        console.error("Error searching posts:", error);
        setSearchError("Gagal mencari artikel. Silakan coba lagi.");
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
      <PublicPageLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Mencari artikel...</p>
          </div>
        </div>
      </PublicPageLayout>
    );
  }

  if (searchError) {
    return (
      <PublicPageLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Gagal Mencari
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{searchError}</p>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </PublicPageLayout>
    );
  }

  if (!query) {
    return (
      <PublicPageLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Cari Artikel
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Masukkan kata kunci untuk mencari artikel
            </p>
          </div>
        </div>
      </PublicPageLayout>
    );
  }

  return (
    <PublicPageLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Search Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
              <Search className="w-5 h-5" />
              <span className="text-sm">Hasil pencarian untuk:</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              "{query}"
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Ditemukan {totalResults} artikel</p>
          </div>

          {/* Results */}
          {posts.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-12 text-center w-full min-w-0">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Tidak ada hasil
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
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
            <div className="divide-y divide-gray-150 dark:divide-gray-800/80 w-full min-w-0">
              {posts.map((post) => {
                const categoryName = post.categories?.[0]?.name || "Berita";
                const authorName = post.author?.display_name || post.author?.username || "Admin";

                return (
                  <Link key={post.id} to={`/detail-news/${post.slug}`} className="group block py-6 w-full min-w-0">
                    <article className="flex flex-col md:flex-row gap-6 bg-transparent w-full min-w-0">
                      {/* Thumbnail */}
                      {post.featured_image && (
                        <div className="w-full md:w-44 aspect-[16/10] md:h-28 flex-shrink-0 overflow-hidden rounded-lg">
                          <img
                            src={getImageUrl(post.featured_image)}
                            alt={post.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = PLACEHOLDER_IMAGE_MEDIUM;
                            }}
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 min-w-0 flex flex-col justify-center w-full">
                        {/* Category */}
                        <span className="mb-2 inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          {categoryName}
                        </span>

                        {/* Title */}
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2 break-words">
                          {post.title}
                        </h2>

                        {/* Excerpt */}
                        {post.excerpt && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 leading-relaxed break-words">
                            {post.excerpt}
                          </p>
                        )}

                        {/* Meta */}
                        <div className="flex items-center gap-2.5 text-xs text-gray-400 dark:text-gray-500 flex-wrap min-w-0">
                          <span className="font-semibold text-gray-700 dark:text-gray-300">
                            Oleh {authorName}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>
                              {formatDate(post.published_at || post.createdAt)}
                            </span>
                          </span>
                          <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{post.views || post.view_count || 0}</span>
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
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
      </div>
    </PublicPageLayout>
  );
};

export default SearchResults;
