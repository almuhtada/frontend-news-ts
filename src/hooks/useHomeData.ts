import { useEffect, useState } from "react";
import { Star, Zap, Users, Search, TrendingUp } from "lucide-react";
import { postsService } from "../services/posts";
import { categoriesService } from "../services/categories";
import { recommendationsService } from "../services/recommendations";
import type { Post, Category, HomeFeed } from "../services/posts";
import type { HotTopic } from "../types";

const HOME_CACHE_KEY = "almuhtada_home_cache";
const HOME_CACHE_TTL = 5 * 60 * 1000;
const COOKIE_CONSENT_KEY = "almuhtada_cookie_consent";

const readCachedHome = () => {
  if (localStorage.getItem(COOKIE_CONSENT_KEY) !== "accepted") return null;

  try {
    const cached = JSON.parse(localStorage.getItem(HOME_CACHE_KEY) || "null");
    if (!cached || Date.now() - cached.timestamp > HOME_CACHE_TTL) return null;
    return cached.data;
  } catch {
    localStorage.removeItem(HOME_CACHE_KEY);
    return null;
  }
};

const cacheHome = (data: unknown) => {
  if (localStorage.getItem(COOKIE_CONSENT_KEY) !== "accepted") return;
  localStorage.setItem(
    HOME_CACHE_KEY,
    JSON.stringify({ timestamp: Date.now(), data }),
  );
};

const deduplicateSections = (sections: Post[][]): Post[][] => {
  const seen = new Set<string>();
  return sections.map((section) =>
    section.filter((post) => {
      const key = post.id ? String(post.id) : post.slug;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }),
  );
};

export const useHomeData = () => {
  const [activeCategory, setActiveCategory] = useState("semua");
  const [isLoading, setIsLoading] = useState(true);
  const [featuredArticles, setFeaturedArticles] = useState<Post[]>([]);
  const [trendingNews, setTrendingNews] = useState<Post[]>([]);
  const [viralNews, setViralNews] = useState<Post[]>([]);
  const [recentNews, setRecentNews] = useState<Post[]>([]);
  const [recommendedNews, setRecommendedNews] = useState<Post[]>([]);
  const [remainingNews, setRemainingNews] = useState<Post[]>([]);
  const [allPublishedPosts, setAllPublishedPosts] = useState<Post[]>([]);
  const [allNews, setAllNews] = useState<Post[]>([]);
  const [categories, setCategories] = useState<
    Array<{
      id: string;
      label: string;
      icon: React.ComponentType<{ className?: string }>;
    }>
  >([{ id: "semua", label: "Semua", icon: Star }]);
  const [hotTopics, setHotTopics] = useState<HotTopic[]>([]);

  useEffect(() => {
    const pool =
      allPublishedPosts.length > 0 ? allPublishedPosts : remainingNews;
    const visibleNews =
      activeCategory === "semua"
        ? pool
        : pool.filter((article) =>
            article.categories?.some(
              (category) => category.slug === activeCategory,
            ),
          );
    setAllNews(visibleNews);
  }, [activeCategory, remainingNews, allPublishedPosts]);

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      const cachedHome = readCachedHome();
      if (cachedHome) {
        applyHomeFeed(cachedHome);
        setIsLoading(false);
      }

      setIsLoading(!cachedHome);
      const [home, categoriesResult, hotTopicsResult, allPostsResult] =
        await Promise.allSettled([
          postsService.getHome(),
          categoriesService.getCategories(),
          recommendationsService.getHotTopics(8, 24),
          postsService.getPosts({ page: 1, limit: 40 }),
        ]);
      if (!active) return;

      if (home.status === "fulfilled") {
        cacheHome(home.value);
        applyHomeFeed(home.value);
      } else {
        console.error("Error fetching homepage feed:", home.reason);
      }

      if (allPostsResult.status === "fulfilled")
        setAllPublishedPosts(allPostsResult.value.posts);
      if (categoriesResult.status === "fulfilled") {
        const categoryIcons = [Star, Zap, Users, Search, TrendingUp];
        setCategories([
          { id: "semua", label: "Semua", icon: Star },
          ...categoriesResult.value.map(
            (category: Category, index: number) => ({
              id: category.slug,
              label: category.name,
              icon: categoryIcons[index + 1] || Star,
            }),
          ),
        ]);
      }
      if (hotTopicsResult.status === "fulfilled")
        setHotTopics(hotTopicsResult.value);
      setIsLoading(false);
    };

    const applyHomeFeed = (feed: HomeFeed) => {
      const heroMain = feed.hero.main ? [feed.hero.main] : [];
      const [
        featured,
        trending,
        viralUnique,
        recent,
        recommended,
        remainingUnique,
      ] = deduplicateSections([
        [...heroMain, ...(feed.hero.supporting || [])],
        feed.mostRead || [],
        feed.viral || [],
        feed.latest || [],
        feed.editorPicks || [],
        feed.remaining || [],
      ]);
      setFeaturedArticles(featured);
      setTrendingNews(trending);
      setViralNews(viralUnique);
      setRecentNews(recent);
      setRecommendedNews(recommended);
      setRemainingNews(remainingUnique);
    };

    loadData();
    const refreshAfterConsent = () => loadData();
    window.addEventListener("almuhtada-cookie-consent", refreshAfterConsent);
    return () => {
      active = false;
      window.removeEventListener(
        "almuhtada-cookie-consent",
        refreshAfterConsent,
      );
    };
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
