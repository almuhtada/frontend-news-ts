import { useNewsData } from "../hooks/useNewsData";
import HeroSection from "../components/news/HeroSection";
import QuickBites from "../components/news/QuickBites";
import Features from "../components/news/Features";
import ArticlesList from "../components/news/ArticlesList";
import NewsSidebar from "../components/news/NewsSidebar";

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
  } = useNewsData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat berita...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
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
        </section>

        <NewsSidebar
          categories={categories}
          editorsPicks={editorsPicks}
          mostRead={mostRead}
          onCategoryClick={handleCategoryClick}
        />
      </main>
    </div>
  );
};

export default News;
