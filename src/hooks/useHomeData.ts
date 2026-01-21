import { useState, useEffect, useRef, useCallback } from "react";
import { Star, Zap, Users, Search, TrendingUp } from "lucide-react";
import { postsService } from "../services/posts";
import { categoriesService } from "../services/categories";
import type { Post, Category } from "../services/posts";

interface HotTopic {
  title: string;
  count: number;
  trend: string;
  slug: string;
}

export const useHomeData = () => {
  const [activeCategory, setActiveCategory] = useState("semua");
  const [isLoading, setIsLoading] = useState(true);
  const [featuredArticles, setFeaturedArticles] = useState<Post[]>([]);
  const [articles, setArticles] = useState<Post[]>([]);
  const [trendingNews, setTrendingNews] = useState<Post[]>([]);
  const [viralNews, setViralNews] = useState<Post[]>([]);
  const [recentNews, setRecentNews] = useState<Post[]>([]);
  const [allNews, setAllNews] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Array<{
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }>>([
    { id: "semua", label: "Semua", icon: Star },
  ]);
  const [hotTopics, setHotTopics] = useState<HotTopic[]>([]);

  // Infinite scroll states
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch categories from backend
        const categoriesData = await categoriesService.getCategories();

        const categoryIcons = [Star, Zap, Users, Search, TrendingUp];
        const formattedCategories = [
          { id: "semua", label: "Semua", icon: Star },
          ...categoriesData.slice(0, 4).map((cat: Category, index: number) => ({
            id: cat.slug,
            label: cat.name,
            icon: categoryIcons[index + 1] || Star,
          })),
        ];
        setCategories(formattedCategories);

        // Format hot topics dari categories dengan post_count terbanyak
        type CategoryWithCount = Category & { post_count?: number | string };
        const categoriesWithCount = categoriesData
          .filter((cat: CategoryWithCount) => {
            const count = typeof cat.post_count === 'string'
              ? parseInt(cat.post_count)
              : (cat.post_count || 0);
            return count > 0;
          })
          .sort((a: CategoryWithCount, b: CategoryWithCount) => {
            const countA = typeof a.post_count === 'string'
              ? parseInt(a.post_count)
              : (a.post_count || 0);
            const countB = typeof b.post_count === 'string'
              ? parseInt(b.post_count)
              : (b.post_count || 0);
            return countB - countA;
          })
          .slice(0, 5)
          .map((cat: CategoryWithCount) => {
            const count = typeof cat.post_count === 'string'
              ? parseInt(cat.post_count)
              : (cat.post_count || 0);
            return {
              title: cat.name,
              count: count,
              trend: "+0%",
              slug: cat.slug,
            };
          });

        setHotTopics(categoriesWithCount);

        // Fetch featured posts (limit 5 untuk carousel)
        const featured = await postsService.getPosts({
          featured: true,
          limit: 5,
          status: "publish",
        });
        setFeaturedArticles(featured.posts);

        // Fetch popular posts untuk trending (limit 4)
        const popular = await postsService.getPopularPosts(4);
        setTrendingNews(popular);

        // Fetch viral posts (posts dengan views tinggi, limit 4)
        const viral = await postsService.getPopularPosts(4);
        setViralNews(viral);

        // Fetch recent posts untuk berita terbaru (limit 4)
        const recentPosts = await postsService.getRecentPosts(4);
        setRecentNews(recentPosts);

        // Fetch all posts untuk pagination list (limit 50)
        const allNewsPosts = await postsService.getRecentPosts(50);
        setAllNews(allNewsPosts);

        // Fetch all posts untuk initial load (limit 12)
        const allPosts = await postsService.getRecentPosts(12);
        setArticles(allPosts);
        setHasMore(allPosts.length === 12);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Load more articles saat scroll
  const loadMoreArticles = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;

      const moreArticles = await postsService.getPosts({
        page: nextPage,
        limit: 12,
        status: "publish",
      });

      if (moreArticles.posts.length > 0) {
        setArticles((prev) => [...prev, ...moreArticles.posts]);
        setPage(nextPage);
        setHasMore(moreArticles.posts.length === 12);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more articles:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [page, loadingMore, hasMore]);

  // Intersection Observer untuk infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMoreArticles();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMoreArticles, hasMore, loadingMore]);

  const filteredArticles =
    activeCategory === "semua"
      ? articles
      : articles.filter((article) =>
          article.categories?.some((cat) => cat.slug === activeCategory)
        );

  return {
    activeCategory,
    setActiveCategory,
    isLoading,
    featuredArticles,
    filteredArticles,
    trendingNews,
    viralNews,
    recentNews,
    allNews,
    categories,
    hotTopics,
    loadingMore,
    hasMore,
    observerTarget,
  };
};
