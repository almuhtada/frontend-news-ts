import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import type { Post } from "../../services/posts";
import { PLACEHOLDER_IMAGE_MEDIUM } from "../../config/constants";
import { getImageUrl } from "../../config/api";
import Pagination from "../common/Pagination";

interface OtherNewsGridProps {
  articles: Post[];
  isLoading: boolean;
}

const OtherNewsGrid = ({ articles, isLoading }: OtherNewsGridProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [articles]);

  if (isLoading) {
    return (
      <div className="mt-10 lg:mt-12 w-full">
        <div className="h-7 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="h-52 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!articles || articles.length === 0) return null;

  // Pastikan hanya artikel unik yang ditampilkan (tanpa duplikasi)
  const uniqueArticles = Array.from(
    new Map(articles.map((item) => [item.id || item.slug, item])).values(),
  );
  const totalPages = Math.ceil(uniqueArticles.length / itemsPerPage);

  const displayArticles = uniqueArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <section className="mt-10 lg:mt-12 w-full pt-6 border-t border-gray-200 dark:border-gray-800">
      {/* Header Section */}
      <div className="flex items-center justify-between pb-3 mb-6 border-b border-gray-100 dark:border-gray-800 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-7 bg-[#00531b] rounded-full" />
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-headline text-gray-900 dark:text-gray-100 tracking-tight">
              Berita Lainnya
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Informasi & artikel menarik lainnya dari redaksi
            </p>
          </div>
        </div>
      </div>

      {/* Grid List Berita: 3 Kolom di Desktop (5 Baris x 3 Kolom = 15 Berita Unik), 1 Kolom di Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 w-full">
        {displayArticles.map((article, idx) => {
          const categoryName =
            article.categories && article.categories.length > 0
              ? article.categories[0].name
              : "Berita";

          return (
            <Link
              key={`${article.id}-${idx}`}
              to={`/detail-news/${article.slug}`}
              className="group flex gap-3.5 items-start p-3 rounded-xl border border-gray-100 dark:border-gray-800/80 hover:border-[#00531b] dark:hover:border-emerald-500/40 hover:bg-gray-50/60 dark:hover:bg-gray-900/50 transition-all duration-200"
            >
              {/* Gambar Thumbnail di Kiri */}
              <div className="relative w-24 h-20 sm:w-28 sm:h-22 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                <img
                  src={
                    getImageUrl(article.featured_image) ||
                    PLACEHOLDER_IMAGE_MEDIUM
                  }
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Teks Berita di Kanan */}
              <div className="flex flex-col justify-between min-w-0 flex-1 h-full py-0.5">
                <div>
                  <span className="text-[11px] font-bold text-[#00531b] dark:text-emerald-400 uppercase tracking-wider block mb-1">
                    {categoryName}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-[#00531b] dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h3>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500 mt-2 font-medium">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span>{formatDate(article.createdAt)}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={uniqueArticles.length}
        displayedCount={displayArticles.length}
        itemLabel="berita"
        onPageChange={setCurrentPage}
      />
    </section>
  );
};

export default OtherNewsGrid;
