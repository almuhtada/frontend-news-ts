import Sidebar from "../../components/components-admin/sidebar";
import {
  NotificationHeader,
  NotificationStats,
  NotificationFilters,
  NotificationContent,
  NotificationPreviewModal,
  useNotificationPage,
} from "../../components/components-admin/notification";

/**
 * Halaman Pusat Notifikasi
 *
 * Struktur:
 * - NotificationHeader: Header dengan judul, badge, dan tombol aksi
 * - NotificationStats: Kartu statistik (total, pending, approved, rejected, high priority)
 * - NotificationFilters: Filter pencarian, status, dan kategori
 * - NotificationContent: Daftar notifikasi dengan aksi approve/reject
 * - NotificationPreviewModal: Modal preview berita
 */
const AdminNotifications: React.FC = () => {
  const {
    // Statex
    notifications,
    stats,
    searchQuery,
    selectedStatus,
    selectedCategory,
    showSuccess,
    lastAction,
    isLoading,
    showPreviewModal,
    previewPost,
    loadingPreview,

    // Actions
    setSearchQuery,
    setSelectedStatus,
    setSelectedCategory,
    handleApprove,
    handleReject,
    handleRefresh,
    handleMarkAllRead,
    handleViewPost,
    closePreviewModal,
    resetFilters,
  } = useNotificationPage();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Sidebar />

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-6 right-6 z-50 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-in-right">
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="font-semibold">Berhasil!</p>
            <p className="text-sm opacity-90">Notifikasi {lastAction}</p>
          </div>
        </div>
      )}

      <main className="flex-1 p-8">
        {/* Header */}
        <NotificationHeader
          stats={stats}
          onMarkAllRead={handleMarkAllRead}
          onRefresh={handleRefresh}
        />

        {/* Stats */}
        <NotificationStats stats={stats} />

        {/* Filters */}
        <NotificationFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onReset={resetFilters}
        />

        {/* Content */}
        <NotificationContent
          notifications={notifications}
          isLoading={isLoading}
          onApprove={handleApprove}
          onReject={handleReject}
          onViewPost={handleViewPost}
        />
      </main>

      {/* Preview Modal */}
      <NotificationPreviewModal
        isOpen={showPreviewModal}
        post={previewPost}
        loading={loadingPreview}
        onClose={closePreviewModal}
      />

      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AdminNotifications;
