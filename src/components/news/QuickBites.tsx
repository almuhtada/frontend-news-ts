import { Link } from "react-router-dom";
import type { Post } from "../../services/posts";

interface QuickBitesProps {
  stories: Post[];
}

const QuickBites = ({ stories }: QuickBitesProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stories.map((story) => (
        <div key={story.id} className="bg-white rounded shadow p-4">
          <div className="text-xs text-gray-500">QUICK BITE</div>
          <h3 className="font-semibold mt-2">
            <Link to={`/detail-news/${story.slug}`}>{story.title}</Link>
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {story.excerpt || story.content.substring(0, 100) + "..."}
          </p>
        </div>
      ))}
    </div>
  );
};

export default QuickBites;
