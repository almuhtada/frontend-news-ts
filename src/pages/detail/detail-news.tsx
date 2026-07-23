import { useMemo, useCallback } from "react";
import { useDetailData } from "../../hooks/useDetailData";
import PublicPageLayout from "../../components/layouts/PublicPageLayout";
import SEO from "../../components/common/SEO";
import { getImageUrl } from "../../config/api"; // pastikan helper getImageUrl terimport

import ArticleHeader from "../../components/detail/ArticleHeader";
import AuthorInfo from "../../components/detail/AuthorInfo";
import FeaturedImage from "../../components/detail/FeaturedImage";
import SocialShare from "../../components/detail/SocialShare";
import ArticleContent from "../../components/detail/ArticleContent";
import Pagination from "../../components/detail/Pagination";
import RelatedPosts from "../../components/detail/RelatedPosts";
import ArticleTags from "../../components/detail/ArticleTags";

import formatEveryFourSentences from "../../utils/formatParagraph";
import ArticleLike from "../../components/detail/ArticleLike";
import ArticleComments from "../../components/detail/ArticleComments";

// Harus sama dengan PARAGRAPHS_PER_PAGE di ArticleContent.tsx
const PARAGRAPHS_PER_PAGE = 3;

const DetailNews = () => {
  const {
    post,
    relatedPosts,
    loading,
    error,
    showAuthors,
    setShowAuthors,
    currentPage,
    setCurrentPage,
    words,
  } = useDetailData();

  // Format konten berita: 1 paragraf = 5 kalimat
  const formattedParagraphs = useMemo(() => {
    if (!post?.content) return [];
    return formatEveryFourSentences(post.content);
  }, [post?.content]);

  // Hitung total halaman berdasarkan jumlah paragraf
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(formattedParagraphs.length / PARAGRAPHS_PER_PAGE));
  }, [formattedParagraphs]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage, totalPages, setCurrentPage]);

  // Loading state
  if (loading) {
    return (
      <PublicPageLayout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">Memuat artikel...</p>
          </div>
        </div>
      </PublicPageLayout>
    );
  }

  // Error / not found state
  if (error || !post) {
    return (
      <PublicPageLayout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Artikel Tidak Ditemukan
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {error || "Artikel yang Anda cari tidak tersedia."}
            </p>
          </div>
        </div>
      </PublicPageLayout>
    );
  }

  return (
    <PublicPageLayout>
      <SEO
        title={post.title}
        description={post.excerpt || post.content ? post.content.replace(/<[^>]*>/g, "").slice(0, 160) : ""}
        image={getImageUrl(post.featured_image)}
        url={`https://almuhtada.org/detail-news/${post.slug}`}
        type="article"
      />
      <div
        className="min-h-screen bg-gray-50 dark:bg-gray-950"
        style={{
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-8 bg-white dark:bg-gray-900">
          {/* Header + Like */}
          <div className="flex flex-col md:flex-row md:items-start gap-4">
            <div className="flex-1 min-w-0">
              <ArticleHeader post={post} />
            </div>
            <ArticleLike postId={post.id} />
          </div>

          {/* Author */}
          <AuthorInfo
            post={post}
            showAuthors={showAuthors}
            setShowAuthors={setShowAuthors}
          />

          {/* Featured Image */}
          <FeaturedImage post={post} />

          {/* Social Share */}
          <SocialShare />

          {/* Konten Artikel (berbasis paragraf, 3 per halaman) */}
          <ArticleContent
            currentPage={currentPage}
            totalPages={totalPages}
            words={words}
            paragraphs={formattedParagraphs}
            excerpt={post.excerpt}
            onNextPage={handleNextPage}
          />

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />

          {/* Related Posts */}
          <RelatedPosts posts={relatedPosts} />

          {/* Tags */}
          <ArticleTags post={post} />

          {/* Komentar */}
          <ArticleComments postId={post.id} />
        </div>
      </div>
    </PublicPageLayout>
  );
};

export default DetailNews;
