import { Link } from "react-router-dom";

type TrendingItem = {
  id: string | number;
  title: string;
  views: number;
  img: string;
};

type TrendingListProps = {
  items: TrendingItem[];
};

const TrendingList = ({ items }: TrendingListProps) => (
  <div className="space-y-6">
    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 border-b-2 border-emerald-600 pb-1">
      Terpopuler
    </h3>

    {items.map((item, index) => (
      <Link
        key={item.id}
        to={`/detail-news`}
        className="group block cursor-pointer"
      >
        {index === 0 ? (
          <div className="relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700/60 transition">
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-3.5">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition">
                {item.title}
              </h4>
              <div className="flex items-center justify-between mt-2 text-gray-400 text-xs">
                <span>{item.views} VIEWS</span>
                <span className="text-xs font-bold text-emerald-300 dark:text-emerald-600">
                  #{String(index + 1).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 text-gray-600 dark:text-gray-400 mt-3 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition">
            <span className="flex-shrink-0 w-6 text-center text-xs font-bold text-emerald-500 dark:text-emerald-500 mt-0.5">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium line-clamp-2">{item.title}</p>
              <span className="text-xs text-gray-400 mt-0.5">{item.views} VIEWS</span>
            </div>
          </div>
        )}
      </Link>
    ))}
  </div>
);

export default TrendingList;
