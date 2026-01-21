import { api } from './api';
import { API_ENDPOINTS } from '../config/api';
import type { Category } from './posts';

interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

interface CategoryResponse {
  success: boolean;
  data: Category;
}

export const categoriesService = {
  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get<CategoriesResponse>(API_ENDPOINTS.CATEGORIES);
    return response.data;
  },

  // Get category by slug
  getCategoryBySlug: async (slug: string): Promise<Category> => {
    const response = await api.get<CategoryResponse>(API_ENDPOINTS.CATEGORY_BY_SLUG(slug));
    return response.data;
  },
};

export type { Category };
