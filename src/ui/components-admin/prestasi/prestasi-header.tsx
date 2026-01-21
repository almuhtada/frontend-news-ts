import { Plus, Award } from "lucide-react";

interface PrestasiHeaderProps {
  onAddClick: () => void;
}

const PrestasiHeader: React.FC<PrestasiHeaderProps> = ({ onAddClick }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Award className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Prestasi Mahasantri
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Kelola dan pantau pencapaian mahasiswa terbaik
            </p>
          </div>
        </div>
        <button
          onClick={onAddClick}
          className="flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Tambah Prestasi
        </button>
      </div>
    </div>
  );
};

export default PrestasiHeader;
