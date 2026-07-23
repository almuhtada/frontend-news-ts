/**
 * WordPress Content Formatter
 * Handles WordPress-specific HTML patterns and converts to clean text
 */

/**
 * Remove WordPress shortcodes
 */
const removeShortcodes = (html: string): string => {
  let text = html;

  // Common WordPress shortcodes
  // [caption], [gallery], [embed], [video], [audio], [playlist]
  // [irp], [related_posts], [vc_*], [et_*], etc.
  text = text.replace(/\[caption[^\]]*\]([\s\S]*?)\[\/caption\]/gi, "$1");
  text = text.replace(/\[gallery[^\]]*\]/gi, "");
  text = text.replace(/\[embed[^\]]*\]([\s\S]*?)\[\/embed\]/gi, "");
  text = text.replace(/\[video[^\]]*\]([\s\S]*?)\[\/video\]/gi, "");
  text = text.replace(/\[audio[^\]]*\]([\s\S]*?)\[\/audio\]/gi, "");
  text = text.replace(/\[playlist[^\]]*\]/gi, "");

  // Internal Related Posts plugin
  text = text.replace(/\[irp[^\]]*\]/gi, "");

  // Visual Composer shortcodes
  text = text.replace(/\[vc_[^\]]*\]/gi, "");
  text = text.replace(/\[\/vc_[^\]]*\]/gi, "");

  // Divi shortcodes
  text = text.replace(/\[et_[^\]]*\]/gi, "");
  text = text.replace(/\[\/et_[^\]]*\]/gi, "");

  // Elementor shortcodes
  text = text.replace(/\[elementor[^\]]*\]/gi, "");

  // WooCommerce shortcodes
  text = text.replace(/\[product[^\]]*\]/gi, "");
  text = text.replace(/\[products[^\]]*\]/gi, "");

  // Contact Form 7
  text = text.replace(/\[contact-form[^\]]*\]/gi, "");

  // Generic shortcodes (anything in square brackets)
  text = text.replace(/\[[a-zA-Z0-9_-]+[^\]]*\]/g, "");
  text = text.replace(/\[\/[a-zA-Z0-9_-]+\]/g, "");

  return text;
};

/**
 * Remove WordPress Gutenberg block comments
 */
const removeBlockComments = (html: string): string => {
  let text = html;

  // Gutenberg block markers
  // <!-- wp:paragraph --> <!-- /wp:paragraph -->
  // <!-- wp:heading --> <!-- /wp:heading -->
  // <!-- wp:list --> <!-- /wp:list -->
  // etc.
  text = text.replace(/<!--\s*wp:[^>]*-->/gi, "");
  text = text.replace(/<!--\s*\/wp:[^>]*-->/gi, "");

  // Other HTML comments
  text = text.replace(/<!--[\s\S]*?-->/g, "");

  return text;
};

/**
 * Handle WordPress media and figures
 */
const handleMedia = (html: string): string => {
  let text = html;

  // Remove figure/figcaption but keep caption text
  text = text.replace(/<figure[^>]*>([\s\S]*?)<\/figure>/gi, (_match, content) => {
    // Extract figcaption if exists
    const captionMatch = content.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);
    if (captionMatch) {
      return `\n[Gambar: ${captionMatch[1].replace(/<[^>]+>/g, "").trim()}]\n`;
    }
    return "";
  });

  // Remove img tags (images will be shown separately)
  text = text.replace(/<img[^>]*alt=["']([^"']*)["'][^>]*>/gi, (_match, alt) => {
    return alt ? `[Gambar: ${alt}]` : "";
  });
  text = text.replace(/<img[^>]*>/gi, "");

  // Remove iframe (embedded videos/maps)
  text = text.replace(/<iframe[^>]*>([\s\S]*?)<\/iframe>/gi, "[Media Embed]");

  // Remove video/audio tags
  text = text.replace(/<video[^>]*>([\s\S]*?)<\/video>/gi, "[Video]");
  text = text.replace(/<audio[^>]*>([\s\S]*?)<\/audio>/gi, "[Audio]");

  // Remove object/embed tags
  text = text.replace(/<object[^>]*>([\s\S]*?)<\/object>/gi, "");
  text = text.replace(/<embed[^>]*>/gi, "");

  return text;
};

