// Vercel Serverless Function — Sitemap.xml dinamis untuk mesin pencari
// Mengambil semua berita terpublish dari API backend dan membangkitkan sitemap.

const API_BASE = process.env.API_URL || "https://api.almuhtada.org/api";
const SITE_URL = "https://almuhtada.org";
const MAX_URLS_PER_SITEMAP = 10000;

const STATIC_PAGES = [
  { loc: "/", changefreq: "daily", priority: "1.0" },
  { loc: "/news", changefreq: "daily", priority: "0.9" },
  { loc: "/tentang-pesantren", changefreq: "monthly", priority: "0.7" },
  { loc: "/program-pengajar", changefreq: "monthly", priority: "0.7" },
  { loc: "/pendaftaran", changefreq: "monthly", priority: "0.7" },
  { loc: "/prestasi-mahasantri", changefreq: "monthly", priority: "0.7" },
  { loc: "/publikasi-mahasantri", changefreq: "monthly", priority: "0.7" },
  { loc: "/griya-quran", changefreq: "monthly", priority: "0.7" },
];

function xmlEscape(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildSitemap(urls) {
  const urlTags = urls
    .map(
      (u) => `<url>
    <loc>${xmlEscape(u.loc)}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}
    <changefreq>${u.changefreq || "monthly"}</changefreq>
    <priority>${u.priority || "0.5"}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  <url>
    <loc>${SITE_URL}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
${urlTags}
</urlset>`;
}

async function fetchAllPosts() {
  const all = [];
  let page = 1;
  const perPage = 100;

  while (page <= 50) {
    const url = `${API_BASE}/posts?page=${page}&limit=${perPage}&status=publish`;
    const res = await fetch(url);
    if (!res.ok) break;

    const json = await res.json();
    const posts = Array.isArray(json) ? json : json.data;
    if (!posts || posts.length === 0) break;

    all.push(...posts);
    const pagination = json.pagination;
    if (pagination) {
      if (page >= pagination.totalPages) break;
    } else if (posts.length < perPage) {
      break;
    }
    page++;
  }
  return all;
}

module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");

  const urls = STATIC_PAGES.map((p) => ({
    ...p,
    loc: `${SITE_URL}${p.loc}`,
  }));

  try {
    const posts = await fetchAllPosts();
    for (const post of posts) {
      const lastmod = post.updatedAt || post.published_at || post.createdAt;
      const dateStr = lastmod ? lastmod.slice(0, 10) : new Date().toISOString().slice(0, 10);
      urls.push({
        loc: `${SITE_URL}/detail-news/${post.slug}`,
        lastmod: dateStr,
        changefreq: "daily",
        priority: "0.8",
      });
    }
  } catch (err) {
    // Jika API bermasalah, tetap kirim sitemap dengan halaman statis agar tidak error
    console.error("Sitemap fetch error:", err);
  }

  if (urls.length > MAX_URLS_PER_SITEMAP) {
    return res.status(200).send(
      `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${SITE_URL}/sitemap.xml</loc></sitemap></sitemapindex>`
    );
  }

  return res.status(200).send(buildSitemap(urls));
};