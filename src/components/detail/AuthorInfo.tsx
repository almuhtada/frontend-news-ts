import { Link } from "react-router-dom";
import type { Post } from "../../services/posts";

interface AuthorInfoProps {
  post: Post;
  showAuthors: boolean;
  setShowAuthors: (show: boolean) => void;
}

const AuthorInfo = ({ post, showAuthors, setShowAuthors }: AuthorInfoProps) => {
  const authorInitial =
    post.author?.display_name?.charAt(0).toUpperCase() || "A";
  const editorInitial =
    post.editor?.display_name?.charAt(0).toUpperCase() || "E";

  const hasEditor = !!post.editor;

  return (
    <div className="relative mt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
      {/* Author & Editor Bar */}
      <div className="flex items-center gap-5 flex-wrap">
        {/* Author */}
        <div className="flex items-center gap-2.5">
          {/* Avatar */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold ring-1 ring-emerald-100 dark:ring-emerald-800">
            {authorInitial}
          </div>

          {/* Info */}
          <div className="leading-tight">
            <div className="flex items-center gap-1.5">
              <Link
                to={`/author/${post.author?.username || post.author?.id}`}
                className="text-[13px] font-semibold text-gray-900 dark:text-gray-100 hover:text-emerald-700 dark:hover:text-emerald-400 transition"
              >
                {post.author?.display_name ||
                  post.author?.username ||
                  "Penulis"}
              </Link>
              <span className="text-[11px] text-gray-400 dark:text-gray-500">
                Penulis
              </span>
            </div>

            <button
              onClick={() => setShowAuthors(!showAuthors)}
              className="text-[11px] font-medium text-gray-500 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400 transition inline-flex items-center gap-0.5"
            >
              Lihat profil {hasEditor ? "tim" : "penulis"}
              <svg
                className={`w-3 h-3 transition-transform ${showAuthors ? "rotate-180" : ""}`}
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M3 4.5L6 7.5L9 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Editor (if exists) */}
        {hasEditor && (
          <>
            <div className="hidden sm:block h-6 w-px bg-gray-200 dark:bg-gray-700" />
            <div className="flex items-center gap-2.5">
              {/* Avatar */}
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-semibold ring-1 ring-gray-200 dark:ring-gray-700">
                {editorInitial}
              </div>

              {/* Info */}
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <Link
                    to={`/author/${post.editor?.username || post.editor?.id}`}
                    className="text-[13px] font-semibold text-gray-900 dark:text-gray-100 hover:text-emerald-700 dark:hover:text-emerald-400 transition"
                  >
                    {post.editor?.display_name ||
                      post.editor?.username ||
                      "Editor"}
                  </Link>
                  <span className="text-[11px] text-gray-400 dark:text-gray-500">
                    Editor
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 dark:text-gray-500">
                  Menyunting artikel ini
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Dropdown Card */}
      {showAuthors && (
        <div className="absolute left-0 top-full mt-2 z-20 w-full max-w-sm rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-md shadow-gray-200/60 dark:shadow-none">
          <div className="flex items-center justify-between px-4 pt-3 pb-2">
            <h4 className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
              {hasEditor ? "Tim" : "Penulis"}
            </h4>
            <button
              onClick={() => setShowAuthors(false)}
              className="text-gray-300 hover:text-gray-500 dark:hover:text-gray-300 transition text-xs"
            >
              ✕
            </button>
          </div>

          <div className="px-2 pb-2">
            {/* Author Profile */}
            <Link
              to={`/author/${post.author?.username || post.author?.id}`}
              className="group flex items-center gap-3 rounded-md px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold ring-1 ring-emerald-100 dark:ring-emerald-800 flex-shrink-0">
                {authorInitial}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-gray-900 dark:text-gray-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition truncate">
                  {post.author?.display_name ||
                    post.author?.username ||
                    "Penulis"}
                </div>
                <div className="text-[11px] text-gray-400 dark:text-gray-500">
                  Penulis · @{post.author?.username || "penulis"}
                </div>
              </div>

              <svg
                className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 flex-shrink-0"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M4.5 2.5L8 6L4.5 9.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            {/* Editor Profile (if exists) */}
            {hasEditor && (
              <Link
                to={`/author/${post.editor?.username || post.editor?.id}`}
                className="group flex items-center gap-3 rounded-md px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-semibold ring-1 ring-gray-200 dark:ring-gray-700 flex-shrink-0">
                  {editorInitial}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-gray-900 dark:text-gray-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition truncate">
                    {post.editor?.display_name ||
                      post.editor?.username ||
                      "Editor"}
                  </div>
                  <div className="text-[11px] text-gray-400 dark:text-gray-500">
                    Editor · @{post.editor?.username || "editor"}
                  </div>
                </div>

                <svg
                  className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 flex-shrink-0"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path
                    d="M4.5 2.5L8 6L4.5 9.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorInfo;
