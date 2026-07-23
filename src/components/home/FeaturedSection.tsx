import { Flame as Fire } from "lucide-react";
import CardHeadlinerApi from "../components-global/card-headliner-api";
import type { Post } from "../../services/posts";

interface FeaturedSectionProps {
  articles: Post[];
  isLoading: boolean;
}

const FeaturedSection = ({ articles, isLoading }: FeaturedSectionProps) => {
  return (
    <section className="relative mb-12 lg:mb-16">
      {/* ─── Section Header ───────────────────────────────────── */}
      <div className="flex items-center gap-4 mb-6 lg:mb-8">
        {/* Icon */}
        <div className="relative flex-shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20">
            <Fire className="h-5 w-5" />
          </div>
          {/* Decorative dot */}
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-white dark:border-gray-900" />
        </div>

        {/* Title group */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              Berita Utama
            </h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Kumpulan berita paling relevan untuk Anda
          </p>
        </div>

        {/* Divider line */}
        <div className="hidden md:block flex-1 h-px bg-gradient-to-r from-gray-200 dark:from-gray-700 to-transparent" />
      </div>

      {/* ─── Content ──────────────────────────────────────────── */}
      {isLoading ? (
        <div className="relative rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
          {/* Skeleton shimmer effect */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
          <div className="p-5 sm:p-6">
            <div className="aspect-[16/9] sm:aspect-[21/9] rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
            {/* Text skeletons */}
            <div className="mt-5 space-y-3 max-w-2xl">
              <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded-lg w-24 animate-pulse" />
              <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded-lg w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-lg w-full animate-pulse" />
              <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-lg w-2/3 animate-pulse" />
            </div>
          </div>
        </div>
      ) : articles.length > 0 ? (
        <div className="relative">
          <CardHeadlinerApi slides={articles} />
        </div>
      ) : (
        /* Empty state */
        <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 p-12 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Fire className="w-6 h-6 text-gray-400 dark:text-gray-600" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-200 mb-1">
            Belum Ada Berita Utama
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Berita utama akan muncul di sini
          </p>
        </div>
      )}
    </section>
  );
};

export default FeaturedSection;
