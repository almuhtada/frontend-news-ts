import { Plus, Newspaper } from "lucide-react";

interface NewsHeaderProps {
  onAddClick: () => void;
}

const NewsHeader: React.FC<NewsHeaderProps> = ({ onAddClick }) => {
  return (
    <header className="mb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Title */}
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 shadow-sm">
            <Newspaper className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Manajemen Berita
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Kelola dan pantau semua artikel dan berita
            </p>
          </div>
        </div>

        {/* Right: Action */}
        <button
          aria-label="Tambah artikel baru"
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
          Tambah Artikel
        </button>
      </div>
    </header>
  );
};

export default NewsHeader;
