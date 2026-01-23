import { Loader } from "lucide-react";
import Sidebar from "../../components/components-admin/sidebar";
import NewsModal from "../../components/components-admin/modal-add-news";
import NewsFilters from "../../components/components-admin/filter-news";
import SuccessToast from "../../components/components-admin/success-toast";
import {
  NewsHeader,
  NewsContent,
  NewsPagination,
  useNewsPage,
} from "../../components/components-admin/news";

/**
 * Halaman Manajemen Berita
 *
 * Struktur:
 * - NewsHeader: Header dengan judul dan tombol tambah artikel
 * - NewsFilters: Filter pencarian, kategori, status, dan view mode
 * - NewsContent: Tampilan artikel (grid/list)
 * - NewsPagination: Navigasi halaman
 * - NewsModal: Modal untuk tambah/edit artikel
 */
const AddNewsPage = () => {
  const {
    // State
    articles,
    categories,
    tags,
    loading,
    isModalOpen,
    isEditing,
    form,
    previewUrl,
    saving,
    showSuccess,
    lastAction,
    viewMode,
    searchQuery,
    selectedCategory,
    selectedStatus,
    availableCategories,
    currentPage,
    totalPages,
    totalPosts,
    displayedCount,

    // Actions
    setForm,
    setViewMode,
    setSearchQuery,
    setSelectedCategory,
    setSelectedStatus,
    setCurrentPage,
    openModal,
    closeModal,
    resetFilters,
    handleSave,
    handleEdit,
    handleDelete,
    handleFileChange,
    removeImage,
    handleCreateTag,
  } = useNewsPage();

  // Loading state
  if (loading) {
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
      {showSuccess && <SuccessToast message={`Artikel ${lastAction}`} />}

      <main className="flex-1 p-8">
        {/* Header */}
        <NewsHeader onAddClick={openModal} />

        {/* Filters */}
        <NewsFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          availableCategories={availableCategories}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onReset={resetFilters}
        />

        {/* Content */}
        <NewsContent
          articles={articles}
          viewMode={viewMode}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Pagination */}
        <NewsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalPosts={totalPosts}
          displayedCount={displayedCount}
          onPageChange={setCurrentPage}
        />

        {/* Modal */}
        <NewsModal
          isOpen={isModalOpen}
          isEditing={isEditing}
          form={form}
          previewUrl={previewUrl}
          categories={categories}
          tags={tags}
          saving={saving}
          onClose={closeModal}
          onChange={(updatedForm) =>
            setForm({ ...updatedForm, tag_ids: updatedForm.tag_ids || [] })
          }
          onFileChange={handleFileChange}
          onRemoveImage={removeImage}
          onSave={handleSave}
          onCreateTag={handleCreateTag}
        />
      </main>

      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default AddNewsPage;