/**
 * Handle headings
 */
const handleHeadings = (html: string): string => {
  let text = html;

  // Convert headings to text with newlines
  text = text.replace(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi, "\n\n$1\n\n");

  return text;
};

/**
 * Handle blockquotes
 */
const handleBlockquotes = (html: string): string => {
  let text = html;

  // Convert blockquote to quoted text
  text = text.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_match, content) => {
    const cleanContent = content.replace(/<[^>]+>/g, "").trim();
    return `\n"${cleanContent}"\n`;
  });

  return text;
};

/**
 * Handle tables (convert to simple text)
 */
const handleTables = (html: string): string => {
  let text = html;

  // Simple table handling - extract cell contents
  text = text.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (_match, content) => {
    let tableText = "\n";

    // Extract rows
    const rows = content.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
    rows.forEach((row: string) => {
      const cells = row.match(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi) || [];
      const cellTexts = cells.map((cell: string) =>
        cell.replace(/<[^>]+>/g, "").trim()
      );
      if (cellTexts.length > 0) {
        tableText += cellTexts.join(" | ") + "\n";
      }
    });

    return tableText + "\n";
  });

  return text;
};

/**
 * Handle lists (ordered and unordered)
 */
const handleLists = (html: string): string => {
  let text = html;

  // Handle ordered lists (<ol>) - convert to numbered items
  // Support start attribute: <ol start="2"> should start counting from 2
  text = text.replace(/<ol([^>]*)>([\s\S]*?)<\/ol>/gi, (_match, attrs, content) => {
    // Parse start attribute if exists
    const startMatch = attrs.match(/start=["']?(\d+)["']?/i);
    let counter = startMatch ? parseInt(startMatch[1], 10) - 1 : 0;

    return content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_: string, itemContent: string) => {
      counter++;
      // Clean inner HTML tags from list item
      const cleanItem = itemContent.replace(/<[^>]+>/g, "").trim();
      return `\n${counter}. ${cleanItem}`;
    });
  });

  // Handle unordered lists (<ul>) - convert to bullet items
  text = text.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_match, content) => {
    return content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_: string, itemContent: string) => {
      // Clean inner HTML tags from list item
      const cleanItem = itemContent.replace(/<[^>]+>/g, "").trim();
      return `\n• ${cleanItem}`;
    });
  });

  // Handle any remaining <li> tags (outside of ol/ul)
  // Check if content already has numbering - don't add bullet if it does
  text = text.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_match, content) => {
    const cleanContent = content.replace(/<[^>]+>/g, "").trim();
    // If content starts with a number followed by dot/paren, keep as numbered
    if (/^\d+[.)]\s/.test(cleanContent)) {
      return `\n${cleanContent}`;
    }
    return `\n• ${cleanContent}`;
  });
  // For unclosed <li> tags, check context before adding bullet
  text = text.replace(/<li[^>]*>/gi, "\n");
  text = text.replace(/<\/li>/gi, "");

  return text;
};

/**
 * Clean website prefix (almuhtada.org)
 */
const cleanWebsitePrefix = (text: string): string => {
  let cleaned = text;

  // Format: <strong><a href="...">almuhtada.org</a></strong> -
  cleaned = cleaned.replace(/<strong[^>]*>\s*<a[^>]*>almuhtada\.org<\/a>[^<]*<\/strong>\s*-?\s*/gi, "");

  // Format: <a href="...">almuhtada.org</a> -
  cleaned = cleaned.replace(/<a[^>]*>almuhtada\.org<\/a>\s*-?\s*/gi, "");

  // Format: <strong>almuhtada.org</strong> -
  cleaned = cleaned.replace(/<strong[^>]*>almuhtada\.org[^<]*<\/strong>\s*-?\s*/gi, "");

  // Format: almuhtada.org - (plain text at start)
  cleaned = cleaned.replace(/^almuhtada\.org\s*-\s*/gim, "");

  // Format: almuhtada.org - (anywhere)
  cleaned = cleaned.replace(/almuhtada\.org\s*-\s*/gi, "");

  return cleaned;
};

/**
 * Decode HTML entities
 */
