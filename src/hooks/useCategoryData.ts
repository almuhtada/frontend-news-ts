import { useState, useEffect } from "react";
import { postsService } from "../services/posts";
import { categoriesService } from "../services/categories";
import type { Post, Category } from "../services/posts";

export const useCategoryData = (categorySlug?: string) => {
  const [featuredArticles, setFeaturedArticles] = useState<Post[]>([]);
  const [articles, setArticles] = useState<Post[]>([]);
  const [trendingNews, setTrendingNews] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Jika ada slug (dari category), fetch berdasarkan category
        if (categorySlug) {
          const categoryPosts = await postsService.getPosts({
            category: categorySlug,
            limit: 12,
            status: "publish",
          });
          setArticles(categoryPosts.posts);
          setFeaturedArticles(categoryPosts.posts.slice(0, 5));
        } else {
          // Fetch featured posts
          const featured = await postsService.getPosts({
            featured: true,
            limit: 5,
            status: "publish",
          });
          setFeaturedArticles(featured.posts);

          // Fetch articles
          const allPosts = await postsService.getPosts({
            limit: 12,
            status: "publish",
          });
          setArticles(allPosts.posts);
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
  }, [categorySlug]);

  return {
    featuredArticles,
    articles,
    trendingNews,
    categories,
    loading,
  };
};
