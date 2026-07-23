import { Flame as Fire, ChevronRight } from "lucide-react";
import TrendingListApi from "../components-global/trending-list-api";
import { useSettings } from "../../hooks/useSettings";
import type { Post, Category } from "../../services/posts";

interface CategorySidebarProps {
  trendingNews: Post[];
  categories: Category[];
}

const CategorySidebar = ({
  trendingNews,
  categories,
}: CategorySidebarProps) => {
  const { settings } = useSettings();

  const socialLinks = [
    { name: "Facebook", url: settings.facebook, color: "bg-blue-600" },
    { name: "Twitter", url: settings.twitter, color: "bg-sky-500" },
    { name: "Instagram", url: settings.instagram, color: "bg-pink-500" },
    { name: "YouTube", url: settings.youtube, color: "bg-red-600" },
  ].filter((s) => s.url);

  return (
    <aside className="lg:col-span-1 space-y-8">
      {/* Trending Section */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4">
          <TrendingListApi items={trendingNews} />
        </div>
      </div>

      {/* Hot Topics */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-green-700 rounded-xl flex items-center justify-center transition hover:scale-105">
            <Fire className="w-4 h-4 text-white" />
          </div>

          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Topik Hangat</h3>
        </div>

        <div className="space-y-4">
          {categories.length > 0 ? (
            categories.map((category) => (
              <a
                key={category.id}
                href={`/category/${category.slug}`}
                className="group flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-green-600 transition-colors">
                    {category.name}
                  </h4>
                  {/* <p className="text-sm text-gray-500">
                    {category.post_count || 0} artikel
                  </p> */}
                </div>
                <div className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" />
                </div>
              </a>
            ))
          ) : (
            <div className="text-center text-gray-400 text-sm py-4">
              Memuat topik hangat...
            </div>
          )}
        </div>
      </div>

      {socialLinks.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Ikuti Kami</h3>
          <div className="grid grid-cols-2 gap-3">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center"
              >
                <div
                  className={`${social.color} text-white p-3 rounded-2xl mb-2 hover:scale-105 transition-transform cursor-pointer`}
                >
                  <span className="font-semibold text-sm">{social.name}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};

export default CategorySidebar;
