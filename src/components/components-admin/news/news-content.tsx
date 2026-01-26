import NewsGridCard from "../grid-card";
import NewsTable from "../table-news";
import type { Article, ArticleDisplay } from "./types";

interface NewsContentProps {
  articles: Article[];
  viewMode: "grid" | "list";
  onEdit: (article: ArticleDisplay) => void;
  onDelete: (id: number) => void;
}

// Utility functions
const getCategoryColor = (categoryName: string) => {
  const colors: Record<string, string> = {
    Teknologi: "bg-blue-100 text-blue-700",
    Pendidikan: "bg-green-100 text-green-700",
    Penelitian: "bg-purple-100 text-purple-700",
    Pengumuman: "bg-orange-100 text-orange-700",
    Kegiatan: "bg-pink-100 text-pink-700",
    Prestasi: "bg-yellow-100 text-yellow-700",
  };
  return colors[categoryName] || "bg-gray-100 text-gray-700";
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const stripHtmlAndClean = (html: string): string => {
  // Hapus semua HTML tags
  let text = html.replace(/<[^>]+>/g, "");
  // Decode HTML entities
  text = text.replace(/&nbsp;/g, " ");
  text = text.replace(/&amp;/g, "&");
  text = text.replace(/&lt;/g, "<");
  text = text.replace(/&gt;/g, ">");
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");
  // Hapus lagi jika ada HTML setelah decode
  text = text.replace(/<[^>]+>/g, "");
  // Hapus prefix almuhtada.org
  text = text.replace(/almuhtada\.org\s*-?\s*/gi, "");
  // Normalize whitespace
  text = text.replace(/\s+/g, " ").trim();
  return text;
};

const truncateText = (text: string, maxLength: number) => {
  const cleanText = stripHtmlAndClean(text);
  return cleanText.length > maxLength
    ? cleanText.substring(0, maxLength) + "..."
    : cleanText;
};

const mapToDisplayArticle = (article: Article): ArticleDisplay => ({
  ...article,
  category: article.categories?.[0]?.name || "Uncategorized",
  image: article.featured_image || "",
  author: article.author?.username || "Unknown",
  categoryId: article.categories?.[0]?.id?.toString() || "",
});

const NewsContent: React.FC<NewsContentProps> = ({
  articles,
  viewMode,
  onEdit,
  onDelete,
}) => {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Tidak ada artikel ditemukan</p>
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {articles.map((article) => {
          const displayArticle = mapToDisplayArticle(article);
          return (
            <NewsGridCard
              key={article.id}
              article={displayArticle}
              onEdit={() => onEdit(displayArticle)}
              onDelete={onDelete}
              getCategoryColor={getCategoryColor}
              formatDate={formatDate}
              truncateText={truncateText}
            />
          );
        })}
      </div>
    );
  }

  return (
    <NewsTable
      articles={articles.map((article) => {
        const displayArticle = mapToDisplayArticle(article);
        return {
          id: displayArticle.id,
          title: displayArticle.title,
          category: displayArticle.category,
          content: displayArticle.content,
          image: displayArticle.image,
          author: displayArticle.author,
          createdAt: new Date(displayArticle.createdAt),
          status: displayArticle.status,
          featured: displayArticle.is_featured,
        };
      })}
      onEdit={(tableArticle) => {
        const article = articles.find((item) => item.id === tableArticle.id);
        if (article) {
          onEdit(mapToDisplayArticle(article));
        }
      }}
      onDelete={onDelete}
    />
  );
};

export default NewsContent;
