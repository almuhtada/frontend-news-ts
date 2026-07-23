/**
 * src/types/index.ts
 * Centralized TypeScript types & interfaces untuk seluruh project.
 *
 * Semua tipe yang dipakai lebih dari satu file wajib didefinisikan di sini
 * agar tidak terjadi duplikasi (Author ada di posts.ts DAN authors.ts).
 */

// ─────────────────────────────────────────────
// CORE ENTITIES
// ─────────────────────────────────────────────

export interface Author {
  id: number;
  username: string;
  email: string;
  display_name: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  user_url?: string;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  post_count?: number | string;
  parent?: Category;
  children?: Category[];
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  summary?: string;
  content: string;
  featured_image?: string;
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
  // Engagement fields dari rekomendasi (opsional)
  engagement_score?: number;
  likes_count?: number;
  comments_count?: number;
}

export interface Comment {
  id: number;
  post_id: number;
  parent_id: number | null;
  author_name: string;
  author_email: string;
  author_url: string | null;
  author_ip: string | null;
  author_agent: string | null;
  content: string;
  comment_type: string;
  status: "approved" | "pending" | "spam" | "trash";
  karma: number;
  user_id: number | null;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
  user?: {
    id: number;
    username: string;
    display_name: string;
  };
  post?: {
    id: number;
    title: string;
    slug: string;
  };
}

// ─────────────────────────────────────────────
// RECOMMENDATION TYPES
// ─────────────────────────────────────────────

/** Response dari GET /api/recommendations/home */
export interface RecommendedPostsResponse {
  posts: Post[];
  /** true = personalized berdasarkan histori user, false = trending global */
  personalized: boolean;
}

/** Satu item Hot Topic dari GET /api/recommendations/hot-topics */
export interface HotTopic {
  id: number;
  name: string;
  slug: string;
  post_count: number;
}

/** Response dari GET /api/recommendations/bookmark/:postId */
export interface BookmarkStatus {
  bookmarked: boolean;
  bookmarkCount: number;
}

/** Response dari GET /api/recommendations/bookmarks */
export interface UserBookmarksResponse {
  bookmarks: Post[];
  total: number;
}

// ─────────────────────────────────────────────
// API RESPONSE WRAPPERS
// ─────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationMeta;
}

// ─────────────────────────────────────────────
// POSTS SERVICE TYPES
// ─────────────────────────────────────────────

export interface PostsParams {
  page?: number;
  limit?: number;
  status?: "draft" | "publish" | "archived";
  category?: string;
  tag?: string;
  search?: string;
  featured?: boolean;
}

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

// ─────────────────────────────────────────────
// INTERACTIONS TYPES
// ─────────────────────────────────────────────

export interface LikeResponse {
  success: boolean;
  message: string;
  data: {
    liked: boolean;
    likeCount: number;
  };
}

export interface GetLikesResponse {
  success: boolean;
  data: {
    likeCount: number;
    liked: boolean;
  };
}

export interface CreateCommentData {
  author_name: string;
  author_email: string;
  content: string;
  author_url?: string;
  author_ip?: string;
  author_agent?: string;
  parent_id?: number;
  user_id?: number;
}

export interface CreateCommentResponse {
  success: boolean;
  message: string;
  data: Comment;
}

export interface GetCommentsResponse {
  success: boolean;
  data: {
    comments: Comment[];
    total: number;
    limit: number;
    offset: number;
  };
}

// ─────────────────────────────────────────────
// AUTHOR SERVICE TYPES
// ─────────────────────────────────────────────

export interface AuthorPostsResponse {
  success: boolean;
  data: {
    author: Author;
    posts: Post[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalPosts: number;
      postsPerPage: number;
    };
  };
}

// ─────────────────────────────────────────────
// UI TYPES
// ─────────────────────────────────────────────

export type Theme = "light" | "dark";

export interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

