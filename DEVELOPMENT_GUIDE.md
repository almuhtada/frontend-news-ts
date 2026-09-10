# Pedoman Pengembangan: Frontend News (frontend-news-ts)

> Website publik berita Pesantren Riset Al-Muhtada — portal berita, profil organisasi, dan konten CMS.
> Domain: `almuhtada.org`

---

## Tech Stack

| Layer          | Teknologi                    | Versi    |
|----------------|------------------------------|----------|
| Framework      | React                        | 19.1.1   |
| Bahasa         | TypeScript                   | ~5.8.3   |
| Build Tool     | Vite + SWC                   | 7.1.2    |
| Styling        | Tailwind CSS                 | 4.1.13   |
| Routing        | react-router-dom             | 7.8.2    |
| Animasi        | framer-motion                | 12.23.12 |
| Ikon           | lucide-react + react-icons   | -        |
| SEO            | react-helmet-async           | 3.0.0    |
| Sanitasi HTML  | dompurify                    | 3.3.1    |
| Analytics      | @vercel/analytics            | 2.0.1    |
| Deploy         | Vercel (primary), Docker/Nginx (secondary) |

---

## Environment Variables

```env
VITE_API_URL=https://api.almuhtada.org/api   # Backend API base URL
VITE_ADSENSE_SLOT=                            # Google AdSense slot ID (opsional)
```

Untuk development lokal, ubah ke `http://localhost:3001/api`.

---

## Struktur Folder

```
src/
├── assets/           # Gambar, logo, data dummy statis
│   ├── data/         # dummy.tsx — data populer, achievements, articles statis
│   └── image/        # logo.svg, logo1.png
│
├── components/       # SEMUA komponen UI (dikelompokkan per fitur/halaman)
│   ├── category/     # Komponen halaman kategori
│   ├── common/       # Komponen shared/reusable
│   ├── components-global/  # Card global (versi API + versi statis)
│   ├── components-news/    # Legacy card berita statis
│   ├── detail/       # Komponen halaman detail artikel
│   ├── home/         # Komponen halaman beranda
│   ├── layouts/      # Master layout (Navbar + Footer + CookieConsent)
│   └── news/         # Komponen halaman daftar berita
│
├── config/           # Konfigurasi API endpoint & konstanta
├── context/          # React Context (tema, toast)
├── hooks/            # Custom hooks (data fetching per halaman)
├── pages/            # Halaman-halaman route utama
│   ├── detail/       # Halaman detail artikel
│   └── profile/      # Halaman profil pesantren (program, prestasi, dll)
├── services/         # Layer API (semua panggilan ke backend)
├── types/            # TypeScript interfaces terpusat
├── ui/               # Navbar + Footer
│   ├── footer/
│   └── navbar/
└── utils/            # Utilitas (format tanggal, excerpt, paragraf)
```

---

## Arsitektur & Pola Utama

### Pola Service → Hook → Component

```
services/posts.ts    →  hooks/useHomeData.ts    →  pages/Home.tsx
(panggil API)           (kelola state & cache)     (render UI)
```

- **Services** (`src/services/`): Panggil API backend, return data mentah
- **Hooks** (`src/hooks/`): Kelola useState, useEffect, caching, logika bisnis
- **Components** (`src/components/`): Presentational, terima data via props

### TIDAK ADA global state library (Redux/Zustand). State dikelola via:
1. **React Context** — hanya tema (dark/light) dan toast notifikasi
2. **Custom Hooks** — satu hook per halaman untuk data fetching
3. **Module-level cache** — variabel module untuk cache settings (5 menit TTL)
4. **localStorage cache** — home data cache (5 menit TTL)

---

## Routing

Semua route didefinisikan di `src/App.tsx`:

