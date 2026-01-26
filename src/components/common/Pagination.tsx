import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  displayedCount: number;
  itemLabel?: string; // e.g., "artikel", "publikasi", "prestasi"
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * Global Pagination Component
 *
 * Reusable pagination component yang bisa dipakai di semua list:
 * - News list
 * - Publications list
 * - Achievements list
 * - User list
 * - dll
 *
 * @example
 * <Pagination
 *   currentPage={1}
 *   totalPages={10}
 *   totalItems={100}
 *   displayedCount={10}
 *   itemLabel="artikel"
 *   onPageChange={(page) => setCurrentPage(page)}
 * />
 */
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  displayedCount,
  itemLabel = "item",
  onPageChange,
  className = "",
}) => {
  // Don't show pagination if only 1 page or less
  if (totalPages <= 1) return null;

  // Calculate visible page numbers (show first, last, current, and adjacent pages)
  const visiblePages = Array.from(
    { length: totalPages },
    (_, i) => i + 1,
  ).filter(
    (page) =>
      page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1,
  );

  return (
    <div className={`mt-8 flex items-center justify-between ${className}`}>
      {/* Item count info */}
      <div className="text-sm text-gray-600">
        Menampilkan <span className="font-semibold">{displayedCount}</span> dari{" "}
        <span className="font-semibold">{totalItems}</span> {itemLabel}
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
          Prev
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {visiblePages.map((page, idx, arr) => {
            const showEllipsisBefore = idx > 0 && page - arr[idx - 1] > 1;

            return (
              <React.Fragment key={page}>
                {showEllipsisBefore && (
                  <span className="px-2 text-gray-400">...</span>
                )}
                <button
                  onClick={() => onPageChange(page)}
                  className={`min-w-[40px] h-10 px-3 rounded-xl text-sm font-medium transition-colors ${
                    currentPage === page
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page}
                </button>
              </React.Fragment>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
