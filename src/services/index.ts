/**
 * src/services/index.ts
 * Barrel export untuk semua service — import dari satu titik.
 *
 * Contoh pemakaian:
 *   import { postsService, categoriesService, interactionService } from "../services";
 *   import type { Post, PostsParams } from "../services";
 */

export { api } from "./api";

export { postsService } from "./posts";
export { categoriesService } from "./categories";
export { authorsService } from "./authors";
export { interactionService } from "./interactions";
export { tagsService } from "./tags";
export { settingsService } from "./settings";
export { aboutService } from "./about";
export { achievementsService } from "./achievements";
export { publicationsService } from "./publications";
export { pageContentsService } from "./pageContents";
export { notificationsService } from "./notifications";
export { statsService } from "./stats";
export { usersService } from "./users";

// Re-export types dari centralized types
export type {
  Post,
  Author,
  Category,
  Tag,
  Comment,
  PostsParams,
  PostsResponse,
  CreatePostData,
  UpdatePostData,
  LikeResponse,
  GetLikesResponse,
  CreateCommentData,
  CreateCommentResponse,
  GetCommentsResponse,
  AuthorPostsResponse,
  ApiResponse,
  PaginationMeta,
  PaginatedResponse,
} from "../types";
