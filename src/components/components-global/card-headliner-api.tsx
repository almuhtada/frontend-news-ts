import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Post } from "../../services/posts";
import { PLACEHOLDER_IMAGE_LARGE, PLACEHOLDER_IMAGE_SMALL } from "../../config/constants";
import { getImageUrl } from "../../config/api";

interface CardHeadlinerApiProps {
  slides: Post[];
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 360 : -360, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -360 : 360, opacity: 0 }),
};

const CardHeadlinerApi = ({ slides }: CardHeadlinerApiProps) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const intervalRef = useRef<number | undefined>(undefined);
  const touchStartX = useRef(0);

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "Baru";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  useEffect(() => {
    if (slides.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, [slides.length]);

  const resetInterval = () => {
    clearInterval(intervalRef.current);
    if (slides.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
  };

  const goTo = (index: number) => {
    if (index === current) return;
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
    resetInterval();
  };

  const goNext = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
    resetInterval();
  };

  const goPrev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    resetInterval();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  if (!slides.length) {
    return (
      <div className="flex h-48 sm:h-64 items-center justify-center rounded-lg bg-gray-50 text-gray-500 text-sm">
        Tidak ada berita utama
      </div>
    );
  }

  const main = slides[0];
  const sideArticles = slides.slice(1, 5);
  const mainImageUrl = getImageUrl(main.featured_image) || PLACEHOLDER_IMAGE_LARGE;
  const mainCategory = main.categories?.[0]?.name || "Berita";
  const mainAuthor = main.author?.display_name || main.author?.username || "Redaksi";

  return (
    <div className="pb-8 border-b border-green-800/15 dark:border-green-700/20">
      {/* ========== MOBILE LAYOUT ========== */}
      <div className="md:hidden">
        {/* Carousel container */}
        <div
          className="relative overflow-hidden rounded-xl bg-gray-100 select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}
            >
              <Link
                to={`/detail-news/${slides[current].slug}`}
                className="relative block aspect-[16/9] overflow-hidden"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center scale-110"
                  style={{
                    backgroundImage: `url(${getImageUrl(slides[current].featured_image) || PLACEHOLDER_IMAGE_LARGE})`,
                    filter: "blur(24px)",
                  }}
                  aria-hidden="true"
                />
                <div className="absolute inset-0 bg-black/10" aria-hidden="true" />
                <img
                  src={getImageUrl(slides[current].featured_image) || PLACEHOLDER_IMAGE_LARGE}
                  alt={slides[current].title}
                  className="relative h-full w-full object-contain z-10"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE_LARGE;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-20" />
                <div className="absolute bottom-0 left-0 right-0 p-4 pb-5 z-30">
                  <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider drop-shadow-sm">
                    {slides[current].categories?.[0]?.name || "Berita"}
                  </span>
                  <h2 className="mt-1 text-base sm:text-lg font-bold text-white leading-tight line-clamp-2 drop-shadow-sm">
                    {slides[current].title}
                  </h2>
                  <div className="mt-1.5 text-xs text-gray-300 drop-shadow-sm">
                    {formatDateTime(slides[current].published_at || slides[current].createdAt)}
                  </div>
                </div>
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Nav arrows */}
          {slides.length > 1 && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-40 w-8 h-8 flex items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors backdrop-blur-sm"
                aria-label="Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={goNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-40 w-8 h-8 flex items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors backdrop-blur-sm"
                aria-label="Selanjutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Dots indicator */}
        {slides.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-6 bg-emerald-600"
                    : "w-2 bg-gray-300 dark:bg-gray-600"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Side articles section */}
        {sideArticles.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4">
              Berita Lainnya
            </h3>
            <div className="space-y-4">
              {sideArticles.map((article) => {
                const imageUrl = getImageUrl(article.featured_image) || PLACEHOLDER_IMAGE_SMALL;
                const category = article.categories?.[0]?.name || "Berita";
                return (
                  <Link
                    key={article.id}
                    to={`/detail-news/${article.slug}`}
                    className="group flex items-start gap-4"
                  >
                    <div className="relative w-[120px] aspect-[4/3] flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      <img
                        src={imageUrl}
                        alt={article.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE_SMALL;
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-450 uppercase tracking-wider">
                        {category}
                      </span>
                      <h3 className="mt-1 text-sm font-bold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {article.title}
                      </h3>
                      <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                        {formatDateTime(article.published_at || article.createdAt)}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ========== DESKTOP LAYOUT ========== */}
      <div className="hidden md:grid md:grid-cols-5 md:gap-8">
        {/* Main Article */}
        <Link
          to={`/detail-news/${main.slug}`}
          className="group block md:col-span-3"
        >
          <div className="flex flex-col gap-2 sm:gap-3">
            <div className="relative overflow-hidden rounded-lg bg-gray-100">
              <div
                className="absolute inset-0 bg-cover bg-center scale-110"
                style={{
                  backgroundImage: `url(${mainImageUrl})`,
                  filter: "blur(24px)",
                }}
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-white/10 dark:bg-black/20" aria-hidden="true" />
              <img
                src={mainImageUrl}
                alt={main.title}
                className="relative w-full max-h-96 object-contain z-10"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE_LARGE;
                }}
              />
            </div>
            <div className="pt-1 sm:pt-2">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-450 uppercase tracking-wider">
                {mainCategory}
              </span>
              <h2 className="mt-1.5 sm:mt-2 text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {main.title}
              </h2>
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 flex-wrap">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Oleh {mainAuthor}
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                <span>{formatDateTime(main.published_at || main.createdAt)}</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Side Articles */}
        {sideArticles.length > 0 && (
          <div className="hidden md:flex md:flex-col md:col-span-2 md:justify-between md:gap-5">
            {sideArticles.map((article, index) => {
              const imageUrl = getImageUrl(article.featured_image) || PLACEHOLDER_IMAGE_SMALL;
              const category = article.categories?.[0]?.name || "Berita";
              return (
                <Link
                  key={article.id}
                  to={`/detail-news/${article.slug}`}
                  className="group flex items-start gap-4 py-4 border-b border-green-800/10 dark:border-green-700/10 last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-450 uppercase tracking-wider">
                      {category}
                    </span>
                    <h3 className="mt-1 text-base font-bold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {article.title}
                    </h3>
                    <div className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
                      {formatDateTime(article.published_at || article.createdAt)}
                    </div>
                  </div>
                  <div className="relative w-28 sm:w-32 aspect-[4/3] flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={imageUrl}
                      alt={article.title}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE_SMALL;
                      }}
                    />
                    <span className="absolute top-2 left-2 w-6 h-6 flex items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white shadow">
                      {index + 2}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardHeadlinerApi;
