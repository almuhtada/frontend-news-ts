import { api } from "./api";
import { API_ENDPOINTS } from "../config/api";

export interface Author {
  id: number;
  username: string;
  display_name: string;
  email: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Post {
  id: number;
  uuid: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  image_caption?: string;
  author_id: number;
  editor_id?: number;
  status: "draft" | "publish" | "archived";
  is_featured: boolean;
  views?: number;
  view_count?: number;
  comment_status: "open" | "closed";
  meta_title?: string;
  meta_description?: string;
  published_at?: string;
  rejection_reason?: string;
  createdAt: string;
  updatedAt: string;
  author?: Author;
  editor?: Author;
  categories?: Category[];
  tags?: Tag[];
}

export interface HomeFeed {
  hero: { main: Post | null; supporting: Post[] };
  latest: Post[];
  editorPicks: Post[];
  viral: Post[];
  mostRead: Post[];
  remaining: Post[];
}

export interface PostsParams {
  page?: number;
  limit?: number;
  status?: "draft" | "publish" | "archived";
  category?: string;
  tag?: string;
  search?: string;
  featured?: boolean;
  exclude?: string;
}

// Backend response interfaces
interface ApiPostsResponse {
  success: boolean;
  data: Post[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface ApiPostResponse {
  success: boolean;
  data: Post;
}

interface ApiPostsArrayResponse {
  success: boolean;
  data: Post[];
}

interface ApiHomeResponse {
  success: boolean;
  data: HomeFeed;
}

// Frontend interface for easier consumption
export interface PostsResponse {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreatePostData {
  title: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  status?: "draft" | "publish" | "archived";
  category_ids?: number[];
  tag_ids?: number[];
  author_id?: number;
  editor_id?: number;
}

export interface UpdatePostData extends Partial<CreatePostData> {
  slug?: string;
}

export const postsService = {
  getHome: async (): Promise<HomeFeed> => {
    const response = await api.get<ApiHomeResponse>(API_ENDPOINTS.HOME);
    return response.data;
  },
  // Get all posts with pagination and filters
  getPosts: async (params?: PostsParams): Promise<PostsResponse> => {
    const response = await api.get<ApiPostsResponse>(
      API_ENDPOINTS.POSTS,
      params as Record<string, string | number | boolean>,
    );
    return {
      posts: response.data,
      total: response.pagination.total,
      page: response.pagination.page,
      limit: response.pagination.limit,
      totalPages: response.pagination.totalPages,
    };
  },

  // Get single post by slug
  getPostBySlug: async (slug: string): Promise<Post> => {
    const response = await api.get<ApiPostResponse>(
      API_ENDPOINTS.POST_BY_SLUG(slug),
    );
    return response.data;
  },

  // Get popular posts (based on total views)
  getPopularPosts: async (limit = 5): Promise<Post[]> => {
    const response = await api.get<ApiPostsArrayResponse>(
      API_ENDPOINTS.POPULAR_POSTS,
      { limit },
    );
    return response.data;
  },

  // Get trending/viral posts (based on engagement in last X hours)
  getTrendingPosts: async (limit = 5, hours = 24): Promise<Post[]> => {
    const response = await api.get<ApiPostsArrayResponse>(
      API_ENDPOINTS.TRENDING_POSTS,
      { limit, hours },
    );
    return response.data;
  },

  // Get recent posts
  getRecentPosts: async (limit = 5): Promise<Post[]> => {
    const response = await api.get<ApiPostsArrayResponse>(
      API_ENDPOINTS.RECENT_POSTS,
      { limit },
    );
    return response.data;
  },

  // Create new post
  createPost: async (data: CreatePostData): Promise<Post> => {
    const response = await api.post<ApiPostResponse>(API_ENDPOINTS.POSTS, data);
    return response.data;
  },

  // Update post
  updatePost: async (uuid: string, data: UpdatePostData): Promise<Post> => {
    const response = await api.put<ApiPostResponse>(
      `${API_ENDPOINTS.POSTS}/${uuid}`,
      data,
    );
    return response.data;
  },

  // Delete post
  deletePost: async (uuid: string): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.POSTS}/${uuid}`);
  },
};