const decodeHtmlEntities = (text: string): string => {
  let decoded = text;

  // Common HTML entities
  decoded = decoded.replace(/&nbsp;/g, " ");
  decoded = decoded.replace(/&amp;/g, "&");
  decoded = decoded.replace(/&lt;/g, "<");
  decoded = decoded.replace(/&gt;/g, ">");
  decoded = decoded.replace(/&quot;/g, '"');
  decoded = decoded.replace(/&#39;/g, "'");
  decoded = decoded.replace(/&apos;/g, "'");
  decoded = decoded.replace(/&mdash;/g, "—");
  decoded = decoded.replace(/&ndash;/g, "–");
  decoded = decoded.replace(/&lsquo;/g, "'");
  decoded = decoded.replace(/&rsquo;/g, "'");
  decoded = decoded.replace(/&ldquo;/g, '"');
  decoded = decoded.replace(/&rdquo;/g, '"');
  decoded = decoded.replace(/&hellip;/g, "…");
  decoded = decoded.replace(/&copy;/g, "©");
  decoded = decoded.replace(/&reg;/g, "®");
  decoded = decoded.replace(/&trade;/g, "™");
  decoded = decoded.replace(/&deg;/g, "°");
  decoded = decoded.replace(/&plusmn;/g, "±");
  decoded = decoded.replace(/&times;/g, "×");
  decoded = decoded.replace(/&divide;/g, "÷");

  // Numeric entities
  decoded = decoded.replace(/&#(\d+);/g, (_match, num) => {
    return String.fromCharCode(parseInt(num, 10));
  });

  // Hex entities
  decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (_match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });

  return decoded;
};

/**
 * Strip remaining HTML tags and normalize whitespace
 */
const stripHtml = (html: string): string => {
  let text = html;

  // Remove script and style tags completely
  text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
  text = text.replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, "");

  // Step 1: Remove WordPress shortcodes
  text = removeShortcodes(text);

  // Step 2: Remove Gutenberg block comments
  text = removeBlockComments(text);

  // Step 3: Clean website prefix first (before stripping HTML)
  text = cleanWebsitePrefix(text);

  // Step 4: Handle special elements
  text = handleMedia(text);
  text = handleHeadings(text);
  text = handleBlockquotes(text);
  text = handleTables(text);
  text = handleLists(text);

  // Step 5: Convert remaining structural tags to newlines
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<\/p>/gi, "\n\n");
  text = text.replace(/<p[^>]*>/gi, "");
  text = text.replace(/<\/div>/gi, "\n");
  text = text.replace(/<div[^>]*>/gi, "");
  text = text.replace(/<hr[^>]*>/gi, "\n---\n");

  // Step 6: Remove all remaining HTML tags
  text = text.replace(/<[^>]+>/g, "");

  // Step 7: Decode HTML entities
  text = decodeHtmlEntities(text);

  // Step 8: Clean up again after decode (in case entities revealed more HTML)
  text = text.replace(/<[^>]+>/g, "");

  // Step 9: Normalize whitespace
  text = text.replace(/\r\n/g, "\n");
  text = text.replace(/\r/g, "\n");
  text = text.replace(/\n{3,}/g, "\n\n");
  text = text.replace(/ {2,}/g, " ");
  text = text.replace(/\t+/g, " ");

  // Step 10: Fix duplicate bullet+number patterns (• 1. → 1.)
  // Handle various bullet characters and patterns
  text = text.replace(/[•·‣⁃►▸▹→-]\s*(\d+[.)]\s)/g, "$1");

  // Step 11: Clean up lines - also clean bullet+number per line
  text = text
    .split("\n")
    .map((line) => {
      let cleanLine = line.trim();
      // Remove bullet at start of line if followed by number
      cleanLine = cleanLine.replace(/^[•·‣⁃►▸▹→-]\s*(\d+[.)]\s)/, "$1");
      return cleanLine;
    })
    .join("\n");

  return text.trim();
};

/**
 * Check if a paragraph is "special" (list, quote, media, etc.)
 */
