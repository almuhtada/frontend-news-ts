import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { Post } from "../../services/posts";

interface NewsListProps {
  articles: Post[];
  itemsPerPage?: number;
}

const NewsList = ({ articles, itemsPerPage = 10 }: NewsListProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentArticles = articles.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Baru saja";
    if (diffInHours < 24) return `${diffInHours} jam lalu`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "1 hari lalu";
    if (diffInDays < 7) return `${diffInDays} hari lalu`;

    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }
    return pages;
  };

  return (
    <section className="rounded-2xl bg-white border border-gray-100 shadow-sm">
      {/* List */}
      <div className="divide-y divide-gray-100">
        {currentArticles.map((article) => (
          <Link
            key={article.id}
            to={`/detail-news/${article.slug}`}
            className="group block px-6 py-5 hover:bg-emerald-50/40 transition"
          >
            <div className="flex gap-5">
              {/* Thumbnail */}
              {article.featured_image && (
                <div className="h-24 w-36 flex-shrink-0 overflow-hidden rounded-xl">
                  <img
                    src={article.featured_image}
                    alt={article.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Meta */}
                <div className="mb-2 flex items-center gap-3 text-xs">
                  {article.categories?.[0] && (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-700">
                      {article.categories[0].name}
                    </span>
                  )}
                  <span className="text-gray-400">
                    {formatDate(article.published_at || article.createdAt)}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mb-2 text-lg font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-emerald-700 transition">
                  {article.title}
                </h3>

                {/* Excerpt */}
                <div
                  className="text-sm text-gray-600 line-clamp-2"
                  dangerouslySetInnerHTML={{
                    __html:
                      article.excerpt || article.content.substring(0, 150),
                  }}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-gray-100 px-6 py-5">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            {/* Prev */}
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                currentPage === 1
                  ? "cursor-not-allowed bg-gray-100 text-gray-400"
                  : "bg-emerald-600 text-white hover:bg-emerald-500"
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              Sebelumnya
            </button>

            {/* Pages */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {getPageNumbers().map((page, i) => (
                <button
                  key={i}
                  disabled={page === "..."}
                  onClick={() => typeof page === "number" && goToPage(page)}
                  className={`h-9 min-w-[36px] rounded-full text-sm font-medium transition ${
                    page === currentPage
                      ? "bg-emerald-600 text-white shadow"
                      : page === "..."
                        ? "cursor-default text-gray-400"
                        : "bg-gray-100 text-gray-700 hover:bg-emerald-100 hover:text-emerald-700"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            {/* Next */}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                currentPage === totalPages
                  ? "cursor-not-allowed bg-gray-100 text-gray-400"
                  : "bg-emerald-600 text-white hover:bg-emerald-500"
              }`}
            >
              Selanjutnya
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Info */}
          <div className="mt-4 text-center text-xs text-gray-500">
            Menampilkan {startIndex + 1}–{Math.min(endIndex, articles.length)}{" "}
            dari {articles.length} berita
          </div>
        </div>
      )}
    </section>
  );
};

export default NewsList;
