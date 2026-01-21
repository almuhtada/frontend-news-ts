import { Link } from "react-router-dom";
import type { Post } from "../../services/posts";

interface ArticlesListProps {
  articles: Post[];
  selectedCategory: string | null;
  onClearFilter: () => void;
}

const ArticlesList = ({ articles, selectedCategory, onClearFilter }: ArticlesListProps) => {
  return (
    <div className="bg-white rounded shadow p-4">
      {selectedCategory && (
        <div className="mb-4">
          <span className="text-sm text-gray-600">Filter: </span>
          <span className="font-semibold text-blue-600">
            {selectedCategory}
          </span>
          <button
            onClick={onClearFilter}
            className="ml-2 text-xs text-red-600 hover:text-red-800"
          >
            Hapus Filter
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map((article) => (
          <article key={article.id} className="flex gap-3">
            {article.featured_image && (
              <img
                src={article.featured_image}
                alt={article.title}
                className="w-24 h-24 object-cover rounded"
              />
            )}
            <div className="flex-1">
              <h5 className="font-semibold">
                <Link to={`/detail-news/${article.slug}`}>
                  {article.title}
                </Link>
              </h5>
              <p className="text-sm text-gray-600">
                {article.excerpt ||
                  article.content.substring(0, 80) + "..."}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ArticlesList;
