import { useState } from "react";
import { Heart } from "lucide-react";

interface Props {
  initialCount?: number;
}

const ArticleLike = ({ initialCount = 24 }: Props) => {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);

  const toggleLike = () => {
    setLiked((prev) => !prev);
    setCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <button
      onClick={toggleLike}
      aria-label="Sukai artikel"
      className={`
        group inline-flex items-center gap-2
        px-3.5 py-1.5
        rounded-full border
        text-sm font-medium
        transition-all duration-200
        ${
          liked
            ? "bg-emerald-50 border-emerald-300 text-gray-700"
            : "bg-white border-gray-300 text-gray-600 hover:border-emerald-300"
        }
      `}
    >
      <Heart
        className={`
          w-4.5 h-4.5 transition-all duration-200
          ${
            liked
              ? "fill-red-500 stroke-red-500 scale-110"
              : "stroke-gray-500 group-hover:stroke-red-500"
          }
        `}
      />

      <span className="tabular-nums text-sm">{count}</span>
    </button>
  );
};

export default ArticleLike;
