import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import type { Post } from "../../services/posts";
import { PLACEHOLDER_IMAGE_MEDIUM } from "../../config/constants";
import { getImageUrl } from "../../config/api";

interface CategoryNewsBlocksProps {
  articles: Post[];
  isLoading: boolean;
}

const CategoryNewsBlocks = ({ articles, isLoading }: CategoryNewsBlocksProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-8 my-6">
        {[1, 2].map((i) => (
          <div key={i} className="h-48 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!articles || articles.length === 0) return null;

  // Kelompokkan artikel berdasarkan nama/slug kategori
  const categoryMap = new Map<string, { name: string; slug: string; posts: Post[] }>();

  articles.forEach((post) => {
    if (post.categories && post.categories.length > 0) {
      post.categories.forEach((cat) => {
        if (!categoryMap.has(cat.slug)) {
          categoryMap.set(cat.slug, {
            name: cat.name,
            slug: cat.slug,
            posts: [],
          });
        }
        const group = categoryMap.get(cat.slug)!;
        if (!group.posts.some((p) => p.id === post.id)) {
          group.posts.push(post);
        }
      });
    }
  });

  const categoryBlocks = Array.from(categoryMap.values()).filter(
    (group) => group.posts.length > 0
  );

  if (categoryBlocks.length === 0) return null;

  return (
    <div className="space-y-10 my-8 w-full">
      {categoryBlocks.map((block) => (
        <section
          key={block.slug}
          className="w-full pt-5 border-t border-gray-200 dark:border-gray-800"
        >
          {/* Header Kategori */}
          <div className="flex items-center justify-between pb-3 mb-5 border-b border-gray-100 dark:border-gray-800 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-[#00531b] rounded-full" />
              <h3 className="text-xl font-bold font-headline text-gray-900 dark:text-gray-100">
                {block.name}
              </h3>
            </div>

            <Link
              to={`/category/${block.slug}`}
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#00531b] dark:text-emerald-400 hover:underline"
            >
              <span>Lihat Semua {block.name}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Grid Berita Kategori (Gambar di Kiri, Teks di Kanan) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
            {block.posts.slice(0, 3).map((article) => (
              <Link
                key={article.id}
                to={`/detail-news/${article.slug}`}
                className="group flex gap-3.5 items-start p-2.5 rounded-xl border border-gray-100 dark:border-gray-800/80 hover:border-[#00531b] dark:hover:border-emerald-500/40 hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-all duration-200"
              >
                {/* Gambar Thumbnail di Kiri */}
                <div className="relative w-24 h-20 sm:w-28 sm:h-22 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                  <img
                    src={getImageUrl(article.featured_image) || PLACEHOLDER_IMAGE_MEDIUM}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Teks Berita di Kanan */}
                <div className="flex flex-col justify-between min-w-0 flex-1 h-full py-0.5">
                  <div>
                    <span className="text-[11px] font-bold text-[#00531b] dark:text-emerald-400 uppercase tracking-wider block mb-1">
                      {block.name}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-[#00531b] dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500 mt-2 font-medium">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span>{formatDate(article.createdAt)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default CategoryNewsBlocks;