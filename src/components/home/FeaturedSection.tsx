import { Flame as Fire } from "lucide-react";
import CardHeadlinerApi from "../components-global/card-headliner-api";
import type { Post } from "../../services/posts";

interface FeaturedSectionProps {
  articles: Post[];
  isLoading: boolean;
}

const FeaturedSection = ({ articles, isLoading }: FeaturedSectionProps) => {
  return (
    <section className="relative mb-14">
      {/* Section Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 text-white shadow">
          <Fire className="h-5 w-5" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900">Berita Utama</h2>

        <div className="flex-1 h-px bg-gradient-to-r from-emerald-200 to-transparent" />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm animate-pulse">
          <div className="h-[420px] rounded-xl bg-gray-200" />
        </div>
      ) : (
        <CardHeadlinerApi slides={articles} />
      )}
    </section>
  );
};

export default FeaturedSection;
