export type Role = "administrator" | "editor" | "author" | "contributor" | "subscriber" | "user";

export interface User {
  id: number;
  wp_user_id?: number;
  username: string;
  email: string;
  display_name?: string;
  first_name?: string;
  last_name?: string;
  role: Role;
  user_url?: string;
  user_registered?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserFormData {
  username: string;
  email: string;
  password?: string;
  role: Role;
}
