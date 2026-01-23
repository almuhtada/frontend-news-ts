import React from "react";
import ArtikelTerbaruCard from "./card-artikel-terbaru";
import type { ArtikelTerbaru } from "./card-artikel-terbaru";

interface Props {
  title?: string;
  items: ArtikelTerbaru[];
  showLoadMore?: boolean;
}

const ArtikelTerbaruList: React.FC<Props> = ({
  title = "Artikel Terbaru",
  items,
  showLoadMore = true,
}) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-extrabold text-gray-900 border-l-4 border-emerald-700 pl-3">
          {title}
        </h2>
        <button className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition">
          Lihat Semua →
        </button>
      </div>

      <div className="space-y-5">
        {items.map((artikel) => (
          <ArtikelTerbaruCard key={artikel.id} artikel={artikel} />
        ))}
      </div>

      {showLoadMore && (
        <div className="text-center mt-10">
          <button className="flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2.5 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg mx-auto">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Muat Lebih Banyak
          </button>
        </div>
      )}
    </section>
  );
};

export default ArtikelTerbaruList;
