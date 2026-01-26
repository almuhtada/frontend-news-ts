import { useState, useEffect, useCallback } from "react";
import { postsService, type CreatePostData } from "../../../services/posts";
import { categoriesService } from "../../../services/categories";
import { tagsService } from "../../../services/tags";
import { API_BASE_URL } from "../../../config/api";
import type { Article, ArticleDisplay, NewsFormData } from "./types";

const INITIAL_FORM: NewsFormData = {
  title: "",
  category_id: "",
  content: "",
  excerpt: "",
  status: "publish",
  tag_ids: [],
};

export const useNewsPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<ReturnType<typeof categoriesService.getCategories> extends Promise<infer T> ? T : never>([]);
  const [tags, setTags] = useState<ReturnType<typeof tagsService.getTags> extends Promise<infer T> ? T : never>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastAction, setLastAction] = useState("");
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [form, setForm] = useState<NewsFormData>(INITIAL_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const limit = 12;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const params: {
        page: number;
        limit: number;
        status?: "draft" | "publish" | "archived";
      } = { page: currentPage, limit };

      if (selectedStatus) {
        params.status = selectedStatus as "draft" | "publish" | "archived";
      }

      const [postsResponse, categoriesData, tagsData] = await Promise.all([
        postsService.getPosts(params),
        categoriesService.getCategories(),
        tagsService.getTags(),
      ]);

      setArticles(postsResponse.posts.map((p) => ({ ...p, views: p.view_count })));
      setTotalPages(postsResponse.totalPages);
      setTotalPosts(postsResponse.total);
      setCategories(categoriesData);
      setTags(tagsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedStatus]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const resetForm = useCallback(() => {
    setForm(INITIAL_FORM);
    setImageFile(null);
    setPreviewUrl("");
    setIsEditing(false);
    setEditingId(null);
  }, []);

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Upload failed");

    const data = await response.json();
    return data.data.url;
  };

  const handleSave = async () => {
    if (!form.title || !form.content) {
      alert("Judul dan konten harus diisi");
      return;
    }

    try {
      setSaving(true);
      let featuredImage = previewUrl;

      if (imageFile) {
        featuredImage = await uploadImage(imageFile);
      }

      const postData: CreatePostData = {
        title: form.title,
        content: form.content,
        excerpt: form.excerpt,
        featured_image: featuredImage,
        status: form.status,
        category_ids: form.category_id ? [parseInt(form.category_id)] : [],
        tag_ids: form.tag_ids,
        author_id: 3,
      };

      if (isEditing && editingId !== null) {
        await postsService.updatePost(editingId, postData);
        setLastAction("diperbarui");
      } else {
        await postsService.createPost(postData);
        setLastAction("ditambahkan");
      }

      resetForm();
      setIsModalOpen(false);
      setShowSuccess(true);

      if (!isEditing) {
        setCurrentPage(1);
      }
      await fetchData();
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Gagal menyimpan artikel");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (article: ArticleDisplay) => {
    const categoryId = article.categoryId || article.categories?.[0]?.id?.toString() || "";
    const tagIds = article.tags?.map((t) => t.id) || [];

    setForm({
      title: article.title,
      category_id: categoryId,
      content: article.content,
      excerpt: article.excerpt || "",
      status: article.status as "draft" | "publish" | "archived",
      tag_ids: tagIds,
      rejection_reason: (article as any).rejection_reason,
    });
    setPreviewUrl(article.image || article.featured_image || "");
    setIsEditing(true);
    setEditingId(article.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Yakin ingin menghapus artikel ini?")) {
      try {
        await postsService.deletePost(id);
        setLastAction("dihapus");
        setShowSuccess(true);
        await fetchData();
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Gagal menghapus artikel");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("File harus berupa gambar");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran file maksimal 5MB");
        return;
      }
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewUrl("");
  };

  const handleCreateTag = async (name: string): Promise<{ id: number; name: string } | null> => {
    try {
      const newTag = await tagsService.createTag(name);
      setTags((prevTags) => [...prevTags, newTag]);
      return { id: newTag.id, name: newTag.name };
    } catch (error) {
      console.error("Error creating tag:", error);
      return null;
    }
  };

  const filteredArticles = articles
    .filter((article) => {
      if (selectedCategory) {
        return article.categories?.some((cat) => cat.name === selectedCategory);
      }
      return true;
    })
    .filter(
      (article) =>
        searchQuery === "" ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.author?.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const availableCategories = [
    ...new Set(articles.flatMap((a) => a.categories?.map((c) => c.name) || [])),
  ];

  const openModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedStatus("");
  };

  return {
    // State
    articles: filteredArticles,
    categories,
    tags,
    loading,
    isModalOpen,
    isEditing,
    form,
    previewUrl,
    saving,
    showSuccess,
    lastAction,
    viewMode,
    searchQuery,
    selectedCategory,
    selectedStatus,
    availableCategories,
    currentPage,
    totalPages,
    totalPosts,
    displayedCount: articles.length,

    // Actions
    setForm,
    setViewMode,
    setSearchQuery,
    setSelectedCategory,
    setSelectedStatus,
    setCurrentPage,
    openModal,
    closeModal,
    resetFilters,
    handleSave,
    handleEdit,
    handleDelete,
    handleFileChange,
    removeImage,
    handleCreateTag,
  };
};
