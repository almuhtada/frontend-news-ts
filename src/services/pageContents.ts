import { api } from './api';

// ==============================================
// SHARED TYPES
// ==============================================

export interface PageHeader {
  title: string;
  description: string;
}

export interface PageContent<T = PageContentData> {
  id: number;
  page_key: string;
  title: string;
  content: T;
  status: 'publish' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export interface PageContentResponse<T = PageContentData> {
  success: boolean;
  data: PageContent<T>;
  message?: string;
}

export interface PageContentsResponse {
  success: boolean;
  data: PageContent[];
}

// ==============================================
// GRIYA QURAN
// ==============================================

export interface GriyaQuranProgram {
  title: string;
  description: string;
  schedule: string;
}

export interface GriyaQuranHalaqah {
  name: string;
  description: string;
}

export interface GriyaQuranContent {
  header: PageHeader & { address: string; phone: string };
  vpiMisi: { visi: string; misi: string[] };
  programs: GriyaQuranProgram[];
  halaqah: GriyaQuranHalaqah[];
}

// ==============================================
// PROGRAM PENGAJAR
// ==============================================

export interface PengurusItem {
  role: string;
  name: string;
}

export interface ProgramPengajarContent {
  header: PageHeader;
  programs: string[];
  masyayikh: string[];
  asatidz: string[];
  pengurus: PengurusItem[];
  mentors: string[];
  ctaText: string;
}

// ==============================================
// PENDAFTARAN
// ==============================================

export interface AccountItem {
  bank: string;
  number: string;
  name: string;
}

export interface WhatsappContact {
  name: string;
  number: string;
}

export interface PendaftaranContent {
  header: PageHeader;
  formLink: string;
  registrationFee: string;
  timelineStart: string;
  timelineEnd: string;
  requirements: string[];
  accounts: AccountItem[];
  whatsappContacts: WhatsappContact[];
  steps: string[];
}

// ==============================================
// UNION TYPE
// ==============================================

export type PageContentData =
  | GriyaQuranContent
  | ProgramPengajarContent
  | PendaftaranContent;

// ==============================================
// SERVICE
// ==============================================

export const pageContentsService = {
  getAll: () => api.get<PageContentsResponse>('/page-contents'),

  getByKey: <T = PageContentData>(key: string) =>
    api.get<PageContentResponse<T>>(`/page-contents/${key}`),

  upsert: <T = PageContentData>(data: {
    page_key: string;
    title: string;
    content: T;
    status?: 'publish' | 'draft';
  }) => api.post<PageContentResponse<T>>('/page-contents', data),

  delete: (key: string) =>
    api.delete<{ success: boolean; message: string }>(`/page-contents/${key}`),
};
