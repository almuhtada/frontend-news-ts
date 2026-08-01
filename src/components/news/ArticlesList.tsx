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
    <div className="space-y-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 min-w-0 w-full">
          {articles.map((article, index) => {
            const categoryName = article.categories?.[0]?.name || "Berita";
            const authorName = article.author?.display_name || article.author?.username || "Admin";

            return (
              <Link
                key={article.id}
                to={`/detail-news/${article.slug}`}
                className="group block border-b border-gray-200/60 dark:border-gray-800/80 pb-6 min-w-0 w-full"
              >
                <article className="flex flex-col gap-4 bg-transparent min-w-0 w-full">
                  {/* Thumbnail */}
                  <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                    {article.featured_image ? (
                      <img
                        src={getImageUrl(article.featured_image)}
                        alt={article.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
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

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-between py-1 min-w-0 w-full">
                    <div className="min-w-0 w-full">
                      {/* Category Tag */}
                      <span className="inline-block mb-2 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        {categoryName}
                      </span>

                      {/* Title */}
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base sm:text-lg leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200 line-clamp-2 break-words">
                        {article.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 break-words">
                        {article.excerpt ||
                          article.content
                            .replace(/<[^>]*>/g, "")
                            .substring(0, 100) + "..."}
                      </p>
                    </div>

                    {/* Footer Meta */}
                    <div className="flex items-center gap-2 mt-4 text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 flex-wrap min-w-0">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        Oleh {authorName}
                      </span>
                      <span className="w-0.5 h-0.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                        {formatDate(article.createdAt)}
                      </span>
                      <span className="w-0.5 h-0.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                      <span className="group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors inline-flex items-center gap-0.5">
                        Baca
                        <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5 flex-shrink-0" />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
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
