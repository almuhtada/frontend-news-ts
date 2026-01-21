import { api } from './api';

export interface NotificationPost {
  id: number;
  title: string;
  slug: string;
  featured_image?: string;
  status: 'draft' | 'publish' | 'archived';
}

export interface Notification {
  id: number;
  user_name: string;
  action: 'add' | 'edit' | 'delete';
  target: string;
  status: 'pending' | 'approved' | 'rejected';
  description?: string;
  priority: 'low' | 'medium' | 'high';
  category: 'news' | 'publication' | 'profile' | 'system' | 'achievement';
  post_id?: number;
  created_at: string;
  updated_at: string;
  post?: NotificationPost;
}

export interface NotificationsParams {
  page?: number;
  limit?: number;
  status?: 'pending' | 'approved' | 'rejected';
  category?: 'news' | 'publication' | 'profile' | 'system' | 'achievement';
  search?: string;
  sort?: string;
  order?: 'ASC' | 'DESC';
}

export interface NotificationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  highPriority: number;
}

// Backend response interfaces
interface ApiNotificationsResponse {
  success: boolean;
  data: Notification[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface ApiNotificationResponse {
  success: boolean;
  data: Notification;
}

interface ApiNotificationStatsResponse {
  success: boolean;
  data: NotificationStats;
}

interface ApiDeleteResponse {
  success: boolean;
  message: string;
}

// Frontend interface for easier consumption
export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateNotificationData {
  user_name: string;
  action: 'add' | 'edit' | 'delete';
  target: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  category?: 'news' | 'publication' | 'profile' | 'system' | 'achievement';
  post_id?: number;
}

export interface UpdateNotificationStatusData {
  status: 'approved' | 'rejected';
  post_status?: 'publish' | 'archived';
}

export const notificationsService = {
  // Get all notifications with pagination and filters
  getNotifications: async (params?: NotificationsParams): Promise<NotificationsResponse> => {
    const response = await api.get<ApiNotificationsResponse>(
      '/notifications',
      params as Record<string, string | number>
    );
    return {
      notifications: response.data,
      total: response.pagination.total,
      page: response.pagination.page,
      limit: response.pagination.limit,
      totalPages: response.pagination.totalPages,
    };
  },

  // Get notification statistics
  getNotificationStats: async (): Promise<NotificationStats> => {
    const response = await api.get<ApiNotificationStatsResponse>('/notifications/stats');
    return response.data;
  },

  // Create new notification
  createNotification: async (data: CreateNotificationData): Promise<Notification> => {
    const response = await api.post<ApiNotificationResponse>('/notifications', data);
    return response.data;
  },

  // Update notification status (approve/reject)
  updateNotificationStatus: async (
    id: number,
    data: UpdateNotificationStatusData
  ): Promise<Notification> => {
    const response = await api.put<ApiNotificationResponse>(
      `/notifications/${id}/status`,
      data
    );
    return response.data;
  },

  // Delete notification
  deleteNotification: async (id: number): Promise<void> => {
    await api.delete<ApiDeleteResponse>(`/notifications/${id}`);
  },
};
