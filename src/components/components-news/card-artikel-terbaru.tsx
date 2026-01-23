import React from "react";

export type ArtikelTerbaru = {
  id: number;
  title: string;
  author: string;
  date: string;
  comments: number;
  excerpt: string;
  image: string;
  number: string;
};

interface Props {
  artikel: ArtikelTerbaru;
}

const ArtikelTerbaruCard: React.FC<Props> = ({ artikel }) => {
  return (
    <div className="flex gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:-translate-y-1">
      {/* Gambar */}
      <div className="relative flex-shrink-0">
        <img
          src={artikel.image}
          alt={artikel.title}
          className="w-28 h-24 md:w-36 md:h-28 object-cover rounded-lg"
        />
        <div className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
          {artikel.number}
        </div>
      </div>

      {/* Konten */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 text-base leading-snug mb-2 hover:text-emerald-700 cursor-pointer line-clamp-2 transition-colors">
          {artikel.title}
        </h3>

        <div className="flex items-center text-xs text-gray-500 mb-2 gap-3 flex-wrap">
          <span className="text-emerald-700 font-medium">
            BY {artikel.author}
          </span>
          <span>{artikel.date}</span>
          <span className="text-blue-600">{artikel.comments} komentar</span>
        </div>

        <p className="text-gray-600 text-xs md:text-sm leading-relaxed line-clamp-3">
          {artikel.excerpt}
        </p>
      </div>
    </div>
  );
};

export default ArtikelTerbaruCard;
