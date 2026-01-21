import { api } from './api';

export type Role = "administrator" | "editor" | "author" | "contributor" | "subscriber" | "user";

export interface User {
  id: number;
  wp_user_id?: number;
  username: string;
  email: string;
  display_name?: string;
  first_name?: string;
  last_name?: string;
  role: Role;
  user_url?: string;
  user_registered?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserFormData {
  username: string;
  email: string;
  password?: string;
  role: Role;
}

export interface UsersResponse {
  success: boolean;
  data: User[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    usersPerPage: number;
  };
}

export interface UserResponse {
  success: boolean;
  data: User;
}

export const usersService = {
  async getUsers(params?: {
    page?: number;
    limit?: number;
    role?: Role;
    search?: string;
  }): Promise<UsersResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.role) queryParams.append('role', params.role);
    if (params?.search) queryParams.append('search', params.search);

    const query = queryParams.toString();
    const response = await api.get<UsersResponse>(`/users${query ? `?${query}` : ''}`);
    return response;
  },

  async getUser(id: number): Promise<UserResponse> {
    const response = await api.get<UserResponse>(`/users/${id}`);
    return response;
  },

  async createUser(data: UserFormData): Promise<UserResponse> {
    const response = await api.post<UserResponse>('/users', data);
    return response;
  },

  async updateUser(id: number, data: Partial<UserFormData>): Promise<UserResponse> {
    const response = await api.put<UserResponse>(`/users/${id}`, data);
    return response;
  },

  async deleteUser(id: number): Promise<{ success: boolean }> {
    const response = await api.delete<{ success: boolean }>(`/users/${id}`);
    return response;
  },
};
