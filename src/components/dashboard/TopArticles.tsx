import { Eye, TrendingUp } from "lucide-react";

export interface Article {
  id: number;
  title: string;
  views: number;
}

interface Props {
  articles: Article[];
}

const TopArticles: React.FC<Props> = ({ articles }) => {
  return (
    <section className="rounded-2xl bg-white border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Artikel Terpopuler
            </h3>
            <p className="text-xs text-gray-500">
              Berdasarkan jumlah views terbanyak
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="divide-y divide-gray-100">
        {articles.map((a, index) => (
          <div
            key={a.id}
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition"
          >
            {/* LEFT */}
            <div className="flex items-center gap-4 min-w-0">
              {/* Rank */}
              <div
                className={`h-8 w-8 flex items-center justify-center rounded-lg text-sm font-semibold
                  ${
                    index === 0
                      ? "bg-yellow-100 text-yellow-700"
                      : index === 1
                        ? "bg-gray-200 text-gray-700"
                        : index === 2
                          ? "bg-amber-100 text-amber-700"
                          : "bg-gray-100 text-gray-500"
                  }
                `}
              >
                {index + 1}
              </div>

              {/* Title */}
              <p className="text-sm font-medium text-gray-900 truncate max-w-[360px]">
                {a.title}
              </p>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-1 text-sm font-medium text-gray-600">
              <Eye className="w-4 h-4 text-gray-400" />
              {a.views.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopArticles;
