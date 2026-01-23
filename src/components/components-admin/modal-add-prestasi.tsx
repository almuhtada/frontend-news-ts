import { useEffect, useRef } from "react";
import {
  X,
  Calendar,
  Star,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Award,
} from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  isLoading: boolean;
  editMode: boolean;
  year: number;
  setYear: (val: number) => void;
  text: string;
  setText: (val: string) => void;
  name: string; // ✅ nama mahasiswa
  setName: (val: string) => void; // ✅ setter nama
  errors: { year?: string; text?: string; name?: string }; // tambahkan validasi name
  showPreview: boolean;
  setShowPreview: (val: boolean) => void;
};

const achievementSuggestions = [
  "🏆 Juara 1 Lomba Programming",
  "🥇 Medali Emas Olimpiade Sains",
  "🏅 Best Paper Award Konferensi",
];

const AchievementModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  isLoading,
  editMode,
  year,
  setYear,
  text,
  setText,
  name,
  setName,
  errors,
  showPreview,
  setShowPreview,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Fokus ke textarea saat modal terbuka
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 relative animate-modal-in max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-xl transition-all"
          aria-label="Tutup modal"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
            <Award className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {editMode ? "Edit Prestasi" : "Tambah Prestasi Baru"}
            </h2>
            <p className="text-sm text-gray-500">
              {editMode
                ? "Perbarui informasi prestasi"
                : "Tambahkan pencapaian terbaru mahasiswa"}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Nama Mahasiswa */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nama Mahasiswa
            </label>
            <input
              type="text"
              placeholder="Contoh: Muhammad Fattahul Alim"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-3 border rounded-2xl text-sm shadow-sm focus:ring-2 focus:ring-emerald-400 outline-none transition-all ${
                errors.name
                  ? "border-red-300 focus:ring-red-400"
                  : "border-gray-200"
              }`}
            />
            {errors.name && (
              <div className="flex items-center gap-2 mt-2 text-red-600 text-xs">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.name}</span>
              </div>
            )}
          </div>

          {/* Tahun */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tahun Prestasi
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                placeholder="2024"
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                disabled={editMode}
                min="1900"
                max={new Date().getFullYear() + 10}
                className={`w-full pl-10 pr-4 py-3 border rounded-2xl text-sm shadow-sm focus:ring-2 focus:ring-emerald-400 outline-none transition-all ${
                  editMode ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                } ${
                  errors.year
                    ? "border-red-300 focus:ring-red-400"
                    : "border-gray-200"
                }`}
              />
            </div>
            {errors.year && (
              <div className="flex items-center gap-2 mt-2 text-red-600 text-xs">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.year}</span>
              </div>
            )}
          </div>

          {/* Deskripsi */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                Judul Prestasi / Juara
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  {showPreview ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
                <span className="text-xs text-gray-500">{text.length}/500</span>
              </div>
            </div>

            {showPreview && text ? (
              <div className="mb-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <p className="text-sm text-gray-700 font-medium">Preview:</p>
                <div className="flex items-center gap-2 mt-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">{text}</span>
                </div>
              </div>
            ) : null}

            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Contoh: 🏆 Juara 1 Hackathon Nasional"
              rows={4}
              maxLength={500}
              className={`w-full border rounded-2xl px-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-emerald-400 outline-none transition-all resize-none ${
                errors.text
                  ? "border-red-300 focus:ring-red-400"
                  : "border-gray-200"
              }`}
            />
            {errors.text && (
              <div className="flex items-center gap-2 mt-2 text-red-600 text-xs">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.text}</span>
              </div>
            )}

            {!editMode && text.length < 5 && (
              <div className="mt-3">
                <p className="text-xs text-gray-600 mb-2">Contoh prestasi:</p>
                <div className="flex flex-wrap gap-2">
                  {achievementSuggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setText(suggestion)}
                      className="text-xs bg-gray-100 hover:bg-emerald-100 text-gray-600 hover:text-emerald-700 px-3 py-1 rounded-full transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-2xl font-medium hover:bg-gray-50 transition-all"
          >
            Batal
          </button>
          <button
            onClick={onSave}
            disabled={isLoading || !text.trim()}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-2xl font-medium shadow-lg transition-all active:scale-95"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>{editMode ? "Update Prestasi" : "Simpan Prestasi"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AchievementModal;
