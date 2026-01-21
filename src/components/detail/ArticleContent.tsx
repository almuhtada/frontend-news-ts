import DOMPurify from "dompurify";

interface ArticleContentProps {
  currentPage: number;
  totalPages: number;
  words: string[];
  paragraphs: string[];
}

const PARAGRAPHS_PER_PAGE = 3;

const ArticleContent = ({
  currentPage,
  totalPages,
  words,
  paragraphs,
}: ArticleContentProps) => {
  const startIndex = (currentPage - 1) * PARAGRAPHS_PER_PAGE;
  const pageHtml = paragraphs
    .slice(startIndex, startIndex + PARAGRAPHS_PER_PAGE)
    .map((text) => `<p>${text}</p>`)
    .join("");

  return (
    <>
      {/* Content Area */}
      <div className="mt-6 mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-gray-600 flex flex-wrap gap-x-4 gap-y-1">
        <span>
          Halaman {currentPage} dari {totalPages}
        </span>
        <span>⏱ {Math.ceil(words.length / 200)} menit baca</span>
      </div>

      {/* Konten Artikel */}
      <div className="mt-6 min-h-96">
        <div
          className="
                prose prose-lg max-w-none text-gray-800
                [&>p]:mb-5
                [&>p]:leading-[1.9]
                prose-strong:font-semibold
                prose-a:text-blue-600 prose-a:underline
                "
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(pageHtml),
          }}
        />
      </div>
    </>
  );
};

export default ArticleContent;
