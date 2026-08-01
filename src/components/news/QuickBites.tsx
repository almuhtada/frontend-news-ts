import { Link } from "react-router-dom";
import type { Post } from "../../services/posts";

interface QuickBitesProps {
  stories: Post[];
}

const QuickBites = ({ stories }: QuickBitesProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-gray-200/60 dark:border-gray-800/80 pb-6 mb-6">
      {stories.map((story) => (
        <div key={story.id} className="bg-transparent flex flex-col justify-between py-1">
          <div>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              QUICK BITE
            </span>
            <h3 className="font-bold text-base text-gray-900 dark:text-gray-100 mt-1.5 leading-snug group-hover:text-emerald-600 transition-colors">
              <Link to={`/detail-news/${story.slug}`}>{story.title}</Link>
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed line-clamp-3">
              {story.excerpt || story.content.replace(/<[^>]*>/g, "").substring(0, 100) + "..."}
            </p>
          </div>
          <Link
            to={`/detail-news/${story.slug}`}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-4 hover:underline"
          >
            Baca selengkapnya →
          </Link>
        </div>
      ))}
    </div>
  );
};

export default QuickBites;
