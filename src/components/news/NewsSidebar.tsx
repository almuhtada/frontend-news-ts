import { Flame as Fire, ChevronRight } from "lucide-react";
import TrendingListApi from "../components-global/trending-list-api";
import type { Post } from "../../services/posts";

interface NewsSidebarProps {
  categories: string[];
  editorsPicks: Post[];
  mostRead: Post[];
  onCategoryClick: (category: string) => void;
}

const NewsSidebar = ({ categories, editorsPicks }: NewsSidebarProps) => {
  return (
    <aside className="lg:col-span-1 space-y-8">
      {/* Trending Section */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-4">
          <TrendingListApi items={editorsPicks} />
        </div>
      </div>

      {/* Hot Topics */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-green-700 rounded-xl flex items-center justify-center transition hover:scale-105 hover:shadow-md">
            <Fire className="w-4 h-4 text-white" />
          </div>

          <h3 className="text-lg font-bold text-gray-800">Topik Hangat</h3>
        </div>

        <div className="space-y-4">
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <div
                key={index}
                className="group flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 group-hover:text-green-600 transition-colors">
                    {category}
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 text-sm py-4">
              Memuat topik hangat...
            </div>
          )}
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Ikuti Kami</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: "Facebook", color: "bg-blue-600", followers: "12K" },
            { name: "Twitter", color: "bg-sky-500", followers: "8.5K" },
            { name: "Instagram", color: "bg-pink-500", followers: "15K" },
            { name: "YouTube", color: "bg-red-600", followers: "6.2K" },
          ].map((social, index) => (
            <div key={index} className="text-center">
              <div
                className={`${social.color} text-white p-3 rounded-2xl mb-2 hover:scale-105 transition-transform cursor-pointer`}
              >
                <span className="font-semibold text-sm">{social.name}</span>
              </div>
              <p className="text-xs text-gray-600">
                {social.followers} followers
              </p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default NewsSidebar;
