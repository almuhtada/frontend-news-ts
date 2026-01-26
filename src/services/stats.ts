import { api } from "./api";

// ==============================
// Types & Interfaces
// ==============================

export interface CategoryEngagement {
  category: string;
  views: number;
  likes: number;
  comments: number;
}

export interface CategoryDistribution {
  name: string;
  value: number;
}

interface CategoryEngagementResponse {
  success: boolean;
  data: CategoryEngagement[];
}

interface CategoryDistributionResponse {
  success: boolean;
  data: CategoryDistribution[];
}

// ==============================
// Stats Service
// ==============================

class StatsService {
  /**
   * Get category engagement statistics (views, likes, comments per category)
   */
  async getCategoryEngagement(): Promise<CategoryEngagement[]> {
    const response = await api.get<CategoryEngagementResponse>(
      "stats/category-engagement"
    );
    return response.data;
  }

  /**
   * Get category distribution (article count per category)
   */
  async getCategoryDistribution(): Promise<CategoryDistribution[]> {
    const response = await api.get<CategoryDistributionResponse>(
      "stats/category-distribution"
    );
    return response.data;
  }
}

export const statsService = new StatsService();
