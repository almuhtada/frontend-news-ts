import { Link } from "react-router-dom";
import type { Post } from "../../services/posts";
import { getImageUrl } from "../../config/api";

interface HeroSectionProps {
  story: Post;
  formatTimeAgo: (dateString: string) => string;
}

const HeroSection = ({ story, formatTimeAgo }: HeroSectionProps) => {
  return (
    <article className="bg-white rounded shadow overflow-hidden flex flex-col md:flex-row min-w-0">
      {story.featured_image && (
        <div className="w-full md:w-1/2 aspect-video md:aspect-auto md:h-auto overflow-hidden">
          <img
            src={getImageUrl(story.featured_image)}
            alt={story.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4 sm:p-6 flex-1 min-w-0 flex flex-col justify-center">
        <div className="text-sm text-yellow-600 font-semibold uppercase tracking-wider">TOP STORIES</div>
        <h1 className="mt-2 text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 break-words leading-tight">
          <Link to={`/detail-news/${story.slug}`} className="hover:text-emerald-600 transition-colors">{story.title}</Link>
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm sm:text-base line-clamp-3 break-words">
          {story.excerpt || story.content.replace(/<[^>]*>/g, "").substring(0, 150) + "..."}
        </p>
        <div className="mt-4 text-xs sm:text-sm text-gray-500 flex flex-wrap gap-1 items-center">
          <span>By {story.author?.display_name || "Admin"}</span>
          <span>•</span>
          <span>{formatTimeAgo(story.createdAt)}</span>
        </div>
      </div>
    </article>
  );
};

export default HeroSection;
