import { api } from "./api";

// ==============================
// Types & Interfaces
// ==============================

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

// ==============================
// Interaction Service
// ==============================

class InteractionService {
  /**
   * Toggle like on a post (like/unlike)
   * @param postId - ID of the post
   * @param userIdentifier - User identifier (IP address or user ID)
   * @param userId - Optional user ID if logged in
   */
  async toggleLike(
    postId: number,
    userIdentifier: string,
    userId?: number
  ): Promise<LikeResponse> {
    return api.post<LikeResponse>(`posts/${postId}/like`, {
      user_identifier: userIdentifier,
      user_id: userId,
    });
  }

  /**
   * Get like count and status for a post
   * @param postId - ID of the post
   * @param userIdentifier - Optional user identifier to check if user has liked
   */
  async getLikes(
    postId: number,
    userIdentifier?: string
  ): Promise<GetLikesResponse> {
    const params: Record<string, string> = userIdentifier ? { user_identifier: userIdentifier } : {};
    return api.get<GetLikesResponse>(`posts/${postId}/likes`, params);
  }

  /**
   * Create a new comment on a post
   * @param postId - ID of the post
   * @param commentData - Comment data
   */
  async createComment(
    postId: number,
    commentData: CreateCommentData
  ): Promise<CreateCommentResponse> {
    return api.post<CreateCommentResponse>(
      `posts/${postId}/comments`,
      commentData
    );
  }

  /**
   * Get comments for a post
   * @param postId - ID of the post
   * @param status - Comment status filter (default: 'approved')
   * @param limit - Number of comments to fetch (default: 50)
   * @param offset - Offset for pagination (default: 0)
   */
  async getComments(
    postId: number,
    status: "approved" | "pending" | "spam" | "trash" = "approved",
    limit: number = 50,
    offset: number = 0
  ): Promise<GetCommentsResponse> {
    return api.get<GetCommentsResponse>(`posts/${postId}/comments`, {
      status,
      limit,
      offset,
    });
  }

  /**
   * Get all comments (for dashboard)
   * @param status - Comment status filter (default: 'approved')
   * @param limit - Number of comments to fetch (default: 50)
   * @param offset - Offset for pagination (default: 0)
   */
  async getAllComments(
    status: "approved" | "pending" | "spam" | "trash" = "approved",
    limit: number = 50,
    offset: number = 0
  ): Promise<GetCommentsResponse> {
    return api.get<GetCommentsResponse>(`comments`, {
      status,
      limit,
      offset,
    });
  }
}

export const interactionService = new InteractionService();
