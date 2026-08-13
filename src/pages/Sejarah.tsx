import { useParams } from "react-router-dom";
import { useCategoryData } from "../hooks/useCategoryData";
import PublicPageLayout from "../components/layouts/PublicPageLayout";
import SEO from "../components/common/SEO";
import CategoryHero from "../components/category/CategoryHero";
import CategoryArticles from "../components/category/CategoryArticles";
import CategorySidebar from "../components/category/CategorySidebar";
import Pagination from "../components/common/Pagination";

const CategoryPage = () => {
  const { slug } = useParams<{ slug?: string }>();
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
  } = useCategoryData(slug);

  // Nama kategori dari daftar yang dimuat (fallback: humanize slug)
  const activeCategory = slug
    ? categories.find((c) => c.slug === slug) || {
        name: slug
          .replace(/-/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
      }
    : { name: "Semua Kategori" };
  const categoryUrl = slug
    ? `https://almuhtada.org/category/${slug}`
    : "https://almuhtada.org/news";
  const catName = activeCategory.name;

  if (loading) {
    return (
      <PublicPageLayout>
        <div className="flex-1 flex items-center justify-center">
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
      <SEO
        title={`Berita ${catName}`}
        description={`Kumpulan berita dan artikel tentang ${catName} dari Pesantren Riset Al-Muhtada Semarang. Baca berita Islami terbaru dan terlengkap.`}
        keywords={`berita ${catName}, ${catName}, berita islam, pesantren al-muhtada, artikel ${catName}`}
        url={categoryUrl}
        type="category"
      />
      <div className="flex-1 bg-white dark:bg-gray-950 w-full overflow-hidden">
        <main className="max-w-[1500px] mx-auto px-4 py-8 md:px-8 min-w-0 w-full">
          <div className="grid lg:grid-cols-4 gap-6 lg:gap-8 min-w-0 w-full">
            <div className="lg:col-span-3 space-y-10 lg:border-r lg:border-green-800/15 dark:lg:border-green-700/20 lg:pr-8 min-w-0 w-full">
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

export default CategoryPage;
