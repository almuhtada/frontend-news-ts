import { api } from './api';

export interface Tag {
  id: number;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiTagsResponse {
  success: boolean;
  data: Tag[];
}

interface ApiTagResponse {
  success: boolean;
  data: Tag;
}

export const tagsService = {
  // Get all tags
  getTags: async (): Promise<Tag[]> => {
    const response = await api.get<ApiTagsResponse>('/tags');
    return response.data;
  },

  // Create a new tag
  createTag: async (name: string): Promise<Tag> => {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const response = await api.post<ApiTagResponse>('/tags', { name, slug });
    return response.data;
  },
};
