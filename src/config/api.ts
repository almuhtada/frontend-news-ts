// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://api.almuhtada.org/api";

// Base server URL (tanpa /api suffix) untuk akses static files seperti uploads
export const SERVER_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

// Convert relative image path ke full URL agar bisa ditampilkan di frontend
export const getImageUrl = (path: string | undefined | null): string => {
  if (!path) return "";
  if (
    path.startsWith("http") ||
    path.startsWith("blob:") ||
    path.startsWith("data:")
  )
    return path;
  return `${SERVER_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",

  // Posts
  POSTS: "/posts",
  POST_BY_SLUG: (slug: string) => `/posts/${slug}`,
  POPULAR_POSTS: "/posts/popular",
  TRENDING_POSTS: "/posts/trending",
  RECENT_POSTS: "/posts/recent",

  // Categories
  CATEGORIES: "/categories",
  CATEGORY_BY_SLUG: (slug: string) => `/categories/${slug}`,

  // Tags
  TAGS: "/tags",

  // Comments
  COMMENTS: "/comments",
  POST_COMMENTS: (postId: string) => `/posts/${postId}/comments`,

  // Media
  MEDIA: "/media",

  // Settings
  SETTINGS: "/settings",
  SETTINGS_SAVE: "/settings/save",

  // ── Recommendation System ────────────────────────────────────────
  /** Related posts untuk Detail News page — berbasis kategori/tag/author */
  RELATED_POSTS: (postId: string) => `/recommendations/related/${postId}`,

  /** Personalized / trending feed untuk Home page */
  RECOMMENDED_POSTS: "/recommendations/home",

  /** Trending dalam satu kategori — widget sidebar Detail page */
  TRENDING_BY_CATEGORY: (categoryId: string) =>
    `/recommendations/trending-category/${categoryId}`,

  /** Hot tags dari artikel trending — widget "Topik Hangat" */
  HOT_TOPICS: "/recommendations/hot-topics",

  /** Track view — dipanggil saat user buka artikel */
  TRACK_VIEW: "/recommendations/track-view",

  /** Bookmark: toggle, cek status, daftar */
  TOGGLE_BOOKMARK: (postId: string) => `/recommendations/bookmark/${postId}`,
  BOOKMARK_STATUS: (postId: string) => `/recommendations/bookmark/${postId}`,
  USER_BOOKMARKS: "/recommendations/bookmarks",
};

