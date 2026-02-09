import { useHomeData } from "../hooks/useHomeData";
import PublicPageLayout from "../components/layouts/PublicPageLayout";
import FeaturedSection from "../components/home/FeaturedSection";
import CategoryFilter from "../components/home/CategoryFilter";
import HomeSidebar from "../components/home/HomeSidebar";
import MultiNewsSection from "../components/common/MultiNewsSection";
import NewsList from "../components/common/NewsList";
import type { NewsSectionConfig } from "../components/common/MultiNewsSection";

const Home = () => {
  const {
    activeCategory,
    setActiveCategory,
    isLoading,
    featuredArticles,
    trendingNews,
    viralNews,
    recentNews,
    allNews,
    categories,
    hotTopics,
  } = useHomeData();

  // Konfigurasi sections untuk MultiNewsSection
  const newsSections: NewsSectionConfig[] = [
    {
      title: "Berita Terbaru",
      articles: recentNews,
      icon: "clock",
      iconBgColor: "from-emerald-500 to-teal-600",
      badgeType: "new",
    },
    {
      title: "Terpopuler",
      articles: trendingNews,
      icon: "trending",
      iconBgColor: "from-blue-500 to-indigo-600",
      badgeType: "popular",
    },
    {
      title: "Viral",
      articles: viralNews,
      icon: "flame",
      iconBgColor: "from-red-500 to-pink-600",
      badgeType: "viral",
    },
  ];

  return (
    <PublicPageLayout>
      <div className="min-h-screen bg-white from-slate-50 via-blue-50 to-indigo-100">
        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
          <div className="grid lg:grid-cols-4 gap-6 lg:gap-10">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6 lg:space-y-10">
              <FeaturedSection
                articles={featuredArticles}
                isLoading={isLoading}
              />

              <CategoryFilter
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />

              <MultiNewsSection sections={newsSections} isLoading={isLoading} />

              {/* All News List with Pagination */}
              <div className="mt-8 lg:mt-12">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Semua Berita
                  </h2>
                </div>
                <NewsList articles={allNews} itemsPerPage={10} />
              </div>
            </div>

            {/* Sidebar */}
            <HomeSidebar
              trendingNews={trendingNews}
              hotTopics={hotTopics}
              isLoading={isLoading}
            />
          </div>
        </main>
      </div>
    </PublicPageLayout>
  );
};

export default Home;
