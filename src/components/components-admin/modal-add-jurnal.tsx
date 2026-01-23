import { useState, useEffect, useRef } from "react";
import {
  X,
  BookOpen,
  Users,
  Calendar,
  Library,
  Link2,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  FileText,
} from "lucide-react";

type Publication = {
  title: string;
  authors: string;
  year: number;
  journal: string;
  link: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  form: Publication;
  setForm: (form: Publication) => void;
  onSave: () => void;
  editMode: boolean;
  isLoading?: boolean;
};

type ValidationErrors = {
  title?: string;
  authors?: string;
  year?: string;
  journal?: string;
  link?: string;
};

const PublicationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  form,
  setForm,
  onSave,
  editMode,
  isLoading = false,
}) => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showPreview, setShowPreview] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Focus pada input pertama saat modal terbuka
  useEffect(() => {
    if (isOpen && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  // Validasi form
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Judul publikasi tidak boleh kosong";
    } else if (form.title.trim().length < 10) {
      newErrors.title = "Judul minimal 10 karakter";
    }

    if (!form.authors.trim()) {
      newErrors.authors = "Nama penulis tidak boleh kosong";
    } else if (form.authors.trim().length < 3) {
      newErrors.authors = "Nama penulis minimal 3 karakter";
    }

    const currentYear = new Date().getFullYear();
    if (form.year < 1900 || form.year > currentYear + 2) {
      newErrors.year = `Tahun harus antara 1900 dan ${currentYear + 2}`;
    }

    if (!form.journal.trim()) {
      newErrors.journal = "Nama jurnal tidak boleh kosong";
    } else if (form.journal.trim().length < 5) {
      newErrors.journal = "Nama jurnal minimal 5 karakter";
    }

    if (!form.link.trim()) {
      newErrors.link = "Link publikasi tidak boleh kosong";
    } else if (!isValidUrl(form.link)) {
      newErrors.link = "Format URL tidak valid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setErrors({});
      setShowPreview(false);
    }, 200);
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave();
    }
  };

  const handleInputChange = (
    field: keyof Publication,
    value: string | number
  ) => {
    setForm({ ...form, [field]: value });
    // Clear error saat user mengetik
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Suggestions untuk journal
  const journalSuggestions = [
    "Journal of Computer Science",
    "International Journal of Technology",
    "Jurnal Teknologi Informasi",
    "IEEE Transactions",
    "Nature",
    "Science",
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4 backdrop-blur-sm">
      <div
        ref={modalRef}
        className={`bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 relative transform transition-all duration-200 ${
          isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        } max-h-[90vh] overflow-y-auto`}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-xl transition-all"
          aria-label="Tutup modal"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {editMode ? "Edit Publikasi" : "Tambah Publikasi Baru"}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {editMode
                ? "Perbarui informasi publikasi"
                : "Tambahkan karya ilmiah terbaru"}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Judul */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Judul Publikasi
            </label>
            <div className="relative">
              <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={titleInputRef}
                type="text"
                value={form.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className={`w-full pl-12 pr-4 py-4 border rounded-2xl text-sm shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all ${
                  errors.title
                    ? "border-red-300 focus:ring-red-400"
                    : "border-gray-200"
                }`}
                placeholder="Contoh: Implementasi Machine Learning untuk Prediksi..."
                maxLength={200}
              />
            </div>
            {errors.title && (
              <div className="flex items-center gap-2 mt-2 text-red-600 text-xs">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.title}</span>
              </div>
            )}
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">Minimal 10 karakter</span>
              <span className="text-xs text-gray-500">
                {form.title.length}/200
              </span>
            </div>
          </div>

          {/* Penulis */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Penulis
            </label>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={form.authors}
                onChange={(e) => handleInputChange("authors", e.target.value)}
                className={`w-full pl-12 pr-4 py-4 border rounded-2xl text-sm shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all ${
                  errors.authors
                    ? "border-red-300 focus:ring-red-400"
                    : "border-gray-200"
                }`}
                placeholder="Contoh: Dr. Ahmad Wijaya, Prof. Sarah Johnson"
                maxLength={150}
              />
            </div>
            {errors.authors && (
              <div className="flex items-center gap-2 mt-2 text-red-600 text-xs">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.authors}</span>
              </div>
            )}
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">
                Pisahkan dengan koma jika lebih dari satu
              </span>
              <span className="text-xs text-gray-500">
                {form.authors.length}/150
              </span>
            </div>
          </div>

          {/* Tahun dan Jurnal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tahun */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tahun Publikasi
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={form.year}
                  onChange={(e) =>
                    handleInputChange("year", Number(e.target.value))
                  }
                  className={`w-full pl-12 pr-4 py-4 border rounded-2xl text-sm shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all ${
                    errors.year
                      ? "border-red-300 focus:ring-red-400"
                      : "border-gray-200"
                  }`}
                  placeholder="2024"
                  min="1900"
                  max={new Date().getFullYear() + 2}
                />
              </div>
              {errors.year && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-xs">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.year}</span>
                </div>
              )}
            </div>

            {/* Nama Jurnal */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Jurnal
              </label>
              <div className="relative">
                <Library className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={form.journal}
                  onChange={(e) => handleInputChange("journal", e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 border rounded-2xl text-sm shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all ${
                    errors.journal
                      ? "border-red-300 focus:ring-red-400"
                      : "border-gray-200"
                  }`}
                  placeholder="Contoh: IEEE Transactions on Software Engineering"
                  maxLength={100}
                  list="journal-suggestions"
                />
                <datalist id="journal-suggestions">
                  {journalSuggestions.map((suggestion, index) => (
                    <option key={index} value={suggestion} />
                  ))}
                </datalist>
              </div>
              {errors.journal && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-xs">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.journal}</span>
                </div>
              )}
            </div>
          </div>

          {/* Link */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Link Publikasi
            </label>
            <div className="relative">
              <Link2 className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="url"
                value={form.link}
                onChange={(e) => handleInputChange("link", e.target.value)}
                className={`w-full pl-12 pr-4 py-4 border rounded-2xl text-sm shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all ${
                  errors.link
                    ? "border-red-300 focus:ring-red-400"
                    : "border-gray-200"
                }`}
                placeholder="https://doi.org/10.1000/example atau https://journal.example.com"
              />
            </div>
            {errors.link && (
              <div className="flex items-center gap-2 mt-2 text-red-600 text-xs">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.link}</span>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Masukkan URL lengkap termasuk https://
            </p>
          </div>

          {/* Preview Section */}
          {(form.title || form.authors || form.journal) && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Preview Publikasi
                </label>
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
              </div>

              {showPreview && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-800 text-sm leading-tight mb-2">
                        {form.title || "Judul publikasi akan muncul di sini"}
                      </h3>
                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex items-center gap-2">
                          <Users className="w-3 h-3" />
                          <span>{form.authors || "Nama penulis"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Library className="w-3 h-3" />
                          <span>{form.journal || "Nama jurnal"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          <span>{form.year}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-8">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-6 py-4 border border-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-all"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-6 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:transform-none"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>
                  {editMode ? "Update Publikasi" : "Simpan Publikasi"}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Form Progress Indicator */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Progress form:</span>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[
                  form.title,
                  form.authors,
                  form.year,
                  form.journal,
                  form.link,
                ].map((field, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      field && String(field).trim()
                        ? "bg-blue-500"
                        : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2">
                {
                  [
                    form.title,
                    form.authors,
                    form.year,
                    form.journal,
                    form.link,
                  ].filter((field) => field && String(field).trim()).length
                }
                /5
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicationModal;
