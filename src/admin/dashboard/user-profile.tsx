import React from "react";
import Sidebar from "../../components/components-admin/sidebar";
import {
  UserHeader,
  UserFilters,
  UserTable,
  UserModal,
  useUserPage,
} from "../../components/components-admin/user";

const UserProfile: React.FC = () => {
  const {
    users,
    searchTerm,
    roleFilter,
    isModalOpen,
    editMode,
    form,
    isLoading,
    dataLoading,
    showSuccess,
    successMessage,
    pagination,
    setSearchTerm,
    setRoleFilter,
    setForm,
    openAddModal,
    openEditModal,
    closeModal,
    handleSave,
    handleDelete,
    goToPage,
    goToFirstPage,
    goToLastPage,
    goToPrevPage,
    goToNextPage,
  } = useUserPage();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-950 dark:to-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 lg:p-10">
        <UserHeader onAddClick={openAddModal} />

        <UserFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
        />

        <UserTable
          users={users}
          dataLoading={dataLoading}
          pagination={pagination}
          onEdit={openEditModal}
          onDelete={handleDelete}
          onPageChange={goToPage}
          onFirstPage={goToFirstPage}
          onLastPage={goToLastPage}
          onPrevPage={goToPrevPage}
          onNextPage={goToNextPage}
        />

        <UserModal
          isOpen={isModalOpen}
          editMode={editMode}
          form={form}
          isLoading={isLoading}
          onClose={closeModal}
          onSave={handleSave}
          onFormChange={setForm}
        />

        {/* Success Toast */}
        {showSuccess && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            {successMessage}
          </div>
        )}
      </main>
    </div>
  );
};

export default UserProfile;
