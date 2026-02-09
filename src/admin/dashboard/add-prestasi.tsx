import { Loader } from "lucide-react";
import Sidebar from "../../components/components-admin/sidebar";
import AchievementModal from "../../components/components-admin/modal-add-prestasi";
import {
  PrestasiHeader,
  PrestasiFilters,
  PrestasiContent,
  PrestasiToast,
  usePrestasiPage,
} from "../../components/components-admin/prestasi";
import { NewsPagination } from "../../components/components-admin/news";

/**
 * Halaman Manajemen Prestasi Mahasantri
 *
 * Struktur:
 * - PrestasiHeader: Header dengan judul dan tombol tambah prestasi
 * - PrestasiFilters: Filter pencarian, tahun, dan view mode
 * - PrestasiContent: Tampilan prestasi (grid/list)
 * - PrestasiToast: Notifikasi sukses
 * - AchievementModal: Modal untuk tambah/edit prestasi
 */
const AdminAchievements: React.FC = () => {
  const {
    // State
    achievements,
    totalCount,
    isModalOpen,
    editMode,
    year,
    text,
    name,
    errors,
    isLoading,
    dataLoading,
    showSuccess,
    showPreview,
    viewMode,
    searchQuery,
    selectedYear,
    availableYears,
    currentPage,
    totalPages,
    displayedCount,

    // Actions
    setYear,
    setText,
    setName,
    setViewMode,
    setSearchQuery,
    setSelectedYear,
    setShowPreview,
    setCurrentPage,
    openAddModal,
    closeModal,
    resetFilters,
    handleSave,
    handleEdit,
    handleDelete,
  } = usePrestasiPage();

  // Loading state
  if (dataLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="flex items-center justify-center h-full">
            <Loader className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900">
      <Sidebar />

      {/* Success Toast */}
      <PrestasiToast show={showSuccess} editMode={editMode} />

      <main className="flex-1 p-8">
        {/* Header */}
        <PrestasiHeader onAddClick={openAddModal} />

        {/* Filters */}
        <PrestasiFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          availableYears={availableYears}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onReset={resetFilters}
        />

        {/* Content */}
        <PrestasiContent
          achievements={achievements}
          totalCount={totalCount}
          viewMode={viewMode}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddFirst={openAddModal}
        />

        {/* Pagination */}
        <NewsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalPosts={totalCount}
          displayedCount={displayedCount}
          onPageChange={setCurrentPage}
        />
      </main>

      {/* Modal */}
      <AchievementModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        isLoading={isLoading}
        editMode={editMode}
        year={year}
        setYear={setYear}
        text={text}
        setText={setText}
        name={name}
        setName={setName}
        errors={errors}
        showPreview={showPreview}
        setShowPreview={setShowPreview}
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

export default AdminAchievements;
