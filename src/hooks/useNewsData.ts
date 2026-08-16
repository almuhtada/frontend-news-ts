import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { postsService } from "../services/posts";
import type { Category, Post } from "../services/posts";

const ARTICLES_PER_PAGE = 6;

export const useNewsData = () => {
  const [searchParams] = useSearchParams();
  const [topStories, setTopStories] = useState<Post[]>([]);
  const [allArticles, setAllArticles] = useState<Post[]>([]);
  const [editorsPicks, setEditorsPicks] = useState<Post[]>([]);
  const [mostRead, setMostRead] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    setSelectedCategorySlug(categoryFromUrl?.toLowerCase() || null);
    setCurrentPage(1);
  }, [searchParams]);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const feed = await postsService.getHome();
        if (!active) return;

        const heroArticles = feed.hero.main
          ? [feed.hero.main, ...feed.hero.supporting]
          : feed.hero.supporting;
        const usedArticleIds = new Set([
          ...heroArticles,
          ...feed.editorPicks,
          ...feed.mostRead,
        ].map((article) => article.id));
        const allFeedArticles = [
          ...heroArticles,
          ...feed.latest,
          ...feed.editorPicks,
          ...feed.viral,
          ...feed.mostRead,
          ...feed.remaining,
        ];
        setTopStories(heroArticles);
        setEditorsPicks(feed.editorPicks);
        setMostRead(feed.mostRead);
        // Safety net for older/cached API responses: daftar bawah tidak boleh
        // mengulang artikel yang sudah terlihat di Hero atau sidebar.
        setAllArticles(feed.remaining.filter((article) => !usedArticleIds.has(article.id)));
        const uniqueCategories = Array.from(
          new Map(
            allFeedArticles
              .flatMap((post) => post.categories || [])
              .map((category) => [category.slug.toLowerCase(), category]),
          ).values(),
        );
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error fetching news feed:", err);
        if (active) setError("Gagal memuat data. Silakan coba lagi.");
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchData();
    return () => { active = false; };
  }, []);

  const selectedCategory = useMemo(
    () =>
      categories.find(
        (category) =>
          category.slug.toLowerCase() === selectedCategorySlug ||
          category.name.toLowerCase() === selectedCategorySlug,
      )?.name || null,
    [categories, selectedCategorySlug],
  );
  const categoryArticles = useMemo(
    () =>
      selectedCategorySlug
        ? allArticles.filter((article) =>
            article.categories?.some(
              (category) =>
                category.slug.toLowerCase() === selectedCategorySlug ||
                category.name.toLowerCase() === selectedCategorySlug,
            ),
          )
        : allArticles,
    [allArticles, selectedCategorySlug],
  );
  const totalArticles = categoryArticles.length;
  const totalPages = Math.max(1, Math.ceil(totalArticles / ARTICLES_PER_PAGE));
  const filteredArticles = categoryArticles.slice((currentPage - 1) * ARTICLES_PER_PAGE, currentPage * ARTICLES_PER_PAGE);

  const handleCategoryClick = (category: Category) => {
    const slug = category.slug.toLowerCase();
    setSelectedCategorySlug((currentSlug) =>
      currentSlug === slug ? null : slug,
    );
    setCurrentPage(1);
  };

  const clearCategoryFilter = () => setSelectedCategorySlug(null);

  const formatTimeAgo = (dateString: string) => {
    const diffInHours = Math.floor((Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60));
    if (diffInHours < 1) return "Baru saja";
    if (diffInHours < 24) return `${diffInHours} jam lalu`;
    const diffInDays = Math.floor(diffInHours / 24);
    return diffInDays === 1 ? "1 hari lalu" : `${diffInDays} hari lalu`;
  };

  return {
    topStories,
    articles: filteredArticles,
    editorsPicks,
    mostRead,
    loading,
    error,
    categories,
    selectedCategory,
    clearCategoryFilter,
    handleCategoryClick,
    formatTimeAgo,
    filteredArticles,
    currentPage,
    setCurrentPage,
    totalPages,
    totalArticles,
  };
};
