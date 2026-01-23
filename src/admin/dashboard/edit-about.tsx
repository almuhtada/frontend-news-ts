import { Loader } from "lucide-react";
import Sidebar from "../../components/components-admin/sidebar";
import {
  AboutHeader,
  AboutSectionCard,
  AboutToast,
  useAboutPage,
} from "../../components/components-admin/about";

/**
 * Halaman Edit Tentang Pesantren
 * UI versi profesional, bersih, dan responsif
 */
const AdminAbout: React.FC = () => {
  const {
    sections,
    loading,
    saving,
    showSuccess,
    showError,
    uploading,
    formData,
    imagePreviews,

    handleInputChange,
    handleImageChange,
    removeImage,
    handleSave,
  } = useAboutPage();

  /* =========================
     Loading State
  ========================== */
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-green-100">
        <Sidebar />
        <main className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader className="h-8 w-8 animate-spin text-emerald-600" />
            <p className="text-sm text-gray-600">Memuat halaman pengaturan…</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-green-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Toast */}
      <AboutToast showSuccess={showSuccess} showError={showError} />

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10">
        {/* Page Container */}
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Header */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <AboutHeader />
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {sections.map((section) => (
              <div key={section.id} className="animate-slide-in-right">
                <AboutSectionCard
                  section={section}
                  formData={formData[section.section_key]}
                  imagePreview={imagePreviews[section.section_key] || null}
                  saving={saving}
                  uploading={uploading[section.section_key] || false}
                  onInputChange={(field, value) =>
                    handleInputChange(section.section_key, field, value)
                  }
                  onImageChange={(e) =>
                    handleImageChange(section.section_key, e)
                  }
                  onRemoveImage={() => removeImage(section.section_key)}
                  onSave={() => handleSave(section.section_key)}
                />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Animation */}
      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(24px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.35s ease-out both;
        }
      `}</style>
    </div>
  );
};

export default AdminAbout;
