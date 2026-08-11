import { Flame as Fire, ChevronRight, TrendingUp, Users } from "lucide-react";
import TrendingListApi from "../components-global/trending-list-api";
import type { Post } from "../../services/posts";
import AdSense from "../common/AdSense";

interface NewsSidebarProps {
  categories: string[];
  editorsPicks: Post[];
  mostRead: Post[];
  onCategoryClick: (category: string) => void;
}

const NewsSidebar = ({
  categories,
  editorsPicks,
  mostRead,
  onCategoryClick,
}: NewsSidebarProps) => {
  return (
    <div className="space-y-5">
      {/* ─── Trending / Most Read ─────────────────────────────── */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800/60 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 dark:border-gray-800 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
            Paling Dibaca
          </h3>
        </div>
        <div className="p-2">
          <TrendingListApi
            items={mostRead.length > 0 ? mostRead : editorsPicks}
          />
        </div>
      </div>

      {/* ─── Hot Topics ───────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800/60 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 dark:border-gray-800 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
            <Fire className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
            Topik Hangat
          </h3>
        </div>

        <div className="p-2">
          {categories.length > 0 ? (
            <div className="divide-y divide-gray-50 dark:divide-gray-800/60">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => onCategoryClick(category)}
                  className="group w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-400 dark:text-gray-500 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors truncate">
                      {category}
                    </span>
                  </div>
                  <ChevronRight className="flex-shrink-0 w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all duration-200" />
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                <Fire className="w-5 h-5 text-gray-300 dark:text-gray-600" />
              </div>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Memuat topik hangat...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ─── Social Media ─────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800/60 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 dark:border-gray-800 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
            Ikuti Kami
          </h3>
        </div>

        <div className="p-4 grid grid-cols-2 gap-3">
          {[
            {
              name: "Facebook",
              handle: "@namasitus",
              color: "from-blue-600 to-blue-700",
              icon: (
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              ),
            },
            {
              name: "Twitter",
              handle: "@namasitus",
              color: "from-sky-500 to-sky-600",
              icon: (
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              ),
            },
            {
              name: "Instagram",
              handle: "@namasitus",
              color: "from-pink-500 to-rose-600",
              icon: (
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              ),
            },
            {
              name: "YouTube",
              handle: "@namasitus",
              color: "from-red-600 to-red-700",
              icon: (
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              ),
            },
          ].map((social, index) => (
            <a
              key={index}
              href="#"
              className="group relative overflow-hidden rounded-xl p-4 text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${social.color} opacity-90 group-hover:opacity-100 transition-opacity`}
              />
              <div className="relative z-10">
                <div className="mb-3 opacity-90 group-hover:opacity-100 transition-opacity">
                  {social.icon}
                </div>
                <p className="text-xs font-semibold">{social.name}</p>
                <p className="text-[10px] opacity-75 mt-0.5">{social.handle}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* ─── AdSense below Ikuti Kami ─────────────────────────── */}
      <AdSense className="mt-2" />
    </div>
  );
};

export default NewsSidebar;
