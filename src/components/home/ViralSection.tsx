import { TrendingUp, ArrowRight } from "lucide-react";
import ArticleCardApi from "../components-global/card-artikel-api";
import type { Post } from "../../services/posts";

interface ViralSectionProps {
  articles: Post[];
  isLoading: boolean;
}

const ViralSection = ({ articles, isLoading }: ViralSectionProps) => {
  return (
    <section className="mb-12 lg:mb-16">
      {/* ─── Section Header ───────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6 lg:mb-8">
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className="relative flex-shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-md shadow-indigo-500/20">
              <TrendingUp className="h-5 w-5" />
            </div>
            {/* Decorative pulse dot */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-400 rounded-full border-2 border-white dark:border-gray-900 animate-pulse" />
          </div>

          {/* Title group */}
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                Viral & Populer
              </h2>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400">
                Trending
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 hidden sm:block">
              Artikel yang paling banyak dibaca minggu ini
            </p>
          </div>
        </div>

        {/* View all link */}
        <a
          href="/viral"
          className="group hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
        >
          Lihat Semua
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>

      {/* ─── Content ──────────────────────────────────────────── */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm"
            >
              {/* Image skeleton */}
              <div className="aspect-[16/10] bg-gray-100 dark:bg-gray-800 animate-pulse" />
              {/* Content skeleton */}
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-lg w-20 animate-pulse" />
                <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded-lg w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-lg w-full animate-pulse" />
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-lg w-2/3 animate-pulse" />
                <div className="pt-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse" />
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-lg w-24 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {articles.slice(0, 4).map((article, index) => (
            <div
              key={article.id}
              className={`
                transition-all duration-500 ease-out
                ${index === 0 ? "md:col-span-2" : ""}
              `}
            >
              <ArticleCardApi article={article} featured={index === 0} />
            </div>
          ))}
        </div>
      ) : (
        /* Empty state */
        <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 p-12 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-gray-400 dark:text-gray-600" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-200 mb-1">
            Belum Ada Artikel Viral
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Artikel populer akan muncul di sini
          </p>
        </div>
      )}
    </section>
  );
};

export default ViralSection;
