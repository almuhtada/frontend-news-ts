import { Link } from "react-router-dom";
import type { Post } from "../../services/posts";
import { PLACEHOLDER_IMAGE_SMALL } from "../../config/constants";
import { getImageUrl } from "../../config/api";

type TrendingListApiProps = {
  items: Post[];
};

const TrendingListApi = ({ items }: TrendingListApiProps) => {
  const uniqueItems = items.filter(
    (item, index, self) => index === self.findIndex((t) => t.id === item.id)
  );

  if (uniqueItems.length === 0) {
    return (
      <div className="space-y-4">
        <p className="text-gray-450 dark:text-gray-500 text-sm">Belum ada berita terpopuler</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100 dark:divide-gray-800/80">
      {uniqueItems.slice(0, 5).map((item, index) => {
        const imageUrl = getImageUrl(item.featured_image) || PLACEHOLDER_IMAGE_SMALL;
        const views = item.views ?? item.view_count ?? 0;

        return (
          <Link
            key={item.id}
            to={`/detail-news/${item.slug}`}
            className="group block cursor-pointer py-4 first:pt-0 last:pb-0"
          >
            {index === 0 ? (
              /* Item pertama dengan gambar */
              <div className="space-y-3">
                <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
                  <img
                    src={imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = PLACEHOLDER_IMAGE_SMALL;
                    }}
                  />
                  <span className="absolute top-2 left-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white shadow">
                    01
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    TERPOPULER
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 mt-1 line-clamp-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-2 text-gray-400 text-xs">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    <span>{views} views</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Item lain tanpa gambar */
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 text-gray-400 text-[10px]">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    <span>{views} views</span>
                  </div>
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
