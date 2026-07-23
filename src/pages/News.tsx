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

  // ─── Loading State ─────────────────────────────────────────────
  if (loading) {
    return (
      <PublicPageLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white">
          <div className="relative">
            <div className="w-14 h-14 rounded-full border-4 border-gray-100 border-t-amber-500 animate-spin" />
            <div className="absolute inset-0 w-14 h-14 rounded-full border-4 border-transparent border-t-amber-300 animate-spin [animation-duration:1.5s]" />
          </div>
          <p className="mt-6 text-gray-500 font-medium tracking-wide animate-pulse">
            Memuat berita...
          </p>
        </div>
      </PublicPageLayout>
    );
  }

  // ─── Error State ───────────────────────────────────────────────
  if (error) {
    return (
      <PublicPageLayout>
        <div className="min-h-[60vh] flex items-center justify-center bg-white px-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-50 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Terjadi Kesalahan
            </h3>
            <p className="text-gray-500 leading-relaxed">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors duration-200"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </PublicPageLayout>
    );
  }

  // ─── Main Content ──────────────────────────────────────────────
  return (
    <PublicPageLayout>
      <div className="min-h-screen bg-gray-50/80 text-gray-900">
        {/* Top accent bar */}
        <div className="h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500" />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Section Header */}
          <div className="mb-8 lg:mb-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-1.5 h-6 rounded-full bg-amber-500" />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Berita Terkini
              </h1>
            </div>
            <p className="text-gray-500 ml-5 text-sm sm:text-base">
              Update informasi terbaru untuk Anda
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Main Column */}
            <section className="lg:col-span-8 space-y-8 lg:space-y-10">
              {/* Hero */}
              {topStories[0] && (
                <div className="animate-fade-in">
                  <HeroSection
                    story={topStories[0]}
                    formatTimeAgo={formatTimeAgo}
                  />
                </div>
              )}

              {/* Quick Bites */}
              <QuickBites stories={topStories.slice(1, 4)} />

              {/* Features */}
              <Features />

              {/* Articles with header */}
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-amber-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15"
                      />
                    </svg>
                    Semua Artikel
                  </h2>
                  {selectedCategory && (
                    <span className="text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                      {selectedCategory}
                    </span>
                  )}
                </div>

                <ArticlesList
                  articles={filteredArticles}
                  selectedCategory={selectedCategory}
                  onClearFilter={() => setSelectedCategory(null)}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pt-4 border-t border-gray-200/60">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={totalArticles}
                      displayedCount={filteredArticles.length}
                      itemLabel="artikel"
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-6 space-y-6">
                <NewsSidebar
                  categories={categories}
                  editorsPicks={editorsPicks}
                  mostRead={mostRead}
                  onCategoryClick={handleCategoryClick}
                />
              </div>
            </aside>
          </div>
        </main>
      </div>
    </PublicPageLayout>
  );
};

export default News;
