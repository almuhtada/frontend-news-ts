import type { Post } from "../../../services/posts";
import type { Category } from "../../../services/categories";
import type { Tag } from "../../../services/tags";

export type Article = Post & {
  views?: number;
};

export interface ArticleDisplay extends Omit<Article, "author"> {
  category: string;
  image: string;
  author: string;
  categoryId?: string;
}

export interface NewsFormData {
  title: string;
  category_id: string;
  content: string;
  excerpt: string;
  status: "draft" | "publish" | "archived";
  tag_ids: number[];
}

export interface NewsPageState {
  articles: Article[];
  categories: Category[];
  tags: Tag[];
  loading: boolean;
  isModalOpen: boolean;
  isEditing: boolean;
  editingId: number | null;
  searchQuery: string;
  selectedCategory: string;
  selectedStatus: string;
  viewMode: "grid" | "list";
  showSuccess: boolean;
  lastAction: string;
  saving: boolean;
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  form: NewsFormData;
  imageFile: File | null;
  previewUrl: string;
}
