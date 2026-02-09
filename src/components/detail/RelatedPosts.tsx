import { Link } from "react-router-dom";
import type { Post } from "../../services/posts";
import { getImageUrl } from "../../config/api";

interface RelatedPostsProps {
  posts: Post[];
}

const RelatedPosts = ({ posts }: RelatedPostsProps) => {
  if (!posts.length) return null;

  return (
    <section className="mt-16">
      {/* Section Header */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">
          Rekomendasi Berita Lainnya
        </h3>
        <span className="text-sm text-emerald-600 font-medium">
          Pilihan untuk Anda
        </span>
      </div>

      {/* Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            to={`/detail-news/${post.slug}`}
            className="group rounded-xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-lg transition"
          >
            {/* Image */}
            {post.featured_image && (
              <div className="relative h-44 overflow-hidden">
                <img
                  src={getImageUrl(post.featured_image)}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  draggable="false"
                  onDragStart={(e) => e.preventDefault()}
                />

                {/* Category Badge */}
                <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow">
                  {post.categories?.[0]?.name || "Artikel"}
                </span>
              </div>
            )}

            {/* Content */}
            <div className="p-4 flex flex-col gap-2">
              <h4 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-emerald-700 transition">
                {post.title}
              </h4>

              {post.published_at && (
                <span className="text-xs text-gray-400">
                  {new Date(post.published_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedPosts;
