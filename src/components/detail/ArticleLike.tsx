import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { interactionService } from "../../services/interactions";
import { getUserIdentifier } from "../../utils/userIdentifier";

interface Props {
  postUuid: string;
  initialCount?: number;
}

const ArticleLike = ({ postUuid, initialCount = 0 }: Props) => {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  // Fetch initial like data
  useEffect(() => {
    const fetchLikeData = async () => {
      try {
        const userIdentifier = getUserIdentifier();
        const response = await interactionService.getLikes(postUuid, userIdentifier);

        if (response.success) {
          setLiked(response.data.liked);
          setCount(response.data.likeCount);
        }
      } catch (error) {
        console.error("Failed to fetch like data:", error);
      }
    };

    fetchLikeData();
  }, [postUuid]);

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
      const response = await interactionService.toggleLike(postUuid, userIdentifier);

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
            ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 text-gray-700 dark:text-gray-300"
            : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-emerald-300"
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
