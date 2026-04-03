/**
 * src/utils/formatDate.ts
 * Semua helper untuk format tanggal & waktu.
 * Sebelumnya formatTimeAgo() ada di dalam useNewsData hook — dipindah ke sini.
 */

/**
 * Format tanggal ke waktu relatif (Bahasa Indonesia & English campuran)
 * Contoh: "2 jam lalu", "3 hari lalu", "Just now"
 *
 * @param dateString - ISO date string dari backend
 * @returns string waktu relatif
 */
export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return "Baru saja";
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays === 1) return "1 hari lalu";
  if (diffDays < 30) return `${diffDays} hari lalu`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths} bulan lalu`;

  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears} tahun lalu`;
}

/**
 * Format tanggal ke format Indonesia panjang
 * Contoh: "3 April 2026"
 */
export function formatDateLong(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Format tanggal ke format pendek
 * Contoh: "03/04/2026"
 */
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID");
}

/**
 * Format tanggal dengan waktu lengkap
 * Contoh: "3 April 2026, 14:30"
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format tanggal ke ISO date string (YYYY-MM-DD)
 * Berguna untuk input type="date"
 */
export function toISODate(dateString: string): string {
  return new Date(dateString).toISOString().split("T")[0];
}
