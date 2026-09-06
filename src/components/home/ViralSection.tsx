import { Link } from "react-router-dom";
import type { Post } from "../../services/posts";
import { PLACEHOLDER_IMAGE_MEDIUM } from "../../config/constants";
import { getImageUrl } from "../../config/api";

interface ViralSectionProps {
  articles: Post[];
  isLoading: boolean;
}

const ViralSection = ({ articles, isLoading }: ViralSectionProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getExcerpt = (content?: string, excerpt?: string, maxLength = 130) => {
    if (excerpt) return excerpt;
    if (!content) return "";
    const plainText = content.replace(/<[^>]*>/g, "");
    return plainText.length > maxLength
      ? plainText.substring(0, maxLength) + "..."
      : plainText;
  };

  if (isLoading) {
    return (
      <div className="my-8 lg:my-10 w-full space-y-6">
        <div className="h-7 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!articles || articles.length === 0) return null;

  const topStory = articles[0];
  const quickBites = articles.slice(1, 4);
  const features = articles.slice(4, 7);

  return (
    <section className="my-8 lg:my-10 w-full">
      {/* Header Section (Primary Hijau Al-Muhtada) */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <span className="w-1.5 h-6 rounded-full bg-[#00531b] flex-shrink-0" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Berita Viral & Populer
          </h2>
        </div>
        <p className="text-gray-500 dark:text-gray-400 ml-4.5 text-xs sm:text-sm">
          Update informasi paling populer dan hangat untuk Anda
        </p>
      </div>

      <div className="space-y-6">
        {/* Main Hero Story (Top Story - Gambar Kiri, Teks Kanan) */}
        {topStory && (
          <article className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-lg shadow-sm overflow-hidden flex flex-col md:flex-row min-w-0">
            <div className="w-full md:w-1/2 aspect-video md:aspect-auto md:h-auto overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img
                src={getImageUrl(topStory.featured_image) || PLACEHOLDER_IMAGE_MEDIUM}
                alt={topStory.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5 sm:p-6 flex-1 min-w-0 flex flex-col justify-center">
              <div className="text-xs text-[#00531b] dark:text-emerald-400 font-extrabold uppercase tracking-wider">
                {topStory.categories && topStory.categories.length > 0
                  ? topStory.categories[0].name
                  : "VIRAL STORY"}
              </div>
              <h3 className="mt-2 text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                <Link
                  to={`/detail-news/${topStory.slug}`}
                  className="hover:text-[#00531b] dark:hover:text-emerald-400 transition-colors"
                >
                  {topStory.title}
                </Link>
              </h3>
              <p className="mt-3 text-gray-600 dark:text-gray-300 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                {getExcerpt(topStory.content, topStory.excerpt)}
              </p>
              <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 font-medium">
                <span>By {topStory.author?.display_name || topStory.author?.username || "Admin"}</span>
                <span>•</span>
                <span>{formatDate(topStory.createdAt)}</span>
              </div>
            </div>
          </article>
        )}

        {/* Row 1: Quick Bites (3 Kolom) */}
        {quickBites.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-gray-200/80 dark:border-gray-800/80 pb-6">
            {quickBites.map((story) => (
              <div key={story.id} className="flex flex-col justify-between py-1">
                <div>
                  <span className="text-[10px] font-bold text-[#00531b] dark:text-emerald-400 uppercase tracking-wider">
                    {story.categories && story.categories.length > 0
                      ? story.categories[0].name
                      : "VIRAL BITE"}
                  </span>
                  <h4 className="font-bold text-sm sm:text-base text-gray-900 dark:text-gray-100 mt-1.5 leading-snug">
                    <Link
                      to={`/detail-news/${story.slug}`}
                      className="hover:text-[#00531b] dark:hover:text-emerald-400 transition-colors"
                    >
                      {story.title}
                    </Link>
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed line-clamp-3">
                    {getExcerpt(story.content, story.excerpt, 100)}
                  </p>
                </div>
                <Link
                  to={`/detail-news/${story.slug}`}
                  className="text-xs font-semibold text-[#00531b] dark:text-emerald-400 mt-4 hover:underline"
                >
                  Baca selengkapnya →
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Row 2: Features (3 Kolom) */}
        {features.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-gray-200/80 dark:border-gray-800/80 pb-6">
            {features.map((story) => (
              <div key={story.id} className="flex flex-col justify-between py-1">
                <div>
                  <span className="text-[10px] font-bold text-[#00531b] dark:text-emerald-400 uppercase tracking-wider">
                    {story.categories && story.categories.length > 0
                      ? story.categories[0].name
                      : "POPULER"}
                  </span>
                  <h4 className="font-bold text-sm sm:text-base text-gray-900 dark:text-gray-100 mt-1.5 leading-snug">
                    <Link
                      to={`/detail-news/${story.slug}`}
                      className="hover:text-[#00531b] dark:hover:text-emerald-400 transition-colors"
                    >
                      {story.title}
                    </Link>
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed line-clamp-3">
                    {getExcerpt(story.content, story.excerpt, 100)}
                  </p>
                </div>
                <Link
                  to={`/detail-news/${story.slug}`}
                  className="text-xs font-semibold text-[#00531b] dark:text-emerald-400 mt-4 hover:underline"
                >
                  Baca selengkapnya →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ViralSection;
