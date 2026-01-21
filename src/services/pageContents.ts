import { api } from './api';

// ============================================
// Griya Quran Types
// ============================================
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
  header: {
    title: string;
    description: string;
    address: string;
    phone: string;
  };
  vpiMisi: {
    visi: string;
    misi: string[];
  };
  programs: GriyaQuranProgram[];
  halaqah: GriyaQuranHalaqah[];
}

// ============================================
// Program Pengajar Types
// ============================================
export interface PengurusItem {
  role: string;
  name: string;
}

export interface ProgramPengajarContent {
  header: {
    title: string;
    description: string;
  };
  programs: string[];
  masyayikh: string[];
  asatidz: string[];
  pengurus: PengurusItem[];
  mentors: string[];
  ctaText: string;
}

// ============================================
// Pendaftaran Types
// ============================================
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
  header: {
    title: string;
    description: string;
  };
  formLink: string;
  registrationFee: string;
  timelineStart: string;
  timelineEnd: string;
  requirements: string[];
  accounts: AccountItem[];
  whatsappContacts: WhatsappContact[];
  steps: string[];
}

// ============================================
// Generic Types
// ============================================
export type PageContentData = GriyaQuranContent | ProgramPengajarContent | PendaftaranContent;

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

// ============================================
// Service
// ============================================
export const pageContentsService = {
  async getAll(): Promise<PageContentsResponse> {
    return api.get<PageContentsResponse>('/page-contents');
  },

  async getByKey<T = PageContentData>(key: string): Promise<PageContentResponse<T>> {
    return api.get<PageContentResponse<T>>(`/page-contents/${key}`);
  },

  async upsert<T = PageContentData>(data: {
    page_key: string;
    title: string;
    content: T;
    status?: 'publish' | 'draft';
  }): Promise<PageContentResponse<T>> {
    return api.post<PageContentResponse<T>>('/page-contents', data);
  },

  async delete(key: string): Promise<{ success: boolean; message: string }> {
    return api.delete<{ success: boolean; message: string }>(`/page-contents/${key}`);
  },
};

// ============================================
// Default Contents (for initial data)
// ============================================
export const defaultGriyaQuranContent: GriyaQuranContent = {
  header: {
    title: "Griya Qur'an Hidayatul Muhtadin",
    description: "Lembaga pembelajaran Al-Qur'an di bawah Yayasan Kanzul Al-Muhtad, berpusat di Semarang, dengan tujuan mencetak generasi Muslim penghafal Al-Qur'an yang berakhlakul karimah.",
    address: "Jl. Kutai No.8 Taman Baru Banyuwangi, Jawa Timur",
    phone: "0819-9772-0092",
  },
  vpiMisi: {
    visi: "Menjadi tempat pencetak Generasi Qurani yang gemar mengaji dan mengkaji Al-Quran serta berprestasi",
    misi: [
      "Mencetak generasi pecinta dan penghafal Al-Quran",
      "Menjadikan generasi Qurani berakhlaqul karimah",
      "Memberikan manfaat melalui kajian Islami untuk masyarakat",
      "Menanamkan nilai-nilai Islami dalam kehidupan",
    ],
  },
  programs: [
    { title: "Tahsin & Tartil", description: "Fokus pada tajwid, makharijul huruf, dan hukum bacaan.", schedule: "Rabu & Kamis (15.00 - 17.30)" },
    { title: "Tahfidz 30 Juz", description: "Program menghafal Al-Qur'an dengan metode At-Taisir.", schedule: "Senin, Selasa & Jum'at (15.00 - 17.30)" },
    { title: "Ibadah & Karakter", description: "Pembelajaran dasar ibadah, akhlak, dan pembentukan karakter.", schedule: "Selasa (17.30 - 19.30)" },
  ],
  halaqah: [
    { name: "Shufla", description: "Untuk usia TK" },
    { name: "Wustho", description: "Untuk usia SD" },
    { name: "'Ulya", description: "Untuk santri yang sudah lancar membaca" },
  ],
};

