import { useState } from "react";

interface CategoryFilterProps {
  categories: Array<{
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }>;
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const CategoryFilter = ({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) => {
  const [showAll, setShowAll] = useState(false);

  // Jika jumlah kategori > 5, batasi tampilan awal menjadi 5 item (termasuk "Semua" di awal)
  const limitCount = 5;
  const hasMore = categories.length > limitCount;
  const displayedCategories = showAll || !hasMore
    ? categories
    : categories.slice(0, limitCount);

  return (
    <section className="mb-8 border-b border-green-800/10 dark:border-green-700/10 pb-3">
      {/* Category Links horizontal list */}
      <div className="flex items-center flex-wrap gap-x-6 gap-y-3 pb-1 w-full min-w-0">
        {displayedCategories.map((category) => {
          const isActive = activeCategory === category.id;

          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`
                relative pb-2 text-xs sm:text-sm font-bold uppercase tracking-wider
                transition-all duration-200 ease-out border-b-2
                focus:outline-none
                ${
                  isActive
                    ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-450 hover:border-emerald-600/40"
                }
              `}
            >
              {category.label}
            </button>
          );
        })}

        {hasMore && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="pb-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 hover:underline focus:outline-none border-b-2 border-transparent"
          >
            {showAll ? "Sembunyikan" : "Lihat Semua"}
          </button>
        )}
      </div>
    </section>
  );
};

export default CategoryFilter;
