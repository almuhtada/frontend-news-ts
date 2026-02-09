import { X, AlertCircle } from "lucide-react";
import { useState } from "react";

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  postTitle?: string;
}

const NotificationRejectModal: React.FC<RejectModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  postTitle,
}) => {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      alert("Mohon berikan alasan penolakan");
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(reason);
      setReason("");
      onClose();
    } catch (error) {
      console.error("Error rejecting:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Tolak Berita
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Berikan alasan penolakan untuk penulis
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Post Title */}
        {postTitle && (
          <div className="mb-4 rounded-lg bg-gray-50 dark:bg-gray-700 p-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Judul Berita:</p>
            <p className="mt-1 text-gray-900 dark:text-gray-100">{postTitle}</p>
          </div>
        )}

        {/* Reason Input */}
        <div className="mb-6">
          <label
            htmlFor="rejection-reason"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Alasan Penolakan <span className="text-red-500">*</span>
          </label>
          <textarea
            id="rejection-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Contoh: Judul kurang menarik, konten perlu ditambahkan referensi, terdapat kesalahan penulisan, dll."
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            rows={6}
          />
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Alasan penolakan akan dikirim ke penulis melalui Telegram dan
            ditampilkan saat mereka mengedit berita.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !reason.trim()}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white hover:bg-red-500 disabled:opacity-50"
          >
            {isSubmitting ? "Menolak..." : "Tolak Berita"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationRejectModal;
