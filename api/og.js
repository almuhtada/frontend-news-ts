// Vercel Serverless Function — Dynamic OG Meta Tags for Social Media Crawlers
// Detects bots (WhatsApp, Facebook, Twitter, Telegram, etc.)
// and returns HTML with correct og:title, og:image, og:description per article.

const API_BASE = process.env.VITE_API_URL || "http://api.almuhtada.org/api";
const SITE_URL = "https://almuhtada.org";
const DEFAULT_TITLE = "Pesantren Riset Al-Muhtada - Mencetak Muslim Intelektual Unggul";
const DEFAULT_DESC = "Pesantren Riset Al-Muhtada adalah pesantren mahasiswa di Semarang yang berfokus mencetak muslim intelektual berakhlak mulia, berprestasi, dan terampil riset.";
const DEFAULT_IMAGE = `${SITE_URL}/logo1.png`;

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getFullImageUrl(path) {
  if (!path) return DEFAULT_IMAGE;
  if (path.startsWith("http")) return path;
  const serverBase = API_BASE.replace(/\/api\/?$/, "");
  return `${serverBase}${path.startsWith("/") ? path : `/${path}`}`;
}

export default async function handler(req, res) {
  const { path: rawPath } = req.query;
  const fullPath = Array.isArray(rawPath) ? rawPath.join("/") : rawPath || "";

  // Check if this is an article detail page
  const slugMatch = fullPath.match(/^detail-news\/(.+)$/);

  if (!slugMatch) {
    // Not an article page — return default OG tags
    return res.status(200).send(buildHtml({
      title: DEFAULT_TITLE,
      description: DEFAULT_DESC,
      image: DEFAULT_IMAGE,
      url: `${SITE_URL}/${fullPath}`,
      type: "website",
    }));
  }

  const slug = slugMatch[1];

  try {
    const apiRes = await fetch(`${API_BASE}/posts/${slug}`);
    if (!apiRes.ok) throw new Error(`API ${apiRes.status}`);

    const json = await apiRes.json();
    // Handle both { data: post } and direct post response
    const post = json.data || json;

    const title = post.title
      ? `${post.title} | Pesantren Riset Al-Muhtada`
      : DEFAULT_TITLE;
    const description =
      post.excerpt ||
      (post.content ? post.content.replace(/<[^>]*>/g, "").slice(0, 160) : DEFAULT_DESC);
    const image = getFullImageUrl(post.featured_image);
    const url = `${SITE_URL}/detail-news/${slug}`;

    return res.status(200).send(buildHtml({
      title,
      description,
      image,
      url,
      type: "article",
    }));
  } catch (err) {
    console.error("OG fetch error:", err.message);
    // Fallback to defaults on error
    return res.status(200).send(buildHtml({
      title: DEFAULT_TITLE,
      description: DEFAULT_DESC,
      image: DEFAULT_IMAGE,
      url: `${SITE_URL}/detail-news/${slug}`,
      type: "article",
    }));
  }
}

function buildHtml({ title, description, image, url, type }) {
  const safeTitle = escapeHtml(title);
  const safeDesc = escapeHtml(description);
  const safeImage = escapeHtml(image);
  const safeUrl = escapeHtml(url);

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>${safeTitle}</title>
  <meta name="description" content="${safeDesc}" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="${type}" />
  <meta property="og:url" content="${safeUrl}" />
  <meta property="og:title" content="${safeTitle}" />
  <meta property="og:description" content="${safeDesc}" />
  <meta property="og:image" content="${safeImage}" />
  <meta property="og:site_name" content="Pesantren Riset Al-Muhtada" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${safeUrl}" />
  <meta name="twitter:title" content="${safeTitle}" />
  <meta name="twitter:description" content="${safeDesc}" />
  <meta name="twitter:image" content="${safeImage}" />

  <!-- Redirect real users (non-bot) to the SPA -->
  <meta http-equiv="refresh" content="0;url=${safeUrl}" />
</head>
<body>
  <p>Redirecting to <a href="${safeUrl}">${safeTitle}</a>...</p>
</body>
</html>`;
}
