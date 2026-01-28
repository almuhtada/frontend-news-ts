# Components Documentation

## 📖 Daftar Isi

1. [Overview](#overview)
2. [Common Components](#common-components)
3. [Global Components](#global-components)
4. [Admin Components](#admin-components)
5. [Component Patterns](#component-patterns)
6. [Usage Examples](#usage-examples)

---

## Overview

Components di project ini tersusun dalam beberapa folder berdasarkan fungsi dan penggunaan:

```
src/components/
├── common/              # Components umum yang bisa dipakai dimana saja
├── components-global/   # Global components (header, footer, dll)
├── components-admin/    # Components khusus admin panel
├── category/            # Components untuk category pages
├── detail/              # Components untuk detail pages
├── home/                # Components untuk home page
├── layouts/             # Layout wrappers
├── news/                # Components untuk news pages
└── dashboard/           # Dashboard components
```

---

## Common Components

Components di folder `common/` adalah reusable components yang bisa digunakan di berbagai tempat.

### 1. **Pagination.tsx**

Component untuk pagination dengan support customization.

#### Props:

```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}
```

#### Penggunaan:

```typescript
import { Pagination } from '@/components/common/Pagination';

function PostList() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [posts, setPosts] = useState([]);

  const totalPages = Math.ceil(posts.length / itemsPerPage);

  return (
    <div>
      {/* Posts list */}
      <div className="grid gap-4">
        {posts
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
          .map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        maxVisiblePages={5}
      />
    </div>
  );
}
```

#### Features:

- ✅ Previous/Next buttons
- ✅ Numbered page buttons
- ✅ Jump to first/last page
- ✅ Customizable visible pages count
- ✅ Responsive design
- ✅ Keyboard navigation support

#### Styling:

```typescript
// Menggunakan Tailwind CSS
// - Active page: blue background
// - Hover: background opacity change
// - Disabled: gray color
```

---

### 2. **NewsList.tsx**

Component untuk menampilkan list berita dengan berbagai layout options.

#### Props:

```typescript
interface NewsListProps {
  news: News[];
  layout?: "grid" | "list" | "compact";
  columns?: 1 | 2 | 3 | 4;
  onSelectNews?: (newsId: number) => void;
  isLoading?: boolean;
}

interface News {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  author: string;
}
```

#### Penggunaan:

```typescript
import { NewsList } from '@/components/common/NewsList';

function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');

  return (
    <div className="container mx-auto">
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setLayout('grid')}
          className={layout === 'grid' ? 'bg-blue-600' : 'bg-gray-200'}
        >
          Grid View
        </button>
        <button
          onClick={() => setLayout('list')}
          className={layout === 'list' ? 'bg-blue-600' : 'bg-gray-200'}
        >
          List View
        </button>
      </div>

      <NewsList
        news={news}
        layout={layout}
        columns={3}
        onSelectNews={(id) => navigate(`/news/${id}`)}
      />
    </div>
  );
}
```

#### Features:

- ✅ Multiple layout options (grid, list, compact)
- ✅ Responsive columns
- ✅ Loading skeleton
- ✅ Click handler
- ✅ Image lazy loading
- ✅ Smooth transitions

---

### 3. **NewsSection.tsx**

Component untuk menampilkan section berita dengan title dan action button.

#### Props:

```typescript
interface NewsSectionProps {
  title: string;
  news: News[];
  showViewMore?: boolean;
  onViewMore?: () => void;
  layout?: "horizontal" | "vertical";
}
```

#### Penggunaan:

```typescript
import { NewsSection } from '@/components/common/NewsSection';

function HomePage() {
  const [trendingNews, setTrendingNews] = useState([]);

  return (
    <div className="space-y-8">
      <NewsSection
        title="Trending News"
        news={trendingNews}
        showViewMore={true}
        onViewMore={() => navigate('/news?sort=trending')}
        layout="horizontal"
      />

      <NewsSection
        title="Latest News"
        news={latestNews}
        showViewMore={true}
        onViewMore={() => navigate('/news')}
        layout="vertical"
      />
    </div>
  );
}
```

#### Features:

- ✅ Customizable title
- ✅ View more button
- ✅ Layout options
- ✅ Responsive
- ✅ Animation on load

---

### 4. **ProtectedRoute.tsx**

Component untuk protect routes yang memerlukan authentication.

#### Props:

```typescript
interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "user" | "admin" | "editor";
  fallback?: ReactNode;
}
```

#### Penggunaan:

```typescript
import { ProtectedRoute } from '@/components/common/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/news/:id" element={<NewsDetail />} />

      {/* Protected routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute requiredRole="user">
            <UserProfile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
```

#### Features:

- ✅ Authentication check
- ✅ Role-based access
- ✅ Redirect to login if unauthorized
- ✅ Custom fallback component
- ✅ Token validation

---

## Global Components

Components di folder `components-global/` adalah components yang digunakan secara global di seluruh aplikasi.

### 1. **card-artikel.tsx**

Component untuk menampilkan artikel card (single article item).

#### Props:

```typescript
interface ArticleCardProps {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  author: string;
  onClick?: () => void;
  showAuthor?: boolean;
}
```

#### Penggunaan:

```typescript
import { ArticleCard } from '@/components/components-global/card-artikel';

function ArticleGrid() {
  const articles = [
    {
      id: 1,
      title: 'Article Title',
      excerpt: 'Article excerpt...',
      image: 'image-url',
      category: 'Technology',
      date: '2024-01-28',
      author: 'John Doe',
    },
    // ... more articles
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          {...article}
          onClick={() => navigate(`/article/${article.id}`)}
          showAuthor={true}
        />
      ))}
    </div>
  );
}
```

#### Features:

- ✅ Image with fallback
- ✅ Category badge
- ✅ Date formatting
- ✅ Author display
- ✅ Hover animation
- ✅ Click handler

---

### 2. **trending-list.tsx**

Component untuk menampilkan list trending articles.

#### Props:

```typescript
interface TrendingListProps {
  articles: Article[];
  maxItems?: number;
  layout?: "compact" | "detailed";
}
```

#### Penggunaan:

```typescript
import { TrendingList } from '@/components/components-global/trending-list';

function Sidebar() {
  const [trendingArticles, setTrendingArticles] = useState([]);

  return (
    <div className="sidebar">
      <h2 className="text-xl font-bold mb-4">Trending Now</h2>
      <TrendingList
        articles={trendingArticles}
        maxItems={5}
        layout="compact"
      />
    </div>
  );
}
```

#### Features:

- ✅ Number ranking (1, 2, 3, ...)
- ✅ Compact/detailed layout
- ✅ View count
- ✅ Quick preview on hover
- ✅ Link to full article

---

### 3. **SectionCard.tsx**

Component untuk menampilkan section dengan card layout.

#### Props:

```typescript
interface SectionCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

#### Penggunaan:

```typescript
import { SectionCard } from '@/components/components-global/SectionCard';

function Dashboard() {
  return (
    <div className="space-y-6">
      <SectionCard
        title="Latest Articles"
        subtitle="Published today"
        action={{
          label: 'View All',
          onClick: () => navigate('/articles'),
        }}
      >
        <ArticleList articles={articles} />
      </SectionCard>

      <SectionCard
        title="Popular Authors"
        subtitle="This week"
      >
        <AuthorList authors={authors} />
      </SectionCard>
    </div>
  );
}
```

#### Features:

- ✅ Title & subtitle
- ✅ Action button
- ✅ Children support
- ✅ Card styling
- ✅ Shadow & borders

---

## Admin Components

Components di folder `components-admin/` adalah components khusus untuk admin panel.

### 1. **table-news.tsx**

Component untuk tabel berita dengan fitur sorting, filtering, dan pagination.

#### Props:

```typescript
interface TableNewsProps {
  news: NewsItem[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onPublish?: (id: number) => void;
  onUnpublish?: (id: number) => void;
  isLoading?: boolean;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

interface NewsItem {
  id: number;
  title: string;
  category: string;
  status: "draft" | "published";
  author: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}
```

#### Penggunaan:

```typescript
import { TableNews } from '@/components/components-admin/table-news';
import { useState, useEffect } from 'react';

function NewsManagement() {
  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchNews(currentPage);
  }, [currentPage]);

  const fetchNews = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/news?page=${page}`);
      const data = await response.json();
      setNews(data.news);
      setTotalPages(data.totalPages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/news/${id}/edit`);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this news?')) {
      await fetch(`/api/news/${id}`, { method: 'DELETE' });
      fetchNews(currentPage);
    }
  };

  const handlePublish = async (id: number) => {
    await fetch(`/api/news/${id}/publish`, { method: 'POST' });
    fetchNews(currentPage);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">News Management</h1>

      <TableNews
        news={news}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPublish={handlePublish}
        isLoading={isLoading}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
        }}
      />
    </div>
  );
}
```

#### Features:

- ✅ Sortable columns
- ✅ Filterable rows
- ✅ Pagination built-in
- ✅ Action buttons (Edit, Delete, Publish)
- ✅ Status badges
- ✅ Loading state
- ✅ Responsive overflow

#### Table Columns:

```
Title | Category | Status | Author | Views | Actions | Created Date
```

#### Styling:

```typescript
// Header: Gray background with white text
// Rows: Alternating white/gray background
// Hover: Light blue background
// Status badge:
//   - draft: Yellow/orange
//   - published: Green
```

---

### 2. **grid-card.tsx**

Component untuk menampilkan grid cards dengan responsive layout.

#### Props:

```typescript
interface GridCardProps<T> {
  items: T[];
  columns?: 1 | 2 | 3 | 4;
  renderCard: (item: T) => ReactNode;
  onCardClick?: (item: T) => void;
  isLoading?: boolean;
}
```

#### Penggunaan:

```typescript
import { GridCard } from '@/components/components-admin/grid-card';

function ArticleGrid() {
  const [articles, setArticles] = useState([]);

  return (
    <GridCard
      items={articles}
      columns={3}
      renderCard={(article) => (
        <div className="p-4 border rounded-lg">
          <img src={article.image} alt={article.title} className="w-full" />
          <h3 className="font-bold mt-2">{article.title}</h3>
          <p className="text-sm text-gray-600">{article.excerpt}</p>
        </div>
      )}
      onCardClick={(article) => navigate(`/article/${article.id}`)}
    />
  );
}
```

#### Features:

- ✅ Responsive columns
- ✅ Custom card rendering
- ✅ Click handler
- ✅ Loading skeleton
- ✅ Spacing & gaps

---

### 3. **filter-news.tsx**

Component untuk filter berita dengan berbagai opsi filter.

#### Props:

```typescript
interface FilterNewsProps {
  categories: Category[];
  onFilterChange: (filters: FilterOptions) => void;
  onReset?: () => void;
}

interface FilterOptions {
  category?: string;
  status?: "draft" | "published";
  dateRange?: {
    from: Date;
    to: Date;
  };
  search?: string;
}
```

#### Penggunaan:

```typescript
import { FilterNews } from '@/components/components-admin/filter-news';
import { useState } from 'react';

function NewsManagement() {
  const [news, setNews] = useState([]);
  const [filters, setFilters] = useState({});

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    // Fetch with filters
    fetchNews(newFilters);
  };

  return (
    <div className="space-y-6">
      <FilterNews
        categories={categories}
        onFilterChange={handleFilterChange}
        onReset={() => {
          setFilters({});
          fetchNews({});
        }}
      />

      <TableNews news={news} />
    </div>
  );
}
```

#### Filter Options:

- ✅ Category dropdown
- ✅ Status (Draft/Published)
- ✅ Date range picker
- ✅ Search input
- ✅ Reset button

---

### 4. **modal-add-news.tsx**

Component untuk modal menambah/edit berita.

#### Props:

```typescript
interface ModalAddNewsProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewsFormData) => Promise<void>;
  initialData?: NewsItem;
  isLoading?: boolean;
}

