import { useState, useEffect, useCallback } from "react";
import { publicationsService } from "../../../services/publications";
import type { Publication, PublicationForm } from "./types";

const INITIAL_FORM: PublicationForm = {
  title: "",
  authors: "",
  year: new Date().getFullYear(),
  journal: "",
  link: "",
};

export const useJurnalPage = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [form, setForm] = useState<PublicationForm>(INITIAL_FORM);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch publications
  const fetchPublications = useCallback(async () => {
    try {
      setDataLoading(true);
      const response = await publicationsService.getAll();
      setPublications(response.data);
    } catch (error) {
      console.error("Error fetching publications:", error);
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPublications();
  }, [fetchPublications]);

  // Success toast effect
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const openAddModal = useCallback(() => {
    setEditMode(false);
    setForm(INITIAL_FORM);
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((publication: Publication) => {
    setEditMode(true);
    setCurrentId(publication.id);
    setForm({
      title: publication.title,
      authors: publication.authors,
      year: publication.year,
      journal: publication.journal || "",
      link: publication.link || "",
    });
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditMode(false);
    setCurrentId(null);
  }, []);

  const handleSave = async () => {
    if (!form.title.trim() || !form.authors.trim()) return;

    setIsLoading(true);

    try {
      if (editMode && currentId !== null) {
        const response = await publicationsService.update(currentId, {
          title: form.title.trim(),
          authors: form.authors.trim(),
          year: form.year,
          journal: form.journal.trim() || undefined,
          link: form.link.trim() || undefined,
        });
        setPublications((prev) =>
          prev.map((p) => (p.id === currentId ? response.data : p))
        );
      } else {
        const response = await publicationsService.create({
          title: form.title.trim(),
          authors: form.authors.trim(),
          year: form.year,
          journal: form.journal.trim() || undefined,
          link: form.link.trim() || undefined,
        });
        setPublications((prev) => [response.data, ...prev]);
      }

      closeModal();
      setShowSuccess(true);
    } catch (error) {
      console.error("Error saving publication:", error);
      alert("Gagal menyimpan publikasi. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Yakin ingin menghapus publikasi ini?")) {
      try {
        await publicationsService.delete(id);
        setPublications((prev) => prev.filter((p) => p.id !== id));
      } catch (error) {
        console.error("Error deleting publication:", error);
        alert("Gagal menghapus publikasi. Silakan coba lagi.");
      }
    }
  };

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedYear(null);
  }, []);

  // Filtered and sorted publications
  const filteredPublications = publications
    .filter((pub) => (selectedYear ? pub.year === selectedYear : true))
    .filter(
      (pub) =>
        pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pub.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pub.journal &&
          pub.journal.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => b.year - a.year);

  // Available years for filter
  const availableYears = Array.from(
    new Set(publications.map((pub) => pub.year))
  ).sort((a, b) => b - a);

  return {
    // State
    publications: filteredPublications,
    totalCount: publications.length,
    isModalOpen,
    editMode,
    form,
    isLoading,
    dataLoading,
    showSuccess,
    viewMode,
    searchQuery,
    selectedYear,
    availableYears,

    // Actions
    setForm,
    setViewMode,
    setSearchQuery,
    setSelectedYear,
    openAddModal,
    openEditModal,
    closeModal,
    resetFilters,
    handleSave,
    handleDelete,
  };
};