| Path                        | Komponen            | Keterangan                    |
|-----------------------------|---------------------|-------------------------------|
| `/`                         | Home                | Beranda                       |
| `/news`                     | → redirect ke `/`   |                               |
| `/search`                   | SearchResults       | Query param `?q=`             |
| `/detail-news/:slug`        | DetailNews          | Halaman detail artikel        |
| `/category/:slug`           | CategoryPage        | Artikel per kategori          |
| `/author/:username`         | AuthorPage          | Profil penulis + artikelnya   |
| `/program-pengajar`         | ProgramPengajar     | Wrapped PublicPageLayout      |
| `/tentang-pesantren`        | TentangPesantren    | Wrapped PublicPageLayout      |
| `/pendaftaran`              | Pendaftaran         | Wrapped PublicPageLayout      |
| `/prestasi-mahasantri`      | PrestasiMahasantri  | Wrapped PublicPageLayout      |
| `/publikasi-mahasantri`     | PublikasiMahasantri | Wrapped PublicPageLayout      |
| `/griya-quran`              | GriyaQuran          | Wrapped PublicPageLayout      |

**Catatan:** Tidak ada lazy loading/code splitting — semua route di-load sekaligus.

---

## Daftar Komponen

### `components/common/` — Komponen Shared

| Komponen           | Fungsi                                                |
|--------------------|-------------------------------------------------------|
| `SEO`              | Wrapper `<Helmet>` untuk meta tags, OG tags, JSON-LD  |
| `Pagination`       | Navigasi halaman dengan nomor, prev/next              |
| `ProfileHero`      | Banner hero dengan judul, deskripsi, badge             |
| `MultiNewsSection` | Render multiple `NewsSection` dengan skeleton loading  |
| `NewsSection`      | Satu section berita dengan ikon, judul, scroll card    |
| `NewsList`         | Daftar artikel vertikal dengan pagination client-side  |
| `AdSense`          | Wrapper unit Google AdSense                            |
| `CookieConsent`    | Banner persetujuan cookie                              |

### `components/home/` — Beranda

| Komponen              | Fungsi                                       |
|-----------------------|----------------------------------------------|
| `FeaturedSection`     | Carousel headliner utama                     |
| `HomeSidebar`         | Trending, topik hangat, social links, AdSense |
| `OtherNewsGrid`       | Grid artikel sisa dengan pagination          |
| `CategoryFilter`      | Tab filter kategori horizontal               |
| `CategoryNewsBlocks`  | Artikel dikelompokkan per kategori           |
| `LatestNewsSection`   | Artikel terbaru dengan infinite scroll       |
| `ViralSection`        | Artikel viral/trending                       |

### `components/detail/` — Detail Artikel

| Komponen          | Fungsi                                                |
|-------------------|-------------------------------------------------------|
| `ArticleHeader`   | Breadcrumb + judul + tanggal                          |
| `AuthorInfo`      | Info penulis/editor, expandable, link ke author page   |
| `FeaturedImage`   | Gambar utama full-width dengan caption                 |
| `ArticleContent`  | Render konten (559 baris): Arabic text, blockquote, code, DOMPurify sanitization, pagination per paragraf |
| `ArticleLike`     | Tombol like dengan counter, anonymous user identifier  |
| `ArticleComments` | Form komentar + komentar threaded (347 baris)          |
| `ArticleTags`     | Pill tag                                               |
| `SocialShare`     | Tombol share (WA, Telegram, FB, Twitter, email, copy)  |
| `RelatedPosts`    | Grid artikel terkait dari recommendation engine        |

### `components/components-global/` — Card Global (Ada 2 versi)

| Komponen (API)          | Komponen (Statis)    | Fungsi                           |
|-------------------------|----------------------|----------------------------------|
| `card-headliner-api`    | `card-headliner`     | Carousel slider animasi          |
| `card-artikel-api`      | `card-artikel`       | Card artikel (gambar, kategori)  |
| `trending-list-api`     | `trending-list`      | Daftar trending bernomor         |
| `artikel-populer-api`   | `artikel-populer`    | Widget sidebar artikel populer   |

