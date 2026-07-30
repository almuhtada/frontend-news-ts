import { useHomeData } from "../hooks/useHomeData";
import PublicPageLayout from "../components/layouts/PublicPageLayout";
import SEO from "../components/common/SEO";
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
    },
    {
      title: "Pilihan Redaksi",
      articles: recommendedNews,
      icon: "zap",
      iconBgColor: "from-emerald-500 to-green-600",
      badgeType: "new",
      layout: "horizontal",
    },
    {
      title: "Viral",
      articles: viralNews,
      icon: "flame",
      iconBgColor: "from-emerald-500 to-green-600",
      badgeType: "viral",
      layout: "horizontal",
    },
  ];

  // Filter allNews berdasarkan category aktif
  const filteredAllNews =
    activeCategory === "semua"
      ? allNews
      : allNews.filter((article) =>
          article.categories?.some((cat) => cat.slug === activeCategory),
        );

  return (
    <PublicPageLayout>
      <SEO />
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <main className="max-w-[1500px] mx-auto px-4 py-6 sm:px-6 md:px-8 sm:py-8">
          <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6 lg:space-y-10 lg:border-r lg:border-green-800/15 dark:lg:border-green-700/20 lg:pr-8">
              <FeaturedSection
                articles={featuredArticles}
                isLoading={isLoading}
              />

              <MultiNewsSection sections={newsSections} isLoading={isLoading} />

              {/* All News List with Pagination */}
              <div className="mt-8 lg:mt-12">
                <CategoryFilter
                  categories={categories}
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                />

                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Semua Berita
                  </h2>
                </div>
                <NewsList articles={filteredAllNews} itemsPerPage={10} />
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