export const defaultProgramPengajarContent: ProgramPengajarContent = {
  header: {
    title: "Program & Pengajar",
    description: "Informasi mengenai program pesantren, dewan masyayikh, asatidz, hingga tim mentor yang berpengalaman dan berkualitas.",
  },
  programs: [
    "Kajian Agama: Tauhid, Tafsir, Hadits, Fiqh, dan Akhlaq",
    "Kajian Sosial dan Analisis Kritis Masalah Aktual",
    "Pelatihan Riset dan Menulis Karya Ilmiah",
    "Pelatihan Bahasa Inggris dan Bahasa Arab",
    "Pelatihan Presentasi dan Public Speaking",
    "Program Penelitian dan Pengabdian Masyarakat secara Berkala",
    "Bimbingan Beasiswa S2/S3 Dalam & Luar Negeri",
  ],
  masyayikh: [
    "Dr. H. Dani Muhtada, M.Ag., M.A., M.P.A.",
    "Dr. H. A. Hasan Asy'ari Ulama'i, M.Ag.",
    "Prof. Dr. Ahwan Fanani, M.Ag., M.S.",
    "Dr. H. M. Hakim Junaidi, M.Ag.",
    "Dr. H. Mohammad Nasih, M.Si.",
    "Dr. H. Sukendar, M.Ag., M.A.",
    "Dr. H. Aji Sofanudin, M.Si.",
  ],
  asatidz: [
    "Dr. Imam Baehaqie, M.Hum.",
    "Hikmiyatin Jalilah, S.Ag., M.Ag.",
    "Asma Luthfi, S.Th.I., M.Hum.",
    "Ayon Diniyanto, S.H., M.H.",
    "Dwi Wisnu Kurniawan, S.H.",
    "Rikha Zulia, S.Pd.",
    "Wihda Ikvina Anfaul Umat, S.Pd.",
    "In'am Zaidi, S.H., M.H.",
  ],
  pengurus: [
    { role: "Sekretaris Pesantren", name: "Dwi Wisnu Kurniawan, S.H., M.H." },
    { role: "Divisi IT dan Humas", name: "M. Akiyasul Azkiya, S.Kom." },
    { role: "Divisi Program", name: "Eka Diyanti" },
  ],
  mentors: [
    "Mohammad Rizal Ardiansyah, S.Si.",
    "Gema Aditya Mahendra, S.T.",
    "Mohammad Fattahul Alim, S.E.",
    "Mohammad Khollaqul Alim, S.E.",
    "Zahrotuz Zakiyah, S.Pd.",
    "Tia Rosalita, S.Pd.",
  ],
  ctaText: "Jadilah bagian dari komunitas pesantren yang berkembang dan belajar dari para pengajar terbaik.",
};

export const defaultPendaftaranContent: PendaftaranContent = {
  header: {
    title: "Pendaftaran Mahasantri Baru 2025",
    description: "Pesantren Riset Al-Muhtada — Jelaskan persyaratan, mekanisme pendaftaran, dan tata cara konfirmasi.",
  },
  formLink: "https://linktr.ee/OPRECSABA25",
  registrationFee: "Rp30.000,-",
  timelineStart: "15 April 2025",
  timelineEnd: "21 Juli 2025",
  requirements: [
    "Mahasiswa Universitas Negeri Semarang Angkatan 2025",
    "Laki-laki atau perempuan",
    "Beragama Islam",
    "Bisa membaca Al-Qur'an",
    "Tidak merokok",
    "Bersedia mematuhi tata tertib pesantren",
    "Bersedia mengikuti program Pesantren Riset Al-Muhtada",
  ],
  accounts: [
    { bank: "BRI", number: "386201028545536", name: "Nayla Syarifa" },
    { bank: "BSI", number: "7235009492", name: "Nayla Syarifa" },
    { bank: "BTN", number: "108901610110387", name: "Azizah Fiqriyatul Mujahidah" },
    { bank: "Dana", number: "081998925631", name: "Azizah Fiqriyatul Mujahidah" },
    { bank: "Gopay", number: "085819704766", name: "Azizah Fiqriyatul Mujahidah" },
    { bank: "ShopeePay", number: "081998925631", name: "Azizah Fiqriyatul Mujahidah" },
  ],
  whatsappContacts: [
    { name: "Abian", number: "083176608687" },
    { name: "Syarifa", number: "085935271192" },
  ],
  steps: [
    "Isi formulir online di link pendaftaran.",
    "Lakukan pembayaran biaya pendaftaran (Rp30.000) ke salah satu rekening di atas.",
    "Konfirmasi pembayaran via WhatsApp ke kontak di samping dengan format PRM_Nama_Prodi_Alamat.",
    "Seleksi: wawancara & tes baca Al-Qur'an.",
    "Pengumuman hasil seleksi akan diberitahukan via WhatsApp & laman resmi.",
  ],
};
