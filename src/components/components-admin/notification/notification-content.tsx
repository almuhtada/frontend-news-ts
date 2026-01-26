import {
  Bell,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  FileText,
  Edit,
  Trash2,
  User,
  Settings,
  Star,
  Calendar,
  RefreshCw,
  Eye,
} from "lucide-react";
import type { Notification } from "./types";

/* ===== Helpers ===== */

const getActionIcon = (action: string) => {
  switch (action) {
    case "add":
      return Plus;
    case "edit":
      return Edit;
    case "delete":
      return Trash2;
    default:
      return FileText;
  }
};

const getCategoryStyle = (category: string) => {
  const styles = {
    news: {
      icon: FileText,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    publication: {
      icon: FileText,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    profile: {
      icon: User,
      color: "text-gray-600",
      bg: "bg-gray-100",
    },
    system: {
      icon: Settings,
      color: "text-gray-600",
      bg: "bg-gray-100",
    },
    achievement: {
      icon: Star,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  };
  return styles[category as keyof typeof styles] || styles.system;
};

const getPriorityBadge = (priority: string) => {
  const styles = {
    high: { bg: "bg-amber-100", text: "text-amber-700", label: "Tinggi" },
    medium: { bg: "bg-gray-100", text: "text-gray-700", label: "Sedang" },
    low: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Rendah" },
  };
  return styles[priority as keyof typeof styles] || styles.medium;
};

/* ===== Component ===== */

interface NotificationContentProps {
  notifications: Notification[];
  isLoading: boolean;
  onApprove: (id: number) => void;
  onReject: (id: number, postTitle?: string) => void;
  onViewPost: (postId: number) => void;
}

const NotificationContent: React.FC<NotificationContentProps> = ({
  notifications,
  isLoading,
  onApprove,
  onReject,
  onViewPost,
}) => {
  /* ===== Loading ===== */
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-14 text-center shadow-sm">
        <RefreshCw className="mx-auto mb-4 h-8 w-8 animate-spin text-emerald-600" />
        <p className="text-sm text-gray-600">Memuat notifikasi…</p>
      </div>
    );
  }

  /* ===== Empty ===== */
  if (!notifications.length) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-14 text-center shadow-sm">
        <Bell className="mx-auto mb-4 h-8 w-8 text-gray-400" />
        <p className="text-sm text-gray-600">Tidak ada notifikasi saat ini</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => {
        const ActionIcon = getActionIcon(notification.action);
        const categoryStyle = getCategoryStyle(notification.category);
        const CategoryIcon = categoryStyle.icon;
        const priorityBadge = getPriorityBadge(notification.priority);

        return (
          <div
            key={notification.id}
            className="
              group rounded-2xl border border-gray-100 bg-white p-5
              shadow-sm transition hover:shadow-md
            "
          >
            <div className="flex gap-4">
              {/* Avatar */}
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                {notification.user.charAt(0)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-gray-900">
                    {notification.user}
                  </h3>

                  <span
                    className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs ${categoryStyle.bg} ${categoryStyle.color}`}
                  >
                    <CategoryIcon className="h-3 w-3" />
                    {notification.category}
                  </span>

                  <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                    <ActionIcon className="h-3 w-3" />
                    {notification.action}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-700">
                  <span className="font-medium">{notification.target}</span>
                </p>

                {notification.description && (
                  <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                    {notification.description}
                  </p>
                )}

                {/* Footer */}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    {/* Status */}
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 font-medium ${
                        notification.status === "pending"
                          ? "bg-gray-100 text-gray-600"
                          : notification.status === "approved"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {notification.status === "pending" && (
                        <Clock className="h-3 w-3" />
                      )}
                      {notification.status === "approved" && (
                        <CheckCircle2 className="h-3 w-3" />
                      )}
                      {notification.status === "rejected" && (
                        <XCircle className="h-3 w-3" />
                      )}
                      {notification.status === "pending"
                        ? "Menunggu"
                        : notification.status === "approved"
                          ? "Disetujui"
                          : "Ditolak"}
                    </span>

                    {/* Priority */}
                    <span
                      className={`rounded-full px-2 py-1 font-medium ${priorityBadge.bg} ${priorityBadge.text}`}
                    >
                      {priorityBadge.label}
                    </span>

                    {/* Time */}
                    <span className="inline-flex items-center gap-1 text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {notification.timestamp}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                    {notification.post_id &&
                      notification.category === "news" && (
                        <button
                          onClick={() => onViewPost(notification.post_id!)}
                          className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                        >
                          <Eye className="h-3 w-3" />
                          Lihat
                        </button>
                      )}

                    {notification.status === "pending" && (
                      <>
                        <button
                          onClick={() => onApprove(notification.id)}
                          className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          Setujui
                        </button>
                        <button
                          onClick={() => onReject(notification.id, notification.target)}
                          className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                        >
                          <XCircle className="h-3 w-3" />
                          Tolak
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationContent;
