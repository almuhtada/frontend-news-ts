import { Search } from "lucide-react";

interface NotificationFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  onReset: () => void;
}

const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  selectedCategory,
  setSelectedCategory,
  onReset,
}) => {
  const hasActiveFilters = searchQuery || selectedStatus || selectedCategory;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 mb-8">
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full lg:w-auto">
          {/* Search */}
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari notifikasi, pengguna, atau deskripsi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Status Filter */}
          <select
            aria-label="Filter berdasarkan status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none bg-white min-w-[130px]"
          >
            <option value="">Semua Status</option>
            <option value="pending">Menunggu</option>
            <option value="approved">Disetujui</option>
            <option value="rejected">Ditolak</option>
          </select>

          {/* Category Filter */}
          <select
            aria-label="Filter berdasarkan kategori"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none bg-white min-w-[130px]"
          >
            <option value="">Semua Kategori</option>
            <option value="news">Berita</option>
            <option value="publication">Publikasi</option>
            <option value="achievement">Prestasi</option>
            <option value="profile">Profil</option>
            <option value="system">Sistem</option>
          </select>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-600">Filter aktif:</span>
          {searchQuery && (
            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium">
              "{searchQuery}"
            </span>
          )}
          {selectedStatus && (
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
              {selectedStatus}
            </span>
          )}
          {selectedCategory && (
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
              {selectedCategory}
            </span>
          )}
          <button
            onClick={onReset}
            className="text-gray-400 hover:text-gray-600 text-xs ml-2"
          >
            Reset semua
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationFilters;