interface NewsFormData {
  title: string;
  content: string;
  excerpt: string;
  image: File | string;
  category: string;
  tags: string[];
  status: "draft" | "published";
}
```

#### Penggunaan:

```typescript
import { ModalAddNews } from '@/components/components-admin/modal-add-news';
import { useState } from 'react';

function NewsManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: NewsFormData) => {
    setIsLoading(true);
    try {
      if (selectedNews) {
        // Update
        await fetch(`/api/news/${selectedNews.id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
      } else {
        // Create
        await fetch('/api/news', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      }
      setIsModalOpen(false);
      // Refresh list
      fetchNews();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => {
          setSelectedNews(null);
          setIsModalOpen(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add News
      </button>

      <ModalAddNews
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedNews}
        isLoading={isLoading}
      />

      <TableNews
        news={news}
        onEdit={(id) => {
          setSelectedNews(news.find((n) => n.id === id));
          setIsModalOpen(true);
        }}
      />
    </div>
  );
}
```

#### Modal Form Fields:

- ✅ Title input
- ✅ Content editor (WYSIWYG)
- ✅ Excerpt textarea
- ✅ Image upload
- ✅ Category select
- ✅ Tags input
- ✅ Status select (Draft/Published)
- ✅ Submit button

---

### 5. **success-toast.tsx**

Component untuk menampilkan toast notification.

#### Props:

```typescript
interface SuccessToastProps {
  message: string;
  duration?: number;
  onClose?: () => void;
  type?: "success" | "error" | "warning" | "info";
}
```

#### Penggunaan:

```typescript
import { SuccessToast } from '@/components/components-admin/success-toast';
import { useState } from 'react';

function NewsManagement() {
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/news/${id}`, { method: 'DELETE' });
      setToast({
        message: 'News deleted successfully!',
        type: 'success',
      });
    } catch (error) {
      setToast({
        message: 'Failed to delete news',
        type: 'error',
      });
    }
  };

  return (
    <div>
      {toast && (
        <SuccessToast
          message={toast.message}
          type={toast.type}
          duration={3000}
          onClose={() => setToast(null)}
        />
      )}

      {/* ... rest of component */}
    </div>
  );
}
```

#### Features:

- ✅ Auto dismiss
- ✅ Multiple types (success, error, warning, info)
- ✅ Close button
- ✅ Custom duration
- ✅ Animation

---

## Component Patterns

### Pattern 1: Controlled Component

```typescript
// Parent component manages state
function Parent() {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <ChildComponent
      selectedId={selectedId}
      onChange={setSelectedId}
    />
  );
}

