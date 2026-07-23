import DOMPurify from "dompurify";
import { Clock, BookOpen, FileText, ChevronDown, Maximize2 } from "lucide-react";

interface ArticleContentProps {
  currentPage: number;
  totalPages: number;
  words: string[];
  paragraphs: string[];
  excerpt?: string;
  onNextPage?: () => void;
  showAll?: boolean;
  onShowAll?: () => void;
}

const PARAGRAPHS_PER_PAGE = 3;

const LATIN_LABEL_REGEX = /^latin\s*:/i;
const ARTI_LABEL_REGEX = /^artinya\s*:/i;

const isArabicLine = (line: string): boolean => {
  if (!line.trim()) return false;
  const chars = line.replace(/\s/g, "");
  if (chars.length === 0) return false;
  let arabicCount = 0;
  for (const ch of chars) {
    if (/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(ch)) arabicCount++;
  }
  return arabicCount / chars.length > 0.6;
};

const AYAT_MARKERS = /ayat|Q\.?\s*S\.?|qs|al[- ]?qur.?an/i;
const HADITS_MARKERS = /hadits|hadis|hadist|H\.?\s*R\.?|hr/i;

type ArabicContext = 'quran' | 'hadith' | null;

const detectArabicContext = (lines: string[], currentIndex: number): ArabicContext => {
  for (let j = currentIndex - 1; j >= 0 && j >= currentIndex - 5; j--) {
    const prev = lines[j].toLowerCase();
    if (AYAT_MARKERS.test(prev)) return 'quran';
    if (HADITS_MARKERS.test(prev)) return 'hadith';
  }
  return null;
};

const cleanText = (text: string) => {
  const cleaned = text
    .replace(/\[irp[^\]]*\]/gi, "")
    .replace(/\[[a-zA-Z0-9_-]+[^\]]*\]/g, "")
    .replace(
      /<strong[^>]*>\s*<a[^>]*>almuhtada\.org<\/a>[^<]*<\/strong>\s*-?\s*/gi,
      "",
    )
    .replace(/<a[^>]*>almuhtada\.org<\/a>\s*-?\s*/gi, "")
    .replace(/<strong[^>]*>almuhtada\.org[^<]*<\/strong>\s*-?\s*/gi, "")
    .replace(/^almuhtada\.org\s*-\s*/gim, "")
    .replace(/&lt;strong&gt;.*?almuhtada\.org.*?&lt;\/strong&gt;\s*-?\s*/gi, "")
    .replace(/&lt;a[^&]*&gt;almuhtada\.org&lt;\/a&gt;\s*-?\s*/gi, "");

  return cleaned.trim();
};

