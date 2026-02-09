import DOMPurify from "dompurify";

interface ArticleContentProps {
  currentPage: number;
  totalPages: number;
  words: string[];
  paragraphs: string[];
  excerpt?: string;
  onNextPage?: () => void;
}

const PARAGRAPHS_PER_PAGE = 3;

// regex
const ARABIC_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
const LATIN_LABEL_REGEX = /^latin\s*:/i;
const ARTI_LABEL_REGEX = /^artinya\s*:/i;

// bersihkan shortcode dan prefix almuhtada.org
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
}: ArticleContentProps) => {
  const startIndex = (currentPage - 1) * PARAGRAPHS_PER_PAGE;
  const readTime = Math.max(1, Math.ceil(words.length / 200));

  const rawLines = paragraphs
    .slice(startIndex, startIndex + PARAGRAPHS_PER_PAGE)
    .join("\n")
    .split(/\n+/)
    .map(cleanText)
    .filter(Boolean);

  const blocks: string[] = [];
  let isFirstParagraph = true;

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    const next = rawLines[i + 1];
    const next2 = rawLines[i + 2];

    // ===== DOA BLOCK (Arab + Latin + Arti)
    if (
      ARABIC_REGEX.test(line) &&
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
      continue;
    }

    // ===== ARAB SAJA
    if (ARABIC_REGEX.test(line) && !LATIN_LABEL_REGEX.test(line)) {
      blocks.push(`
        <div class="arabic-inline-block" dir="rtl">
          ${line}
        </div>
      `);
      continue;
    }

    // Bullet list
    if (line.startsWith("• ")) {
      blocks.push(`<div class="list-item bullet-item">${line}</div>`);
      continue;
    }

    // Numbered list
    if (/^\d+[.)]\s/.test(line)) {
      blocks.push(`<div class="list-item numbered-item">${line}</div>`);
      continue;
    }

    // ===== PARAGRAF BIASA
    const pClass = currentPage === 1 && isFirstParagraph
      ? "article-paragraph first-paragraph"
      : "article-paragraph";

    if (currentPage === 1 && isFirstParagraph) {
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
      {/* META BAR */}
      <div className="mt-8 mb-6 flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-gray-500">
        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          {readTime} menit baca
        </div>
        {totalPages > 1 && (
          <div className="flex items-center gap-1.5 bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
            Halaman {currentPage}/{totalPages}
          </div>
        )}
        <div className="flex items-center gap-1.5 bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          {words.length} kata
        </div>
      </div>

      {/* RINGKASAN / SUMMARY */}
      {excerpt && currentPage === 1 && (
        <div className="mb-8 rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wider">Ringkasan</h3>
          </div>
          <p className="text-gray-700 leading-relaxed text-[0.95rem]">{excerpt}</p>
        </div>
      )}

      {/* SEPARATOR */}
      <div className="w-16 h-1 bg-emerald-600 rounded-full mb-8" />

      {/* CONTENT */}
      <div
        className="article-body"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(blocks.join(""), {
            ADD_ATTR: ["dir"],
          }),
        }}
      />

      {/* LANJUTKAN MEMBACA */}
      {currentPage < totalPages && onNextPage && (
        <div className="mt-10 relative">
          {/* Fade overlay */}
          <div className="absolute -top-20 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          <div className="flex flex-col items-center gap-3 py-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Halaman {currentPage} dari {totalPages}
            </p>
            <button
              onClick={onNextPage}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-full transition-all shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-0.5"
            >
              Lanjutkan Membaca
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
          </div>
        </div>
      )}

      {/* STYLE */}
      <style>{`
        .article-body {
          max-width: 720px;
          font-size: 1.125rem;
          color: #1a1a1a;
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

        .source-link {
          color: #065f46;
          text-decoration: none;
          font-weight: 700;
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

        .doa-arti {
          font-size: 0.95rem;
          color: #6b7280;
          line-height: 1.7;
          padding-left: 1rem;
          border-left: 3px solid #10b981;
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
        }
      `}</style>
    </>
  );
};

export default ArticleContent;
