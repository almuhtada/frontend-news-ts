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
  return (
    <nav className="mt-12 flex flex-col gap-4 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
      {/* Previous */}
      <button
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition ${
          currentPage === 1
            ? "cursor-not-allowed bg-gray-100 text-gray-400"
            : "bg-emerald-600 text-white hover:bg-emerald-500"
        }`}
      >
        ← Sebelumnya
      </button>

      {/* Page numbers */}
      <div className="flex flex-wrap justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition ${
              currentPage === page
                ? "bg-emerald-600 text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-emerald-100 hover:text-emerald-700"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next */}
      <button
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition ${
          currentPage === totalPages
            ? "cursor-not-allowed bg-gray-100 text-gray-400"
            : "bg-emerald-600 text-white hover:bg-emerald-500"
        }`}
      >
        Selanjutnya →
      </button>
    </nav>
  );
};

export default Pagination;