const ArticleContent = ({
  currentPage,
  totalPages,
  words,
  paragraphs,
  excerpt,
  onNextPage,
  showAll,
  onShowAll,
}: ArticleContentProps) => {
  const startIndex = (currentPage - 1) * PARAGRAPHS_PER_PAGE;
  const readTime = Math.max(1, Math.ceil(words.length / 200));

  const visibleParagraphs = showAll
    ? paragraphs
    : paragraphs.slice(startIndex, startIndex + PARAGRAPHS_PER_PAGE);

  const rawLines = visibleParagraphs
    .join("\n")
    .split(/\n+/)
    .map(cleanText)
    .filter(Boolean);

  const blocks: string[] = [];
  let isFirstParagraph = true;
  let lastContext: ArabicContext = null;

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    const next = rawLines[i + 1];
    const next2 = rawLines[i + 2];

    if (
      isArabicLine(line) &&
      next &&
      LATIN_LABEL_REGEX.test(next) &&
      next2 &&
      ARTI_LABEL_REGEX.test(next2)
    ) {
      blocks.push(`
        <div class="doa-card">
          <div class="doa-ornament"></div>
          <div class="doa-arab" dir="rtl">${line}</div>
          <div class="doa-divider"></div>
          <div class="doa-latin">${next}</div>
          <div class="doa-arti">${next2}</div>
        </div>
      `);
      i += 2;
      lastContext = null;
      continue;
    }

    if (isArabicLine(line) && !LATIN_LABEL_REGEX.test(line)) {
      const context = detectArabicContext(rawLines, i);
      lastContext = context;
      blocks.push(`
        <div class="arabic-inline-block" dir="rtl">
          ${line}
        </div>
      `);
      continue;
    }

    if (line.startsWith("\u2022 ")) {
      lastContext = null;
      blocks.push(`<div class="list-item bullet-item">${line}</div>`);
      continue;
    }

    if (/^\d+[.)]\s/.test(line)) {
      lastContext = null;
      blocks.push(`<div class="list-item numbered-item">${line}</div>`);
      continue;
    }

    if (lastContext) {
      lastContext = null;
      blocks.push(`<p class="article-paragraph explanation-text" style="border-left: 3px solid #10b981; padding-left: 1rem; margin: 0.75rem 0;">${line}</p>`);
      continue;
    }

    const showFirstParagraph = (currentPage === 1 || showAll) && isFirstParagraph;
    const pClass = showFirstParagraph
      ? "article-paragraph first-paragraph"
      : "article-paragraph";

    if (showFirstParagraph) {
      blocks.push(
        `<p class="${pClass}"><strong><a href="https://almuhtada.org" target="_blank" rel="noopener noreferrer" class="source-link">almuhtada.org</a></strong> - ${line}</p>`
      );
      isFirstParagraph = false;
    } else {
      blocks.push(`<p class="${pClass}">${line}</p>`);
    }
  }

  return (
    <>
      <div className="mt-8 mb-6 flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-full font-medium">
          <Clock className="w-3.5 h-3.5" />
          {readTime} menit baca
        </div>
        {!showAll && totalPages > 1 && (
          <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-full font-medium">
            <BookOpen className="w-3.5 h-3.5" />
            Halaman {currentPage}/{totalPages}
          </div>
        )}
        <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-full font-medium">
          <FileText className="w-3.5 h-3.5" />
          {words.length} kata
        </div>
        {!showAll && totalPages > 1 && onShowAll && (
          <button
            onClick={onShowAll}
            className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-full font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            Tampilkan Semua
          </button>
        )}
      </div>

      {excerpt && (currentPage === 1 || showAll) && (
        <div className="mb-8 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">Ringkasan</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-[0.95rem]">{excerpt}</p>
        </div>
      )}

      <div className="w-16 h-1 bg-emerald-600 rounded-full mb-8" />

      <div
        className="article-body"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(blocks.join(""), {
            ADD_ATTR: ["dir"],
          }),
        }}
      />

      {!showAll && currentPage < totalPages && onNextPage && (
        <div className="mt-10 relative">
          <div className="absolute -top-20 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent dark:from-gray-900 pointer-events-none" />
          <div className="flex flex-col items-center gap-3 py-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Halaman {currentPage} dari {totalPages}
            </p>
            <button
              onClick={onNextPage}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-full transition-all"
            >
              Lanjutkan Membaca
              <ChevronDown className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      )}

      <style>{`
        .article-body {
          max-width: 720px;
          font-size: 1.125rem;
          color: #1a1a1a;
        }
        .dark .article-body {
          color: #e5e7eb;
        }

        .article-paragraph {
          margin: 1.75rem 0;
          line-height: 1.9;
          letter-spacing: 0.01em;
          text-align: justify;
          text-align-last: left;
        }

        .first-paragraph::first-letter {
          float: left;
          font-size: 3.5rem;
          font-weight: 700;
          line-height: 1;
          margin-right: 0.5rem;
          margin-top: 0.1rem;
          color: #065f46;
        }
        .dark .first-paragraph::first-letter {
          color: #34d399;
        }

        .source-link {
          color: #065f46;
          text-decoration: none;
          font-weight: 700;
        }
        .dark .source-link {
          color: #34d399;
        }
        .source-link:hover {
          text-decoration: underline;
        }

        .list-item {
          margin: 0.5rem 0;
          margin-left: 1.75rem;
          line-height: 1.85;
          list-style: none;
          font-size: 1.125rem;
          color: #1a1a1a;
          position: relative;
        }
        .dark .list-item {
          color: #e5e7eb;
        }

        .bullet-item {
          padding-left: 0.25rem;
        }

        .numbered-item {
          padding-left: 0.25rem;
        }

        .doa-card {
          margin: 2.5rem 0;
          padding: 2rem 1.75rem;
          border-radius: 1rem;
          background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdf4 100%);
          border: 1px solid #d1fae5;
          position: relative;
          overflow: hidden;
        }
        .dark .doa-card {
          background: linear-gradient(135deg, #064e3b 0%, #065f46 50%, #064e3b 100%);
          border-color: #065f46;
        }

        .doa-ornament {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #059669, #10b981, #059669);
          border-radius: 1rem 1rem 0 0;
        }

        .doa-arab {
          font-family: "Amiri", "Cairo", "Noto Naskh Arabic", serif;
          font-size: 1.6rem;
          font-weight: 600;
          line-height: 2.6;
          text-align: right;
          margin-bottom: 1rem;
          color: #064e3b;
          padding: 0.5rem 0;
        }
        .dark .doa-arab {
          color: #6ee7b7;
        }

        .doa-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #a7f3d0, transparent);
          margin: 0.75rem 0;
        }

        .doa-latin {
          font-style: italic;
          margin-bottom: 0.75rem;
          color: #374151;
          line-height: 1.8;
          font-size: 1rem;
        }
        .dark .doa-latin {
          color: #d1d5db;
        }

        .doa-arti {
          font-size: 0.95rem;
          color: #6b7280;
          line-height: 1.7;
          padding-left: 1rem;
          border-left: 3px solid #10b981;
        }
        .dark .doa-arti {
          color: #9ca3af;
        }

        .arabic-inline-block {
          margin: 2rem 0;
          padding: 1.25rem 1.5rem;
          font-family: "Amiri", "Cairo", "Noto Naskh Arabic", serif;
          font-size: 1.4rem;
          text-align: right;
          color: #064e3b;
          line-height: 2.4;
          background: #f0fdf4;
          border-radius: 0.75rem;
          border-right: 4px solid #10b981;
          position: relative;
        }
        .dark .arabic-inline-block {
          color: #6ee7b7;
          background: #064e3b;
          border-right-color: #34d399;
        }
      `}</style>
    </>
  );
};

export default ArticleContent;
