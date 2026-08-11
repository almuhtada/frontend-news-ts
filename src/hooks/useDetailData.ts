import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { postsService } from "../services/posts";
import { recommendationsService } from "../services/recommendations";
import type { Post } from "../services/posts";

export const useDetailData = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAuthors, setShowAuthors] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        setError(null);

        const postData = await postsService.getPostBySlug(slug);
        setPost(postData);

        // Track view untuk sistem rekomendasi (fire-and-forget)
        // Tidak perlu await — tidak boleh blocking
        recommendationsService.trackView(postData.uuid);

        // Fetch related posts menggunakan endpoint rekomendasi yang sesungguhnya.
        // Strategi bobot ditangani di backend:
        //   - Kategori sama  → ~65% slot (prioritas tertinggi)
        //   - Tag sama       → ~25% slot
        //   - Author sama    → ~10% slot
        //   - Fallback trending jika kurang
        const related = await recommendationsService.getRelatedPosts(
          postData.uuid,
          6
        );
        setRelatedPosts(related.filter((p) => p.slug !== slug).slice(0, 6));
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Gagal memuat artikel. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  // Disable text selection and copy protection
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
    };
    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      (e as Event).preventDefault();
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (
        e.ctrlKey &&
        (e.key === "a" ||
          e.key === "c" ||
          e.key === "v" ||
          e.key === "x" ||
          e.key === "s")
      ) {
        e.preventDefault();
      }
      if (e.key === "F12") {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("selectstart", handleSelectStart);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("selectstart", handleSelectStart);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const words = post?.content.split(" ") || [];
  const wordsPerPage = 300;
  const totalPages = Math.ceil(words.length / wordsPerPage);

  const getPageContent = (page: number) => {
    const start = (page - 1) * wordsPerPage;
    const end = start + wordsPerPage;
    return words.slice(start, end).join(" ");
  };

  return {
    post,
    relatedPosts,
    loading,
    error,
    showAuthors,
    setShowAuthors,
    currentPage,
    setCurrentPage,
    totalPages,
    words,
    getPageContent,
  };
};
