import { Link } from "react-router-dom";

type Article = {
  img: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  summary: string;
  author: string;
};

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, featured }) => (
  <Link
    to={`/detail-news`}
    className={`block ${featured ? "md:col-span-2" : ""}`}
  >
    <article className="group cursor-pointer">
      <div
        className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 ${
          featured ? "md:flex" : ""
        }`}
      >
        <div className={`relative ${featured ? "md:w-1/2" : ""}`}>
          <img
            src={article.img}
            alt={article.title}
            className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
              featured ? "h-64 md:h-full" : "h-48"
            }`}
          />
          <span className="absolute top-4 left-4 bg-[#00531b] text-white text-xs font-medium px-3 py-1 rounded-full">
            {article.category}
          </span>
        </div>

        <div
          className={`p-6 ${
            featured ? "md:w-1/2 flex flex-col justify-center" : ""
          }`}
        >
          <div className="flex items-center text-xs text-gray-500 mb-3">
            <span>{article.date}</span>
            <span className="mx-2">•</span>
            <span>{article.readTime}</span>
          </div>

          <h3
            className={`font-bold text-gray-900 mb-3 group-hover:text-[#00531b] transition-colors leading-tight ${
              featured ? "text-xl md:text-2xl" : "text-lg"
            }`}
          >
            {article.title}
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {article.summary}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
              <span className="text-xs text-gray-500 font-medium">
                {article.author}
              </span>
            </div>
            <button className="text-[#00531b] hover:text-blue-800 text-sm font-medium">
              Baca →
            </button>
          </div>
        </div>
      </div>
    </article>
  </Link>
);

export default ArticleCard;
