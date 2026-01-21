import type { Post } from "../../services/posts";

interface ArticleHeaderProps {
  post: Post;
}

const ArticleHeader = ({ post }: ArticleHeaderProps) => {
  return (
    <>
      {/* Breadcrumb */}
      <div>
        <h6 className="text-xs text-gray-500">
          Home {">"} {post.categories?.[0]?.name || "Berita"} {">"}{" "}
          {post.title}
        </h6>
      </div>

      {/* Judul Berita */}
      <div className="mt-4">
        <h1 className="font-bold text-3xl leading-tight text-gray-900">
          {post.title}
        </h1>
      </div>

      {/* Info media + tanggal */}
      <div className="mt-4 text-sm text-gray-500">
        <span className="font-semibold text-blue-600">almuhtada.org</span> -
        {post.published_at
          ? new Date(post.published_at).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "Tanggal tidak tersedia"}
        ,{" "}
        {post.published_at
          ? new Date(post.published_at).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : ""}{" "}
        WIB
      </div>
    </>
  );
};

export default ArticleHeader;
