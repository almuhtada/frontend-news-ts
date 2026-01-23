import type { Achievement } from "../../../services/achievements";

export type { Achievement };

export interface ValidationError {
  year?: string;
  text?: string;
}

export interface PrestasiFormState {
  year: number;
  text: string;
  name: string;
}