// Child component is controlled
interface ChildProps {
  selectedId: number | null;
  onChange: (id: number) => void;
}

function ChildComponent({ selectedId, onChange }: ChildProps) {
  return (
    <div>
      {/* Component receives state from parent */}
      {selectedId && <p>Selected: {selectedId}</p>}
      <button onClick={() => onChange(1)}>Select 1</button>
    </div>
  );
}
```

### Pattern 2: Compound Components

```typescript
// Example: Table component with sub-components
<Table data={data}>
  <Table.Header>
    <Table.Column key="title">Title</Table.Column>
    <Table.Column key="author">Author</Table.Column>
  </Table.Header>
  <Table.Body>
    {data.map((item) => (
      <Table.Row key={item.id}>
        <Table.Cell>{item.title}</Table.Cell>
        <Table.Cell>{item.author}</Table.Cell>
      </Table.Row>
    ))}
  </Table.Body>
  <Table.Pagination
    currentPage={page}
    totalPages={totalPages}
    onPageChange={setPage}
  />
</Table>
```

### Pattern 3: Render Props

```typescript
function DataFetcher({
  url,
  render,
}: {
  url: string;
  render: (data: any) => ReactNode;
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, [url]);

  return render({ data, loading });
}

// Usage
<DataFetcher
  url="/api/news"
  render={({ data, loading }) => (
    loading ? <Spinner /> : <NewsList news={data} />
  )}
