// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',

  // Posts
  POSTS: '/posts',
  POST_BY_SLUG: (slug: string) => `/posts/${slug}`,
  POPULAR_POSTS: '/posts/popular',
  TRENDING_POSTS: '/posts/trending',
  RECENT_POSTS: '/posts/recent',

  // Categories
  CATEGORIES: '/categories',
  CATEGORY_BY_SLUG: (slug: string) => `/categories/${slug}`,

  // Tags
  TAGS: '/tags',

  // Comments
  COMMENTS: '/comments',
  POST_COMMENTS: (postId: number) => `/posts/${postId}/comments`,

  // Media
  MEDIA: '/media',

  // Settings
  SETTINGS: '/settings',
  SETTINGS_SAVE: '/settings/save',
};
