# All Components Index & Quick Reference

## 📂 Complete Component Map

### Common Components

| Component        | File                   | Purpose              | Props                                       |
| ---------------- | ---------------------- | -------------------- | ------------------------------------------- |
| Pagination       | `Pagination.tsx`       | Page navigation      | `currentPage`, `totalPages`, `onPageChange` |
| ProtectedRoute   | `ProtectedRoute.tsx`   | Route protection     | `children`, `requiredRole`, `fallback`      |
| NewsSection      | `NewsSection.tsx`      | News section wrapper | `title`, `news`, `showViewMore`, `layout`   |
| NewsList         | `NewsList.tsx`         | News list display    | `news`, `layout`, `columns`, `onSelectNews` |
| MultiNewsSection | `MultiNewsSection.tsx` | Multiple sections    | `sections` array                            |

### Global Components

| Component         | File                      | Purpose              | Props                                         |
| ----------------- | ------------------------- | -------------------- | --------------------------------------------- |
| SectionCard       | `SectionCard.tsx`         | Card wrapper         | `title`, `subtitle`, `children`, `action`     |
| ArticleCard       | `card-artikel.tsx`        | Single article card  | `id`, `title`, `excerpt`, `image`, `category` |
| ArticlePopuler    | `artikel-populer.tsx`     | Popular articles     | `articles`, `limit`                           |
| ArticlePopulerAPI | `artikel-populer-api.tsx` | Popular + API        | `apiUrl`, `limit`                             |
| CardArticle       | `card-artikel.tsx`        | Article card variant | Same as ArticleCard                           |
| CardArticleAPI    | `card-artikel-api.tsx`    | Article card + API   | `apiUrl`, `limit`                             |
| CardHeadliner     | `card-headliner.tsx`      | Featured article     | `article`, `onClick`                          |
| CardHeadlinerAPI  | `card-headliner-api.tsx`  | Featured + API       | `apiUrl`                                      |
| TrendingList      | `trending-list.tsx`       | Trending articles    | `articles`, `maxItems`, `layout`              |
| TrendingListAPI   | `trending-list-api.tsx`   | Trending + API       | `apiUrl`, `maxItems`                          |

### Admin Components (components-admin)

| Component        | File                     | Purpose           | Props                                      |
| ---------------- | ------------------------ | ----------------- | ------------------------------------------ |
| GridCard         | `grid-card.tsx`          | Grid layout       | `items`, `columns`, `renderCard`           |
| TableNews        | `table-news.tsx`         | News table        | `news`, `onEdit`, `onDelete`, `pagination` |
| FilterNews       | `filter-news.tsx`        | Filters           | `categories`, `onFilterChange`             |
| Sidebar          | `sidebar.tsx`            | Admin sidebar     | Navigation items                           |
| ModalAddNews     | `modal-add-news.tsx`     | News form modal   | `isOpen`, `onSubmit`, `initialData`        |
| ModalAddJurnal   | `modal-add-jurnal.tsx`   | Journal modal     | Same pattern                               |
| ModalAddPrestasi | `modal-add-prestasi.tsx` | Achievement modal | Same pattern                               |
| SuccessToast     | `success-toast.tsx`      | Notifications     | `message`, `type`, `duration`              |

### Category Components

| Component                    | File        | Purpose               | Location                    |
| ---------------------------- | ----------- | --------------------- | --------------------------- |
| Category specific components | `category/` | Category detail pages | `/src/components/category/` |

### Detail Components

| Component              | File      | Purpose              | Location                  |
| ---------------------- | --------- | -------------------- | ------------------------- |
| Detail page components | `detail/` | Article detail pages | `/src/components/detail/` |

### Home Components

| Component            | File    | Purpose            | Location                |
| -------------------- | ------- | ------------------ | ----------------------- |
| Home page components | `home/` | Home page sections | `/src/components/home/` |

### Dashboard Components

| Component         | File         | Purpose         | Location                     |
| ----------------- | ------------ | --------------- | ---------------------------- |
| Dashboard widgets | `dashboard/` | Admin dashboard | `/src/components/dashboard/` |

### News Components

