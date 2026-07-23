import { Link } from "react-router-dom";
import { User, UserCheck } from "lucide-react";
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
    <div className="relative mt-6">
      {/* Author & Editor Bar */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Author */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-700 text-white font-bold shadow-md">
            {authorInitial}
          </div>

          {/* Info */}
          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <Link
                to={`/author/${post.author?.username || post.author?.id}`}
                className="block text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-emerald-700 dark:hover:text-emerald-400 transition"
              >
                {post.author?.display_name || post.author?.username || "Penulis"}
              </Link>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold rounded-full">
                <User className="w-3 h-3" />
                PENULIS
              </span>
            </div>

            <button
              onClick={() => setShowAuthors(!showAuthors)}
              className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition"
            >
              Lihat profil {hasEditor ? "tim" : "penulis"}
              <span
                className={`transition-transform ${
                  showAuthors ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>
          </div>
        </div>

        {/* Editor (if exists) */}
        {hasEditor && (
          <>
            <div className="hidden sm:block h-8 w-px bg-gray-300 dark:bg-gray-600" />
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-700 text-white font-bold shadow-md">
                {editorInitial}
              </div>

              {/* Info */}
              <div className="leading-tight">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/author/${post.editor?.username || post.editor?.id}`}
                    className="block text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-700 dark:hover:text-blue-400 transition"
                  >
                    {post.editor?.display_name || post.editor?.username || "Editor"}
                  </Link>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-bold rounded-full">
                    <UserCheck className="w-3 h-3" />
                    EDITOR
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Editor artikel</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Dropdown Card */}
      {showAuthors && (
        <div className="absolute left-0 top-16 z-20 w-full max-w-md rounded-xl border border-emerald-100 dark:border-emerald-800 bg-white dark:bg-gray-800 shadow-xl">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                {hasEditor ? "Profil Tim" : "Profil Penulis"}
              </h4>
              <button
                onClick={() => setShowAuthors(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {/* Author Profile */}
              <Link
                to={`/author/${post.author?.username || post.author?.id}`}
                className="group flex items-center gap-3 rounded-lg p-3 border border-emerald-100 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-700 text-white font-bold flex-shrink-0">
                  {authorInitial}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition truncate">
                      {post.author?.display_name || post.author?.username || "Penulis"}
                    </div>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[9px] font-bold rounded-full flex-shrink-0">
                      <User className="w-2.5 h-2.5" />
                      PENULIS
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    @{post.author?.username || "penulis"}
                  </div>
                </div>

                <span className="text-emerald-600 text-sm flex-shrink-0">→</span>
              </Link>

              {/* Editor Profile (if exists) */}
              {hasEditor && (
                <Link
                  to={`/author/${post.editor?.username || post.editor?.id}`}
                  className="group flex items-center gap-3 rounded-lg p-3 border border-blue-100 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-700 text-white font-bold flex-shrink-0">
                    {editorInitial}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition truncate">
                        {post.editor?.display_name || post.editor?.username || "Editor"}
                      </div>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[9px] font-bold rounded-full flex-shrink-0">
                        <UserCheck className="w-2.5 h-2.5" />
                        EDITOR
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      @{post.editor?.username || "editor"}
                    </div>
                  </div>

                  <span className="text-blue-600 text-sm flex-shrink-0">→</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorInfo;
