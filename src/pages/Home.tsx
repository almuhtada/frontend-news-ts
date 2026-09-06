import { useHomeData } from "../hooks/useHomeData";
import PublicPageLayout from "../components/layouts/PublicPageLayout";
import SEO from "../components/common/SEO";
import FeaturedSection from "../components/home/FeaturedSection";
import HomeSidebar from "../components/home/HomeSidebar";
import MultiNewsSection from "../components/common/MultiNewsSection";
import ViralSection from "../components/home/ViralSection";
import OtherNewsGrid from "../components/home/OtherNewsGrid";
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
    allNews,
  } = useHomeData();

  // Filter artikel yang belum ditampilkan di section atas untuk Berita Lainnya
  const shownIds = new Set([
    ...featuredArticles.map((p) => p.id),
    ...viralNews.map((p) => p.id),
    ...recentNews.map((p) => p.id),
    ...recommendedNews.map((p) => p.id),
  ]);

  const uniqueOtherArticles = allNews.filter((post) => !shownIds.has(post.id));
  const finalOtherArticles = uniqueOtherArticles.length >= 5 ? uniqueOtherArticles : allNews;

  // Konfigurasi sections untuk MultiNewsSection
  const recentNewsSection: NewsSectionConfig[] = [
    {
      title: "Berita Terbaru",
      articles: recentNews,
      icon: "clock",
      iconBgColor: "from-emerald-500 to-teal-600",
      badgeType: "new",
      layout: "horizontal",
      emphasized: true,
    },
  ];

  const recommendedNewsSection: NewsSectionConfig[] = [
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
            {/* Main Content (3 Kolom) */}
            <div className="lg:col-span-3 space-y-6 lg:space-y-10 lg:border-r lg:border-green-800/15 dark:lg:border-green-700/20 lg:pr-8 min-w-0 w-full">
              {/* Headline / Featured News Slider */}
              <FeaturedSection
                articles={featuredArticles}
                isLoading={isLoading}
              />

              {/* Berita Terbaru */}
              <MultiNewsSection sections={recentNewsSection} isLoading={isLoading} />

              {/* Section Khusus VIRAL & POPULER (Tampilan Jurnalistik Gambar 1) */}
              <ViralSection articles={viralNews} isLoading={isLoading} />

              {/* Pilihan Redaksi */}
              <MultiNewsSection sections={recommendedNewsSection} isLoading={isLoading} />

              {/* Berita Lainnya (Persis 15 Berita Berbeda Unik, Gambar Kiri & Teks Kanan) */}
              <OtherNewsGrid
                articles={finalOtherArticles}
                isLoading={isLoading}
              />
            </div>

            {/* Sidebar (Hanya tampil di Desktop, disembunyikan di Mobile) */}
            <div className="hidden lg:block min-w-0 w-full">
              <HomeSidebar
                trendingNews={trendingNews}
                hotTopics={hotTopics}
                isLoading={isLoading}
              />
            </div>
          </div>
        </main>
      </div>
    </PublicPageLayout>
  );
};

export default Home;
