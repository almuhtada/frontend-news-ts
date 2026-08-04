import {
  Clock,
  TrendingUp,
  Flame,
  Zap,
  Eye,
  MessageCircle,
  Share2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useRef } from "react";
import type { Post } from "../../services/posts";
import { getImageUrl } from "../../config/api";
import { PLACEHOLDER_IMAGE_MEDIUM } from "../../config/constants";

interface NewsSectionProps {
  title: string;
  articles: Post[];
  icon?: "clock" | "trending" | "flame" | "zap";
  iconColor?: string;
  iconBgColor?: string;
  badgeType?: "views" | "popular" | "viral" | "new";
  layout?: "horizontal" | "vertical";
  emphasized?: boolean;
}

const iconMap = {
  clock: Clock,
  trending: TrendingUp,
  flame: Flame,
  zap: Zap,
};

const NewsSection = ({
  title,
  articles,
  icon = "clock",
  iconColor = "text-white",
  iconBgColor = "from-emerald-500 to-teal-600",
  badgeType = "new",
  layout = "horizontal",
  emphasized = false,
}: NewsSectionProps) => {
  const IconComponent = iconMap[icon];
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const getBadge = (article: Post) => {
    switch (badgeType) {
      case "views":
        return (
          <div className="flex items-center gap-1 text-[11px] text-gray-500">
            <Eye className="w-3.5 h-3.5" />
            <span>{article.views || 0} views</span>
          </div>
        );
      case "popular":
        return (
          <div className="flex items-center gap-3 text-[11px] text-gray-500">
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{article.views || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>24</span>
            </div>
          </div>
        );
      case "viral":
        return (
          <div className="flex items-center gap-3 text-[11px] text-gray-500">
            <div className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span className="font-semibold text-orange-600">
                {article.views || 0} views
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Share2 className="w-3.5 h-3.5" />
              <span>128 shares</span>
            </div>
          </div>
        );
      case "new":
        return (
          <div className="text-[11px] text-gray-500">
            {article.published_at
              ? new Date(article.published_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "Baru"}
          </div>
        );
    }
  };

  // Limit to 4 articles
  const displayArticles = articles.slice(0, 4);

  if (layout === "vertical") {
    return (
      <section className="mb-12 border-b border-green-800/10 dark:border-green-700/10 pb-10 min-w-0 w-full">
        <div className="flex items-center gap-3 mb-6 min-w-0">
          <div
            className={`w-8 h-8 bg-gradient-to-br ${iconBgColor} rounded-2xl flex items-center justify-center flex-shrink-0`}
          >
            <IconComponent className={`w-5 h-5 ${iconColor}`} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 min-w-0 break-words">{title}</h2>
        </div>

        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 min-w-0 w-full">
          {displayArticles.map((article) => {
            const categoryName = article.categories?.[0]?.name || "Berita";
            const imageUrl = getImageUrl(article.featured_image) || PLACEHOLDER_IMAGE_MEDIUM;

            return (
              <Link
                key={article.id}
                to={`/detail-news/${article.slug}`}
                className="group rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden shadow-sm hover:shadow-lg transition min-w-0 w-full block"
              >
                {article.featured_image && (
                  <div className="relative aspect-[16/9] overflow-hidden w-full">
                    <img
                      src={imageUrl}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = PLACEHOLDER_IMAGE_MEDIUM;
                      }}
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow">
                      {categoryName}
                    </span>
                  </div>
                )}
                <div className="p-4 sm:p-5 flex flex-col gap-2 min-w-0">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2 group-hover:text-emerald-700 transition break-words">
                    {article.title}
                  </h4>
                  {article.published_at && (
                    <span className="text-xs sm:text-sm text-gray-400">
                      {new Date(article.published_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    );
  }

  // Horizontal Scrollable slider
  return (
    <section className="mb-12 border-b border-green-800/10 dark:border-green-700/10 pb-10 min-w-0 w-full">
      <div className="flex items-center justify-between mb-8 gap-4 min-w-0">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-8 h-8 bg-gradient-to-br ${iconBgColor} rounded-2xl flex items-center justify-center flex-shrink-0`}
          >
            <IconComponent className={`w-5 h-5 ${iconColor}`} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 min-w-0 break-words">{title}</h2>
        </div>

        {/* Scroll buttons */}
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => scroll("left")}
            className="w-9 h-9 rounded-full bg-white dark:bg-gray-800 shadow hover:shadow-md transition-all flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-9 h-9 rounded-full bg-white dark:bg-gray-800 shadow hover:shadow-md transition-all flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 min-w-0 w-full"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {displayArticles.map((article, index) => {
          const categoryName = article.categories?.[0]?.name || "Berita";
          return (
            <div
              key={`${article.id}-${index}`}
              className={`flex-shrink-0 group min-w-0 ${
                emphasized ? "w-[300px] sm:w-[340px]" : "w-[280px] sm:w-[320px]"
              }`}
            >
              <Link to={`/detail-news/${article.slug}`} className="block w-full">
                <div className="bg-transparent overflow-hidden h-full flex flex-col min-w-0">
                  {/* Image */}
                  {article.featured_image && (
                    <div
                      className={`relative overflow-hidden rounded-lg mb-3 w-full ${
                        emphasized ? "h-48 sm:h-56" : "h-44"
                      }`}
                    >
                      <img
                        src={getImageUrl(article.featured_image)}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 flex flex-col min-w-0">
                    {/* Category Tag */}
                    <span
                      className={`mb-2 font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-450 ${
                        emphasized ? "text-[11px] sm:text-xs" : "text-[10px]"
                      }`}
                    >
                      {categoryName}
                    </span>

                    {/* Title */}
                    <h3
                      className={`font-bold text-gray-900 dark:text-gray-100 line-clamp-2 mb-2 group-hover:text-emerald-600 transition-colors leading-snug break-words ${
                        emphasized ? "text-lg sm:text-xl" : "text-base"
                      }`}
                    >
                      {article.title}
                    </h3>

                    {/* Excerpt */}
                    <div
                      className={`text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed break-words ${
                        emphasized ? "text-sm" : "text-xs"
                      }`}
                      dangerouslySetInnerHTML={{
                        __html:
                          article.excerpt || article.content?.substring(0, 100) || "",
                      }}
                    />

                    {/* Badge/Meta info */}
                    <div className="flex items-center justify-between pt-3 border-t border-green-800/10 dark:border-green-700/10 mt-auto min-w-0">
                      {getBadge(article)}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default NewsSection;
