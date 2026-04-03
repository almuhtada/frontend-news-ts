/**
 * src/utils/index.ts
 * Barrel export — import semua utils dari satu titik.
 *
 * Contoh pemakaian:
 *   import { formatTimeAgo, formatDateLong }    from "../utils";
 *   import { generateSmartExcerpt }             from "../utils";
 *   import { getUserIdentifier }                from "../utils";
 *   import formatEveryFourSentences             from "../utils/formatParagraph";
 */

export * from "./formatDate";
export * from "./excerptGenerator";
export * from "./userIdentifier";
// formatParagraph memakai default export — import langsung dari file-nya
