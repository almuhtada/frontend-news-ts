import { api } from './api';

export interface AboutSection {
  id: number;
  section_key: string;
  title: string;
  content: string;
  image_url: string | null;
  order_number: number;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface AboutResponse {
  success: boolean;
  data: AboutSection[];
}

export interface SingleAboutResponse {
  success: boolean;
  data: AboutSection;
}

export interface UpsertAboutData {
  section_key: string;
  title?: string;
  content?: string;
  image_url?: string;
  order_number?: number;
  metadata?: Record<string, unknown> | null;
}

export const aboutService = {
  async getAll(): Promise<AboutResponse> {
    const response = await api.get<AboutResponse>('/about');
    return response;
  },

  async getByKey(key: string): Promise<SingleAboutResponse> {
    const response = await api.get<SingleAboutResponse>(`/about/${key}`);
    return response;
  },

  async upsert(data: UpsertAboutData): Promise<SingleAboutResponse> {
    const response = await api.post<SingleAboutResponse>('/about', data);
    return response;
  },

  async delete(id: number): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(`/about/${id}`);
    return response;
  }
};
