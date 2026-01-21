import { Clock, Loader2 } from "lucide-react";
import ArticleCardApi from "../../ui/components-global/card-artikel-api";
import type { Post } from "../../services/posts";

interface LatestNewsSectionProps {
  articles: Post[];
  activeCategory: string;
  isLoading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  observerRef: React.RefObject<HTMLDivElement | null>;
}

const LatestNewsSection = ({
  articles,
  activeCategory,
  isLoading,
  loadingMore,
  hasMore,
  observerRef,
}: LatestNewsSectionProps) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Berita Terbaru
          </h2>
          {activeCategory !== "semua" && (
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium capitalize">
              {activeCategory}
            </span>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 shadow-lg animate-pulse"
            >
              <div className="h-48 bg-gray-200 rounded-2xl mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-8">
            {articles.map((article, index) => (
              <div
                key={`${article.id}-${index}`}
                className="group rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <ArticleCardApi article={article} featured={index === 0} />
              </div>
            ))}
          </div>

          {/* Infinite Scroll Trigger */}
          <div ref={observerRef} className="mt-8 flex justify-center">
            {loadingMore && (
              <div className="flex items-center gap-2 text-blue-600">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-sm font-medium">Memuat berita lainnya...</span>
              </div>
            )}
            {!hasMore && articles.length > 0 && (
              <div className="text-center text-gray-500 text-sm">
                Semua berita telah ditampilkan
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default LatestNewsSection;
