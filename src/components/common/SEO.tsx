import React from "react";
import { Helmet } from "react-helmet-async";

const SITE_NAME = "Pesantren Riset Al-Muhtada";
const SITE_URL = "https://almuhtada.org";
const BASE_KEYWORDS =
  "pesantren riset al-muhtada, pesantren mahasiswa semarang, beasiswa asrama mahasiswa, al-muhtada semarang";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "category" | "author";
  /** Dipakai untuk type="article" */
  publishedTime?: string;
  modifiedTime?: string;
  authorName?: string;
  categories?: string[];
  tags?: string[];
  noindex?: boolean;
}

const stripHtml = (html?: string) =>
  html
    ? html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160)
    : "";

const SEO: React.FC<SEOProps> = ({
  title = "Berita Islami & Pesantren Terkini - Pesantren Riset Al-Muhtada",
  description = "Berita terbaru seputar dunia Islam, pendidikan pesantren, kajian, dan informasi dari Pesantren Riset Al-Muhtada Semarang.",
  keywords = BASE_KEYWORDS,
  image = `${SITE_URL}/logo1.png`,
  url = SITE_URL,
  type = "website",
  publishedTime,
  modifiedTime,
  authorName,
  categories = [],
  tags = [],
  noindex = false,
}) => {
  const defaultTitle = title.includes("Al-Muhtada")
    ? title
    : `${title} | Pesantren Riset Al-Muhtada`;

  // Vektor kata kunci: judul berita + kata kunci tambahan
  const allKeywords = keywords
    ? keywords
    : [title, ...(categories || []), ...(tags || [])].join(", ");

  // ── JSON-LD Structured Data ─────────────────────────────────
  const structuredData: Record<string, unknown>[] = [];

  // Schema: WebSite (global)
  structuredData.push({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Portal berita Islami, informasi pesantren, dan kajian dari Pesantren Riset Al-Muhtada Semarang.",
    inLanguage: "id-ID",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo1.png`,
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  });

  // Schema: NewsArticle / Article (untuk halaman detail berita)
  if (type === "article") {
    structuredData.push({
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: title,
      description: stripHtml(description),
      image: image,
      datePublished: publishedTime || new Date().toISOString(),
      dateModified: modifiedTime || publishedTime || new Date().toISOString(),
      author: authorName
        ? { "@type": "Person", name: authorName }
        : { "@type": "Organization", name: SITE_NAME },
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/logo1.png`,
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": url,
      },
      articleSection: categories && categories.length > 0 ? categories : undefined,
      keywords: tags && tags.length > 0 ? tags.join(", ") : undefined,
      inLanguage: "id-ID",
    });
  }

  if (type === "category") {
    structuredData.push({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: title,
      url: url,
      inLanguage: "id-ID",
    });
  }

  // Schema: BreadcrumbList
  structuredData.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Beranda", item: SITE_URL },
      ...(type === "article"
        ? [{ "@type": "ListItem", position: 2, name: "Berita", item: `${SITE_URL}/news` }]
        : []),
      ...(title && type !== "website"
        ? [{ "@type": "ListItem", position: type === "article" ? 3 : 2, name: title, item: url }]
        : []),
    ],
  });

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{defaultTitle}</title>
      <meta name="description" content={stripHtml(description)} />
      <meta name="keywords" content={allKeywords} />
      <link rel="canonical" href={url} />
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large" />
      )}
      <meta name="author" content={authorName || SITE_NAME} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type === "article" ? "article" : "website"} />
      <meta property="og:title" content={defaultTitle} />
      <meta property="og:description" content={stripHtml(description)} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="id_ID" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={defaultTitle} />
      <meta name="twitter:description" content={stripHtml(description)} />
      <meta name="twitter:image" content={image} />

      {/* Article SEO (dipakai mesin pencari & Google News) */}
      {type === "article" && (
        <>
          <meta property="article:published_time" content={publishedTime || new Date().toISOString()} />
          {modifiedTime && (
            <meta property="article:modified_time" content={modifiedTime} />
          )}
          {authorName && (
            <meta property="article:author" content={`${SITE_URL}/author/${(authorName || "").toLowerCase().replace(/\s+/g, "-")}`} />
          )}
          {categories?.map((c) => (
            <meta property="article:section" content={c} key={c} />
          ))}
          {tags?.slice(0, 10).map((t) => (
            <meta property="article:tag" content={t} key={t} />
          ))}
        </>
      )}

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {structuredData.map((schema) => JSON.stringify(schema)).join("\n")}
      </script>
    </Helmet>
  );
};

export default SEO;