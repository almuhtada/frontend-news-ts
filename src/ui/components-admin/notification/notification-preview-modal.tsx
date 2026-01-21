import { Eye, X, RefreshCw, User, Calendar, FileText } from "lucide-react";
import type { Post } from "../../../services/posts";

interface NotificationPreviewModalProps {
  isOpen: boolean;
  post: Post | null;
  loading: boolean;
  onClose: () => void;
}

const NotificationPreviewModal: React.FC<NotificationPreviewModalProps> = ({
  isOpen,
  post,
  loading,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Preview Berita</h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-100px)]">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <RefreshCw className="w-12 h-12 text-green-500 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Memuat berita...</p>
              </div>
            </div>
          ) : post ? (
            <div>
              {/* Featured Image */}
              {post.featured_image && (
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-64 object-cover rounded-2xl mb-6"
                />
              )}

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>

              {/* Meta Info */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{post.author?.username || "Unknown"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(post.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    post.status === "publish"
                      ? "bg-green-100 text-green-700"
                      : post.status === "draft"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {post.status}
                </span>
              </div>

              {/* Excerpt */}
              {post.excerpt && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-xl mb-6">
                  <p className="text-gray-700 italic">{post.excerpt}</p>
                </div>
              )}

              {/* Content */}
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Categories */}
              {post.categories && post.categories.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Kategori:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {post.categories.map((cat) => (
                      <span
                        key={cat.id}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Tags:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Tidak dapat memuat berita</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPreviewModal;
