import type { Post } from "../../services/posts";
import { getImageUrl } from "../../config/api";

interface FeaturedImageProps {
  post: Post;
}

const FeaturedImage = ({ post }: FeaturedImageProps) => {
  const imageUrl = getImageUrl(post.featured_image);

  if (!imageUrl) return null;

  return (
    <figure className="mt-8">
      {/* IMAGE FRAME */}
      <div className="relative w-full h-[420px] rounded-2xl overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={post.title}
          className="
            absolute inset-0
            w-full h-full
            object-cover
            select-none
          "
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
        />
      </div>

      {/* CAPTION */}
      {(post.image_caption || post.meta_description || post.excerpt) && (
        <figcaption className="mt-3 text-center text-sm text-gray-500 italic">
          {post.image_caption || post.meta_description || post.excerpt}
        </figcaption>
      )}
    </figure>
  );
};

export default FeaturedImage;
