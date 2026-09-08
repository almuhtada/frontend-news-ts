import { Fragment } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
}: PaginationProps) => {
  // Don't show pagination if only 1 page
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
    <nav className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 dark:border-gray-800 pt-6">
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-wrap">
        {/* Previous Button */}
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-lg text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          ← Sebelumnya
        </button>

        {/* Page Numbers */}
        <div className="flex items-center justify-center flex-wrap gap-1">
          {visiblePages.map((page, idx, arr) => {
            const showEllipsisBefore = idx > 0 && page - arr[idx - 1] > 1;

            return (
              <Fragment key={page}>
                {showEllipsisBefore && (
                  <span className="px-2 text-xs text-gray-400 dark:text-gray-500">...</span>
                )}
                <button
                  onClick={() => setCurrentPage(page)}
                  className={`min-w-[32px] h-9 px-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    currentPage === page
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm font-semibold"
                      : "border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/80"
                  }`}
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page}
                </button>
              </Fragment>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-lg text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          Selanjutnya →
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
