import { X } from "lucide-react";
import type { UserFormData, Role } from "./types";

interface UserModalProps {
  isOpen: boolean;
  editMode: boolean;
  form: UserFormData;
  isLoading: boolean;
  onClose: () => void;
  onSave: () => void;
  onFormChange: (form: UserFormData) => void;
}

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  editMode,
  form,
  isLoading,
  onClose,
  onSave,
  onFormChange,
}) => {
  if (!isOpen) return null;

  const isFormValid = form.username.trim() && form.email.trim();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-all"
          aria-label="Tutup modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            {editMode ? "Edit User" : "Tambah User Baru"}
          </h2>
          <p className="text-slate-600">
            {editMode
              ? "Perbarui informasi user"
              : "Isi data user yang akan ditambahkan"}
          </p>
        </div>

        {/* Form */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => onFormChange({ ...form, username: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all placeholder-slate-400"
              placeholder="Masukkan username"
              disabled={editMode}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => onFormChange({ ...form, email: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all placeholder-slate-400"
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Password {editMode && <span className="text-slate-400 font-normal">(kosongkan jika tidak ingin mengubah)</span>}
            </label>
            <input
              type="password"
              value={form.password || ""}
              onChange={(e) => onFormChange({ ...form, password: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all placeholder-slate-400"
              placeholder={editMode ? "Masukkan password baru" : "Masukkan password"}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Role
            </label>
            <select
              aria-label="Pilih role user"
              value={form.role}
              onChange={(e) => onFormChange({ ...form, role: e.target.value as Role })}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all"
            >
              <option value="administrator">Administrator</option>
              <option value="editor">Editor</option>
              <option value="author">Author</option>
              <option value="contributor">Contributor</option>
              <option value="subscriber">Subscriber</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all duration-150"
          >
            Batal
          </button>
          <button
            onClick={onSave}
            disabled={!isFormValid || isLoading}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-slate-300 disabled:to-slate-300 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-150 active:scale-95 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {isLoading ? "Menyimpan..." : editMode ? "Update" : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
