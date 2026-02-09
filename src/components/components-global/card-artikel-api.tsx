import { Link } from "react-router-dom";
import type { Post } from "../../services/posts";
import { PLACEHOLDER_IMAGE_MEDIUM } from "../../config/constants";
import { getImageUrl } from "../../config/api";

interface ArticleCardApiProps {
  article: Post;
  featured?: boolean;
}

const ArticleCardApi: React.FC<ArticleCardApiProps> = ({ article, featured }) => {
  // Transform API data to component format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const getExcerpt = (content: string, maxLength = 150) => {
    // Don't strip HTML tags, just truncate if needed
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  const categoryName = article.categories && article.categories.length > 0
    ? article.categories[0].name
    : 'Berita';

  const authorName = article.author?.display_name || article.author?.username || 'Admin';
  const articleDate = formatDate(article.createdAt);
  const readTime = calculateReadTime(article.content);
  const summary = article.excerpt || getExcerpt(article.content);
  const imageUrl = getImageUrl(article.featured_image) || PLACEHOLDER_IMAGE_MEDIUM;

  return (
    <Link
      to={`/detail-news/${article.slug}`}
      className={`block ${featured ? "md:col-span-2" : ""}`}
    >
      <article className="group cursor-pointer">
        <div
          className={`bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800 ${
            featured ? "md:flex" : ""
          }`}
        >
          <div className={`relative ${featured ? "md:w-1/2" : ""}`}>
            <img
              src={imageUrl}
              alt={article.title}
              className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                featured ? "h-64 md:h-full" : "h-48"
              }`}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = PLACEHOLDER_IMAGE_MEDIUM;
              }}
            />
            <span className="absolute top-4 left-4 bg-[#00531b] text-white text-xs font-medium px-3 py-1 rounded-full">
              {categoryName}
            </span>
          </div>

          <div
            className={`p-6 ${
              featured ? "md:w-1/2 flex flex-col justify-center" : ""
            }`}
          >
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
              <span>{articleDate}</span>
              <span className="mx-2">•</span>
              <span>{readTime}</span>
            </div>

            <h3
              className={`font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-[#00531b] transition-colors leading-tight ${
                featured ? "text-xl md:text-2xl" : "text-lg"
              }`}
            >
              {article.title}
            </h3>

            <div
              className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3"
              dangerouslySetInnerHTML={{ __html: summary }}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full mr-3 flex items-center justify-center text-white font-semibold text-xs">
                  {authorName.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {authorName}
                </span>
              </div>
              <button className="text-[#00531b] hover:text-blue-800 text-sm font-medium">
                Baca →
              </button>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ArticleCardApi;
