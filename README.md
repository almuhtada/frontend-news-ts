# Al-Muhtada News — Frontend

Aplikasi berita **Al-Muhtada** dibangun dengan React 19, TypeScript, Vite, dan Tailwind CSS. Menampilkan berita pesantren dengan fitur AI summary, dark mode, komentar, like, dan infinite scroll.

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 7 + SWC |
| Styling | Tailwind CSS 4 |
| Routing | React Router DOM 7 |
| Animasi | Framer Motion |
| Icons | Lucide React |
| Chart | Recharts |
| Sanitasi HTML | DOMPurify |

---

## Prasyarat

- Node.js >= 18
- Backend API berjalan (lihat `../backend-news-js`)

---

## Instalasi & Development

```bash
cd frontend-news-ts
npm install

# Development server (http://localhost:5173)
npm run dev

# Build production
npm run build

# Preview hasil build
npm run preview

# Lint
npm run lint
```

---

## Konfigurasi Environment

```bash
cp .env.example .env   # jika ada
```

Atau buat file `.env`:

```env
VITE_API_URL=http://localhost:3001/api
```

Jika tidak diset, default ke `http://api.almuhtada.org/api`.

---

## Struktur Folder

```
src/
├── types/
│   └── index.ts                  # ★ Semua shared types/interfaces terpusat di sini
│
├── config/
│   ├── api.ts                    # API_BASE_URL, API_ENDPOINTS, getImageUrl()
│   └── constants.ts              # Konstanta global (placeholder images, dll)
│
├── context/
│   └── ThemeContext.tsx          # Dark mode context provider
│
├── hooks/
│   ├── useTheme.ts               # Hook: akses ThemeContext
│   ├── useHomeData.ts            # Hook: data halaman Home (featured, trending, dll)
│   ├── useNewsData.ts            # Hook: data halaman News (pagination, filter)
│   ├── useDetailData.ts          # Hook: data halaman Detail berita (post, related)
│   ├── useCategoryData.ts        # Hook: data halaman Kategori
│   ├── useAuthorData.ts          # Hook: data halaman Author
│   └── useSettings.ts            # Hook: settings website
│
├── services/
│   ├── index.ts                  # ★ Barrel export semua services & types
│   ├── api.ts                    # ApiService class (fetch wrapper)
│   ├── posts.ts                  # postsService (CRUD, popular, trending)
│   ├── categories.ts             # categoriesService
│   ├── tags.ts                   # tagsService
│   ├── authors.ts                # authorsService
│   ├── interactions.ts           # interactionService (like, comment)
│   ├── about.ts                  # aboutService
│   ├── achievements.ts           # achievementsService
│   ├── publications.ts           # publicationsService
│   ├── pageContents.ts           # pageContentsService
│   ├── notifications.ts          # notificationsService
│   ├── settings.ts               # settingsService
│   ├── stats.ts                  # statsService
│   └── users.ts                  # usersService
│
├── utils/
│   ├── index.ts                  # ★ Barrel export semua utils
│   ├── formatDate.ts             # formatTimeAgo, formatDateLong, formatDateTime
│   ├── excerptGenerator.ts       # generateSmartExcerpt, generateSimpleExcerpt
│   ├── formatParagraph.ts        # Konversi HTML WP ke paragraf bersih
│   └── userIdentifier.ts        # getUserIdentifier() untuk like anonim
│
├── pages/
│   ├── Home.tsx                  # Halaman utama (hero, trending, terbaru)
│   ├── News.tsx                  # Daftar semua berita
│   ├── SearchResults.tsx         # Hasil pencarian
│   ├── AuthorPage.tsx            # Profil penulis & post-nya
│   ├── Pendidikan.tsx            # Halaman pendidikan
│   ├── Sejarah.tsx               # Halaman sejarah / category fallback
│   ├── Profile.tsx               # Halaman profil umum
│   ├── detail/
│   │   └── detail-news.tsx       # Halaman detail artikel
│   └── profile/
│       ├── tentang-pesantren.tsx
│       ├── program-pengajar.tsx
│       ├── prestasi-mahasantri.tsx
│       ├── publikasi-mahasantri.tsx
│       ├── griya-quran.tsx
│       └── pendaftaran-mahasantri.tsx
│
├── components/
│   ├── layouts/
│   │   └── PublicPageLayout.tsx  # Layout wrapper (Navbar + Footer)
│   │
│   ├── common/                   # Reusable components antar halaman
│   │   ├── index.ts
│   │   ├── Pagination.tsx
│   │   ├── NewsList.tsx
│   │   ├── NewsSection.tsx
│   │   └── MultiNewsSection.tsx
│   │
│   ├── home/                     # Komponen khusus halaman Home
│   │   ├── FeaturedSection.tsx   # Carousel berita unggulan
│   │   ├── ViralSection.tsx      # Berita viral/trending
│   │   ├── LatestNewsSection.tsx # Berita terbaru + infinite scroll
│   │   ├── CategoryFilter.tsx    # Filter kategori
│   │   └── HomeSidebar.tsx       # Sidebar kanan Home
│   │
│   ├── detail/                   # Komponen khusus halaman Detail
│   │   ├── ArticleHeader.tsx
│   │   ├── ArticleContent.tsx
│   │   ├── ArticleComments.tsx
│   │   ├── ArticleLike.tsx
│   │   ├── ArticleTags.tsx
│   │   ├── AuthorInfo.tsx
│   │   ├── FeaturedImage.tsx
│   │   ├── RelatedPosts.tsx
│   │   ├── SocialShare.tsx
│   │   └── Pagination.tsx
│   │
│   ├── news/                     # Komponen khusus halaman News
│   │   ├── HeroSection.tsx
│   │   ├── ArticlesList.tsx
│   │   ├── Features.tsx
│   │   ├── QuickBites.tsx
│   │   └── NewsSidebar.tsx
│   │
│   ├── category/                 # Komponen khusus halaman Kategori
│   │   ├── CategoryHero.tsx
│   │   ├── CategoryArticles.tsx
│   │   └── CategorySidebar.tsx
│   │
│   └── components-global/        # Komponen card reusable (API & static)
│       ├── SectionCard.tsx
│       ├── card-artikel.tsx / card-artikel-api.tsx
│       ├── card-headliner.tsx / card-headliner-api.tsx
│       ├── artikel-populer.tsx / artikel-populer-api.tsx
│       └── trending-list.tsx / trending-list-api.tsx
│
├── ui/
│   ├── navbar/
│   │   ├── Navbar.tsx
│   │   ├── Navlink.tsx
│   │   ├── Dropdown.tsx
│   │   ├── DropdownItem.tsx
│   │   └── SearchBar.tsx
│   └── footer/
│       └── Footer.tsx
│
└── assets/
    ├── image/
    │   ├── logo.svg
    │   └── logo1.png
    ├── data/
    │   └── dummy.tsx             # Data dummy untuk development
    └── react.svg
```

