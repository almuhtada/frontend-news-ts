import { useState, useEffect, useRef, useCallback } from "react";
import { Star, Zap, Users, Search, TrendingUp } from "lucide-react";
import { postsService } from "../services/posts";
import { categoriesService } from "../services/categories";
import { recommendationsService } from "../services/recommendations";
import type { Post, Category } from "../services/posts";
import type { HotTopic } from "../types";

export const useHomeData = () => {
  const [activeCategory, setActiveCategory] = useState("semua");
  const [isLoading, setIsLoading] = useState(true);
  const [featuredArticles, setFeaturedArticles] = useState<Post[]>([]);
  const [articles, setArticles] = useState<Post[]>([]);
  const [trendingNews, setTrendingNews] = useState<Post[]>([]);
  const [viralNews, setViralNews] = useState<Post[]>([]);
  const [recentNews, setRecentNews] = useState<Post[]>([]);
  const [allNews, setAllNews] = useState<Post[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(false);

  // ── Rekomendasi personal / trending (baru) ──────────────────────
  const [recommendedNews, setRecommendedNews] = useState<Post[]>([]);

  const [categories, setCategories] = useState<
    Array<{
      id: string;
      label: string;
      icon: React.ComponentType<{ className?: string }>;
    }>
  >([{ id: "semua", label: "Semua", icon: Star }]);

  // Hot topics berbasis trending tags dari BE (bukan hanya post_count)
  const [hotTopics, setHotTopics] = useState<HotTopic[]>([]);

  // Infinite scroll states
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement | null>(null);

  // Efek untuk memuat artikel per kategori ketika kategori aktif berubah
  useEffect(() => {
    if (activeCategory === "semua") return;

    const fetchCategoryArticles = async () => {
      try {
        setCategoryLoading(true);
        const response = await postsService.getPosts({
          category: activeCategory,
          limit: 100,
          status: "publish",
        });
        setAllNews(response.posts);
      } catch (err) {
        console.error("Error fetching articles by category:", err);
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategoryArticles();
  }, [activeCategory]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch categories dari backend
        const categoriesData = await categoriesService.getCategories();

        const categoryIcons = [Star, Zap, Users, Search, TrendingUp];
        const formattedCategories = [
          { id: "semua", label: "Semua", icon: Star },
          ...categoriesData.map((cat: Category, index: number) => ({
            id: cat.slug,
            label: cat.name,
            icon: categoryIcons[index + 1] || Star,
          })),
        ];
        setCategories(formattedCategories);

        // ── Hot Topics dari BE (trending tags, bukan category post_count) ──
        // Fetch paralel untuk performa
        const [
          featured,
          popular,
          viral,
          recentPosts,
          allNewsPosts,
          allPosts,
          recommended,
          hotTopicsData,
        ] = await Promise.allSettled([
          postsService.getPosts({
            featured: true,
            limit: 5,
            status: "publish",
          }),
          postsService.getPopularPosts(4),
          postsService.getTrendingPosts(4, 168), // 168 jam = 7 hari (berita baru seminggu terakhir yang banyak dilihat)
          postsService.getRecentPosts(4),
          postsService.getPosts({
            limit: 100,
            status: "publish",
          }),
          postsService.getRecentPosts(12),
          postsService.getRecentPosts(8),
          recommendationsService.getHotTopics(8, 24),
        ]);

        // Set featured
        if (featured.status === "fulfilled") {
          setFeaturedArticles(featured.value.posts);
        }

        // Set trending (popular by views)
        if (popular.status === "fulfilled") {
          setTrendingNews(popular.value);
        }

        // Set viral (engagement score 24h)
        if (viral.status === "fulfilled") {
          setViralNews(viral.value);
        }

        // Set recent
        if (recentPosts.status === "fulfilled") {
          setRecentNews(recentPosts.value);
        }

        // Set all news
        if (allNewsPosts.status === "fulfilled") {
          // getRecentPosts mengembalikan Post[], tapi getPosts mengembalikan PostsResponse
          const postsData = Array.isArray(allNewsPosts.value) 
            ? allNewsPosts.value 
            : (allNewsPosts.value as any).posts || [];
          setAllNews(postsData);
        }

        // Set articles dengan infinite scroll
        if (allPosts.status === "fulfilled") {
          setArticles(allPosts.value);
          setHasMore(allPosts.value.length === 12);
        }

        // ── Recommended feed (personalized / fallback trending) ──────
        if (recommended.status === "fulfilled") {
          setRecommendedNews(recommended.value);
        }

        // ── Hot Topics dari trending tags ───────────────────────────
        if (
          hotTopicsData.status === "fulfilled" &&
          hotTopicsData.value.length > 0
        ) {
          setHotTopics(hotTopicsData.value);
        } else {
          // Fallback: gunakan kategori dengan post_count terbanyak
          type CategoryWithCount = Category & { post_count?: number | string };
          const fallbackTopics = (categoriesData as CategoryWithCount[])
            .filter((cat) => {
              const count =
                typeof cat.post_count === "string"
                  ? parseInt(cat.post_count)
                  : cat.post_count || 0;
              return count > 0;
            })
            .sort((a, b) => {
              const countA =
                typeof a.post_count === "string"
                  ? parseInt(a.post_count)
                  : a.post_count || 0;
              const countB =
                typeof b.post_count === "string"
                  ? parseInt(b.post_count)
                  : b.post_count || 0;
              return countB - countA;
            })
            .slice(0, 8)
            .map((cat) => ({
              id: cat.id,
              name: cat.name,
              slug: cat.slug,
              post_count:
                typeof cat.post_count === "string"
                  ? parseInt(cat.post_count)
                  : cat.post_count || 0,
            }));
          setHotTopics(fallbackTopics);
        }
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
      { threshold: 0.1 },
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
          article.categories?.some((cat) => cat.slug === activeCategory),
        );

  return {
    activeCategory,
    setActiveCategory,
    isLoading: isLoading || categoryLoading,
    featuredArticles,
    filteredArticles,
    trendingNews,
    viralNews,
    recentNews,
    allNews,
    // Rekomendasi personal / trending (baru)
    recommendedNews,
    categories,
    hotTopics,
    loadingMore,
    hasMore,
    observerTarget,
  };
};
