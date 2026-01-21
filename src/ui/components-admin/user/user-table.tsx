import { Users, Pencil, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import type { User, Role } from "./types";
import type { Pagination } from "./use-user-page";

interface UserTableProps {
  users: User[];
  dataLoading: boolean;
  pagination: Pagination;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  onPageChange: (page: number) => void;
  onFirstPage: () => void;
  onLastPage: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
}

// Get role badge style
const getRoleBadgeStyle = (role: Role) => {
  const styles: Record<Role, string> = {
    administrator: "bg-red-100 text-red-700 border border-red-200",
    editor: "bg-blue-100 text-blue-700 border border-blue-200",
    author: "bg-green-100 text-green-700 border border-green-200",
    contributor: "bg-purple-100 text-purple-700 border border-purple-200",
    subscriber: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    user: "bg-gray-100 text-gray-700 border border-gray-200",
  };
  return styles[role] || styles.user;
};

// Format role label
const getRoleLabel = (role: Role) => {
  const labels: Record<Role, string> = {
    administrator: "Administrator",
    editor: "Editor",
    author: "Author",
    contributor: "Contributor",
    subscriber: "Subscriber",
    user: "User",
  };
  return labels[role] || role;
};

// Format date
const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Generate page numbers to display
const getPageNumbers = (currentPage: number, totalPages: number): (number | string)[] => {
  const pages: (number | string)[] = [];
  const maxVisible = 5;

  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push("...");
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push("...");
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
      pages.push("...");
      pages.push(totalPages);
    }
  }

  return pages;
};

const UserTable: React.FC<UserTableProps> = ({
  users,
  dataLoading,
  pagination,
  onEdit,
  onDelete,
  onPageChange,
  onFirstPage,
  onLastPage,
  onPrevPage,
  onNextPage,
}) => {
  const { currentPage, totalPages, totalUsers, usersPerPage } = pagination;
  const startItem = (currentPage - 1) * usersPerPage + 1;
  const endItem = Math.min(currentPage * usersPerPage, totalUsers);

  // Loading state
  if (dataLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="py-16 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-500">Memuat data user...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (users.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="py-16 text-center">
          <div className="p-4 bg-slate-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Users className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-500 text-lg mb-2">Belum ada user</p>
          <p className="text-slate-400 text-sm">
            Klik tombol "Tambah User" untuk memulai
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
            <tr>
              <th className="p-4 text-left font-semibold text-slate-700">
                User
              </th>
              <th className="p-4 text-left font-semibold text-slate-700">
                Username
              </th>
              <th className="p-4 text-left font-semibold text-slate-700">
                Role
              </th>
              <th className="p-4 text-left font-semibold text-slate-700">
                Bergabung
              </th>
              <th className="p-4 text-left font-semibold text-slate-700">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-slate-100 hover:bg-slate-50 transition-all duration-150"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {(user.display_name || user.username)
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">
                        {user.display_name || user.username}
                      </p>
                      <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-slate-600">
                    @{user.username}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${getRoleBadgeStyle(
                      user.role,
                    )}`}
                  >
                    {getRoleLabel(user.role)}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-slate-600">
                    {formatDate(user.user_registered || user.createdAt)}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(user)}
                      className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-150"
                      aria-label="Edit user"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(user.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-150"
                      aria-label="Hapus user"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="px-4 py-4 border-t border-slate-200 bg-slate-50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Info */}
            <div className="text-sm text-slate-600">
              Menampilkan <span className="font-semibold">{startItem}</span> - <span className="font-semibold">{endItem}</span> dari <span className="font-semibold">{totalUsers}</span> user
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1">
              {/* First Page */}
              <button
                type="button"
                onClick={onFirstPage}
                disabled={currentPage === 1}
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all"
                aria-label="Halaman pertama"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>

              {/* Previous Page */}
              <button
                type="button"
                onClick={onPrevPage}
                disabled={currentPage === 1}
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all"
                aria-label="Halaman sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1 mx-2">
                {getPageNumbers(currentPage, totalPages).map((page, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => typeof page === "number" && onPageChange(page)}
                    disabled={page === "..."}
                    className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-all ${
                      page === currentPage
                        ? "bg-emerald-500 text-white shadow-md"
                        : page === "..."
                        ? "cursor-default text-slate-400"
                        : "text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* Next Page */}
              <button
                type="button"
                onClick={onNextPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all"
                aria-label="Halaman selanjutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Last Page */}
              <button
                type="button"
                onClick={onLastPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all"
                aria-label="Halaman terakhir"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
