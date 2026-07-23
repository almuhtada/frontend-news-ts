import { LayoutGrid } from "lucide-react";

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
  return (
    <section className="mb-8 lg:mb-10">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800/60 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <LayoutGrid className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
              Filter Kategori
            </h3>
          </div>
        </div>

        {/* Category Chips */}
        <div className="p-4 sm:p-5">
          <div className="flex flex-wrap gap-2.5">
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isActive = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  className={`
                    relative flex items-center gap-2 px-4 py-2.5 rounded-xl
                    text-sm font-medium
                    transition-all duration-300 ease-out
                    focus:outline-none focus:ring-2 focus:ring-emerald-500/30
                    ${
                      isActive
                        ? `
                          bg-emerald-600 text-white
                          shadow-md shadow-emerald-500/25
                          hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/30
                        `
                        : `
                          bg-gray-50 dark:bg-gray-800/60
                          text-gray-600 dark:text-gray-400
                          border border-transparent
                          hover:bg-gray-100 dark:hover:bg-gray-700/60
                          hover:border-gray-200 dark:hover:border-gray-700
                          hover:text-gray-900 dark:hover:text-gray-200
                        `
                    }
                  `}
                >
                  {/* Active indicator dot */}
                  {isActive && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-white dark:border-gray-900" />
                  )}

                  <IconComponent
                    className={`w-4 h-4 transition-colors duration-200 ${
                      isActive
                        ? "text-white"
                        : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600"
                    }`}
                  />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryFilter;
