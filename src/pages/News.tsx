import { useNewsData } from "../hooks/useNewsData";
import PublicPageLayout from "../components/layouts/PublicPageLayout";
import HeroSection from "../components/news/HeroSection";
import QuickBites from "../components/news/QuickBites";
import Features from "../components/news/Features";
import ArticlesList from "../components/news/ArticlesList";
import NewsSidebar from "../components/news/NewsSidebar";
import Pagination from "../components/common/Pagination";

const News = () => {
  const {
    topStories,
    editorsPicks,
    mostRead,
    loading,
    error,
    categories,
    selectedCategory,
    setSelectedCategory,
    handleCategoryClick,
    formatTimeAgo,
    filteredArticles,
    currentPage,
    setCurrentPage,
    totalPages,
    totalArticles,
  } = useNewsData();

  if (loading) {
    return (
      <PublicPageLayout>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat berita...</p>
          </div>
        </div>
      </PublicPageLayout>
    );
  }

  if (error) {
    return (
      <PublicPageLayout>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center text-red-600">
            <p className="text-xl font-semibold">{error}</p>
          </div>
        </div>
      </PublicPageLayout>
    );
  }

  return (
    <PublicPageLayout>
      <div className="min-h-screen bg-gray-100 text-gray-900 px-4 py-6 sm:px-6 sm:py-8">
        <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          <section className="lg:col-span-3 space-y-6">
            {topStories[0] && (
              <HeroSection story={topStories[0]} formatTimeAgo={formatTimeAgo} />
            )}

            <QuickBites stories={topStories.slice(1, 4)} />

            <Features />

            <ArticlesList
              articles={filteredArticles}
              selectedCategory={selectedCategory}
              onClearFilter={() => setSelectedCategory(null)}
            />

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalArticles}
              displayedCount={filteredArticles.length}
              itemLabel="artikel"
              onPageChange={setCurrentPage}
            />
          </section>

          <NewsSidebar
            categories={categories}
            editorsPicks={editorsPicks}
            mostRead={mostRead}
            onCategoryClick={handleCategoryClick}
          />
        </main>
      </div>
    </PublicPageLayout>
  );
};

export default News;
