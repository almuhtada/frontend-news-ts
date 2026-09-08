import { useHomeData } from "../hooks/useHomeData";
import PublicPageLayout from "../components/layouts/PublicPageLayout";
import SEO from "../components/common/SEO";
import FeaturedSection from "../components/home/FeaturedSection";
import HomeSidebar from "../components/home/HomeSidebar";
import MultiNewsSection from "../components/common/MultiNewsSection";
import type { NewsSectionConfig } from "../components/common/MultiNewsSection";

const Home = () => {
  const {
    isLoading,
    featuredArticles,
    trendingNews,
    viralNews,
    recentNews,
    hotTopics,
    recommendedNews,
  } = useHomeData();

  // Konfigurasi sections untuk MultiNewsSection
  const newsSections: NewsSectionConfig[] = [
    {
      title: "Berita Terbaru",
      articles: recentNews,
      icon: "clock",
      iconBgColor: "from-emerald-500 to-teal-600",
      badgeType: "new",
      layout: "horizontal",
      emphasized: true,
    },
    {
      title: "Viral",
      articles: viralNews,
      icon: "flame",
      iconBgColor: "from-emerald-500 to-green-600",
      badgeType: "viral",
      layout: "horizontal",
    },
    {
      title: "Pilihan Redaksi",
      articles: recommendedNews,
      icon: "zap",
      iconBgColor: "from-emerald-500 to-green-600",
      badgeType: "new",
      layout: "horizontal",
    },
  ];

  return (
    <PublicPageLayout>
      <SEO />
      <div className="min-h-screen bg-white dark:bg-gray-950 w-full overflow-hidden">
        <main className="max-w-[1500px] mx-auto px-4 py-6 sm:px-6 md:px-8 sm:py-8 min-w-0 w-full">
          <div className="grid lg:grid-cols-4 gap-6 lg:gap-8 min-w-0 w-full">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6 lg:space-y-10 lg:border-r lg:border-green-800/15 dark:lg:border-green-700/20 lg:pr-8 min-w-0 w-full">
              <FeaturedSection
                articles={featuredArticles}
                isLoading={isLoading}
              />

              <MultiNewsSection sections={newsSections} isLoading={isLoading} />

              {/* All News List with Pagination */}
              <div className="mt-8 lg:mt-12">
                {/* <CategoryFilter
                  categories={categories}
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                /> */}

                {/* <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                      Berita Terkini
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Semua terbaru dari redaksi
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                      Terupdate
                    </span>
                  </div>
                </div>
                <NewsList articles={filteredAllNews} itemsPerPage={10} /> */}
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
