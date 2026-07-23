import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import type { Post } from "../../services/posts";
import { PLACEHOLDER_IMAGE_MEDIUM } from "../../config/constants";
import { getImageUrl } from "../../config/api";

interface ArticleCardApiProps {
  article: Post;
  featured?: boolean;
}

const ArticleCardApi: React.FC<ArticleCardApiProps> = ({
  article,
  featured,
}) => {
  // ─── Helpers ─────────────────────────────────────────────────
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} menit baca`;
  };

  const getExcerpt = (content: string, maxLength = 160) => {
    const plainText = content.replace(/<[^>]*>/g, "");
    return plainText.length > maxLength
      ? plainText.substring(0, maxLength) + "..."
      : plainText;
  };

  // ─── Derived Data ────────────────────────────────────────────
  const categoryName =
    article.categories && article.categories.length > 0
      ? article.categories[0].name
      : "Berita";

  const authorName =
    article.author?.display_name || article.author?.username || "Admin";

  const articleDate = formatDate(article.createdAt);
  const readTime = calculateReadTime(article.content);
  const summary = article.excerpt || getExcerpt(article.content);
  const imageUrl =
    getImageUrl(article.featured_image) || PLACEHOLDER_IMAGE_MEDIUM;

  // ─── Render ──────────────────────────────────────────────────
  return (
    <Link
      to={`/detail-news/${article.slug}`}
      className={`group block ${featured ? "md:col-span-2" : ""}`}
    >
      <article
        className={`
          relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden
          border border-gray-100 dark:border-gray-800/60
          shadow-sm hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/20
          transition-all duration-500 ease-out
          ${featured ? "md:flex" : ""}
        `}
      >
        {/* Image Container */}
        <div
          className={`
            relative overflow-hidden
            ${featured ? "md:w-3/5 aspect-[16/10] md:aspect-auto md:min-h-[360px]" : "aspect-[16/10]"}
          `}
        >
          <img
            src={imageUrl}
            alt={article.title}
            loading="lazy"
            className={`
              w-full h-full object-cover
              transition-transform duration-700 ease-out
              group-hover:scale-105
            `}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = PLACEHOLDER_IMAGE_MEDIUM;
            }}
          />

          {/* Gradient overlay (subtle) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Category Badge */}
          <span
            className={`
              absolute top-4 left-4
              inline-flex items-center gap-1.5
              px-3 py-1.5 rounded-lg text-xs font-semibold
              bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm
              text-gray-900 dark:text-gray-100
              shadow-sm
              transform translate-y-0 group-hover:-translate-y-0.5
              transition-transform duration-300
            `}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {categoryName}
          </span>
        </div>

        {/* Content */}
        <div
          className={`
            flex flex-col
            ${featured ? "md:w-2/5 p-6 sm:p-8 justify-center" : "p-5"}
          `}
        >
          {/* Meta row */}
          <div className="flex items-center gap-3 mb-3 text-xs text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {articleDate}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
            <span>{readTime}</span>
          </div>

          {/* Title */}
          <h3
            className={`
              font-bold text-gray-900 dark:text-gray-100
              group-hover:text-emerald-600 dark:group-hover:text-emerald-400
              transition-colors duration-300 leading-snug
              ${featured ? "text-xl sm:text-2xl mb-4" : "text-base mb-3 line-clamp-2"}
            `}
          >
            {article.title}
          </h3>

          {/* Excerpt */}
          <p
            className={`
              text-gray-500 dark:text-gray-400 leading-relaxed
              ${featured ? "text-sm mb-6 line-clamp-4" : "text-sm mb-4 line-clamp-2"}
            `}
          >
            {summary}
          </p>

          {/* Footer */}
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800/60">
            {/* Author */}
            <div className="flex items-center gap-2.5">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  bg-gradient-to-br from-emerald-400 to-teal-600
                  text-white text-xs font-bold
                  ring-2 ring-white dark:ring-gray-800
                `}
              >
                {authorName.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {authorName}
                </span>
              </div>
            </div>

            {/* Read more */}
            <span
              className={`
                inline-flex items-center gap-1 text-xs font-semibold
                text-emerald-600 dark:text-emerald-400
                group-hover:text-emerald-700 dark:group-hover:text-emerald-300
                transition-colors duration-300
              `}
            >
              Baca
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ArticleCardApi;
