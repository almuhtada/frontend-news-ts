import { api } from './api';
import type { Post } from './posts';

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

export const authorsService = {
  async getAuthorPosts(username: string, page = 1, limit = 10): Promise<AuthorPostsResponse> {
    const response = await api.get<AuthorPostsResponse>(`/authors/${username}?page=${page}&limit=${limit}`);
    return response;
  }
};
