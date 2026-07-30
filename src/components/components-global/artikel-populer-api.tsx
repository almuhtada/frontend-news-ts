import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { postsService, type Post } from "../../services/posts";

const ArtikelPopulerApi: React.FC = () => {
  const [articles, setArticles] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopularArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        const popularPosts = await postsService.getPopularPosts(5);
        setArticles(popularPosts);
      } catch (err) {
        setError("Gagal memuat artikel populer");
        console.error("Error fetching popular articles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularArticles();
  }, []);

  // ─── Loading State ───────────────────────────────────────────
  if (loading) {
    return (
      <div className="bg-transparent pb-6">
        <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-gray-105 pb-2 border-b border-gray-100 dark:border-gray-800/60 mb-4">
          Artikel Populer
        </h3>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-8 h-8 rounded bg-gray-100 dark:bg-gray-800" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full" />
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── Error State ─────────────────────────────────────────────
  if (error) {
    return null;
  }

  // ─── Empty State ─────────────────────────────────────────────
  if (articles.length === 0) {
    return null;
  }

  // ─── Main Content (Editorial Newspaper Style) ─────────────────
  return (
    <div className="bg-transparent pb-6">
      {/* Header */}
      <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-gray-105 pb-2 border-b border-gray-100 dark:border-gray-800/60 mb-4">
        Artikel Populer
      </h3>

      {/* List */}
      <div className="flex flex-col">
        {articles.map((article, index) => {
          const authorName = article.author?.display_name || article.author?.username || "Redaksi";
          return (
            <Link
              key={article.id}
              to={`/detail-news/${article.slug}`}
              className="group flex items-start gap-4 py-3.5 border-b border-gray-100 dark:border-gray-850 last:border-0"
            >
              {/* Large, elegant editorial rank number */}
              <span className="font-serif text-3xl font-light text-gray-300 dark:text-gray-700 leading-none select-none w-8 block flex-shrink-0">
                {index + 1}
              </span>

              {/* Title and Author (Clean typography) */}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-gray-950 dark:text-gray-200 leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  {article.title}
                </h4>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-wider font-semibold">
                  Oleh {authorName}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ArtikelPopulerApi;
