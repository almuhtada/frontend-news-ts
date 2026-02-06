import { useAuthorData } from "../hooks/useAuthorData";
import { Calendar, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import PublicPageLayout from "../components/layouts/PublicPageLayout";
import NewsList from "../components/common/NewsList";

const AuthorPage = () => {
  const {
    author,
    posts,
    loading,
    error,
    currentPage,
    totalPages,
    totalPosts,
    goToPage,
  } = useAuthorData();

  if (loading) {
    return (
      <PublicPageLayout>
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent mx-auto" />
            <p className="mt-4 text-sm text-gray-600">Memuat profil penulis…</p>
          </div>
        </div>
      </PublicPageLayout>
    );
  }

  if (error || !author) {
    return (
      <PublicPageLayout>
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Penulis Tidak Ditemukan
            </h1>
            <p className="text-gray-600">
              {error || "Profil penulis tidak tersedia."}
            </p>
          </div>
        </div>
      </PublicPageLayout>
    );
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      );
    } else {
      pages.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages,
      );
    }
    return pages;
  };

  return (
    <PublicPageLayout>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <main className="mx-auto max-w-6xl px-4 py-8">
        {/* PROFILE HEADER */}
        <section className="mb-10 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-700 text-white shadow">
                <span className="text-3xl font-bold">
                  {(author.display_name || author.username)
                    .charAt(0)
                    .toUpperCase()}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {author.display_name || author.username}
              </h1>
              <p className="text-sm text-gray-500 mt-1">@{author.username}</p>

              {author.role && (
                <span className="mt-2 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {author.role}
                </span>
              )}

              {/* Stats */}
              <div className="mt-4 flex flex-wrap gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-600" />
                  <span className="font-semibold text-gray-900">
                    {totalPosts}
                  </span>
                  Artikel
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-emerald-600" />
                  Bergabung sejak {formatDate(author.createdAt)}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION TITLE */}
        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Artikel oleh {author.display_name || author.username}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Menampilkan {posts.length} dari {totalPosts} artikel
          </p>
        </section>

        {/* CONTENT */}
        {posts.length > 0 ? (
          <>
            <NewsList articles={posts} itemsPerPage={posts.length} />

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="mt-10 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                  {/* Prev */}
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                      currentPage === 1
                        ? "cursor-not-allowed bg-gray-100 text-gray-400"
                        : "bg-emerald-600 text-white hover:bg-emerald-500"
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Sebelumnya
                  </button>

                  {/* Pages */}
                  <div className="flex flex-wrap justify-center gap-2">
                    {getPageNumbers().map((page, i) => (
                      <button
                        key={i}
                        onClick={() =>
                          typeof page === "number" && goToPage(page)
                        }
                        disabled={page === "..."}
                        className={`h-9 min-w-[36px] rounded-full text-sm font-medium transition ${
                          page === currentPage
                            ? "bg-emerald-600 text-white shadow"
                            : page === "..."
                              ? "cursor-default text-gray-400"
                              : "bg-gray-100 text-gray-700 hover:bg-emerald-100 hover:text-emerald-700"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  {/* Next */}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                      currentPage === totalPages
                        ? "cursor-not-allowed bg-gray-100 text-gray-400"
                        : "bg-emerald-600 text-white hover:bg-emerald-500"
                    }`}
                  >
                    Selanjutnya
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <p className="mt-4 text-center text-xs text-gray-500">
                  Halaman {currentPage} dari {totalPages}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
            <FileText className="mx-auto mb-4 h-14 w-14 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900">
              Belum Ada Artikel
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Penulis ini belum mempublikasikan artikel.
            </p>
          </div>
        )}
      </main>
    </div>
    </PublicPageLayout>
  );
};

export default AuthorPage;
