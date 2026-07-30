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
    <section className="mb-8 border-b border-green-800/10 dark:border-green-700/10 pb-3">
      {/* Category Links horizontal list */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {categories.map((category) => {
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
      </div>
    </section>
  );
};

export default CategoryFilter;
