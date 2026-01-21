import type { Publication } from "../../../services/publications";

export type { Publication };

export interface PublicationForm {
  title: string;
  authors: string;
  year: number;
  journal: string;
  link: string;
}

export interface JurnalPageState {
  publications: Publication[];
  isModalOpen: boolean;
  editMode: boolean;
  currentId: number | null;
  showSuccess: boolean;
  isLoading: boolean;
  dataLoading: boolean;
  form: PublicationForm;
  selectedYear: number | null;
  searchQuery: string;
  viewMode: "grid" | "list";
}
