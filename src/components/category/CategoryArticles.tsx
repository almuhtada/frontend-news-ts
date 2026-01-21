import ArticleCardApi from "../../ui/components-global/card-artikel-api";
import type { Post } from "../../services/posts";

interface CategoryArticlesProps {
  articles: Post[];
}

const CategoryArticles = ({ articles }: CategoryArticlesProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {articles.map((article) => (
        <ArticleCardApi key={article.id} article={article} />
      ))}
    </div>
  );
};

export default CategoryArticles;
