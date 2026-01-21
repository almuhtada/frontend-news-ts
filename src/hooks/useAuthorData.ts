import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { authorsService } from "../services/authors";
import type { Author, AuthorPostsResponse } from "../services/authors";
import type { Post } from "../services/posts";

export const useAuthorData = () => {
  const { username } = useParams<{ username: string }>();
  const [author, setAuthor] = useState<Author | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    const fetchAuthorData = async () => {
      if (!username) return;

      try {
        setLoading(true);
        setError(null);

        const response: AuthorPostsResponse = await authorsService.getAuthorPosts(
          username,
          currentPage,
          10
        );

        setAuthor(response.data.author);
        setPosts(response.data.posts);
        setTotalPages(response.data.pagination.totalPages);
        setTotalPosts(response.data.pagination.totalPosts);
      } catch (err) {
        console.error("Error fetching author data:", err);
        setError("Gagal memuat data penulis. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorData();
  }, [username, currentPage]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    author,
    posts,
    loading,
    error,
    currentPage,
    totalPages,
    totalPosts,
    goToPage,
  };
};