| Component     | File    | Purpose           | Location                |
| ------------- | ------- | ----------------- | ----------------------- |
| News specific | `news/` | News list/filters | `/src/components/news/` |

### Layout Components

| Component | File       | Purpose      | Location                   |
| --------- | ---------- | ------------ | -------------------------- |
| Layouts   | `layouts/` | Page layouts | `/src/components/layouts/` |

---

## Quick Start Guide by Use Case

### Use Case 1: Display News List with Pagination

```typescript
import { NewsList } from '@/components/common/NewsList';
import { Pagination } from '@/components/common/Pagination';
import { useState } from 'react';

export default function NewsPage() {
  const [page, setPage] = useState(1);
  const [news, setNews] = useState([]);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(news.length / itemsPerPage);

  const displayedNews = news.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <>
      <NewsList news={displayedNews} layout="grid" columns={3} />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </>
  );
}
```

### Use Case 2: Admin News Management

```typescript
import { TableNews } from '@/components/components-admin/table-news';
import { ModalAddNews } from '@/components/components-admin/modal-add-news';
import { FilterNews } from '@/components/components-admin/filter-news';

export default function AdminNews() {
  const [news, setNews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <FilterNews
        categories={[]}
        onFilterChange={(filters) => {
          // Fetch with filters
        }}
      />
      <TableNews
        news={news}
        onEdit={() => setIsModalOpen(true)}
        onDelete={() => {}}
      />
      <ModalAddNews
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={() => {}}
      />
    </>
  );
}
```

### Use Case 3: Home Page with Multiple Sections

```typescript
import { NewsSection } from '@/components/common/NewsSection';
import { TrendingListAPI } from '@/components/components-global/trending-list-api';
import { CardHeadlinerAPI } from '@/components/components-global/card-headliner-api';

export default function HomePage() {
  return (
    <>
      <CardHeadlinerAPI apiUrl="/api/news/featured" />
      <NewsSection
        title="Latest News"
        news={[]}
        layout="horizontal"
      />
      <TrendingListAPI
        apiUrl="/api/news/trending"
        maxItems={5}
      />
    </>
  );
}
```

### Use Case 4: Protected Admin Page

```typescript
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import AdminPanel from '@/pages/admin/AdminPanel';

export default function App() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminPanel />
    </ProtectedRoute>
  );
}
```

---

## Component Import Examples

### Common Components

```typescript
// Import from common folder
import { Pagination } from "@/components/common/Pagination";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { NewsList } from "@/components/common/NewsList";
import { NewsSection } from "@/components/common/NewsSection";
import { MultiNewsSection } from "@/components/common/MultiNewsSection";
```

### Global Components

```typescript
// Import from components-global folder
import { SectionCard } from "@/components/components-global/SectionCard";
import { ArticleCard } from "@/components/components-global/card-artikel";
import { ArticleCardAPI } from "@/components/components-global/card-artikel-api";
import { TrendingList } from "@/components/components-global/trending-list";
import { TrendingListAPI } from "@/components/components-global/trending-list-api";
import { CardHeadliner } from "@/components/components-global/card-headliner";
import { CardHeadlinerAPI } from "@/components/components-global/card-headliner-api";
```

### Admin Components

```typescript
// Import from components-admin folder
import { TableNews } from "@/components/components-admin/table-news";
import { ModalAddNews } from "@/components/components-admin/modal-add-news";
import { FilterNews } from "@/components/components-admin/filter-news";
import { GridCard } from "@/components/components-admin/grid-card";
import { SuccessToast } from "@/components/components-admin/success-toast";
import { Sidebar } from "@/components/components-admin/sidebar";
```

---

## Component Props TypeScript Interfaces

### Common Components

```typescript
// Pagination
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

// NewsList
interface NewsListProps {
  news: News[];
  layout?: "grid" | "list" | "compact";
  columns?: 1 | 2 | 3 | 4;
  onSelectNews?: (id: number) => void;
}

// NewsSection
interface NewsSectionProps {
  title: string;
  news: News[];
  showViewMore?: boolean;
  onViewMore?: () => void;
  layout?: "horizontal" | "vertical";
}

// ProtectedRoute
interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "user" | "admin" | "editor";
  fallback?: ReactNode;
}
```

