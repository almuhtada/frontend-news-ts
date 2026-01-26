import { useState, useEffect } from "react";
import { postsService } from "../services/posts";
import { categoriesService } from "../services/categories";
import type { Post, Category } from "../services/posts";

const POSTS_PER_PAGE = 12;

export const useCategoryData = (categorySlug?: string) => {
  const [featuredArticles, setFeaturedArticles] = useState<Post[]>([]);
  const [articles, setArticles] = useState<Post[]>([]);
  const [trendingNews, setTrendingNews] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Jika ada slug (dari category), fetch berdasarkan category
        if (categorySlug) {
          const categoryPosts = await postsService.getPosts({
            category: categorySlug,
            limit: POSTS_PER_PAGE,
            page: currentPage,
            status: "publish",
          });
          setArticles(categoryPosts.posts);
          setFeaturedArticles(categoryPosts.posts.slice(0, 5));
          setTotalPages(categoryPosts.totalPages || 1);
          setTotalPosts(categoryPosts.total || categoryPosts.posts.length);
        } else {
          // Fetch featured posts
          const featured = await postsService.getPosts({
            featured: true,
            limit: 5,
            status: "publish",
          });
          setFeaturedArticles(featured.posts);

          // Fetch articles with pagination
          const allPosts = await postsService.getPosts({
            limit: POSTS_PER_PAGE,
            page: currentPage,
            status: "publish",
          });
          setArticles(allPosts.posts);
          setTotalPages(allPosts.totalPages || 1);
          setTotalPosts(allPosts.total || allPosts.posts.length);
        }

        // Fetch popular posts
        const popular = await postsService.getPopularPosts(5);
        setTrendingNews(popular);

        // Fetch categories untuk topik hangat
        const categoriesData = await categoriesService.getCategories();
        setCategories(categoriesData.slice(0, 6));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categorySlug, currentPage]);

  return {
    featuredArticles,
    articles,
    trendingNews,
    categories,
    loading,
    currentPage,
    setCurrentPage,
    totalPages,
    totalPosts,
  };
};
