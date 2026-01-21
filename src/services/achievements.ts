import { api } from './api';

export interface Achievement {
  id: number;
  title: string;
  name: string;
  years: number;
  createdAt: string;
  updatedAt: string;
}

export interface AchievementResponse {
  success: boolean;
  data: Achievement[];
}

export interface SingleAchievementResponse {
  success: boolean;
  data: Achievement;
}

export interface CreateAchievementData {
  title: string;
  name: string;
  years: number;
}

export interface UpdateAchievementData {
  title?: string;
  name?: string;
  years?: number;
}

export const achievementsService = {
  async getAll(year?: number, search?: string): Promise<AchievementResponse> {
    const params: Record<string, string | number> = {};
    if (year) params.year = year;
    if (search) params.search = search;

    const response = await api.get<AchievementResponse>('/achievements', params);
    return response;
  },

  async getById(id: number): Promise<SingleAchievementResponse> {
    const response = await api.get<SingleAchievementResponse>(`/achievements/${id}`);
    return response;
  },

  async create(data: CreateAchievementData): Promise<SingleAchievementResponse> {
    const response = await api.post<SingleAchievementResponse>('/achievements', data);
    return response;
  },

  async update(id: number, data: UpdateAchievementData): Promise<SingleAchievementResponse> {
    const response = await api.put<SingleAchievementResponse>(`/achievements/${id}`, data);
    return response;
  },

  async delete(id: number): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(`/achievements/${id}`);
    return response;
  }
};
