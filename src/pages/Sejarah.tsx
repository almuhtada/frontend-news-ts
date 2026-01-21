import { useParams } from "react-router-dom";
import { useCategoryData } from "../hooks/useCategoryData";
import CategoryHero from "../components/category/CategoryHero";
import CategoryArticles from "../components/category/CategoryArticles";
import CategorySidebar from "../components/category/CategorySidebar";

const SejarahPage = () => {
  const { slug } = useParams<{ slug?: string }>();
  const { featuredArticles, articles, trendingNews, categories, loading } =
    useCategoryData(slug);

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
          <div className="lg:col-span-3 space-y-10">
            <CategoryHero articles={featuredArticles} />
            <CategoryArticles articles={articles} />
          </div>

          <CategorySidebar
            trendingNews={trendingNews}
            categories={categories}
          />
        </div>
      </main>
    </div>
  );
};

export default SejarahPage;