const isSpecialParagraph = (para: string): boolean => {
  if (!para) return true;
  if (para === "[Media Embed]" || para === "[Video]" || para === "[Audio]") return true;
  if (para.startsWith("•") || /^\d+[.)]\s/.test(para)) return true;
  if (para.startsWith('"') || para.startsWith("[Gambar:")) return true;
  if (para.includes("\n•") || /\n\d+\.\s/.test(para)) return true;
  if (/Q\.?S\.|H\.?R\.|Swt\.|Saw\.|\.ra\b/i.test(para)) return true;
  return false;
};

/**
 * Split sentences without breaking Islamic honorifics such as "r.a.".
 */
const splitIntoSentences = (text: string): string[] => {
  const protectedText = text.replace(
    /\b(?:[Rr]\s*\.\s*[Aa]|[Ss]\s*\.\s*[Aa]\s*\.\s*[Ww]|[Ss][Ww][Tt]|[Ss][Aa][Ww]|[Qq][Ss]|[Hh][Rr])\.(?=[\s,;:)]|$)|\b(?:[A-Za-z]\.)+[A-Za-z]+\.?(?=[\s,;:)]|$)|\b[A-Z]\.(?=\s+[A-Z])/g,
    (abbreviation) => abbreviation.replace(/\./g, "\uE000"),
  );

  return (protectedText.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [protectedText])
    .map((sentence) => sentence.replace(/\uE000/g, "."));
};
/** Keep a Quran verse and its translation on the same pagination block. */
const ARABIC_TEXT_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
const isVerseTranslation = (text: string): boolean =>
  /^artinya\s*:/i.test(text) ||
  (/(?:Q\.?\s*S\.?|Al[-\s]?Baqarah)/i.test(text) && /^[“"']/.test(text.trim()));

/**
 * Format content into paragraphs of ~5 sentences each
 */
const formatEveryFourSentences = (html: string): string[] => {
  if (!html) return [];

  // Strip HTML first
  const cleanText = stripHtml(html);

  // Split into paragraphs (separated by double newlines)
  const rawParagraphs = cleanText
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  // Merge consecutive short plain-text paragraphs into larger blocks
  // This handles content where each sentence is separated by \r\n\r\n
  const mergedParagraphs: string[] = [];
  let plainBuffer = "";

  for (let index = 0; index < rawParagraphs.length; index++) {
    const para = rawParagraphs[index];
    const cleaned = para.replace(/^[•·‣⁃►▸▹→-]\s*(\d+[.)]\s)/, "$1");
    const nextParagraph = rawParagraphs[index + 1]?.trim();

    // Treat an Arabic verse and its translation as one block so pagination
    // never separates them onto different pages.
    if (
      ARABIC_TEXT_REGEX.test(cleaned) &&
      nextParagraph &&
      isVerseTranslation(nextParagraph)
    ) {
      if (plainBuffer) {
        mergedParagraphs.push(plainBuffer.trim());
        plainBuffer = "";
      }
      mergedParagraphs.push(`${cleaned}\n${nextParagraph}`);
      index++;
      continue;
    }

    if (isSpecialParagraph(cleaned)) {
      // Flush plain text buffer first
      if (plainBuffer) {
        mergedParagraphs.push(plainBuffer.trim());
        plainBuffer = "";
      }
      mergedParagraphs.push(cleaned);
    } else {
      // Accumulate plain text, joining with space
      plainBuffer += (plainBuffer ? " " : "") + cleaned;
    }
  }
  // Flush remaining buffer
  if (plainBuffer) {
    mergedParagraphs.push(plainBuffer.trim());
  }

  const result: string[] = [];

  for (const para of mergedParagraphs) {
    // Skip empty or placeholder content
    if (!para || para === "[Media Embed]" || para === "[Video]" || para === "[Audio]") {
      continue;
    }

    // Check if it's a special paragraph (keep as is)
    if (isSpecialParagraph(para)) {
      result.push(para);
      continue;
    }

    // For regular paragraphs, split into sentences
    const sentences = splitIntoSentences(para);

    // Group into chunks of 5 sentences
    for (let i = 0; i < sentences.length; i += 5) {
      const chunk = sentences
        .slice(i, i + 5)
        .join(" ")
        .trim();

      if (chunk) {
        result.push(chunk);
      }
    }
  }

  return result;
};

export default formatEveryFourSentences;
export { stripHtml, decodeHtmlEntities, removeShortcodes };
