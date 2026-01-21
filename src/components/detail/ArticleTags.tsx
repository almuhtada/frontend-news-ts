import type { Post } from "../../services/posts";

interface ArticleTagsProps {
  post: Post;
}

const ArticleTags = ({ post }: ArticleTagsProps) => {
  const tags = post.tags?.length
    ? post.tags
    : [{ id: "default", name: "Berita" }];

  return (
    <div className="mt-10 flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-gray-500">Topik terkait:</span>

      {tags.map((tag) => (
        <span
          key={tag.id}
          className="
            inline-flex items-center
            rounded-full
            border border-emerald-200
            bg-emerald-50
            px-3 py-1
            text-xs font-semibold
            text-emerald-700
            transition
            hover:bg-emerald-100
            hover:text-emerald-800
          "
        >
          #{tag.name}
        </span>
      ))}
    </div>
  );
};

export default ArticleTags;
