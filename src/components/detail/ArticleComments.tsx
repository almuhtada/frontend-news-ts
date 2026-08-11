import React, { useState, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
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

const ArticleComments = ({ postUuid }: Props) => {
  const { toast } = useToast();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch comments on mount
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await interactionService.getComments(
          postUuid,
          "approved",
        );

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

  const submitComment = async () => {
    if (!text.trim()) {
      toast.warning("Komentar tidak boleh kosong");
      return;
    }

    if (!name.trim()) {
      toast.warning("Nama tidak boleh kosong");
      return;
    }

    if (!email.trim()) {
      toast.warning("Email tidak boleh kosong");
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.warning("Format email tidak valid");
      return;
    }

    setSubmitting(true);

    try {
      const userIdentifier = getUserIdentifier();

      const response = await interactionService.createComment(postUuid, {
        author_name: name.trim(),
        author_email: email.trim(),
        content: text.trim(),
        author_ip: userIdentifier,
      });

      if (response.success) {
        // Clear form
        setText("");
        setName("");
        setEmail("");

        // Refresh comments list to show new comment immediately
        const commentsResponse = await interactionService.getComments(
          postUuid,
          "approved",
        );
        if (commentsResponse.success) {
          setComments(commentsResponse.data.comments);
        }

        // Show success message
        toast.success("Komentar berhasil dikirim!");
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
      </div>

      {/* COMMENT FORM */}
      <div className="mb-10">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
          {/* Name and Email inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama Anda *"
              className="
                px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600
                text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500
                focus:outline-none focus:border-emerald-400
              "
              disabled={submitting}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Anda *"
              className="
                px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600
                text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500
                focus:outline-none focus:border-emerald-400
              "
              disabled={submitting}
            />
          </div>

          {/* Comment textarea */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tulis pendapat Anda secara sopan dan relevan…"
            rows={3}
            className="
              w-full resize-none bg-transparent text-sm text-gray-800 dark:text-gray-200
              placeholder:text-gray-400 dark:placeholder:text-gray-500
              focus:outline-none
            "
            disabled={submitting}
          />

          <div className="flex items-center justify-end mt-4">
            <button
              onClick={submitComment}
              disabled={submitting}
              className="
                inline-flex items-center gap-2
                px-5 py-2 rounded-full
                bg-emerald-600 text-white
                text-sm font-medium
                hover:bg-emerald-700
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
                  Kirim
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="text-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-600" />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Memuat komentar...
          </p>
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
            <article
              key={c.id}
              className="border-b border-gray-100 dark:border-gray-700 pb-6"
            >
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
