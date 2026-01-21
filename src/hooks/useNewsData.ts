import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { postsService } from "../services/posts";
import type { Post } from "../services/posts";

export const useNewsData = () => {
  const [searchParams] = useSearchParams();
  const [topStories, setTopStories] = useState<Post[]>([]);
  const [articles, setArticles] = useState<Post[]>([]);
  const [editorsPicks, setEditorsPicks] = useState<Post[]>([]);
  const [mostRead, setMostRead] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch featured posts for top stories
        const featuredPosts = await postsService.getPosts({
          featured: true,
          limit: 10,
          status: "publish",
        });
        setTopStories(featuredPosts.posts);

        // Fetch recent posts for articles
        const recentPosts = await postsService.getPosts({
          limit: 6,
          status: "publish",
        });
        setArticles(recentPosts.posts);

        // Fetch popular posts
        const popularPosts = await postsService.getPopularPosts(3);
        setMostRead(popularPosts);

        // Fetch some posts for editor's picks
        const editorPosts = await postsService.getRecentPosts(3);
        setEditorsPicks(editorPosts);

        // Extract unique categories from all posts
        const allPosts = [
          ...featuredPosts.posts,
          ...recentPosts.posts,
          ...popularPosts,
          ...editorPosts,
        ];
        const uniqueCategories = Array.from(
          new Set(
            allPosts
              .flatMap((post) => post.categories || [])
              .map((cat) => cat.name)
              .filter((name) => name),
          ),
        );
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Gagal memuat data. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "1 day ago";
    return `${diffInDays} days ago`;
  };

  const filteredArticles = selectedCategory
    ? articles.filter((article) =>
        article.categories?.some((cat) => cat.name === selectedCategory),
      )
    : articles;

  return {
    topStories,
    articles,
    editorsPicks,
    mostRead,
    loading,
    error,
    categories,
    selectedCategory,
    setSelectedCategory,
    handleCategoryClick,
    formatTimeAgo,
    filteredArticles,
  };
};
