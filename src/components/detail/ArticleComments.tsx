import React, { useState, useEffect } from "react";
import {
  Send,
  Loader2,
  X,
  MessageSquarePlus,
  User,
  Mail,
  MessageSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  interactionService,
  type Comment as CommentType,
} from "../../services/interactions";
import { getUserIdentifier } from "../../utils/userIdentifier";
import { useToast } from "../../context/ToastContext";

interface Props {
  postUuid: string;
}

// Strip HTML tags from content
const stripHtml = (html: string): string => {
  if (!html) return "";
  // Remove HTML tags
  let text = html.replace(/<[^>]+>/g, "");
  // Decode HTML entities
  text = text.replace(/&nbsp;/g, " ");
  text = text.replace(/&amp;/g, "&");
  text = text.replace(/&lt;/g, "<");
  text = text.replace(/&gt;/g, ">");
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");
  // Remove again if any HTML appeared after decode
  text = text.replace(/<[^>]+>/g, "");
  // Clean almuhtada.org prefix if exists
  text = text.replace(/almuhtada\.org\s*-?\s*/gi, "");
  // Normalize whitespace
  return text.replace(/\s+/g, " ").trim();
};

// URL regex patterns
const urlSplitRegex = /(https?:\/\/[^\s<>"{}|\\^`[\]]+)/gi;
const urlTestRegex = /^https?:\/\/[^\s<>"{}|\\^`[\]]+$/i;

// Render text with clickable links
const renderWithLinks = (text: string): React.ReactNode[] => {
  const cleanText = stripHtml(text);
  const parts = cleanText.split(urlSplitRegex);

  return parts.map((part, index) => {
    if (urlTestRegex.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-600 hover:text-emerald-700 underline break-all"
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

// Format timestamp to Indonesian relative time
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "baru saja";
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} menit yang lalu`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} jam yang lalu`;
  }
  if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} hari yang lalu`;
  }

  // Format as Indonesian date
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// ─── Backdrop overlay ────────────────────────────────────────────────────────

const Overlay = ({ onClick }: { onClick: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    onClick={onClick}
    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
  />
);

// ─── Comment Modal ───────────────────────────────────────────────────────────

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; email: string; comment: string }) => void;
  submitting: boolean;
}

const CommentModal = ({
  isOpen,
  onClose,
  onSubmit,
  submitting,
}: CommentModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Delay reset so exit animation plays first
      const timer = setTimeout(() => {
        setName("");
        setEmail("");
        setComment("");
        setErrors({});
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Nama tidak boleh kosong";
    if (!email.trim()) {
      newErrors.email = "Email tidak boleh kosong";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) newErrors.email = "Format email tidak valid";
    }
    if (!comment.trim()) newErrors.comment = "Komentar tidak boleh kosong";

    setErrors(newErrors);

    // Show first error as toast
    const firstError = Object.values(newErrors)[0];
    if (firstError) {
      toast.warning(firstError);
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ name: name.trim(), email: email.trim(), comment: comment.trim() });
  };

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, submitting, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Overlay onClick={() => !submitting && onClose()} />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                    <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      Tulis Komentar
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Sampaikan pendapat Anda secara sopan
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  disabled={submitting}
                  className="p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                {/* Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    <User className="w-3.5 h-3.5" />
                    Nama
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                    }}
                    placeholder="Masukkan nama Anda"
                    disabled={submitting}
                    className={`
                      w-full px-4 py-2.5 rounded-xl border text-sm
                      bg-gray-50 dark:bg-gray-900
                      text-gray-800 dark:text-gray-200
                      placeholder:text-gray-400 dark:placeholder:text-gray-500
                      focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400
                      transition
                      disabled:opacity-50
                      ${errors.name ? "border-red-400 dark:border-red-500" : "border-gray-200 dark:border-gray-600"}
                    `}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email)
                        setErrors((prev) => ({ ...prev, email: "" }));
                    }}
                    placeholder="Masukkan email Anda"
                    disabled={submitting}
                    className={`
                      w-full px-4 py-2.5 rounded-xl border text-sm
                      bg-gray-50 dark:bg-gray-900
                      text-gray-800 dark:text-gray-200
                      placeholder:text-gray-400 dark:placeholder:text-gray-500
                      focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400
                      transition
                      disabled:opacity-50
                      ${errors.email ? "border-red-400 dark:border-red-500" : "border-gray-200 dark:border-gray-600"}
                    `}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Comment */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Komentar
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => {
                      setComment(e.target.value);
                      if (errors.comment)
                        setErrors((prev) => ({ ...prev, comment: "" }));
                    }}
                    placeholder="Tulis pendapat Anda secara sopan dan relevan..."
                    rows={4}
                    disabled={submitting}
                    className={`
                      w-full px-4 py-2.5 rounded-xl border text-sm resize-none
                      bg-gray-50 dark:bg-gray-900
                      text-gray-800 dark:text-gray-200
                      placeholder:text-gray-400 dark:placeholder:text-gray-500
                      focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400
                      transition
                      disabled:opacity-50
                      ${errors.comment ? "border-red-400 dark:border-red-500" : "border-gray-200 dark:border-gray-600"}
                    `}
                  />
                  {errors.comment && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.comment}
                    </p>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={submitting}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="
                      inline-flex items-center gap-2
                      px-5 py-2.5 rounded-xl
                      bg-emerald-600 text-white
                      text-sm font-medium
                      hover:bg-emerald-700
                      focus:outline-none focus:ring-2 focus:ring-emerald-500/50
                      transition
                      disabled:opacity-50 disabled:cursor-not-allowed
                    "
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Kirim Komentar
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

const ArticleComments = ({ postUuid }: Props) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();

  // Fetch comments on mount
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await interactionService.getComments(postUuid, "approved");

        if (response.success) {
          setComments(response.data.comments);
        }
      } catch (err) {
        console.error("Failed to fetch comments:", err);
        setError("Gagal memuat komentar");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postUuid]);

  const handleSubmitComment = async (data: {
    name: string;
    email: string;
    comment: string;
  }) => {
    setSubmitting(true);

    try {
      const userIdentifier = getUserIdentifier();

      const response = await interactionService.createComment(postUuid, {
        author_name: data.name,
        author_email: data.email,
        content: data.comment,
        author_ip: userIdentifier,
      });

      if (response.success) {
        // Close modal first
        setModalOpen(false);

        // Refresh comments list
        const commentsResponse = await interactionService.getComments(
          postUuid,
          "approved",
        );
        if (commentsResponse.success) {
          setComments(commentsResponse.data.comments);
        }

        // Show success toast
        toast.success("Komentar berhasil dikirim! Menunggu persetujuan moderator.");
      }
    } catch (err) {
      console.error("Failed to submit comment:", err);
      toast.error("Gagal mengirim komentar. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-14">
      {/* SECTION TITLE */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
          Komentar
          <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
            ({comments.length})
          </span>
        </h3>

        {/* Add Comment Button */}
        <button
          onClick={() => setModalOpen(true)}
          className="
            inline-flex items-center gap-2
            px-4 py-2 rounded-xl
            bg-emerald-600 text-white
            text-sm font-medium
            hover:bg-emerald-700
            focus:outline-none focus:ring-2 focus:ring-emerald-500/50
            transition
            shadow-sm hover:shadow-md
          "
        >
          <MessageSquarePlus className="w-4 h-4" />
          Tulis Komentar
        </button>
      </div>

      {/* COMMENT MODAL */}
      <CommentModal
        isOpen={modalOpen}
        onClose={() => !submitting && setModalOpen(false)}
        onSubmit={handleSubmitComment}
        submitting={submitting}
      />

      {/* LOADING STATE */}
      {loading && (
        <div className="text-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-600" />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Memuat komentar...</p>
        </div>
      )}

      {/* ERROR STATE */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* COMMENT LIST */}
      {!loading && comments.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Belum ada komentar. Jadilah yang pertama berkomentar!
          </p>
        </div>
      )}

      {!loading && comments.length > 0 && (
        <div className="space-y-8">
          {comments.map((c) => (
            <article key={c.id} className="border-b border-gray-100 dark:border-gray-700 pb-6">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {c.author_name}
                </p>
                <span className="text-xs text-gray-400">
                  {formatRelativeTime(c.createdAt)}
                </span>
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl">
                {renderWithLinks(c.content)}
              </p>

              {/* Nested replies */}
              {c.replies && c.replies.length > 0 && (
                <div className="mt-4 ml-6 space-y-4 border-l-2 border-gray-100 dark:border-gray-700 pl-4">
                  {c.replies.map((reply) => (
                    <div key={reply.id}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                          {reply.author_name}
                        </p>
                        <span className="text-xs text-gray-400">
                          {formatRelativeTime(reply.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {renderWithLinks(reply.content)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default ArticleComments;
