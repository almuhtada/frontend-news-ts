import { useState, useEffect, useCallback } from "react";
import { usersService } from "../../../services/users";
import type { User, UserFormData, Role } from "./types";

const initialFormData: UserFormData = {
  username: "",
  email: "",
  password: "",
  role: "user",
};

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  usersPerPage: number;
}

export const useUserPage = () => {
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState<UserFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Pagination state
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    usersPerPage: 10,
  });

  // Fetch users with pagination
  const fetchUsers = useCallback(async (page = 1, search = "", role: Role | "all" = "all") => {
    try {
      setDataLoading(true);
      const response = await usersService.getUsers({
        page,
        limit: pagination.usersPerPage,
        search: search || undefined,
        role: role !== "all" ? role : undefined,
      });
      if (response.success) {
        setUsers(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setDataLoading(false);
    }
  }, [pagination.usersPerPage]);

  // Initial fetch and refetch on filter changes
  useEffect(() => {
    fetchUsers(1, searchTerm, roleFilter);
  }, [searchTerm, roleFilter]);

  // Success toast effect
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  // Pagination handlers
  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchUsers(page, searchTerm, roleFilter);
    }
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(pagination.totalPages);
  const goToPrevPage = () => goToPage(pagination.currentPage - 1);
  const goToNextPage = () => goToPage(pagination.currentPage + 1);

  // Handlers
  const openAddModal = () => {
    setEditMode(false);
    setEditingUser(null);
    setForm(initialFormData);
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditMode(true);
    setEditingUser(user);
    setForm({
      username: user.username,
      email: user.email,
      password: "",
      role: user.role,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditMode(false);
    setEditingUser(null);
    setForm(initialFormData);
  };

  const handleSave = async () => {
    if (!form.username.trim() || !form.email.trim()) return;

    try {
      setIsLoading(true);

      if (editMode && editingUser) {
        const updateData: Partial<UserFormData> = {
          email: form.email,
          role: form.role,
        };
        // Only include password if provided
        if (form.password && form.password.trim()) {
          updateData.password = form.password;
        }
        await usersService.updateUser(editingUser.id, updateData);
        setSuccessMessage("User berhasil diperbarui");
      } else {
        await usersService.createUser(form);
        setSuccessMessage("User berhasil ditambahkan");
      }

      setShowSuccess(true);
      closeModal();
      fetchUsers(pagination.currentPage, searchTerm, roleFilter);
    } catch (error) {
      console.error("Error saving user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus user ini?")) return;

    try {
      await usersService.deleteUser(id);
      setSuccessMessage("User berhasil dihapus");
      setShowSuccess(true);
      fetchUsers(pagination.currentPage, searchTerm, roleFilter);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return {
    // State
    users,
    searchTerm,
    roleFilter,
    isModalOpen,
    editMode,
    form,
    isLoading,
    dataLoading,
    showSuccess,
    successMessage,
    pagination,

    // Actions
    setSearchTerm,
    setRoleFilter,
    setForm,
    openAddModal,
    openEditModal,
    closeModal,
    handleSave,
    handleDelete,

    // Pagination actions
    goToPage,
    goToFirstPage,
    goToLastPage,
    goToPrevPage,
    goToNextPage,
  };
};
