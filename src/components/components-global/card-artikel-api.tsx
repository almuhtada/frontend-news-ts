import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
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
      className={`group block ${featured ? "md:col-span-2" : ""} border-b border-gray-150 dark:border-gray-800 pb-6 mb-2 min-w-0 w-full`}
    >
      <article
        className={`
          relative overflow-hidden flex flex-col md:flex-row gap-6
          bg-transparent
          transition-all duration-300 ease-out
          min-w-0 w-full
        `}
      >
        {/* Image Container */}
        <div
          className={`
            relative overflow-hidden flex-shrink-0 rounded-lg w-full
            ${featured ? "md:w-3/5 aspect-[16/10]" : "md:w-2/5 aspect-[16/10]"}
          `}
        >
          <img
            src={imageUrl}
            alt={article.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-750 ease-out group-hover:scale-[1.02]"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = PLACEHOLDER_IMAGE_MEDIUM;
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center py-1 min-w-0">
          {/* Category Tag */}
          <span className="mb-2 text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            {categoryName}
          </span>

          {/* Title */}
          <h3
            className={`
              font-bold text-gray-900 dark:text-gray-100
              group-hover:text-emerald-600 dark:group-hover:text-emerald-400
              transition-colors duration-200 leading-tight mb-2 break-words
              ${featured ? "text-xl sm:text-2xl" : "text-base sm:text-lg"}
            `}
          >
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm mb-4 line-clamp-2 sm:line-clamp-3 break-words">
            {summary}
          </p>

          {/* Metadata Footer */}
          <div className="flex items-center gap-2.5 text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 mt-auto flex-wrap min-w-0">
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Oleh {authorName}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{articleDate} • {readTime}</span>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ArticleCardApi;
