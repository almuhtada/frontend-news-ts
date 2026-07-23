import { Link } from "react-router-dom";
import type { Post } from "../../services/posts";
import { PLACEHOLDER_IMAGE_SMALL } from "../../config/constants";
import { getImageUrl } from "../../config/api";

type TrendingListApiProps = {
  items: Post[];
};

const TrendingListApi = ({ items }: TrendingListApiProps) => {
  const uniqueItems = items.filter(
    (item, index, self) => index === self.findIndex((t) => t.id === item.id),
  );

  if (uniqueItems.length === 0) {
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
      {uniqueItems.slice(0, 5).map((item, index) => {
        const imageUrl = getImageUrl(item.featured_image) || PLACEHOLDER_IMAGE_SMALL;
        const views = item.views ?? item.view_count ?? 0;

        return (
          <Link
            key={item.id}
            to={`/detail-news/${item.slug}`}
            className="group block cursor-pointer"
          >
            {index === 0 ? (
              /* Item pertama dengan gambar */
              <div className="relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700/60 transition">
                <img
                  src={imageUrl}
                  alt={item.title}
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = PLACEHOLDER_IMAGE_SMALL;
                  }}
                />
                <div className="p-3.5">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition">
                    {item.title}
                  </h4>
                  <div className="flex items-center justify-between mt-2 text-gray-400 text-xs">
                    <span className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      {views}
                    </span>
                    <span className="text-xs font-bold text-emerald-300 dark:text-emerald-600">
                      #{String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Item lain tanpa gambar */
              <div className="flex items-start gap-3 text-gray-600 dark:text-gray-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition">
                <span className="flex-shrink-0 w-6 text-center text-xs font-bold text-emerald-500 dark:text-emerald-500 mt-0.5">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium line-clamp-2">{item.title}</p>
                  <span className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    {views}
                  </span>
                </div>
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default TrendingListApi;
