import { useState, useEffect, useCallback } from "react";
import { achievementsService } from "../../../services/achievements";
import type { Achievement, ValidationError } from "./types";

export const usePrestasiPage = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [errors, setErrors] = useState<ValidationError>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [dataLoading, setDataLoading] = useState(true);

  // Fetch achievements
  const fetchAchievements = useCallback(async () => {
    try {
      setDataLoading(true);
      const response = await achievementsService.getAll();
      setAchievements(response.data);
    } catch (error) {
      console.error("Error fetching achievements:", error);
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  // Success toast effect
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  // Validate form
  const validateForm = useCallback((): boolean => {
    const newErrors: ValidationError = {};

    if (year < 1900 || year > new Date().getFullYear() + 10) {
      newErrors.year =
        "Tahun harus antara 1900 dan " + (new Date().getFullYear() + 10);
    }

    if (!text.trim()) {
      newErrors.text = "Judul prestasi tidak boleh kosong";
    } else if (text.trim().length < 5) {
      newErrors.text = "Judul minimal 5 karakter";
    }

    if (!editMode) {
      const existingAchievement = achievements.find(
        (a) =>
          a.years === year &&
          a.title.toLowerCase().trim() === text.toLowerCase().trim()
      );
      if (existingAchievement) {
        newErrors.text = "Prestasi ini sudah ada pada tahun yang sama";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [year, text, editMode, achievements]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => {
      setText("");
      setName("");
      setEditMode(false);
      setEditId(null);
      setYear(new Date().getFullYear());
      setErrors({});
      setShowPreview(false);
    }, 200);
  }, []);

  const openAddModal = useCallback(() => {
    setEditMode(false);
    setText("");
    setName("");
    setYear(new Date().getFullYear());
    setErrors({});
    setIsModalOpen(true);
  }, []);

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (editMode && editId !== null) {
        const response = await achievementsService.update(editId, {
          title: text.trim(),
          name,
          years: year,
        });
        setAchievements((prev) =>
          prev.map((a) => (a.id === editId ? response.data : a))
        );
      } else {
        const response = await achievementsService.create({
          title: text.trim(),
          name,
          years: year,
        });
        setAchievements((prev) => [response.data, ...prev]);
      }

      setShowSuccess(true);
      setTimeout(() => {
        closeModal();
      }, 1200);
    } catch (error) {
      console.error("Error saving achievement:", error);
      alert("Gagal menyimpan prestasi. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Yakin ingin menghapus prestasi ini?")) {
      try {
        await achievementsService.delete(id);
        setAchievements((prev) => prev.filter((a) => a.id !== id));
      } catch (error) {
        console.error("Error deleting achievement:", error);
        alert("Gagal menghapus prestasi. Silakan coba lagi.");
      }
    }
  };

  const handleEdit = useCallback((achievement: Achievement) => {
    setEditMode(true);
    setEditId(achievement.id);
    setText(achievement.title);
    setName(achievement.name);
    setYear(achievement.years);
    setIsModalOpen(true);
  }, []);

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedYear(null);
  }, []);

  // Filtered achievements
  const filteredAchievements = achievements
    .filter((a) => (selectedYear ? a.years === selectedYear : true))
    .filter(
      (a) =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => b.years - a.years);

  // Available years for filter
  const availableYears = [...new Set(achievements.map((a) => a.years))].sort(
    (a, b) => b - a
  );

  return {
    // State
    achievements: filteredAchievements,
    totalCount: achievements.length,
    isModalOpen,
    editMode,
    year,
    text,
    name,
    errors,
    isLoading,
    dataLoading,
    showSuccess,
    showPreview,
    viewMode,
    searchQuery,
    selectedYear,
    availableYears,

    // Actions
    setYear,
    setText,
    setName,
    setViewMode,
    setSearchQuery,
    setSelectedYear,
    setShowPreview,
    openAddModal,
    closeModal,
    resetFilters,
    handleSave,
    handleEdit,
    handleDelete,
  };
};
