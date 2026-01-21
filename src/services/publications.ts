import { api } from './api';

export interface Publication {
  id: number;
  title: string;
  authors: string;
  year: number;
  journal: string | null;
  link: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PublicationResponse {
  success: boolean;
  data: Publication[];
}

export interface SinglePublicationResponse {
  success: boolean;
  data: Publication;
}

export interface CreatePublicationData {
  title: string;
  authors: string;
  year: number;
  journal?: string;
  link?: string;
}

export interface UpdatePublicationData {
  title?: string;
  authors?: string;
  year?: number;
  journal?: string;
  link?: string;
}

export const publicationsService = {
  async getAll(year?: number, search?: string): Promise<PublicationResponse> {
    const params: Record<string, string | number> = {};
    if (year) params.year = year;
    if (search) params.search = search;

    const response = await api.get<PublicationResponse>('/publications', params);
    return response;
  },

  async getById(id: number): Promise<SinglePublicationResponse> {
    const response = await api.get<SinglePublicationResponse>(`/publications/${id}`);
    return response;
  },

  async create(data: CreatePublicationData): Promise<SinglePublicationResponse> {
    const response = await api.post<SinglePublicationResponse>('/publications', data);
    return response;
  },

  async update(id: number, data: UpdatePublicationData): Promise<SinglePublicationResponse> {
    const response = await api.put<SinglePublicationResponse>(`/publications/${id}`, data);
    return response;
  },

  async delete(id: number): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(`/publications/${id}`);
    return response;
  }
};