/>
```

---

## Usage Examples

### Example 1: Complete News Page

```typescript
import { useState, useEffect } from 'react';
import { NewsList } from '@/components/common/NewsList';
import { Pagination } from '@/components/common/Pagination';
import { FilterNews } from '@/components/components-admin/filter-news';

function NewsPage() {
  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNews(currentPage, filters);
  }, [currentPage, filters]);

  const fetchNews = async (page: number, filters: any) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: String(page),
        ...filters,
      });

      const response = await fetch(`/api/news?${query}`);
      const data = await response.json();

      setNews(data.news);
      setTotalPages(data.totalPages);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">News</h1>

      {/* Filter */}
      <FilterNews
        categories={categories}
        onFilterChange={(newFilters) => {
          setFilters(newFilters);
          setCurrentPage(1);
        }}
      />

      {/* News List */}
      <NewsList news={news} layout="grid" columns={3} />

      {/* Pagination */}
      <div className="mt-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
```

### Example 2: Admin News Management

```typescript
import { useState, useEffect } from 'react';
import { TableNews } from '@/components/components-admin/table-news';
import { ModalAddNews } from '@/components/components-admin/modal-add-news';
import { SuccessToast } from '@/components/components-admin/success-toast';

function AdminNewsManagement() {
  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchNews(currentPage);
  }, [currentPage]);

  const fetchNews = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/news?page=${page}`);
      const data = await response.json();
      setNews(data.news);
      setTotalPages(data.totalPages);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedNews(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id: number) => {
    const item = news.find((n) => n.id === id);
    setSelectedNews(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this news?')) return;

    try {
      await fetch(`/api/admin/news/${id}`, { method: 'DELETE' });
      setToast({
        message: 'News deleted successfully!',
        type: 'success',
      });
      fetchNews(currentPage);
    } catch (error) {
      setToast({
        message: 'Failed to delete news',
        type: 'error',
      });
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (selectedNews) {
        await fetch(`/api/admin/news/${selectedNews.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      } else {
        await fetch('/api/admin/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      }

      setToast({
        message: selectedNews ? 'News updated!' : 'News created!',
        type: 'success',
      });
      setIsModalOpen(false);
      fetchNews(currentPage);
    } catch (error) {
      setToast({
        message: 'Failed to save news',
        type: 'error',
      });
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <SuccessToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">News Management</h1>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add News
        </button>
      </div>

      <TableNews
        news={news}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={loading}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
        }}
      />

      <ModalAddNews
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedNews}
      />
    </div>
  );
}
```

---

## Component Best Practices

### 1. Use TypeScript for Props

```typescript
// ✅ Good
interface ButtonProps {
  onClick: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

function Button({ onClick, variant = "primary", disabled }: ButtonProps) {
  // ...
}

// ❌ Avoid
function Button(props: any) {
  // ...
}
```

### 2. Separate Concerns

```typescript
// ✅ Good - Component handles UI only
function TableUI({ data, isLoading }: Props) {
  return <table>{/* render */}</table>;
}

// Container handles logic
function TableContainer() {
  const { data, isLoading } = useFetchData();
  return <TableUI data={data} isLoading={isLoading} />;
}

// ❌ Avoid - Mixed concerns
function Table(props: any) {
  const [data, setData] = useState();
  // Mixed UI and logic
}
```

### 3. Memoize Components When Needed

```typescript
import { memo } from 'react';

// Memoize expensive components
const ArticleCard = memo(function ArticleCard({ article }: Props) {
  return <div>{/* render */}</div>;
});
```

### 4. Use Proper Loading States

```typescript
if (isLoading) {
  return <LoadingSkeleton />;
}

if (error) {
  return <ErrorMessage error={error} />;
}

return <Content data={data} />;
```

---

**Last Updated:** January 28, 2026  
**Version:** 1.0.0
