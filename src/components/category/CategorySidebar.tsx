import TrendingListApi from "../components-global/trending-list-api";
import SidebarSection from "../components-news/sidebar-section";
import type { Post, Category } from "../../services/posts";

interface CategorySidebarProps {
  trendingNews: Post[];
  categories: Category[];
}

const CategorySidebar = ({
  trendingNews,
  categories,
}: CategorySidebarProps) => {
  return (
    <aside className="lg:col-span-1 space-y-8">
      <TrendingListApi items={trendingNews} />

      <SidebarSection
        title="Topik Hangat"
        items={categories.map((cat) => cat.name)}
      />
    </aside>
  );
};

export default CategorySidebar;
