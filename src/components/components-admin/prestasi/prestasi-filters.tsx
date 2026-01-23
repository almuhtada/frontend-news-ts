import { Search, Calendar, Download, LayoutGrid, List, X } from "lucide-react";

interface PrestasiFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedYear: number | null;
  setSelectedYear: (year: number | null) => void;
  availableYears: number[];
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  onReset: () => void;
}

const PrestasiFilters: React.FC<PrestasiFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedYear,
  setSelectedYear,
  availableYears,
  viewMode,
  setViewMode,
  onReset,
}) => {
  const hasFilter = searchQuery || selectedYear;

  return (
    <section className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      {/* Top row */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Filters */}
        <div className="flex w-full flex-col gap-3 sm:flex-row lg:flex-1">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari prestasi…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                w-full rounded-xl border border-gray-200
                py-2.5 pl-9 pr-3 text-sm
                focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500
              "
            />
          </div>

          {/* Year */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <select
              value={selectedYear ?? ""}
              onChange={(e) =>
                setSelectedYear(e.target.value ? Number(e.target.value) : null)
              }
              className="
                rounded-xl border border-gray-200 bg-white
                py-2.5 pl-9 pr-3 text-sm
                focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500
              "
            >
              <option value="">Semua Tahun</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right tools */}
        <div className="flex items-center gap-2">
          {/* View mode */}
          <div className="flex rounded-xl border border-gray-200 bg-gray-50 p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-lg p-2 transition ${
                viewMode === "grid"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-lg p-2 transition ${
                viewMode === "list"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* Export */}
          <button
            title="Unduh data prestasi"
            className="
              rounded-xl border border-gray-200 bg-white p-2
              text-gray-500 transition hover:bg-gray-50 hover:text-gray-700
            "
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Active filters */}
      {hasFilter && (
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">
          <span className="text-xs text-gray-500">Filter:</span>

          {searchQuery && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
              “{searchQuery}”
            </span>
          )}

          {selectedYear && (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-700">
              {selectedYear}
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

export default PrestasiFilters;