> **Catatan:** Versi `-api` menggunakan data dari backend. Versi statis menggunakan `dummy.tsx`. Gunakan versi `-api` untuk fitur baru.

### `ui/navbar/` — Navigasi

| Komponen     | Fungsi                                                  |
|--------------|----------------------------------------------------------|
| `Navbar`     | Navbar utama (659 baris): logo, search, nav, tema, Google Translate (11 bahasa), scroll-aware |
| `DesktopNav` | Nav horizontal desktop: kategori, dropdown "Profil" & "Lainnya" |
| `MobileNav`  | Nav mobile horizontal scrolling                          |
| `SearchBar`  | Form pencarian → navigate ke `/search?q=...`            |
| `Dropdown`   | Dropdown reusable (variant: default, pill, ghost, outline, nav) |

### `ui/footer/`

| Komponen | Fungsi                                                   |
|----------|-----------------------------------------------------------|
| `Footer` | 4 kolom: logo/kontak, profil links, kategori (API), social media |

---

## Services (API Layer)

Semua di `src/services/`. Core HTTP client: `api.ts` — class `ApiService` yang wrap `fetch`.

| Service                  | Endpoint Utama                     | Fungsi                            |
|--------------------------|------------------------------------|-----------------------------------|
| `postsService`           | `/posts`, `/home`                  | CRUD artikel + home feed          |
| `categoriesService`      | `/categories`                      | Ambil kategori                    |
| `authorsService`         | `/authors/:username`               | Ambil artikel per penulis         |
| `interactionService`     | `/posts/:id/like`, `/comments`     | Like & komentar (class-based)     |
| `tagsService`            | `/tags`                            | CRUD tag                          |
| `settingsService`        | `/settings`                        | Pengaturan situs                  |
| `recommendationsService` | `/recommendations/*`               | Related posts, trending, bookmark |
| `aboutService`           | `/about`                           | Seksi "Tentang"                   |
| `achievementsService`    | `/achievements`                    | Prestasi                          |
| `publicationsService`    | `/publications`                    | Publikasi                         |
| `pageContentsService`    | `/page-contents`                   | Konten halaman CMS                |
| `notificationsService`   | `/notifications`                   | Notifikasi                        |
| `statsService`           | `/stats/*`                         | Statistik                         |

### Cara Pakai Service

```tsx
import { postsService } from "../services";

// Di dalam custom hook:
const { data } = await postsService.getPosts({ page: 1, limit: 10, status: "publish" });
```

---

## Custom Hooks (Data Fetching)

| Hook              | Untuk Halaman      | Fungsi Utama                                   |
|-------------------|--------------------|-------------------------------------------------|
| `useHomeData`     | Home (`/`)         | Agregasi: featured, trending, viral, recent, recommended, categories, hot topics. Cache localStorage 5 menit |
| `useDetailData`   | Detail artikel     | Fetch post by slug + related posts + copy protection |
| `useNewsData`     | Daftar berita      | Filter kategori, pagination client-side (6/hal) |
| `useCategoryData` | Halaman kategori   | Filter per kategori, pagination server-side (12/hal) |
| `useAuthorData`   | Halaman penulis    | Profil penulis + artikel paginated              |
| `useSettings`     | Global             | Settings situs, cache module-level 5 menit      |
| `useTheme`        | Global             | Consumer ThemeContext (dark/light)               |

---

## Types (TypeScript)

Semua terpusat di `src/types/index.ts` (~273 baris). Entity utama:

| Type                   | Keterangan                                      |
|------------------------|-------------------------------------------------|
| `Post`                 | Artikel: title, slug, content, author, categories, tags, views, status |
| `Author`               | Penulis: display_name, role, user_url            |
| `Category`             | Kategori: name, slug, parent/children, post_count |
| `Tag`                  | Tag: name, slug                                  |
| `Comment`              | Komentar threaded: content, status, user          |
| `ApiResponse<T>`       | Wrapper generic `{ success, data, message }`     |
| `PaginatedResponse<T>` | Extends ApiResponse + pagination meta            |

