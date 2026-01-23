import type { LucideIcon } from "lucide-react";

interface Stat {
  label: string;
  value: string;
  note: string;
  icon: LucideIcon;
}

interface Props {
  stats: Stat[];
}

const StatsCards: React.FC<Props> = ({ stats }) => (
  <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
    {stats.map((item, i) => {
      const Icon = item.icon;

      return (
        <div
          key={i}
          className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-500">{item.label}</p>

            <div className="p-2 rounded-xl bg-emerald-50">
              <Icon className="w-5 h-5 text-emerald-600" />
            </div>
          </div>

          <p className="text-2xl font-bold text-gray-900">{item.value}</p>
          <p className="text-xs text-emerald-600 mt-1">{item.note}</p>
        </div>
      );
    })}
  </section>
);

export default StatsCards;
