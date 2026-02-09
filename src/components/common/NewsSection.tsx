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

interface NewsSectionProps {
  title: string;
  articles: Post[];
  icon?: "clock" | "trending" | "flame" | "zap";
  iconColor?: string;
  iconBgColor?: string;
  badgeType?: "views" | "popular" | "viral" | "new";
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
          <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
            <Eye className="w-3 h-3" />
            <span>{article.views || 0} views</span>
          </div>
        );
      case "popular":
        return (
          <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{article.views || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              <span>24</span>
            </div>
          </div>
        );
      case "viral":
        return (
          <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-500" />
              <span className="font-semibold text-orange-600">
                {article.views || 0} views
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Share2 className="w-3 h-3" />
              <span>128 shares</span>
            </div>
          </div>
        );
      case "new":
        return (
          <div className="text-xs text-gray-600 dark:text-gray-400">
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

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 bg-gradient-to-br ${iconBgColor} rounded-2xl flex items-center justify-center`}
          >
            <IconComponent className={`w-5 h-5 ${iconColor}`} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
        </div>

        {/* Scroll buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {displayArticles.map((article, index) => (
          <div
            key={`${article.id}-${index}`}
            className="flex-shrink-0 w-[calc(25%-18px)] min-w-[280px] group"
          >
            <Link to={`/detail-news/${article.slug}`}>
              <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                {/* Image */}
                {article.featured_image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getImageUrl(article.featured_image)}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {/* Category badge */}
                    {article.categories?.[0] && (
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full">
                          {article.categories[0].name}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 line-clamp-2 mb-3 group-hover:text-green-600 transition-colors">
                    {article.title}
                  </h3>

                  <div
                    className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4"
                    dangerouslySetInnerHTML={{
                      __html:
                        article.excerpt || article.content?.substring(0, 100) || "",
                    }}
                  />

                  {/* Badge showing why it's in this section */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                    {getBadge(article)}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewsSection;
