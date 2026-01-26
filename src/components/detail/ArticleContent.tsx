import DOMPurify from "dompurify";

interface ArticleContentProps {
  currentPage: number;
  totalPages: number;
  words: string[];
  paragraphs: string[];
}

const PARAGRAPHS_PER_PAGE = 10;

// regex
const ARABIC_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
const LATIN_LABEL_REGEX = /^latin\s*:/i;
const ARTI_LABEL_REGEX = /^artinya\s*:/i;

// bersihkan shortcode dan prefix almuhtada.org
const cleanText = (text: string) => {
  const cleaned = text
    // Hapus shortcode
    .replace(/\[irp[^\]]*\]/gi, "")
    .replace(/\[[a-zA-Z0-9_-]+[^\]]*\]/g, "")
    // Hapus prefix almuhtada.org dengan berbagai format (dengan link, bold, dll)
    // Format: <strong><a href="...">almuhtada.org</a> - </strong>
    .replace(
      /<strong[^>]*>\s*<a[^>]*>almuhtada\.org<\/a>[^<]*<\/strong>\s*-?\s*/gi,
      "",
    )
    // Format: <a href="...">almuhtada.org</a> -
    .replace(/<a[^>]*>almuhtada\.org<\/a>\s*-?\s*/gi, "")
    // Format: <strong>almuhtada.org</strong> -
    .replace(/<strong[^>]*>almuhtada\.org[^<]*<\/strong>\s*-?\s*/gi, "")
    // Format: almuhtada.org - (plain text di awal)
    .replace(/^almuhtada\.org\s*-\s*/gim, "")
    // Format yang di-escape: &lt;strong&gt; dll
    .replace(/&lt;strong&gt;.*?almuhtada\.org.*?&lt;\/strong&gt;\s*-?\s*/gi, "")
    .replace(/&lt;a[^&]*&gt;almuhtada\.org&lt;\/a&gt;\s*-?\s*/gi, "");

  return cleaned.trim();
};

/**
 * 🔑 HELPER FINAL
 * 1 paragraf = TEPAT 5 kalimat
 * Kalimat ke-6 → paragraf baru
 * Tidak memotong paragraf dengan referensi Islam: Q.S., H.R., Swt., Saw., dll.
 */
const splitEveryFiveSentences = (text: string) => {
  // Jika mengandung referensi Islam, jangan dipotong
  const hasIslamicRef = /Q\.?S\.|H\.?R\.|Swt\.|Saw\.|\.ra\b/i.test(text);
  if (hasIslamicRef) {
    return [text];
  }

  // Split berdasarkan kalimat
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];

  const chunks: string[] = [];

  for (let i = 0; i < sentences.length; i += 5) {
    const chunk = sentences
      .slice(i, i + 5)
      .join(" ")
      .trim();

    if (chunk) {
      chunks.push(chunk);
    }
  }

  return chunks.length > 0 ? chunks : [text];
};

const ArticleContent = ({
  currentPage,
  totalPages,
  words,
  paragraphs,
}: ArticleContentProps) => {
  const startIndex = (currentPage - 1) * PARAGRAPHS_PER_PAGE;

  // ⬇️ LOGIKA LAMA (TIDAK DIUBAH)
  const rawLines = paragraphs
    .slice(startIndex, startIndex + PARAGRAPHS_PER_PAGE)
    .join("\n")
    .split(/\n+/)
    .map(cleanText)
    .filter(Boolean);

  const blocks: string[] = [];

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
          <div class="doa-arab" dir="rtl">${line}</div>
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

    // 🔐 Bullet list (dari ul)
    if (line.startsWith("• ")) {
      blocks.push(`<div class="list-item bullet-item">${line}</div>`);
      continue;
    }

    // 🔢 Numbered list (dari ol atau plain text 1. 2. 3.)
    if (/^\d+[.)]\s/.test(line)) {
      blocks.push(`<div class="list-item numbered-item">${line}</div>`);
      continue;
    }

    // ===== PARAGRAF BIASA (PER 5 KALIMAT BARU GANTI PARAGRAF)
    const parts = splitEveryFiveSentences(line);

    parts.forEach((part) => {
      blocks.push(`<p class="article-paragraph">${part}</p>`);
    });
  }

  // Tambahkan "almuhtada.org" dengan bold di awal paragraf pertama (hanya halaman 1)
  if (currentPage === 1 && blocks.length > 0) {
    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i].includes('class="article-paragraph"')) {
        blocks[i] = blocks[i].replace(
          '<p class="article-paragraph">',
          '<p class="article-paragraph"><strong><a href="https://almuhtada.org" target="_blank" rel="noopener noreferrer">almuhtada.org</a></strong> - ',
        );
        break;
      }
    }
  }

  return (
    <>
      {/* META */}
      <div className="mt-6 mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-gray-600 flex gap-4">
        <span>
          Halaman {currentPage} dari {totalPages}
        </span>
        <span>⏱ {Math.ceil(words.length / 200)} menit baca</span>
      </div>

      {/* CONTENT */}
      <div
        className="prose prose-lg max-w-none text-gray-800"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(blocks.join(""), {
            ADD_ATTR: ["dir"],
          }),
        }}
      />

      {/* STYLE */}
      <style>{`
        .article-paragraph {
          margin: 1.5rem 0;
          line-height: 1.85;
        }

        .list-item {
          margin: 0.75rem 0;
          margin-left: 1.5rem;
          line-height: 1.8;
          list-style: none;
        }

        .numbered-item {
          /* Numbered items - no bullet, just the number */
          list-style: none;
        }

        .bullet-item {
          /* Bullet items already have • in content */
          list-style: none;
        }

        .doa-card {
          margin: 2rem 0;
          padding: 1.5rem;
          border-radius: 1rem;
        }

        .doa-arab {
          font-family: "Cairo", "Noto Naskh Arabic", serif;
          font-size: 1.5rem;
          font-weight: 600;
          line-height: 2.4;
          text-align: right;
          margin-bottom: 0.75rem;
        }

        .doa-latin {
          font-style: italic;
          margin-bottom: 0.5rem;
        }

        .doa-arti {
          font-size: 0.95rem;
        }

        .arabic-inline-block {
          margin: 1.5rem 0;
          font-family: "Cairo", "Noto Naskh Arabic", serif;
          font-size: 1.25rem;
          text-align: right;
          color: #065f46;
        }
      `}</style>
    </>
  );
};

export default ArticleContent;
