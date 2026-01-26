import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { postsService, type Post } from "../../services/posts";

const ArtikelPopulerApi: React.FC = () => {
  const [articles, setArticles] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularArticles = async () => {
      try {
        setLoading(true);
        const popularPosts = await postsService.getPopularPosts(5);
        console.log("Popular Posts:", popularPosts);
        setArticles(popularPosts);
      } catch (error) {
        console.error("Error fetching popular articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularArticles();
  }, []);

  if (loading) {
    return (
      <aside className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="text-center text-gray-400 py-8">
          Memuat artikel populer...
        </div>
      </aside>
    );
  }

  if (articles.length === 0) {
    return (
      <aside className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="text-center text-gray-400 py-8">
          Tidak ada artikel populer
        </div>
      </aside>
    );
  }

  return (
    <aside className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Artikel Populer</h2>
        <span className="text-xs text-gray-400">{articles.length} artikel</span>
      </div>

      {/* LIST */}
      <ul className="space-y-3">
        {articles.map((article) => (
          <li key={article.id}>
            <Link
              to={`/detail-news/${article.slug}`}
              onClick={() => {
                console.log("Link clicked!", {
                  slug: article.slug,
                  title: article.title,
                  fullPath: `/detail-news/${article.slug}`,
                });
              }}
              className="relative z-20 group block p-4 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all duration-200 cursor-pointer"
              style={{ pointerEvents: "auto" }}
            >
              <h3 className="font-medium text-gray-800 group-hover:text-emerald-700 leading-snug line-clamp-2">
                {article.title}
              </h3>
              {article.excerpt && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {article.excerpt}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                <span>{article.views || article.view_count || 0} views</span>
                {article.categories && article.categories.length > 0 && (
                  <span>• {article.categories[0].name}</span>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default ArtikelPopulerApi;
