import type { NotificationStats } from "../../../services/notifications";
import type { Post } from "../../../services/posts";

export type { NotificationStats, Post };

export interface Notification {
  id: number;
  user: string;
  action: "add" | "edit" | "delete";
  target: string;
  status: "pending" | "approved" | "rejected";
  timestamp: string;
  description?: string;
  priority: "low" | "medium" | "high";
  category: "news" | "publication" | "profile" | "system" | "achievement";
  post_id?: number;
}
