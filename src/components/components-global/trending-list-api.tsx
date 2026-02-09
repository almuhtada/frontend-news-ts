import { Link } from "react-router-dom";
import type { Post } from "../../services/posts";
import { PLACEHOLDER_IMAGE_SMALL } from "../../config/constants";
import { getImageUrl } from "../../config/api";

type TrendingListApiProps = {
  items: Post[];
};

const TrendingListApi = ({ items }: TrendingListApiProps) => {
  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 border-b-2 border-emerald-600 pb-1">
          Terpopuler
        </h3>
        <p className="text-gray-500 text-sm">No trending articles available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 border-b-2 border-emerald-600 pb-1">
        Terpopuler
      </h3>

      {items.slice(0, 5).map((item, index) => {
        const imageUrl = getImageUrl(item.featured_image) || PLACEHOLDER_IMAGE_SMALL;
        const views = item.view_count || 0;

        return (
          <Link
            key={item.id}
            to={`/detail-news/${item.slug}`}
            className="group block cursor-pointer"
          >
            {index === 0 ? (
              /* Item pertama dengan gambar */
              <div className="relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition">
                <img
                  src={imageUrl}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = PLACEHOLDER_IMAGE_SMALL;
                  }}
                />
                <div className="p-4">
                  <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-emerald-700 transition">
                    {item.title}
                  </h4>
                  <div className="flex items-center justify-between mt-2 text-gray-400 text-xs">
                    <span>{views} VIEWS</span>
                    <span className="text-2xl font-bold text-emerald-200">
                      01
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Item lain tanpa gambar */
              <div className="flex items-center justify-between text-gray-600 dark:text-gray-400 mt-3 hover:text-emerald-700 transition">
                <span className="flex items-center space-x-2">
                  <span className="text-emerald-600 font-bold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-medium line-clamp-1">
                    {item.title}
                  </span>
                </span>
                <span className="text-gray-400 text-xs whitespace-nowrap ml-2">
                  {views} VIEWS
                </span>
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default TrendingListApi;
