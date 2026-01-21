import { Search, LayoutGrid, List, Download, X } from "lucide-react";

type NewsFiltersProps = {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  selectedStatus: string;
  setSelectedStatus: (val: string) => void;
  availableCategories: string[];
  viewMode: "grid" | "list";
  setViewMode: (val: "grid" | "list") => void;
  onReset: () => void;
};

const NewsFilters = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  availableCategories,
  viewMode,
  setViewMode,
  onReset,
}: NewsFiltersProps) => {
  const hasFilter = searchQuery || selectedCategory || selectedStatus;

  return (
    <section className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      {/* Top Row */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search + Select */}
        <div className="flex w-full flex-col gap-3 sm:flex-row lg:flex-1">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari artikel…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                w-full rounded-xl border border-gray-200
                py-2.5 pl-9 pr-3 text-sm
                focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500
              "
            />
          </div>

          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="
              rounded-xl border border-gray-200 bg-white
              px-3 py-2.5 text-sm
              focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500
            "
          >
            <option value="">Semua Kategori</option>
            {availableCategories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="
              rounded-xl border border-gray-200 bg-white
              px-3 py-2.5 text-sm
              focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500
            "
          >
            <option value="">Semua Status</option>
            <option value="published">Publikasi</option>
            <option value="draft">Draft</option>
            <option value="archived">Arsip</option>
          </select>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2">
          {/* View Mode */}
          <div className="flex rounded-xl border border-gray-200 bg-gray-50 p-1">
            <button
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
              className={`rounded-lg p-2 transition ${
                viewMode === "grid"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              aria-label="List view"
              className={`rounded-lg p-2 transition ${
                viewMode === "list"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* Export */}
          <button
            aria-label="Unduh data"
            className="
              rounded-xl border border-gray-200 bg-white p-2
              text-gray-500 transition hover:bg-gray-50 hover:text-gray-700
            "
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Active Filters */}
      {hasFilter && (
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">
          <span className="text-xs text-gray-500">Filter:</span>

          {searchQuery && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
              “{searchQuery}”
            </span>
          )}

          {selectedCategory && (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-700">
              {selectedCategory}
            </span>
          )}

          {selectedStatus && (
            <span className="rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-700">
              {selectedStatus}
            </span>
          )}

          <button
            onClick={onReset}
            className="ml-1 inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
          >
            <X className="h-3 w-3" />
            Reset
          </button>
        </div>
      )}
    </section>
  );
};

export default NewsFilters;