Type tambahan per service file (lihat masing-masing file service untuk interface spesifik).

---

## Styling

- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- **Dark mode**: Class-based (`dark` class di `<html>`), toggle via ThemeContext
- **Font**: Inter (body), Playfair Display (headline), Poppins (config)
- **Warna utama**: Emerald/green (komponen), Blue (tailwind config)
- **Breakpoint**: Mobile-first (`sm:`, `md:`, `lg:`)
- **Max width**: `max-w-[1500px]`
- **Semua styling inline** menggunakan utility class Tailwind, TIDAK ada CSS modules

---

## Panduan untuk AI / Developer Baru

### Menambah Halaman Baru

1. Buat file di `src/pages/`
2. Buat custom hook di `src/hooks/` untuk data fetching
3. Tambah route di `src/App.tsx`
4. Wrap dengan `<PublicPageLayout>` jika butuh Navbar + Footer

### Menambah Komponen Baru

1. Taruh di folder yang sesuai:
   - `components/common/` → reusable di banyak halaman
   - `components/home/` → khusus beranda
   - `components/detail/` → khusus detail artikel
   - `components/category/` → khusus halaman kategori
2. Styling pakai Tailwind utility class
3. Support dark mode: tambah `dark:` prefix di class

### Memanggil API Backend

1. Cek apakah endpoint sudah ada di `config/api.ts` (daftar `API_ENDPOINTS`)
2. Cek apakah service sudah ada di `services/`
3. Jika belum, tambah endpoint di `config/api.ts`, lalu buat service baru atau tambah method di service yang ada
4. Panggil dari custom hook, BUKAN langsung dari komponen

```tsx
// ❌ Jangan langsung di komponen
useEffect(() => {
  fetch("/api/posts").then(...)
}, []);

// ✅ Lewat service + hook
// hooks/useMyData.ts
const useMyData = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    postsService.getPosts({}).then(res => setData(res.data));
  }, []);
  return { data };
};
```

### Menampilkan Gambar dari Backend

```tsx
import { getImageUrl } from "../config/api";

<img src={getImageUrl(post.featured_image)} alt={post.title} />
```

### Dark Mode

Semua komponen harus support dark mode. Contoh:

```tsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  <p className="text-gray-600 dark:text-gray-400">Konten</p>
</div>
```

---

## Fitur Penting yang Perlu Diketahui

1. **Copy Protection** — `useDetailData` disable right-click, Ctrl+C, text selection di detail artikel
2. **WordPress Content Parser** — `utils/formatParagraph.ts` (621 baris) parse HTML WordPress termasuk Arabic text, Gutenberg blocks, shortcode
3. **Google Translate** — Widget translate tersembunyi UI aslinya, 11 bahasa, cookie persistence
4. **AdSense** — Ada proteksi CSS supaya iklan tidak menimpa header/navbar
5. **Vercel Serverless** — `api/og.js` untuk OG tags social media crawler, `api/sitemap.js` untuk sitemap
6. **Recommendation Engine** — Header `X-User-Identifier` untuk personalisasi anonim
7. **Dual Component Versions** — `components-global/` punya versi API (`*-api.tsx`) dan statis (`*.tsx`). Pakai versi API untuk produksi.

---

## Deployment

### Vercel (Primary)
- Push ke repo → auto deploy
- Konfigurasi di `vercel.json` (SPA rewrite, sitemap, OG handler)

### Docker (Secondary)
- `Dockerfile`: Multi-stage Node 18 build → Nginx Alpine serve
- `nginx.conf`: Proxy `/api/` ke `backend:3001`, serve SPA, cache static assets 30 hari
