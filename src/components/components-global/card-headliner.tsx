import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface Slide {
  id: string | number;
  img: string;
  title: string;
  category: string;
  summary: string;
  author: string;
  date: string;
  readTime: string;
}

interface CardHeadlinerProps {
  slides: Slide[];
}

const CardHeadliner = ({ slides }: CardHeadlinerProps) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="relative rounded-xl overflow-hidden shadow-lg h-80 md:h-96 group">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            index === current ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        >
          <img
            src={slide.img}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <span className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded mb-3">
              {slide.category}
            </span>
            <h1 className="text-white text-xl md:text-3xl font-bold mb-3 leading-tight">
              {slide.title}
            </h1>
            <p className="text-gray-200 text-sm mb-3 line-clamp-2">
              {slide.summary}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-gray-300 text-xs">
                By {slide.author} • {slide.date} • {slide.readTime}
              </p>
              <Link
                to={`/detail-news`}
                className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-xs hover:bg-white/30 transition-colors"
              >
                Baca Selengkapnya
              </Link>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-4 right-4 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === current ? "bg-white" : "bg-white/50"
            }`}
            title={`Go to slide ${index + 1}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default CardHeadliner;
