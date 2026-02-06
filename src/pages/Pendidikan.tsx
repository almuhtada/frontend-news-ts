import { useCategoryData } from "../hooks/useCategoryData";
import PublicPageLayout from "../components/layouts/PublicPageLayout";
import CategoryHero from "../components/category/CategoryHero";
import CategoryArticles from "../components/category/CategoryArticles";
import CategorySidebar from "../components/category/CategorySidebar";
import Pagination from "../components/common/Pagination";

const PendidikanPage = () => {
  const {
    featuredArticles,
    articles,
    trendingNews,
    categories,
    loading,
    currentPage,
    setCurrentPage,
    totalPages,
    totalPosts,
  } = useCategoryData("pendidikan");

  if (loading) {
    return (
      <PublicPageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data...</p>
          </div>
        </div>
      </PublicPageLayout>
    );
  }

  return (
    <PublicPageLayout>
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-4 gap-10">
            <div className="lg:col-span-3 space-y-10">
              <CategoryHero articles={featuredArticles} />
              <CategoryArticles articles={articles} />

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalPosts}
                displayedCount={articles.length}
                itemLabel="artikel"
                onPageChange={setCurrentPage}
              />
            </div>

            <CategorySidebar
              trendingNews={trendingNews}
              categories={categories}
            />
          </div>
        </main>
      </div>
    </PublicPageLayout>
  );
};

export default PendidikanPage;
