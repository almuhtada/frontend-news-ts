import React from "react";
import { Link } from "react-router-dom";

type ArtikelPopulerItem = {
  title: string;
  desc: string;
  slug?: string; // Optional slug for routing
};

type ArtikelPopulerProps = {
  items: ArtikelPopulerItem[];
};

const ArtikelPopuler: React.FC<ArtikelPopulerProps> = ({ items }) => {
  return (
    <aside className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Artikel Populer</h2>
        <span className="text-xs text-gray-400">{items.length} artikel</span>
      </div>

      {/* LIST */}
      <ul className="space-y-3">
        {items.map((item, index) => {
          const content = (
            <>
              <h3 className="font-medium text-gray-800 group-hover:text-emerald-700 leading-snug">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {item.desc}
              </p>
            </>
          );

          return (
            <li key={index}>
              {item.slug ? (
                <Link
                  to={`/detail-news/${item.slug}`}
                  className="group block p-4 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50 transition cursor-pointer"
                >
                  {content}
                </Link>
              ) : (
                <div className="group p-4 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50 transition">
                  {content}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default ArtikelPopuler;
