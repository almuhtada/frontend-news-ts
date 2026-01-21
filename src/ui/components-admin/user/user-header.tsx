import { Users, Plus } from "lucide-react";

interface UserHeaderProps {
  onAddClick: () => void;
}

const UserHeader: React.FC<UserHeaderProps> = ({ onAddClick }) => {
  return (
    <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 flex items-center gap-3 mb-2">
          <div className="p-2 bg-emerald-100 rounded-xl">
            <Users className="w-8 h-8 text-emerald-600" />
          </div>
          Manajemen User
        </h1>
        <p className="text-slate-600 text-base">
          Kelola semua pengguna dalam sistem dengan mudah dan efisien
        </p>
      </div>
      <button
        type="button"
        onClick={onAddClick}
        className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
      >
        <Plus className="w-5 h-5" />
        Tambah User
      </button>
    </div>
  );
};

export default UserHeader;
