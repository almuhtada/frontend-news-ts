import { Save, Loader, Upload, X } from "lucide-react";
import type { AboutSection, SectionFormData } from "./types";

interface AboutSectionCardProps {
  section: AboutSection;
  formData: SectionFormData;
  imagePreview: string | null;
  saving: boolean;
  uploading: boolean;
  onInputChange: (
    field: "title" | "content" | "image_url",
    value: string,
  ) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  onSave: () => void;
}

const AboutSectionCard: React.FC<AboutSectionCardProps> = ({
  section,
  formData,
  imagePreview,
  saving,
  uploading,
  onInputChange,
  onImageChange,
  onRemoveImage,
  onSave,
}) => {
  const isFounderSection =
    section.section_key === "founder_ustadz" ||
    section.section_key === "founder_ustadzah";

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {section.section_key.replace(/_/g, " ").toUpperCase()}
        </h2>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Judul
          </label>
          <input
            type="text"
            value={formData?.title || ""}
            onChange={(e) => onInputChange("title", e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none"
            placeholder="Masukkan judul..."
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Konten
          </label>
          <textarea
            value={formData?.content || ""}
            onChange={(e) => onInputChange("content", e.target.value)}
            rows={6}
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none resize-none"
            placeholder="Masukkan konten..."
          />
          {section.section_key === "mission" && (
            <p className="text-xs text-gray-500 mt-1">
              Format: ["Item 1", "Item 2", "Item 3"]
            </p>
          )}
        </div>

        {/* Image Upload (for founders) */}
        {isFounderSection && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Foto Pendiri
            </label>

            {/* Image Preview */}
            {imagePreview && (
              <div className="relative mb-4 inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-2xl border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={onRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Upload Button */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-2xl cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">
                  {imagePreview ? "Ganti Gambar" : "Upload Gambar"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onImageChange}
                  className="hidden"
                />
              </label>
              {uploading && (
                <Loader className="w-4 h-4 animate-spin text-green-600" />
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Format: JPG, PNG, GIF. Maksimal 5MB
            </p>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Simpan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutSectionCard;
