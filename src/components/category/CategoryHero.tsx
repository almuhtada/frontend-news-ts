import CardHeadlinerApi from "../components-global/card-headliner-api";
import type { Post } from "../../services/posts";

interface CategoryHeroProps {
  articles: Post[];
}

const CategoryHero = ({ articles }: CategoryHeroProps) => {
  return <CardHeadlinerApi slides={articles} />;
};

export default CategoryHero;
