import {
  Trash2,
  Pencil,
  NotebookPen,
  Users,
  MoreHorizontal,
  Sparkles,
  Crown,
  Medal,
  Star,
  Trophy,
  BookOpen,
  Target,
  type LucideIcon,
} from "lucide-react";
import type { Achievement } from "./types";

interface PrestasiContentProps {
  achievements: Achievement[];
  totalCount: number;
  viewMode: "grid" | "list";
  onEdit: (achievement: Achievement) => void;
  onDelete: (id: number) => void;
  onAddFirst: () => void;
}

// Utility functions
const getAchievementIcon = (title: string): LucideIcon => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("juara 1") || lowerTitle.includes("emas"))
    return Crown;
  if (lowerTitle.includes("juara") || lowerTitle.includes("medali"))
    return Medal;
  if (lowerTitle.includes("terbaik") || lowerTitle.includes("best"))
    return Star;
  if (lowerTitle.includes("lomba") || lowerTitle.includes("kompetisi"))
    return Trophy;
  if (lowerTitle.includes("penelitian") || lowerTitle.includes("paper"))
    return BookOpen;
  return Target;
};

const getAchievementColor = (title: string): string => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("juara 1") || lowerTitle.includes("emas"))
    return "from-yellow-400 to-orange-500";
  if (lowerTitle.includes("juara 2") || lowerTitle.includes("silver"))
    return "from-gray-400 to-gray-600";
  if (lowerTitle.includes("juara 3") || lowerTitle.includes("bronze"))
    return "from-orange-400 to-orange-600";
  if (lowerTitle.includes("nasional")) return "from-red-400 to-pink-600";
  if (lowerTitle.includes("internasional"))
    return "from-purple-400 to-indigo-600";
  return "from-emerald-400 to-teal-600";
};

// Empty state component
const EmptyState: React.FC<{ isEmpty: boolean; onAddFirst: () => void }> = ({
  isEmpty,
  onAddFirst,
}) => (
  <div className="bg-white rounded-3xl p-16 text-center shadow-lg">
    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
      <NotebookPen className="w-10 h-10 text-gray-400" />
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">
      {isEmpty ? "Belum Ada Prestasi" : "Tidak Ada Hasil"}
    </h3>
    <p className="text-gray-600 mb-6">
      {isEmpty
        ? "Mulai tambahkan prestasi mahasiswa untuk melacak pencapaian mereka"
        : "Coba ubah filter atau kata kunci pencarian"}
    </p>
    {isEmpty && (
      <button
        onClick={onAddFirst}
        className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-2xl font-medium hover:shadow-lg transition-all"
      >
        Tambah Prestasi Pertama
      </button>
    )}
  </div>
);

// Grid card component
const AchievementCard: React.FC<{
  achievement: Achievement;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ achievement, onEdit, onDelete }) => {
  const IconComponent = getAchievementIcon(achievement.title);
  const gradientColor = getAchievementColor(achievement.title);

  return (
    <div className="group bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 bg-gradient-to-br ${gradientColor} rounded-2xl flex items-center justify-center shadow-lg`}
        >
          <IconComponent className="w-6 h-6 text-white" />
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            aria-label="Edit Prestasi"
            onClick={onEdit}
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Hapus Prestasi"
            onClick={onDelete}
            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold text-gray-800 text-lg mb-2 leading-tight">
          {achievement.title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span className="font-medium">{achievement.name}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-gray-700">
              {achievement.years}
            </span>
          </div>
          <Sparkles className="w-4 h-4 text-yellow-500" />
        </div>
        <button
          type="button"
          aria-label="Lihat detail prestasi"
          className="text-gray-400 hover:text-gray-600 p-1"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// List row component
const AchievementRow: React.FC<{
  achievement: Achievement;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ achievement, onEdit, onDelete }) => {
  const IconComponent = getAchievementIcon(achievement.title);
  const gradientColor = getAchievementColor(achievement.title);

  return (
    <div className="group px-6 py-4 hover:bg-gray-50 transition-colors">
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-6 flex items-center gap-4">
          <div
            className={`w-10 h-10 bg-gradient-to-br ${gradientColor} rounded-xl flex items-center justify-center shadow-md flex-shrink-0`}
          >
            <IconComponent className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-sm leading-tight">
              {achievement.title}
            </h3>
          </div>
        </div>

        <div className="col-span-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
              {achievement.name.charAt(0)}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {achievement.name}
            </span>
          </div>
        </div>

        <div className="col-span-2">
          <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
            {achievement.years}
          </span>
        </div>

        <div className="col-span-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            aria-label="Edit Prestasi"
            type="button"
            onClick={onEdit}
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            aria-label="Hapus Prestasi"
            type="button"
            onClick={onDelete}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const PrestasiContent: React.FC<PrestasiContentProps> = ({
  achievements,
  totalCount,
  viewMode,
  onEdit,
  onDelete,
  onAddFirst,
}) => {
  if (achievements.length === 0) {
    return <EmptyState isEmpty={totalCount === 0} onAddFirst={onAddFirst} />;
  }

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {achievements.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            onEdit={() => onEdit(achievement)}
            onDelete={() => onDelete(achievement.id)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
        <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
          <div className="col-span-6">Prestasi</div>
          <div className="col-span-3">Mahasiswa</div>
          <div className="col-span-2">Tahun</div>
          <div className="col-span-1">Aksi</div>
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {achievements.map((achievement) => (
          <AchievementRow
            key={achievement.id}
            achievement={achievement}
            onEdit={() => onEdit(achievement)}
            onDelete={() => onDelete(achievement.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default PrestasiContent;
