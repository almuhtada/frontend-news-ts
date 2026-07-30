import DOMPurify from "dompurify";
import {
  Clock,
  BookOpen,
  FileText,
  ChevronDown,
  Maximize2,
} from "lucide-react";

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

type ArabicContext = "quran" | "hadith" | null;

const detectArabicContext = (
  lines: string[],
  currentIndex: number,
): ArabicContext => {
  for (let j = currentIndex - 1; j >= 0 && j >= currentIndex - 5; j--) {
    const prev = lines[j].toLowerCase();
    if (AYAT_MARKERS.test(prev)) return "quran";
    if (HADITS_MARKERS.test(prev)) return "hadith";
  }
  return null;
};

const cleanText = (text: string) => {
  const cleaned = text
    .replace(/\[irp[^\]]*\]/gi, "")
    .replace(
      /\[(?!\/?align-(?:center|right|justify)(?:-(?:h[1-6]|blockquote))?\])[a-zA-Z0-9_-]+[^\]]*\]/g,
      "",
    )
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
    let line = rawLines[i];
    const next = rawLines[i + 1];
    const next2 = rawLines[i + 2];

    let alignmentClass = "";
    if (line.includes("[align-center]")) {
      alignmentClass = " align-center-block";
      line = line
        .replace(/\[align-center\]/g, "")
        .replace(/\[\/align-center\]/g, "");
    } else if (line.includes("[align-right]")) {
      alignmentClass = " align-right-block";
      line = line
        .replace(/\[align-right\]/g, "")
        .replace(/\[\/align-right\]/g, "");
    } else if (line.includes("[align-justify]")) {
      alignmentClass = " align-justify-block";
      line = line
        .replace(/\[align-justify\]/g, "")
        .replace(/\[\/align-justify\]/g, "");
    }

    // Deteksi alignment heading h1-h6
    const headingAlignMatch = line.match(
      /^\[align-(center|right|justify)-(h[1-6])\]([\s\S]*?)\[\/align-(?:center|right|justify)-\2\]$/i,
    );
    if (headingAlignMatch) {
      lastContext = null;
      const align = headingAlignMatch[1];
      const tag = headingAlignMatch[2];
      const content = headingAlignMatch[3];
      blocks.push(`<${tag} class="align-${align}-block">${content}</${tag}>`);
      continue;
    }

    // Deteksi alignment blockquote
    const quoteAlignMatch = line.match(
      /^\[align-(center|right|justify)-blockquote\]([\s\S]*?)\[\/align-(?:center|right|justify)-blockquote\]$/i,
    );
    if (quoteAlignMatch) {
      lastContext = null;
      const align = quoteAlignMatch[1];
      const content = quoteAlignMatch[2];
      blocks.push(
        `<blockquote class="align-${align}-block">${content}</blockquote>`,
      );
      continue;
    }

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

    const bulletMatch = line.match(/^(\u2022\s+)(.*)$/);
    if (bulletMatch) {
      lastContext = null;
      const marker = bulletMatch[1].trim();
      const content = bulletMatch[2];
      blocks.push(`
        <div class="list-item-container">
          <div class="list-item-marker">${marker}</div>
          <div class="list-item-content${alignmentClass}">${content}</div>
        </div>
      `);
      continue;
    }

    const numberMatch = line.match(/^(\d+[.)]\s+)(.*)$/);
    if (numberMatch) {
      lastContext = null;
      const marker = numberMatch[1].trim();
      const content = numberMatch[2];
      blocks.push(`
        <div class="list-item-container">
          <div class="list-item-marker">${marker}</div>
          <div class="list-item-content${alignmentClass}">${content}</div>
        </div>
      `);
      continue;
    }

    if (lastContext) {
      lastContext = null;
      blocks.push(
        `<p class="article-paragraph explanation-text${alignmentClass}" style="border-left: 3px solid #10b981; padding-left: 1rem; margin: 0.75rem 0;">${line}</p>`,
      );
      continue;
    }

    const showFirstParagraph =
      (currentPage === 1 || showAll) && isFirstParagraph;
    const pClass = showFirstParagraph
      ? `article-paragraph first-paragraph${alignmentClass}`
      : `article-paragraph${alignmentClass}`;

    if (showFirstParagraph) {
      blocks.push(
        `<p class="${pClass}"><strong><a href="https://almuhtada.org" target="_blank" rel="noopener noreferrer" class="source-link">Almuhtada.org</a></strong> - ${line}</p>`,
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
        <div className="relative mb-8">
          <div className="absolute top-0 left-0 w-12 h-[2px] bg-emerald-600 dark:bg-emerald-400" />

          <div className="pt-5">
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-[0.15em]">
                Ringkasan
              </span>
              <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
            </div>

            <p className="text-gray-800 dark:text-gray-200 leading-[1.75] text-base font-normal">
              {excerpt}
            </p>
          </div>
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
        .article-body blockquote {
          border-left: 4px solid #00531b;
          padding-left: 1.25rem;
          font-style: italic;
          color: #4b5563;
          margin: 1.75rem 0;
          line-height: 1.8;
        }
        .dark .article-body blockquote {
          border-left-color: #10b981;
          color: #9ca3af;
        }
        .article-body h1 {
          font-size: 1.875rem;
          font-weight: 800;
          margin-top: 2rem;
          margin-bottom: 1rem;
          line-height: 1.25;
        }
        .article-body h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 1.75rem;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }
        .article-body h3 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          line-height: 1.35;
        }
        .article-body pre {
          background-color: #f3f4f6;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          font-family: monospace;
          font-size: 0.875rem;
          margin: 1.5rem 0;
        }
        .dark .article-body pre {
          background-color: #1f2937;
        }
        .article-body code {
          font-family: monospace;
          font-size: 0.875rem;
          background-color: #f3f4f6;
          color: #be123c;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .dark .article-body code {
          background-color: #1f2937;
          color: #fda4af;
        }
        .dark .article-body {
          color: #e5e7eb;
        }

        .list-item-container {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          margin: 0.5rem 0;
          margin-left: 1.75rem;
          font-size: 1.125rem;
          color: #1a1a1a;
          line-height: 1.85;
          width: 100%;
        }
        .dark .list-item-container {
          color: #e5e7eb;
        }
        .list-item-marker {
          flex-shrink: 0;
          text-align: left;
          width: 1.75rem;
          font-weight: 600;
        }
        .list-item-content {
          flex: 1;
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
        .align-center-block {
          text-align: center !important;
          text-align-last: center !important;
        }
        .align-right-block {
          text-align: right !important;
          text-align-last: right !important;
        }
        .align-justify-block {
          text-align: justify !important;
          text-align-last: justify !important;
        }
      `}</style>
    </>
  );
};

export default ArticleContent;
