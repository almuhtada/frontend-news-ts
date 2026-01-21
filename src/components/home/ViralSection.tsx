import { TrendingUp } from "lucide-react";
import ArticleCardApi from "../../ui/components-global/card-artikel-api";
import type { Post } from "../../services/posts";

interface ViralSectionProps {
  articles: Post[];
  isLoading: boolean;
}

const ViralSection = ({ articles, isLoading }: ViralSectionProps) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Viral & Populer
          </h2>
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
        <div className="grid md:grid-cols-2 gap-8">
          {articles.slice(0, 4).map((article, index) => (
            <div
              key={article.id}
              className="group rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <ArticleCardApi article={article} featured={index === 0} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ViralSection;
