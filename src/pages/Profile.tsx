import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Flame as Fire, ChevronRight } from "lucide-react";
import CardHeadlinerApi from "../components/components-global/card-headliner-api";
import TrendingListApi from "../components/components-global/trending-list-api";
import ArticleCardApi from "../components/components-global/card-artikel-api";
import { postsService } from "../services/posts";
import { categoriesService } from "../services/categories";
import type { Post, Category } from "../services/posts";

const ProfilePage = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [featuredArticles, setFeaturedArticles] = useState<Post[]>([]);
  const [articles, setArticles] = useState<Post[]>([]);
  const [trendingNews, setTrendingNews] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Jika ada slug (dari category), fetch berdasarkan category
        if (slug) {
          const categoryPosts = await postsService.getPosts({
            category: slug,
            limit: 12,
            status: "publish",
          });
          setArticles(categoryPosts.posts);
          setFeaturedArticles(categoryPosts.posts.slice(0, 5));
        } else {
          // Fetch featured posts
          const featured = await postsService.getPosts({
            featured: true,
            limit: 5,
            status: "publish",
          });
          setFeaturedArticles(featured.posts);

          // Fetch articles
          const allPosts = await postsService.getPosts({
            limit: 12,
            status: "publish",
          });
          setArticles(allPosts.posts);
        }

        // Fetch popular posts
        const popular = await postsService.getPopularPosts(5);
        setTrendingNews(popular);

        // Fetch categories untuk topik hangat
        const categoriesData = await categoriesService.getCategories();
        setCategories(categoriesData.slice(0, 6));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-10">
          {/* Konten utama */}
          <div className="lg:col-span-3 space-y-10">
            <CardHeadlinerApi slides={featuredArticles} />

            <div className="grid md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <ArticleCardApi key={article.id} article={article} />
              ))}
            </div>
          </div>

          {/* Sidebar kanan */}
          <aside className="lg:col-span-1 space-y-8">
            {/* Trending Section */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-4">
                <TrendingListApi items={trendingNews} />
              </div>
            </div>

            {/* Hot Topics */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-green-700 rounded-xl flex items-center justify-center transition hover:scale-105 hover:shadow-md">
                  <Fire className="w-4 h-4 text-white" />
                </div>

                <h3 className="text-lg font-bold text-gray-800">
                  Topik Hangat
                </h3>
              </div>

              <div className="space-y-4">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <a
                      key={category.id}
                      href={`/category/${category.slug}`}
                      className="group flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 group-hover:text-green-600 transition-colors">
                          {category.name}
                        </h4>
                        {/* <p className="text-sm text-gray-500">
                          {category.post_count || 0} artikel
                        </p> */}
                      </div>
                      <div className="flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" />
                      </div>
                    </a>
                  ))
                ) : (
                  <div className="text-center text-gray-400 text-sm py-4">
                    Memuat topik hangat...
                  </div>
                )}
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Ikuti Kami
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "Facebook", color: "bg-blue-600", followers: "12K" },
                  { name: "Twitter", color: "bg-sky-500", followers: "8.5K" },
                  { name: "Instagram", color: "bg-pink-500", followers: "15K" },
                  { name: "YouTube", color: "bg-red-600", followers: "6.2K" },
                ].map((social, index) => (
                  <div key={index} className="text-center">
                    <div
                      className={`${social.color} text-white p-3 rounded-2xl mb-2 hover:scale-105 transition-transform cursor-pointer`}
                    >
                      <span className="font-semibold text-sm">
                        {social.name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      {social.followers} followers
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
