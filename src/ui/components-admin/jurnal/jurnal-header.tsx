import { Plus, BookOpen } from "lucide-react";

interface JurnalHeaderProps {
  onAddClick: () => void;
}

const JurnalHeader: React.FC<JurnalHeaderProps> = ({ onAddClick }) => {
  return (
    <header className="mb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Title */}
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 shadow-sm">
            <BookOpen className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Publikasi Jurnal
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Kelola dan pantau publikasi ilmiah terkini
            </p>
          </div>
        </div>

        {/* Right: Action */}
        <button
          aria-label="Tambah publikasi baru"
          onClick={onAddClick}
          className="
            inline-flex items-center gap-2
            rounded-full bg-emerald-600
            px-5 py-2.5
            text-sm font-semibold text-white
            shadow-sm transition
            hover:bg-emerald-500
            active:scale-[0.98]
          "
        >
          <Plus className="h-4 w-4" />
          Tambah Publikasi
        </button>
      </div>
    </header>
  );
};

export default JurnalHeader;
