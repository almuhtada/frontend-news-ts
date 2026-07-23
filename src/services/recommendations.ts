/**
 * src/services/recommendations.ts
 * Service layer untuk sistem rekomendasi berita.
 *
 * Endpoint yang dipakai:
 *   GET  /api/recommendations/related/:postId     → Detail News page
 *   GET  /api/recommendations/home                → Home page
 *   GET  /api/recommendations/trending-category/:id → Sidebar detail
 *   GET  /api/recommendations/hot-topics          → Widget "Topik Hangat"
 *   POST /api/recommendations/track-view          → Track histori baca
 *   POST /api/recommendations/bookmark/:postId    → Toggle bookmark (auth)
 *   GET  /api/recommendations/bookmark/:postId    → Cek status (auth)
 *   GET  /api/recommendations/bookmarks           → Daftar bookmark (auth)
 */

import { api } from "./api";
import { API_ENDPOINTS } from "../config/api";
import type {
  Post,
  RecommendedPostsResponse,
  HotTopic,
  BookmarkStatus,
  UserBookmarksResponse,
} from "../types";

/* ─────────────────────────────────────────────────────────────────────────
   USER IDENTIFIER HELPER
   Buat identifier unik yang persisten di localStorage untuk anonymous user.
   Dipakai sebagai X-User-Identifier header di setiap request rekomendasi.
───────────────────────────────────────────────────────────────────────── */
function getUserIdentifier(): string {
  const STORAGE_KEY = "almuhtada_uid";
  let uid = localStorage.getItem(STORAGE_KEY);
  if (!uid) {
    uid = `anon_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem(STORAGE_KEY, uid);
  }
  return uid;
}

/** Header yang ditambahkan ke setiap request rekomendasi */
function recommendationHeaders(): Record<string, string> {
  return { "X-User-Identifier": getUserIdentifier() };
}

// ── Internal response shapes dari BE ───────────────────────────────────
interface ApiPostsArrayResponse {
  success: boolean;
  data: Post[];
}

interface ApiRecommendedResponse {
  success: boolean;
  data: RecommendedPostsResponse;
}

interface ApiHotTopicsResponse {
  success: boolean;
  data: HotTopic[];
}

interface ApiBookmarkStatusResponse {
  success: boolean;
  data: BookmarkStatus;
}

interface ApiUserBookmarksResponse {
  success: boolean;
  data: UserBookmarksResponse;
}

/* ═══════════════════════════════════════════════════════════════════════
   RECOMMENDATION SERVICE
═══════════════════════════════════════════════════════════════════════ */
export const recommendationsService = {
  /* ───────────────────────────────────────────────────────────────────
     GET RELATED POSTS — untuk DETAIL NEWS page
     Dipanggil dengan postId artikel yang sedang ditampilkan.
     Backend sudah menerapkan bobot: kategori 65% · tag 25% · author 10%.
  ─────────────────────────────────────────────────────────────────── */
  getRelatedPosts: async (postId: string, limit = 6): Promise<Post[]> => {
    const response = await api.get<ApiPostsArrayResponse>(
      API_ENDPOINTS.RELATED_POSTS(postId),
      { limit },
      { headers: recommendationHeaders() }
    );
    return response.data;
  },

  /* ───────────────────────────────────────────────────────────────────
     GET RECOMMENDED POSTS — untuk HOME page
     Return { posts, personalized } — FE bisa tampilkan label berbeda
     berdasarkan flag `personalized`.
  ─────────────────────────────────────────────────────────────────── */
  getRecommendedPosts: async (
    limit = 8
  ): Promise<RecommendedPostsResponse> => {
    const response = await api.get<ApiRecommendedResponse>(
      API_ENDPOINTS.RECOMMENDED_POSTS,
      { limit },
      { headers: recommendationHeaders() }
    );
    return response.data;
  },

  /* ───────────────────────────────────────────────────────────────────
     GET TRENDING BY CATEGORY — widget sidebar Detail page
     Tampilkan artikel terpopuler dalam kategori yang sama.
  ─────────────────────────────────────────────────────────────────── */
  getTrendingByCategory: async (
    categoryId: string,
    options: { limit?: number; hours?: number; excludePostId?: string } = {}
  ): Promise<Post[]> => {
    const { limit = 5, hours = 48, excludePostId } = options;
    const params: Record<string, string | number> = { limit, hours };
    if (excludePostId) params.excludePostId = excludePostId;

    const response = await api.get<ApiPostsArrayResponse>(
      API_ENDPOINTS.TRENDING_BY_CATEGORY(categoryId),
      params,
      { headers: recommendationHeaders() }
    );
    return response.data;
  },

  /* ───────────────────────────────────────────────────────────────────
     GET HOT TOPICS — widget "Topik Hangat" di Home & Explore
  ─────────────────────────────────────────────────────────────────── */
  getHotTopics: async (limit = 10, hours = 24): Promise<HotTopic[]> => {
    const response = await api.get<ApiHotTopicsResponse>(
      API_ENDPOINTS.HOT_TOPICS,
      { limit, hours }
    );
    return response.data;
  },

  /* ───────────────────────────────────────────────────────────────────
     TRACK VIEW — fire-and-forget
     Dipanggil saat user membuka artikel. Tidak blocking UI.
     Error diabaikan agar tidak mengganggu pengalaman baca.
  ─────────────────────────────────────────────────────────────────── */
  trackView: (postId: string): void => {
    api
      .post(
        API_ENDPOINTS.TRACK_VIEW,
        { postId },
        { headers: recommendationHeaders() }
      )
      .catch(() => {}); // silent fail
  },

  /* ───────────────────────────────────────────────────────────────────
     BOOKMARK — Toggle (wajib login)
  ─────────────────────────────────────────────────────────────────── */
  toggleBookmark: async (postId: string): Promise<BookmarkStatus> => {
    const response = await api.post<ApiBookmarkStatusResponse>(
      API_ENDPOINTS.TOGGLE_BOOKMARK(postId),
      {}
    );
    return response.data;
  },

  /* ───────────────────────────────────────────────────────────────────
     BOOKMARK STATUS — cek apakah sudah di-bookmark (wajib login)
  ─────────────────────────────────────────────────────────────────── */
  getBookmarkStatus: async (postId: string): Promise<BookmarkStatus> => {
    const response = await api.get<ApiBookmarkStatusResponse>(
      API_ENDPOINTS.BOOKMARK_STATUS(postId)
    );
    return response.data;
  },

  /* ───────────────────────────────────────────────────────────────────
     USER BOOKMARKS — daftar artikel yang disimpan (wajib login)
  ─────────────────────────────────────────────────────────────────── */
  getUserBookmarks: async (
    limit = 20,
    offset = 0
  ): Promise<UserBookmarksResponse> => {
    const response = await api.get<ApiUserBookmarksResponse>(
      API_ENDPOINTS.USER_BOOKMARKS,
      { limit, offset }
    );
    return response.data;
  },
};
