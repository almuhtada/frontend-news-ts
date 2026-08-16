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

        // Hero tetap kecil dan cepat; daftar bawah mengecualikan ID Hero di server.
        const heroResponse = await postsService.getPosts({
          ...(categorySlug ? { category: categorySlug } : {}),
          limit: 5,
          status: "publish",
        });
        const excludedIds = heroResponse.posts.map((post) => post.id).join(",");
        const [listResponse, popular, categoriesData] = await Promise.all([
          postsService.getPosts({
            ...(categorySlug ? { category: categorySlug } : {}),
            limit: POSTS_PER_PAGE,
            page: currentPage,
            status: "publish",
            ...(excludedIds ? { exclude: excludedIds } : {}),
          }),
          postsService.getPopularPosts(5),
          categoriesService.getCategories(),
        ]);
        setFeaturedArticles(heroResponse.posts);
        setArticles(listResponse.posts);
        setTotalPages(listResponse.totalPages || 1);
        setTotalPosts(listResponse.total || listResponse.posts.length);

        setTrendingNews(popular);
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
