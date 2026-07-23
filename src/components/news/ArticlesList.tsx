import { Link } from "react-router-dom";
import { X, Clock, ArrowRight, Filter } from "lucide-react";
import type { Post } from "../../services/posts";
import { getImageUrl } from "../../config/api";

interface ArticlesListProps {
  articles: Post[];
  selectedCategory: string | null;
  onClearFilter: () => void;
}

const ArticlesList = ({
  articles,
  selectedCategory,
  onClearFilter,
}: ArticlesListProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-5">
      {/* ─── Active Filter Banner ─────────────────────────────── */}
      {selectedCategory && (
        <div className="flex items-center justify-between px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 rounded-xl">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-800/40 flex items-center justify-center">
              <Filter className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Menampilkan
              </span>
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                {selectedCategory}
              </span>
            </div>
          </div>
          <button
            onClick={onClearFilter}
            className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-800/30 hover:bg-emerald-200 dark:hover:bg-emerald-800/50 transition-colors"
          >
            Hapus
            <X className="w-3 h-3 transition-transform group-hover:rotate-90" />
          </button>
        </div>
      )}

      {/* ─── Articles Grid ────────────────────────────────────── */}
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
          {articles.map((article, index) => (
            <Link
              key={article.id}
              to={`/detail-news/${article.slug}`}
              className="group block"
            >
              <article
                className={`
                  flex gap-4 p-4 rounded-2xl
                  bg-white dark:bg-gray-900
                  border border-gray-100 dark:border-gray-800/60
                  hover:border-gray-200 dark:hover:border-gray-700
                  hover:shadow-md dark:hover:shadow-gray-900/20
                  transition-all duration-300 ease-out
                `}
              >
                {/* Thumbnail */}
                <div className="flex-shrink-0">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {article.featured_image ? (
                      <img
                        src={getImageUrl(article.featured_image)}
                        alt={article.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-xs font-bold text-gray-400 dark:text-gray-500">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    {/* Category tag (if available) */}
                    {article.categories && article.categories[0] && (
                      <span className="inline-block mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        {article.categories[0].name}
                      </span>
                    )}

                    {/* Title */}
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200 line-clamp-2">
                      {article.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="mt-1.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                      {article.excerpt ||
                        article.content
                          .replace(/<[^>]*>/g, "")
                          .substring(0, 100) + "..."}
                    </p>
                  </div>

                  {/* Footer meta */}
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-gray-400 dark:text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(article.createdAt)}
                    </span>
                    <span className="w-0.5 h-0.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                    <span className="group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors inline-flex items-center gap-0.5">
                      Baca
                      <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        /* Empty state */
        <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 p-10 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Filter className="w-5 h-5 text-gray-400 dark:text-gray-600" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-200 mb-1">
            Tidak Ada Artikel
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {selectedCategory
              ? `Tidak ada artikel dalam kategori "${selectedCategory}"`
              : "Belum ada artikel yang tersedia"}
          </p>
          {selectedCategory && (
            <button
              onClick={onClearFilter}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
            >
              <X className="w-3 h-3" />
              Hapus Filter
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ArticlesList;
