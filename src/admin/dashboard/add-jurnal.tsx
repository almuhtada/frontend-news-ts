import { Loader } from "lucide-react";
import Sidebar from "../../components/components-admin/sidebar";
import PublicationModal from "../../components/components-admin/modal-add-jurnal";
import {
  JurnalHeader,
  JurnalFilters,
  JurnalContent,
  JurnalToast,
  useJurnalPage,
} from "../../components/components-admin/jurnal";
import { NewsPagination } from "../../components/components-admin/news";

/**
 * Halaman Manajemen Publikasi Jurnal
 *
 * Struktur:
 * - JurnalHeader: Header dengan judul dan tombol tambah publikasi
 * - JurnalFilters: Filter pencarian, tahun, dan view mode
 * - JurnalContent: Tampilan publikasi (grid/list)
 * - JurnalToast: Notifikasi sukses
 * - PublicationModal: Modal untuk tambah/edit publikasi
 */
const AdminPublications: React.FC = () => {
  const {
    // State
    publications,
    totalCount,
    isModalOpen,
    editMode,
    form,
    isLoading,
    dataLoading,
    showSuccess,
    viewMode,
    searchQuery,
    selectedYear,
    availableYears,
    currentPage,
    totalPages,
    totalPosts,
    displayedCount,

    // Actions
    setCurrentPage,
    setForm,
    setViewMode,
    setSearchQuery,
    setSelectedYear,
    openAddModal,
    openEditModal,
    closeModal,
    resetFilters,
    handleSave,
    handleDelete,
  } = useJurnalPage();

  // Loading state
  if (dataLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="flex items-center justify-center h-full">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Sidebar />

      {/* Success Toast */}
      <JurnalToast show={showSuccess} editMode={editMode} />

      <main className="flex-1 p-8">
        {/* Header */}
        <JurnalHeader onAddClick={openAddModal} />

        {/* Filters */}
        <JurnalFilters
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
        <JurnalContent
          publications={publications}
          totalCount={totalCount}
          viewMode={viewMode}
          onEdit={openEditModal}
          onDelete={handleDelete}
          onAddFirst={openAddModal}
        />

        {/* Pagination */}
        <NewsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalPosts={totalPosts}
          displayedCount={displayedCount}
          onPageChange={setCurrentPage}
        />
      </main>

      {/* Modal */}
      <PublicationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        editMode={editMode}
        form={form}
        setForm={setForm}
        isLoading={isLoading}
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
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default AdminPublications;
