import { useEffect, useState } from "react";
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
  const [trendingNews, setTrendingNews] = useState<Post[]>([]);
  const [viralNews, setViralNews] = useState<Post[]>([]);
  const [recentNews, setRecentNews] = useState<Post[]>([]);
  const [recommendedNews, setRecommendedNews] = useState<Post[]>([]);
  const [remainingNews, setRemainingNews] = useState<Post[]>([]);
  const [allNews, setAllNews] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; label: string; icon: React.ComponentType<{ className?: string }> }>>([{ id: "semua", label: "Semua", icon: Star }]);
  const [hotTopics, setHotTopics] = useState<HotTopic[]>([]);

  useEffect(() => {
    const visibleNews = activeCategory === "semua"
      ? remainingNews
      : remainingNews.filter((article) => article.categories?.some((category) => category.slug === activeCategory));
    setAllNews(visibleNews);
  }, [activeCategory, remainingNews]);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      setIsLoading(true);
      const [home, categoriesResult, hotTopicsResult] = await Promise.allSettled([
        postsService.getHome(),
        categoriesService.getCategories(),
        recommendationsService.getHotTopics(8, 24),
      ]);
      if (!active) return;

      if (home.status === "fulfilled") {
        const feed = home.value;
        setFeaturedArticles(feed.hero.main ? [feed.hero.main, ...feed.hero.supporting] : feed.hero.supporting);
        setRecentNews(feed.latest);
        setRecommendedNews(feed.editorPicks);
        setViralNews(feed.viral);
        setTrendingNews(feed.mostRead);
        setRemainingNews(feed.remaining);
      } else {
        console.error("Error fetching homepage feed:", home.reason);
      }

      if (categoriesResult.status === "fulfilled") {
        const categoryIcons = [Star, Zap, Users, Search, TrendingUp];
        const categoryData = categoriesResult.value;
        setCategories([
          { id: "semua", label: "Semua", icon: Star },
          ...categoryData.map((category: Category, index: number) => ({
            id: category.slug,
            label: category.name,
            icon: categoryIcons[index + 1] || Star,
          })),
        ]);
      }

      if (hotTopicsResult.status === "fulfilled") setHotTopics(hotTopicsResult.value);
      setIsLoading(false);
    };
    fetchData();
    return () => { active = false; };
  }, []);

  return {
    activeCategory,
    setActiveCategory,
    isLoading,
    featuredArticles,
    filteredArticles: allNews,
    trendingNews,
    viralNews,
    recentNews,
    allNews,
    recommendedNews,
    categories,
    hotTopics,
    loadingMore: false,
    hasMore: false,
    observerTarget: { current: null },
  };
};
