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
  POST_COMMENTS: (postId: number) => `/posts/${postId}/comments`,

  // Media
  MEDIA: "/media",

  // Settings
  SETTINGS: "/settings",
  SETTINGS_SAVE: "/settings/save",
};
