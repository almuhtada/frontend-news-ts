import { Flame as Fire } from "lucide-react";
import CardHeadlinerApi from "../components-global/card-headliner-api";
import type { Post } from "../../services/posts";

interface FeaturedSectionProps {
  articles: Post[];
  isLoading: boolean;
}

const FeaturedSection = ({ articles, isLoading }: FeaturedSectionProps) => {
  return (
    <section>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <span className="w-1.5 h-6 rounded-full bg-[#00531b] flex-shrink-0" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Berita Utama
          </h2>
        </div>
        <p className="text-gray-500 dark:text-gray-400 ml-4.5 text-xs sm:text-sm">
          Kumpulan berita paling relevan untuk Anda
        </p>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm p-4 sm:p-6">
          <div className="h-44 sm:h-64 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
          <div className="mt-4 space-y-3">
            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-lg w-1/3 animate-pulse" />
            <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded-lg w-3/4 animate-pulse" />
            <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-lg w-full animate-pulse" />
          </div>
        </div>
      ) : articles.length > 0 ? (
        <CardHeadlinerApi slides={articles} />
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 p-8 sm:p-12 text-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Fire className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 dark:text-gray-600" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-200 mb-1">
            Belum Ada Berita Utama
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Berita utama akan muncul di sini
          </p>
        </div>
      )}
    </section>
  );
};

export default FeaturedSection;
