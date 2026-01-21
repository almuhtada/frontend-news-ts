import React from "react";
import { Flame as Fire, ChevronRight } from "lucide-react";

interface Props {
  title: string;
  items: string[];
  onItemClick?: (item: string) => void;
}

const SidebarSection: React.FC<Props> = ({ title, items, onItemClick }) => {
  return (
    <aside className="rounded-3xl shadow-lg border border-gray-100 p-6 bg-white">
      {/* Header */}
      <div className="mb-6 flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 shadow">
          <Fire className="h-4 w-4 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      </div>

      {/* Items */}
      <div className="space-y-3">
        {items.length > 0 ? (
          items.map((item, idx) => (
            <div
              key={idx}
              onClick={() => onItemClick?.(item)}
              className="
                group flex items-center justify-between
                rounded-2xl p-3
                cursor-pointer
                transition-all
                hover:bg-gray-50
              "
            >
              <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-600 transition-colors line-clamp-1">
                {item}
              </span>

              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
            </div>
          ))
        ) : (
          <div className="py-4 text-center text-sm text-gray-400">
            Tidak ada data
          </div>
        )}
      </div>
    </aside>
  );
};

export default SidebarSection;
