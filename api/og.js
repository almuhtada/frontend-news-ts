// Vercel Serverless Function — Dynamic OG Meta Tags for Social Media Crawlers

const API_BASE = process.env.API_URL || "http://api.almuhtada.org/api";
const SITE_URL = "https://almuhtada.org";
const DEFAULT_TITLE =
  "Pesantren Riset Al-Muhtada - Mencetak Muslim Intelektual Unggul";
const DEFAULT_DESC =
  "Pesantren Riset Al-Muhtada adalah pesantren mahasiswa di Semarang yang berfokus mencetak muslim intelektual berakhlak mulia, berprestasi, dan terampil riset.";
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

function getFullImageUrl(imgPath) {
  if (!imgPath) return DEFAULT_IMAGE;
  if (imgPath.startsWith("http")) return imgPath;
  const serverBase = API_BASE.replace(/\/api\/?$/, "");
  return `${serverBase}${imgPath.startsWith("/") ? imgPath : `/${imgPath}`}`;
}

function buildHtml({ title, description, image, url, type }) {
  const t = escapeHtml(title);
  const d = escapeHtml(description);
  const i = escapeHtml(image);
  const u = escapeHtml(url);

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>${t}</title>
  <meta name="description" content="${d}" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="${type}" />
  <meta property="og:url" content="${u}" />
  <meta property="og:title" content="${t}" />
  <meta property="og:description" content="${d}" />
  <meta property="og:image" content="${i}" />
  <meta property="og:site_name" content="Pesantren Riset Al-Muhtada" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${u}" />
  <meta name="twitter:title" content="${t}" />
  <meta name="twitter:description" content="${d}" />
  <meta name="twitter:image" content="${i}" />
</head>
<body>
  <p><a href="${u}">${t}</a></p>
</body>
</html>`;
}

module.exports = async function handler(req, res) {
  const slug = req.query.slug || "";

  if (!slug) {
    return res.status(200).send(
      buildHtml({
        title: DEFAULT_TITLE,
        description: DEFAULT_DESC,
        image: DEFAULT_IMAGE,
        url: SITE_URL,
        type: "website",
      })
    );
  }

  try {
    const apiUrl = `${API_BASE}/posts/${slug}`;
    const apiRes = await fetch(apiUrl);
    if (!apiRes.ok) throw new Error(`API responded ${apiRes.status}`);

    const json = await apiRes.json();
    const post = json.data || json;

    const title = post.title
      ? `${post.title} | Pesantren Riset Al-Muhtada`
      : DEFAULT_TITLE;
    const description =
      post.excerpt ||
      post.summary ||
      (post.content
        ? post.content.replace(/<[^>]*>/g, "").slice(0, 160)
        : DEFAULT_DESC);
    const image = getFullImageUrl(post.featured_image);
    const url = `${SITE_URL}/detail-news/${slug}`;

    return res.status(200).send(
      buildHtml({ title, description, image, url, type: "article" })
    );
  } catch (err) {
    console.error("OG fetch error:", err);
    return res.status(200).send(
      buildHtml({
        title: DEFAULT_TITLE,
        description: DEFAULT_DESC,
        image: DEFAULT_IMAGE,
        url: `${SITE_URL}/detail-news/${slug}`,
        type: "article",
      })
    );
  }
};
