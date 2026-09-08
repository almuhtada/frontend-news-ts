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
    <div className={`mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Item count info */}
      <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
        Menampilkan <span className="font-semibold text-gray-800 dark:text-gray-200">{displayedCount}</span> dari{" "}
        <span className="font-semibold text-gray-800 dark:text-gray-200">{totalItems}</span> {itemLabel}
      </div>

      {/* Pagination controls */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 sm:py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Prev</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {visiblePages.map((page, idx, arr) => {
            const showEllipsisBefore = idx > 0 && page - arr[idx - 1] > 1;

            return (
              <React.Fragment key={page}>
                {showEllipsisBefore && (
                  <span className="px-1 sm:px-2 text-xs sm:text-sm text-gray-400 dark:text-gray-500">...</span>
                )}
                <button
                  onClick={() => onPageChange(page)}
                  className={`min-w-[32px] sm:min-w-[38px] h-8 sm:h-9 px-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    currentPage === page
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm font-semibold"
                      : "border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/80"
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
          className="flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 sm:py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
          aria-label="Next page"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
