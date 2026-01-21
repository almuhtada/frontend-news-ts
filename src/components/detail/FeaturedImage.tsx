import type { Post } from "../../services/posts";

interface FeaturedImageProps {
  post: Post;
}

const FeaturedImage = ({ post }: FeaturedImageProps) => {
  if (!post.featured_image) return null;

  return (
    <div className="mt-6">
      <img
        src={post.featured_image}
        alt={post.title}
        className="w-full h-80 object-cover rounded-lg"
        draggable="false"
        onDragStart={(e) => e.preventDefault()}
      />
      <p className="text-xs text-gray-500 mt-2 italic">
        {post.meta_description || post.excerpt || "Gambar artikel"}
      </p>
    </div>
  );
};

export default FeaturedImage;
