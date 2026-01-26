/**
 * Excerpt Generator Utility
 * Menghasilkan ringkasan berita yang informatif dari konten HTML
 */

interface ExcerptOptions {
  maxLength?: number;
  minSentences?: number;
  maxSentences?: number;
}

/**
 * Membersihkan teks dari HTML tags dan whitespace berlebihan
 */
function cleanText(html: string): string {
  let text = html.replace(/<[^>]*>/g, " ");
  text = text.replace(/\s+/g, " ");
  text = text.trim();
  return text;
}

/**
 * Memisahkan teks menjadi kalimat-kalimat
 */
function splitIntoSentences(text: string): string[] {
  // Split berdasarkan . ! ? yang diikuti spasi atau akhir string
  const sentences = text
    .split(/([.!?]+)\s+/)
    .filter((s) => s.trim().length > 0);

  // Gabungkan kembali tanda baca dengan kalimat
  const result: string[] = [];
  for (let i = 0; i < sentences.length; i += 2) {
    if (i + 1 < sentences.length) {
      result.push((sentences[i] + sentences[i + 1]).trim());
    } else {
      result.push(sentences[i].trim());
    }
  }

  return result.filter((s) => s.length > 15); // Filter kalimat pendek
}

/**
 * Menghitung skor penting dari sebuah kalimat
 * Semakin tinggi skor, semakin penting kalimat tersebut
 */
function calculateSentenceScore(sentence: string, position: number): number {
  let score = 0;

  // Posisi awal lebih penting (lead paragraph)
  if (position === 0) score += 10;
  else if (position === 1) score += 7;
  else if (position === 2) score += 5;

  // Kalimat dengan angka/data penting
  if (/\d+/.test(sentence)) score += 3;
  if (/Rp\s*[\d.,]+/.test(sentence)) score += 5; // Nominal uang
  if (/\$\s*[\d.,]+/.test(sentence)) score += 5; // Dollar
  if (/\d+%/.test(sentence)) score += 3; // Persentase
  if (/\d+\s*(juta|miliar|triliun|ribu)/i.test(sentence)) score += 5; // Angka besar

  // Kata kunci penting
  const keywords = [
    "penting",
    "utama",
    "pertama",
    "terakhir",
    "baru",
    "kini",
    "saat ini",
    "mengumumkan",
    "melaporkan",
    "menyatakan",
    "mengatakan",
    "masalah",
    "solusi",
    "dampak",
    "hasil",
    "kesimpulan",
    "kerugian",
    "keuntungan",
    "peningkatan",
    "penurunan",
  ];

  const lowerSentence = sentence.toLowerCase();
  keywords.forEach((keyword) => {
    if (lowerSentence.includes(keyword)) score += 2;
  });

  // Panjang kalimat yang baik (tidak terlalu pendek, tidak terlalu panjang)
  const wordCount = sentence.split(/\s+/).length;
  if (wordCount >= 8 && wordCount <= 25) score += 2;

  return score;
}

/**
 * Generate excerpt pintar dari konten berita
 */
export function generateSmartExcerpt(
  htmlContent: string,
  options: ExcerptOptions = {},
): string {
  const { maxLength = 250, minSentences = 2, maxSentences = 4 } = options;

  // Bersihkan HTML
  const cleanedText = cleanText(htmlContent);

  if (!cleanedText) return "";

  // Pisahkan menjadi kalimat
  const sentences = splitIntoSentences(cleanedText);

  if (sentences.length === 0) {
    // Fallback: ambil 200 karakter pertama
    return cleanedText.substring(0, maxLength) + "...";
  }

  // Hitung skor setiap kalimat
  const scoredSentences = sentences.map((sentence, index) => ({
    sentence,
    score: calculateSentenceScore(sentence, index),
    index,
  }));

  // Sort berdasarkan skor (descending) untuk mendapatkan kalimat terpenting
  const sortedByScore = [...scoredSentences].sort((a, b) => b.score - a.score);

  // Pilih kalimat terbaik, tapi tetap jaga urutan asli
  const selectedSentences: typeof scoredSentences = [];
  let currentLength = 0;

  // Prioritas 1: Selalu ambil kalimat pertama (lead)
  if (scoredSentences.length > 0) {
    selectedSentences.push(scoredSentences[0]);
    currentLength += scoredSentences[0].sentence.length;
  }

  // Prioritas 2: Ambil kalimat dengan skor tinggi
  for (const item of sortedByScore) {
    // Skip jika sudah diambil (kalimat pertama)
    if (item.index === 0) continue;

    const newLength = currentLength + item.sentence.length;

    // Cek batasan
    if (selectedSentences.length >= maxSentences) break;
    if (newLength > maxLength && selectedSentences.length >= minSentences)
      break;

    selectedSentences.push(item);
    currentLength = newLength;
  }

  // Sort kembali berdasarkan posisi asli agar urutan natural
  selectedSentences.sort((a, b) => a.index - b.index);

  // Gabungkan kalimat
  let excerpt = selectedSentences.map((item) => item.sentence).join(" ");

  // Potong jika terlalu panjang
  if (excerpt.length > maxLength) {
    excerpt = excerpt.substring(0, maxLength);
    // Potong di akhir kata
    const lastSpace = excerpt.lastIndexOf(" ");
    if (lastSpace > maxLength * 0.8) {
      excerpt = excerpt.substring(0, lastSpace);
    }
    excerpt += "...";
  }

  // Pastikan ada tanda baca di akhir
  if (!excerpt.match(/[.!?]$/) && !excerpt.endsWith("...")) {
    excerpt += ".";
  }

  return excerpt;
}

/**
 * Generate excerpt simple (fallback method)
 * Hanya mengambil beberapa kalimat pertama
 */
export function generateSimpleExcerpt(
  htmlContent: string,
  maxLength: number = 200,
): string {
  const cleanedText = cleanText(htmlContent);

  if (!cleanedText) return "";

  const sentences = splitIntoSentences(cleanedText);

  if (sentences.length === 0) {
    return cleanedText.substring(0, maxLength) + "...";
  }

  let excerpt = "";
  for (const sentence of sentences.slice(0, 3)) {
    if (excerpt.length + sentence.length <= maxLength) {
      excerpt += (excerpt ? " " : "") + sentence;
    } else {
      break;
    }
  }

  if (excerpt.length > maxLength) {
    excerpt = excerpt.substring(0, maxLength);
    const lastSpace = excerpt.lastIndexOf(" ");
    if (lastSpace > maxLength * 0.8) {
      excerpt = excerpt.substring(0, lastSpace);
    }
    excerpt += "...";
  }

  return excerpt || cleanedText.substring(0, maxLength) + "...";
}
