import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { interactionService } from "../../services/interactions";
import { getUserIdentifier } from "../../utils/userIdentifier";

interface Props {
  postId: number;
  initialCount?: number;
}

const ArticleLike = ({ postId, initialCount = 0 }: Props) => {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  // Fetch initial like data
  useEffect(() => {
    const fetchLikeData = async () => {
      try {
        const userIdentifier = getUserIdentifier();
        const response = await interactionService.getLikes(postId, userIdentifier);

        if (response.success) {
          setLiked(response.data.liked);
          setCount(response.data.likeCount);
        }
      } catch (error) {
        console.error("Failed to fetch like data:", error);
      }
    };

    fetchLikeData();
  }, [postId]);

  const toggleLike = async () => {
    if (loading) return;

    setLoading(true);

    // Optimistic update
    const previousLiked = liked;
    const previousCount = count;

    setLiked(!liked);
    setCount(liked ? count - 1 : count + 1);

    try {
      const userIdentifier = getUserIdentifier();
      const response = await interactionService.toggleLike(postId, userIdentifier);

      if (response.success) {
        // Update with actual data from server
        setLiked(response.data.liked);
        setCount(response.data.likeCount);
      } else {
        // Revert on failure
        setLiked(previousLiked);
        setCount(previousCount);
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
      // Revert on error
      setLiked(previousLiked);
      setCount(previousCount);
    } finally {
      setLoading(false);
    }
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
