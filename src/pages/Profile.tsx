import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CardHeadlinerApi from "../components/components-global/card-headliner-api";
import TrendingListApi from "../components/components-global/trending-list-api";
import ArticleCardApi from "../components/components-global/card-artikel-api";
import SidebarSection from "../components/components-news/sidebar-section";
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
            <TrendingListApi items={trendingNews} />

            <SidebarSection
              title="Topik Hangat"
              items={categories.map((cat) => cat.name)}
            />
          </aside>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
