import { Bell, CheckCircle2, RefreshCw } from "lucide-react";
import type { NotificationStats } from "./types";

interface NotificationHeaderProps {
  stats: NotificationStats;
  onMarkAllRead: () => void;
  onRefresh: () => void;
}

const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  stats,
  onMarkAllRead,
  onRefresh,
}) => {
  return (
    <header className="mb-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Icon + Title */}
        <div className="flex items-center gap-4">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 shadow-sm">
            <Bell className="h-6 w-6" />
            {stats.pending > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-emerald-600 px-1.5 text-[10px] font-bold text-white">
                {stats.pending}
              </span>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Pusat Notifikasi
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Kelola dan pantau aktivitas sistem
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onMarkAllRead}
            className="
              inline-flex items-center gap-2
              rounded-full border border-gray-200
              bg-white px-4 py-2.5
              text-sm font-semibold text-gray-700
              shadow-sm transition
              hover:bg-gray-50
            "
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Tandai semua
          </button>

          <button
            onClick={onRefresh}
            className="
              inline-flex items-center gap-2
              rounded-full bg-emerald-600
              px-4 py-2.5
              text-sm font-semibold text-white
              shadow-sm transition
              hover:bg-emerald-500
            "
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>
    </header>
  );
};

export default NotificationHeader;
