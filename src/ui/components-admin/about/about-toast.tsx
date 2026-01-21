import { CheckCircle, AlertCircle } from "lucide-react";

interface AboutToastProps {
  showSuccess: boolean;
  showError: boolean;
}

const AboutToast: React.FC<AboutToastProps> = ({ showSuccess, showError }) => {
  if (showSuccess) {
    return (
      <div className="fixed top-6 right-6 z-50 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 shadow-lg animate-slide-in-right">
        <CheckCircle className="h-6 w-6 text-emerald-600" />
        <div>
          <p className="text-sm font-semibold text-emerald-800">Berhasil</p>
          <p className="text-xs text-emerald-700">Konten berhasil disimpan</p>
        </div>
      </div>
    );
  }

  if (showError) {
    return (
      <div className="fixed top-6 right-6 z-50 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 shadow-lg animate-slide-in-right">
        <AlertCircle className="h-6 w-6 text-amber-600" />
        <div>
          <p className="text-sm font-semibold text-amber-800">
            Gagal menyimpan
          </p>
          <p className="text-xs text-amber-700">
            Terjadi kesalahan, silakan coba lagi
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default AboutToast;
