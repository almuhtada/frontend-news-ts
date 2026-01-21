import { Link } from "react-router-dom";
import type { Post } from "../../services/posts";

interface HeroSectionProps {
  story: Post;
  formatTimeAgo: (dateString: string) => string;
}

const HeroSection = ({ story, formatTimeAgo }: HeroSectionProps) => {
  return (
    <article className="bg-white rounded shadow overflow-hidden md:flex">
      {story.featured_image && (
        <img
          src={story.featured_image}
          alt={story.title}
          className="w-full md:w-1/2 object-cover h-64 md:h-auto"
        />
      )}
      <div className="p-6 flex-1">
        <div className="text-sm text-yellow-600 font-semibold">
          TOP STORIES
        </div>
        <h1 className="mt-2 text-2xl md:text-3xl font-bold">
          <Link to={`/detail-news/${story.slug}`}>
            {story.title}
          </Link>
        </h1>
        <p className="mt-3 text-gray-600">
          {story.excerpt || story.content.substring(0, 150) + "..."}
        </p>
        <div className="mt-4 text-sm text-gray-500">
          By {story.author?.display_name || "Admin"} •{" "}
          {formatTimeAgo(story.createdAt)}
        </div>
      </div>
    </article>
  );
};

export default HeroSection;
