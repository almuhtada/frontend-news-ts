import { Link } from "react-router-dom";

type TrendingItem = {
  id: string | number;
  title: string;
  views: number; // bisa pakai "0 SHARES"
  img: string;
};

type TrendingListProps = {
  items: TrendingItem[];
};

const TrendingList = ({ items }: TrendingListProps) => (
  <div className="space-y-6">
    <h3 className="text-lg font-bold text-gray-900 mb-4 border-b-2 border-red-500 pb-1">
      Terpopuler
    </h3>

    {items.map((item, index) => (
      <Link
        key={item.id}
        to={`/detail-news`}
        className="group block cursor-pointer"
      >
        {index === 0 ? (
          // Item pertama dengan gambar besar
          <div className="relative bg-white rounded-lg overflow-hidden hover:shadow-lg transition">
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h4 className="text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-red-600 transition">
                {item.title}
              </h4>
              <div className="flex items-center justify-between mt-2 text-gray-400 text-xs">
                <span>{item.views} SHARES</span>
                <span className="text-2xl font-bold text-gray-300">01</span>
              </div>
            </div>
          </div>
        ) : (
          // Item lain tanpa gambar
          <div className="flex items-center justify-between text-gray-600 mt-3 hover:text-red-600 transition">
            <span className="flex items-center space-x-2">
              <span className="text-gray-400 font-bold">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-sm font-medium">{item.title}</span>
            </span>
            <span className="text-gray-400 text-xs">{item.views} SHARES</span>
          </div>
        )}
      </Link>
    ))}
  </div>
);

export default TrendingList;
