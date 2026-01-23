import { useState, useEffect, useCallback } from "react";
import { notificationsService } from "../../../services/notifications";
import type { Notification as NotificationAPI, NotificationStats } from "../../../services/notifications";
import type { Post } from "../../../services/posts";
import type { Notification } from "./types";

export const useNotificationPage = () => {
  // State
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    highPriority: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastAction, setLastAction] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewPost, setPreviewPost] = useState<Post | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  // Convert API notification to local format
  const convertNotification = (apiNotif: NotificationAPI): Notification => {
    const now = new Date();
    const createdAt = new Date(apiNotif.created_at);
    const diffMs = now.getTime() - createdAt.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    let timestamp = "";
    if (diffMins < 1) timestamp = "Baru saja";
    else if (diffMins < 60) timestamp = `${diffMins} menit yang lalu`;
    else if (diffHours < 24) timestamp = `${diffHours} jam yang lalu`;
    else timestamp = `${diffDays} hari yang lalu`;

    return {
      id: apiNotif.id,
      user: apiNotif.user_name,
      action: apiNotif.action,
      target: apiNotif.target,
      status: apiNotif.status,
      timestamp,
      description: apiNotif.description,
      priority: apiNotif.priority,
      category: apiNotif.category,
      post_id: apiNotif.post_id,
    };
  };

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const params: {
        page: number;
        limit: number;
        status?: "pending" | "approved" | "rejected";
        category?: "news" | "publication" | "profile" | "system" | "achievement";
        search?: string;
      } = {
        page: currentPage,
        limit: 20,
      };

      if (selectedStatus) {
        params.status = selectedStatus as "pending" | "approved" | "rejected";
      }
      if (selectedCategory) {
        params.category = selectedCategory as "news" | "publication" | "profile" | "system" | "achievement";
      }
      if (searchQuery) {
        params.search = searchQuery;
      }

      const [notificationsData, statsData] = await Promise.all([
        notificationsService.getNotifications(params),
        notificationsService.getNotificationStats(),
      ]);

      const convertedNotifications = notificationsData.notifications.map(convertNotification);
      setNotifications(convertedNotifications);
      setStats(statsData);
      setTotalPages(notificationsData.totalPages);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, selectedStatus, selectedCategory, searchQuery]);

  // Fetch notifications on mount and when filters change
  useEffect(() => {
    fetchNotifications();
  }, [currentPage, selectedStatus, selectedCategory]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        fetchNotifications();
      } else {
        setCurrentPage(1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Success toast effect
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  // Handlers
  const handleApprove = async (id: number) => {
    try {
      await notificationsService.updateNotificationStatus(id, {
        status: "approved",
        post_status: "publish",
      });
      setLastAction("disetujui");
      setShowSuccess(true);
      fetchNotifications();
    } catch (error) {
      console.error("Error approving notification:", error);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await notificationsService.updateNotificationStatus(id, {
        status: "rejected",
      });
      setLastAction("ditolak");
      setShowSuccess(true);
      fetchNotifications();
    } catch (error) {
      console.error("Error rejecting notification:", error);
    }
  };

  const handleRefresh = () => {
    fetchNotifications();
    setLastAction("Data diperbarui");
    setShowSuccess(true);
  };

  const handleMarkAllRead = () => {
    setLastAction("semua notifikasi ditandai sudah dibaca");
    setShowSuccess(true);
  };

  const handleViewPost = async (postId: number) => {
    try {
      setLoadingPreview(true);
      setShowPreviewModal(true);
      const response = await fetch(`http://localhost:3001/api/posts/id/${postId}`);
      const data = await response.json();
      if (data.success) {
        setPreviewPost(data.data);
      }
    } catch (error) {
      console.error("Error loading post:", error);
    } finally {
      setLoadingPreview(false);
    }
  };

  const closePreviewModal = () => {
    setShowPreviewModal(false);
    setPreviewPost(null);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedStatus("");
    setSelectedCategory("");
  };

  return {
    // State
    notifications,
    stats,
    searchQuery,
    selectedStatus,
    selectedCategory,
    showSuccess,
    lastAction,
    isLoading,
    currentPage,
    totalPages,
    showPreviewModal,
    previewPost,
    loadingPreview,

    // Actions
    setSearchQuery,
    setSelectedStatus,
    setSelectedCategory,
    setCurrentPage,
    handleApprove,
    handleReject,
    handleRefresh,
    handleMarkAllRead,
    handleViewPost,
    closePreviewModal,
    resetFilters,
  };
};
