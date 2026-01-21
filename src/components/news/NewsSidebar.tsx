import { Link } from "react-router-dom";
import SidebarSection from "../../ui/components-news/sidebar-section";
import type { Post } from "../../services/posts";

interface NewsSidebarProps {
  categories: string[];
  editorsPicks: Post[];
  mostRead: Post[];
  onCategoryClick: (category: string) => void;
}

const NewsSidebar = ({
  categories,
  editorsPicks,
  mostRead,
  onCategoryClick
}: NewsSidebarProps) => {
  return (
    <aside className="space-y-4">
      <SidebarSection
        title="Kategori"
        items={categories}
        onItemClick={onCategoryClick}
      />

      <div className="bg-white rounded shadow p-4">
        <h4 className="font-bold">Editor's picks</h4>
        <ul className="mt-3 space-y-2 text-sm text-gray-600">
          {editorsPicks.map((post) => (
            <li key={post.id}>
              <Link to={`/detail-news/${post.slug}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded shadow p-4">
        <h4 className="font-bold">Most Read</h4>
        <ol className="mt-3 space-y-2 text-sm text-gray-600 list-decimal pl-5">
          {mostRead.map((post) => (
            <li key={post.id}>
              <Link to={`/detail-news/${post.slug}`}>{post.title}</Link>
            </li>
          ))}
        </ol>
      </div>
    </aside>
  );
};

export default NewsSidebar;