### Global Components

```typescript
// SectionCard
interface SectionCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// ArticleCard
interface ArticleCardProps {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  author: string;
  onClick?: () => void;
}
```

### Admin Components

```typescript
// TableNews
interface TableNewsProps {
  news: NewsItem[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onPublish?: (id: number) => void;
  pagination?: PaginationConfig;
}

// ModalAddNews
interface ModalAddNewsProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewsFormData) => Promise<void>;
  initialData?: NewsItem;
}

// FilterNews
interface FilterNewsProps {
  categories: Category[];
  onFilterChange: (filters: FilterOptions) => void;
  onReset?: () => void;
}
```

---

## Common Patterns

### Pattern 1: API-Connected Component

```typescript
// Use *-api variants for automatic API calls
import { CardArticleAPI } from '@/components/components-global/card-artikel-api';

<CardArticleAPI
  apiUrl="/api/articles"
  limit={10}
/>
// Automatically fetches from API and displays
```

### Pattern 2: Controlled Component

```typescript
// Parent controls state
const [selectedId, setSelectedId] = useState(null);

<Component
  selectedId={selectedId}
  onChange={setSelectedId}
/>
```

### Pattern 3: Render Prop

```typescript
<GridCard
  items={items}
  renderCard={(item) => (
    <div>{item.title}</div>
  )}
/>
```

### Pattern 4: Compound Components

```typescript
<NewsSection title="Latest">
  <NewsSection.Header />
  <NewsSection.Content news={news} />
  <NewsSection.Footer />
</NewsSection>
```

---

## State Management Recommendations

### For Simple Components

```typescript
// Use useState for local state
const [currentPage, setCurrentPage] = useState(1);
```

### For Complex Components

```typescript
// Use useReducer for multiple state
const [state, dispatch] = useReducer(reducer, initialState);
```

### For Global State

```typescript
// Consider using Context API or external state management
import { useNews } from "@/context/NewsContext";
const { news, loading } = useNews();
```

---

## Error Handling Pattern

```typescript
const [error, setError] = useState<string | null>(null);

try {
  const response = await fetch(url);
  if (!response.ok) throw new Error('API Error');
  const data = await response.json();
} catch (error) {
  setError(error instanceof Error ? error.message : 'Unknown error');
}

{error && <ErrorBoundary error={error} />}
```

---

## Performance Optimization

### Memoization

```typescript
import { memo } from 'react';

export const ArticleCard = memo(function ArticleCard(props) {
  return <div>{/* ... */}</div>;
});
```

### Lazy Loading

```typescript
import { lazy, Suspense } from 'react';

const AdminPanel = lazy(() => import('@/pages/admin/AdminPanel'));

<Suspense fallback={<Loading />}>
  <AdminPanel />
</Suspense>
```

### Code Splitting

```typescript
// Already built-in with React Router
<Route path="/admin/*" element={<AdminLayout />} />
```

---

## Styling Approach

All components use **Tailwind CSS** for styling.

### Custom Styling Example

```typescript
<Pagination
  className="flex gap-3 justify-center my-8"
  // ... other props
/>
```

### Extending Styles

```typescript
// In your CSS file
@layer components {
  .custom-pagination {
    @apply flex gap-2 justify-center;
  }
}

// Usage
<Pagination className="custom-pagination" />
```

---

## Testing Components

### Testing with React Testing Library

```typescript
import { render, screen } from '@testing-library/react';
import { Pagination } from '@/components/common/Pagination';

test('Pagination renders page numbers', () => {
  render(
    <Pagination
      currentPage={1}
      totalPages={5}
      onPageChange={jest.fn()}
    />
  );

  expect(screen.getByText('2')).toBeInTheDocument();
});
```

---

## Accessibility

All components follow accessibility best practices:

- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Proper color contrast

---

**Last Updated:** January 28, 2026  
**Version:** 1.0.0  
**Quick Links:**

- [Components Usage Guide](./COMPONENTS-USAGE-GUIDE.md)
- [Pagination & Table Guide](./PAGINATION-TABLE-GUIDE.md)
- [AI Components Guide](./AI-COMPONENTS-GUIDE.md)
