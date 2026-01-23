import { FileText } from "lucide-react";

const AboutHeader: React.FC = () => {
  return (
    <header className="mb-6">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 shadow-sm">
          <FileText className="h-6 w-6" />
        </div>

        {/* Text */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Edit Tentang Pesantren
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Kelola konten halaman Tentang Pesantren
          </p>
        </div>
      </div>
    </header>
  );
};

export default AboutHeader;