---

## Routing

| URL | Komponen | Keterangan |
|---|---|---|
| `/` | `Home` | Halaman utama |
| `/news` | `News` | Daftar semua berita |
| `/search` | `SearchResults` | Hasil pencarian |
| `/detail-news/:slug` | `DetailNews` | Artikel detail |
| `/category/:slug` | `SejarahPage` | Berita per kategori |
| `/author/:username` | `AuthorPage` | Profil penulis |
| `/pendidikan` | `PendidikanPage` | Halaman pendidikan |
| `/program-pengajar` | `ProgramPengajar` | Program pengajar |
| `/tentang-pesantren` | `TentangPesantren` | Tentang pesantren |
| `/pendaftaran` | `Pendaftaran` | Pendaftaran mahasantri |
| `/prestasi-mahasantri` | `PrestasiMahasantri` | Prestasi |
| `/publikasi-mahasantri` | `PublikasiMahasantri` | Publikasi |
| `/griya-quran` | `GriyaQuran` | Griya Quran |

---

## Architecture

### Data Flow

```
pages/
  └── menggunakan hooks/
        └── memanggil services/
              └── memanggil api.ts (fetch wrapper)
                    └── memanggil Backend REST API
```

### Hooks Pattern

Setiap halaman punya custom hook-nya sendiri yang handle semua state & fetch:

```ts
// pages/Home.tsx — HANYA render
const { featuredArticles, trendingNews, isLoading } = useHomeData();

// hooks/useHomeData.ts — SEMUA logic & state
export const useHomeData = () => { ... };
```

### Types

Semua shared types ada di `src/types/index.ts`. **Jangan** definisikan interface/type di dalam service file jika akan dipakai di lebih dari satu tempat.

```ts
// BENAR — import dari types/
import type { Post, Author, Category } from "../types";

// HINDARI — tipe tersebar di service file
import type { Post } from "../services/posts";
```

### Services

Setiap service bertugas satu domain saja. Import dari barrel:

```ts
import { postsService, categoriesService } from "../services";
import type { Post, PostsParams } from "../services";
```

### Utils

```ts
import { formatTimeAgo, formatDateLong, generateSmartExcerpt } from "../utils";
import formatEveryFourSentences from "../utils/formatParagraph";
```

---

## Fitur Utama

### Dark Mode
Toggle dark/light mode disimpan di `localStorage`. Diimplementasikan via `ThemeContext` + `useTheme()` hook.

```tsx
import { useTheme } from "../hooks/useTheme";
const { isDark, toggleTheme } = useTheme();
```

### Infinite Scroll
Halaman Home punya infinite scroll yang load artikel tambahan saat user scroll ke bawah menggunakan `IntersectionObserver` di `useHomeData`.

### AI Summary
Artikel yang dibuat di backend otomatis punya field `summary` hasil generate Groq AI. Frontend menampilkan `summary` atau fallback ke `excerpt`.

### Content Sanitasi
Konten dari WordPress diproses oleh `utils/formatParagraph.ts` untuk:
- Strip shortcode WP
- Strip Gutenberg block comments
- Konversi list HTML ke plain text dengan bullet/numbering
- Handle tabel, blockquote, heading
- Decode HTML entities

### Like Anonim
Like bisa dilakukan tanpa login menggunakan identifier unik yang disimpan di `localStorage` (`utils/userIdentifier.ts`).

---

## Konvensi Kode

| Hal | Konvensi |
|---|---|
| Komponen React | PascalCase (`ArticleHeader.tsx`) |
| Hooks | `useXxx.ts` (misal: `useTheme.ts`) |
| Services | `domain.ts` (misal: `posts.ts`) |
| Types | Di `src/types/index.ts` |
| Utils | camelCase function, file camelCase |
| CSS class | Tailwind utility classes |

---

## Environment Variables

| Variable | Default | Keterangan |
|---|---|---|
| `VITE_API_URL` | `http://api.almuhtada.org/api` | URL backend API |

---

## Docker

```bash
docker build -t almuhtada-frontend .
docker run -p 80:80 almuhtada-frontend
```

Atau dengan Docker Compose dari root project.

---

## Deployment

- **Vercel**: sudah ada `vercel.json`, push ke repo untuk auto-deploy
- **Nginx**: sudah ada `nginx.conf`, build lalu serve folder `dist/`
- **Docker**: sudah ada `Dockerfile`
