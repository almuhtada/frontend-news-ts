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

  return (
    <div className="relative mt-6">
      {/* Author Bar */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-700 text-white font-bold shadow-md">
          {authorInitial}
        </div>

        {/* Info */}
        <div className="leading-tight">
          <Link
            to={`/author/${post.author?.username || post.author?.id}`}
            className="block text-sm font-semibold text-gray-900 hover:text-emerald-700 transition"
          >
            {post.author?.username || "Penulis"}
          </Link>

          <button
            onClick={() => setShowAuthors(!showAuthors)}
            className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition"
          >
            Lihat profil penulis
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

      {/* Dropdown Card */}
      {showAuthors && (
        <div className="absolute left-0 top-14 z-20 w-80 rounded-xl border border-emerald-100 bg-white shadow-xl">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-800">
                Profil Penulis
              </h4>
              <button
                onClick={() => setShowAuthors(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                ✕
              </button>
            </div>

            <Link
              to={`/author/${post.author?.username || post.author?.id}`}
              className="group flex items-center gap-3 rounded-lg p-2 hover:bg-emerald-50 transition"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-700 text-white font-bold">
                {authorInitial}
              </div>

              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-900 group-hover:text-emerald-700 transition">
                  {post.author?.display_name || "Penulis"}
                </div>
                <div className="text-xs text-gray-500">
                  Lihat semua artikel penulis
                </div>
              </div>

              <span className="text-emerald-600 text-sm">→</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorInfo;
