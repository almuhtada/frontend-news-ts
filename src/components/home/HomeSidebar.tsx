import { Flame as Fire, ChevronRight, Users, TrendingUp } from "lucide-react";
import TrendingListApi from "../components-global/trending-list-api";
import { useSettings } from "../../hooks/useSettings";
import type { Post } from "../../services/posts";
import type { HotTopic } from "../../types";
import AdSense from "../common/AdSense";

interface HomeSidebarProps {
  trendingNews: Post[];
  hotTopics: HotTopic[];
  isLoading: boolean;
}

const HomeSidebar = ({
  trendingNews,
  hotTopics,
  isLoading,
}: HomeSidebarProps) => {
  const { settings } = useSettings();

  const socialLinks = [
    {
      name: "Facebook",
      url: settings.facebook,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: "Twitter",
      url: settings.twitter,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      url: settings.instagram,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      url: settings.youtube,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
  ].filter((s) => s.url);

  return (
    <div className="space-y-8">
      {/* ─── Trending Section ─────────────────────────────────── */}
      <div className="border-b border-gray-100 dark:border-gray-800/30 pb-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-450" />
          <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
            Terpopuler
          </h3>
        </div>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <TrendingListApi items={trendingNews} />
        )}
      </div>

      {/* ─── Hot Topics (Topik Hangat) ───────────────────────── */}
      <div className="border-b border-gray-100 dark:border-gray-800/30 pb-6">
        <div className="flex items-center gap-2 mb-4">
          <Fire className="w-4 h-4 text-emerald-600 dark:text-emerald-450" />
          <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
            Topik Hangat
          </h3>
        </div>

        {hotTopics.length > 0 ? (
          <div className="divide-y divide-gray-100/60 dark:divide-gray-800/30">
            {hotTopics.map((topic, index) => (
              <a
                key={index}
                href={`/category/${topic.slug}`}
                className="group flex items-center justify-between py-3 text-left"
              >
                <div className="flex items-baseline min-w-0">
                  <span className="flex-shrink-0 text-sm font-extrabold text-emerald-600 dark:text-emerald-450 mr-3">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                      {topic.name}
                    </h4>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                      {topic.post_count} artikel
                    </p>
                  </div>
                </div>
                <ChevronRight className="flex-shrink-0 w-3.5 h-3.5 text-gray-300 dark:text-gray-600 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all duration-200" />
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Memuat topik hangat...
            </p>
          </div>
        )}
      </div>

      {/* ─── Social Links (Minimalist Monochromatic) ─────────── */}
      {socialLinks.length > 0 && (
        <div className="pb-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-450" />
            <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
              Ikuti Kami
            </h3>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-emerald-600 dark:text-gray-500 dark:hover:text-emerald-400 transition-colors p-1"
                aria-label={`Ikuti kami di ${social.name}`}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ─── AdSense below Ikuti Kami ─────────────────────────── */}
      <AdSense className="mt-6" />
    </div>
  );
};

export default HomeSidebar;
