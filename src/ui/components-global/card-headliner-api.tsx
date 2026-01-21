import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import type { Post } from "../../services/posts";
import { PLACEHOLDER_IMAGE_LARGE } from "../../config/constants";

interface CardHeadlinerApiProps {
  slides: Post[];
}

const CardHeadlinerApi = ({ slides }: CardHeadlinerApiProps) => {
  const [current, setCurrent] = useState(0);

  /* =========================
     Auto slide
  ========================== */
  useEffect(() => {
    if (!slides.length) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  /* =========================
     Helpers
  ========================== */
  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "Baru";

    return (
      new Date(dateString).toLocaleString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jakarta",
      }) + " WIB"
    );
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    return `${Math.max(1, Math.ceil(words / wordsPerMinute))} menit baca`;
  };

  const getExcerpt = (content: string, maxLength = 160) =>
    content.length > maxLength ? content.slice(0, maxLength) + "…" : content;

  /* =========================
     Empty state
  ========================== */
  if (!slides.length) {
    return (
      <div className="flex h-80 md:h-[420px] items-center justify-center rounded-2xl bg-gray-100 text-gray-500">
        Tidak ada berita utama
      </div>
    );
  }

  /* =========================
     Render
  ========================== */
  return (
    <section className="relative h-80 md:h-[420px] overflow-hidden rounded-2xl shadow-sm">
      {slides.map((slide, index) => {
        const categoryName = slide.categories?.[0]?.name || "Berita";
        const authorName =
          slide.author?.display_name || slide.author?.username || "Redaksi";
        const imageUrl = slide.featured_image || PLACEHOLDER_IMAGE_LARGE;
        const summary = slide.excerpt || getExcerpt(slide.content);

        return (
          <Link
            key={slide.id}
            to={`/detail-news/${slide.slug}`}
            className={`absolute inset-0 block transition-all duration-700 ease-out ${
              index === current
                ? "opacity-100 scale-100 z-10"
                : "opacity-0 scale-105 z-0 pointer-events-none"
            }`}
          >
            {/* Image */}
            <img
              src={imageUrl}
              alt={slide.title}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE_LARGE;
              }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              {/* Category */}
              <span className="mb-3 inline-block rounded-full bg-emerald-600 px-4 py-1 text-xs font-semibold text-white shadow">
                {categoryName}
              </span>

              {/* Title */}
              <h1 className="mb-3 max-w-4xl text-xl md:text-3xl font-bold leading-tight text-white">
                {slide.title}
              </h1>

              {/* Excerpt */}
              <div
                className="mb-4 max-w-3xl text-sm text-white/80 line-clamp-2"
                dangerouslySetInnerHTML={{ __html: summary }}
              />

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-white/70">
                <span>Oleh {authorName}</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDateTime(slide.published_at || slide.createdAt)}
                </span>
                <span>{calculateReadTime(slide.content)}</span>
                <span className="opacity-80">• Klik untuk membaca</span>
              </div>
            </div>
          </Link>
        );
      })}

      {/* Dots */}
      <div className="absolute bottom-4 right-4 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              setCurrent(index);
            }}
            className={`h-2.5 w-2.5 rounded-full transition ${
              index === current ? "bg-white" : "bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default CardHeadlinerApi;
