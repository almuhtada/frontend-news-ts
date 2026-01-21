import { Bell, Clock, CheckCircle2, XCircle, Zap } from "lucide-react";
import type { NotificationStats } from "./types";

interface NotificationStatsCardsProps {
  stats: NotificationStats;
}

const NotificationStatsCards: React.FC<NotificationStatsCardsProps> = ({
  stats,
}) => {
  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {/* Total */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500">Total</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {stats.total}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
            <Bell className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Pending */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500">Menunggu</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {stats.pending}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
            <Clock className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Approved */}
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm transition hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-emerald-700">Disetujui</p>
            <p className="mt-1 text-2xl font-bold text-emerald-800">
              {stats.approved}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Rejected */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500">Ditolak</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {stats.rejected}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
            <XCircle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* High Priority */}
      <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5 shadow-sm transition hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-amber-700">
              Prioritas Tinggi
            </p>
            <p className="mt-1 text-2xl font-bold text-amber-800">
              {stats.highPriority}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <Zap className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationStatsCards;
