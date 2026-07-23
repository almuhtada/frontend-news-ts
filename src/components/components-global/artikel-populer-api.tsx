import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, Eye, FileText, ArrowRight } from "lucide-react";
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
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800/60 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 dark:border-gray-800 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
            Artikel Populer
          </h3>
        </div>
        <div className="p-5 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-lg w-full" />
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-lg w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── Error State ─────────────────────────────────────────────
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800/60 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 dark:border-gray-800 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
            Artikel Populer
          </h3>
        </div>
        <div className="p-8 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
            <FileText className="w-5 h-5 text-gray-400 dark:text-gray-600" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  // ─── Empty State ─────────────────────────────────────────────
  if (articles.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800/60 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 dark:border-gray-800 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
            Artikel Populer
          </h3>
        </div>
        <div className="p-8 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
            <FileText className="w-5 h-5 text-gray-400 dark:text-gray-600" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Belum ada artikel populer
          </p>
        </div>
      </div>
    );
  }

  // ─── Main Content ────────────────────────────────────────────
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800/60 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
            Artikel Populer
          </h3>
        </div>
        <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
          {articles.length}
        </span>
      </div>

      {/* List */}
      <div className="p-2">
        <div className="divide-y divide-gray-50 dark:divide-gray-800/60">
          {articles.map((article, index) => (
            <Link
              key={article.id}
              to={`/detail-news/${article.slug}`}
              className="group flex items-start gap-3 px-3 py-3.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200"
            >
              {/* Rank Number */}
              <div
                className={`
                  flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold
                  ${
                    index < 3
                      ? "bg-gradient-to-br from-green-400 to-green-500 text-white shadow-sm"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                  }
                `}
              >
                {index + 1}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2">
                  {article.title}
                </h4>

                {/* Meta */}
                <div className="flex items-center gap-2 mt-1.5 text-[11px] text-gray-400 dark:text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {(article.views || article.view_count || 0).toLocaleString(
                      "id-ID",
                    )}
                  </span>
                  {article.categories && article.categories.length > 0 && (
                    <>
                      <span className="w-0.5 h-0.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                      <span className="text-emerald-600 dark:text-emerald-400">
                        {article.categories[0].name}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Arrow */}
              <ArrowRight className="flex-shrink-0 w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all duration-200 mt-1" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtikelPopulerApi;
