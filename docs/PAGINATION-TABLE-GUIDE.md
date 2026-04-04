# Pagination & Table Components - Detailed Guide

## Table of Contents

1. [Pagination Component](#pagination-component)
2. [Table News Component](#table-news-component)
3. [Integration Tutorial](#integration-tutorial)
4. [Advanced Examples](#advanced-examples)

---

## Pagination Component

### Component Overview

Pagination adalah component yang menangani navigasi antar halaman dalam data yang banyak.

### Full API Documentation

#### Signature

```typescript
function Pagination(props: PaginationProps): ReactElement;
```

#### Props Interface

```typescript
interface PaginationProps {
  /**
   * Halaman yang sedang aktif (1-indexed)
   */
  currentPage: number;

  /**
   * Total jumlah halaman
   */
  totalPages: number;

  /**
   * Callback ketika user mengklik page number
   */
  onPageChange: (page: number) => void;

  /**
   * Jumlah maksimal page number yang ditampilkan
   * Default: 5
   */
  maxVisiblePages?: number;

  /**
   * Custom styling class
   * Default: undefined
   */
  className?: string;

  /**
   * Disable semua tombol pagination
   */
  disabled?: boolean;
}
```

#### Return Value

Component mengembalikan JSX yang merender pagination controls.

### Component Structure

```
┌─────────────────────────────────────────────────┐
│  « Previous  1  2  [3]  4  5  Next »            │
│  ↑ First    ↑ Numbered Pages  ↑ Last   ↑ Props │
└─────────────────────────────────────────────────┘
```

### HTML Structure

```html
<nav className="flex justify-center items-center gap-2">
  <!-- Previous Button -->
  <button onClick="{()" ="">
    onPageChange(currentPage - 1)} disabled={currentPage === 1} > Previous
  </button>

  <!-- Page Numbers -->
  {pages.map(page => (
  <button key="{page}" onClick="{()" ="">
    onPageChange(page)} className={page === currentPage ? 'bg-blue-500' :
    'bg-gray-200'} > {page}
  </button>
  ))}

  <!-- Next Button -->
  <button onClick="{()" ="">
    onPageChange(currentPage + 1)} disabled={currentPage === totalPages} > Next
  </button>
</nav>
```

### Basic Usage

```typescript
import { Pagination } from '@/components/common/Pagination';
import { useState } from 'react';

function MyComponent() {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Contoh: 50 items = 5 halaman
  const totalItems = 50;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return (
    <div>
      {/* Content */}
      <div>Items {currentPage} - {currentPage * ITEMS_PER_PAGE}</div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
```

### Advanced Usage with Data

```typescript
import { Pagination } from '@/components/common/Pagination';
import { useState, useEffect } from 'react';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  author: string;
}

function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const ITEMS_PER_PAGE = 10;

  // Fetch articles ketika page berubah
  useEffect(() => {
    fetchArticles(currentPage);
  }, [currentPage]);

  const fetchArticles = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/articles?page=${page}&limit=${ITEMS_PER_PAGE}`
      );
      const data = await response.json();

      setArticles(data.articles);
      setTotalPages(Math.ceil(data.total / ITEMS_PER_PAGE));
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {isLoading && <div className="text-center">Loading...</div>}

      {/* Content */}
      {!isLoading && articles.length === 0 && (
        <div className="text-center text-gray-500">No articles found</div>
      )}

      {/* Article List */}
      <div className="space-y-4">
        {articles.map((article) => (
          <div key={article.id} className="border p-4 rounded">
            <h3 className="text-lg font-bold">{article.title}</h3>
            <p className="text-gray-600">{article.excerpt}</p>
            <p className="text-sm text-gray-500">By {article.author}</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            setCurrentPage(page);
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          maxVisiblePages={7}
        />
      )}
    </div>
  );
}

export default ArticleList;
```

### Common Patterns

#### Pattern 1: Client-Side Pagination

```typescript
function ClientSidePagination() {
  const [currentPage, setCurrentPage] = useState(1);
  const allArticles = [...]; // Assume all data loaded
  const ITEMS_PER_PAGE = 10;

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedArticles = allArticles.slice(startIndex, endIndex);
  const totalPages = Math.ceil(allArticles.length / ITEMS_PER_PAGE);

  return (
    <>
      <ArticleList articles={displayedArticles} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
}
```

#### Pattern 2: Server-Side Pagination

```typescript
function ServerSidePagination() {
  const [currentPage, setCurrentPage] = useState(1);
  const [articles, setArticles] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Server handles pagination
        const response = await fetch(
          `/api/articles?page=${currentPage}&limit=10`
        );
        const data = await response.json();
        setArticles(data.articles);
        setTotalPages(data.totalPages);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  return (
    <>
      {loading ? <LoadingSpinner /> : <ArticleList articles={articles} />}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
}
```

#### Pattern 3: Cursor-Based Pagination

```typescript
function CursorPagination() {
  const [articles, setArticles] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);

  const loadMore = async () => {
    try {
      const response = await fetch(
        `/api/articles?${cursor ? `cursor=${cursor}` : ''}&limit=10`
      );
      const data = await response.json();

      setArticles((prev) => [...prev, ...data.articles]);
      setCursor(data.nextCursor);
      setHasMore(!!data.nextCursor);
    } catch (error) {
      console.error('Failed to load articles:', error);
    }
  };

  return (
    <>
      <ArticleList articles={articles} />
      {hasMore && (
        <button
          onClick={loadMore}
          className="w-full py-2 bg-blue-600 text-white rounded"
        >
          Load More
        </button>
      )}
    </>
  );
}
```

### Styling & Customization

```typescript
// Custom styling example
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
  className="flex gap-3 justify-center my-8"
/>

// With custom button styling through CSS
// Add to your CSS:
/*
.pagination-container {
  display: flex;
  gap: 10px;
}

.pagination-button {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.pagination-button.active {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.pagination-button:hover {
  background-color: #f3f4f6;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
*/
```

---

## Table News Component

### Component Overview

Table News adalah component untuk menampilkan list berita dalam format tabel dengan fitur lengkap seperti sorting, filtering, pagination, dan action buttons.

### Full API Documentation

#### Signature

```typescript
function TableNews(props: TableNewsProps): ReactElement;
```

#### Props Interface

```typescript
interface TableNewsProps {
  /**
   * Array of news items to display
   */
  news: NewsItem[];

  /**
   * Callback ketika user klik edit button
   */
  onEdit?: (id: number) => void;

  /**
   * Callback ketika user klik delete button
   */
  onDelete?: (id: number) => void;

  /**
   * Callback ketika user klik publish button
   */
  onPublish?: (id: number) => void;

  /**
   * Callback ketika user klik unpublish button
   */
  onUnpublish?: (id: number) => void;

  /**
   * Loading state
   */
  isLoading?: boolean;

  /**
   * Pagination configuration
   */
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };

  /**
   * Custom CSS classes
   */
  className?: string;

  /**
   * Show/hide columns
   */
  columns?: {
    title?: boolean;
    category?: boolean;
    status?: boolean;
    author?: boolean;
    views?: boolean;
    date?: boolean;
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
  excerpt?: string;
}
```

### Table Structure

```
┌─────┬─────────────┬──────────┬──────────┬────────┬───────┬────────┐
│ ID  │ Title       │ Category │ Status   │ Author │ Views │ Action │
├─────┼─────────────┼──────────┼──────────┼────────┼───────┼────────┤
│ 1   │ Article 1   │ Tech     │ Draft    │ John   │ 120   │ ...... │
│ 2   │ Article 2   │ News     │ Published│ Jane   │ 450   │ ...... │
└─────┴─────────────┴──────────┴──────────┴────────┴───────┴────────┘
```

### Basic Usage

```typescript
import { TableNews } from '@/components/components-admin/table-news';
import { useState } from 'react';

function NewsManagement() {
  const [news, setNews] = useState([
    {
      id: 1,
      title: 'Breaking News',
      category: 'Technology',
      status: 'published',
      author: 'John Doe',
      views: 1200,
      createdAt: '2024-01-28',
      updatedAt: '2024-01-28',
    },
    {
      id: 2,
      title: 'Draft Article',
      category: 'Science',
      status: 'draft',
      author: 'Jane Smith',
      views: 0,
      createdAt: '2024-01-27',
      updatedAt: '2024-01-28',
    },
  ]);

  const handleEdit = (id: number) => {
    console.log('Edit:', id);
  };

  const handleDelete = (id: number) => {
    console.log('Delete:', id);
  };

  return (
    <TableNews
      news={news}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
```

### Complete Example with CRUD

```typescript
import { TableNews } from '@/components/components-admin/table-news';
import { ModalAddNews } from '@/components/components-admin/modal-add-news';
import { SuccessToast } from '@/components/components-admin/success-toast';
import { useState, useEffect } from 'react';

function AdminNewsManagement() {
  // State management
  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning';
  } | null>(null);

  const ITEMS_PER_PAGE = 10;

  // Fetch news ketika page berubah
  useEffect(() => {
    fetchNews(currentPage);
  }, [currentPage]);

  // Fetch news from API
  const fetchNews = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/admin/news?page=${page}&limit=${ITEMS_PER_PAGE}`
      );

      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      setNews(data.news);
      setTotalPages(Math.ceil(data.total / ITEMS_PER_PAGE));
    } catch (error) {
      showToast('Failed to fetch news', 'error');
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (id: number) => {
    const item = news.find((n) => n.id === id);
    if (item) {
      setSelectedNews(item);
      setIsModalOpen(true);
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    // Confirmation dialog
    if (!confirm('Are you sure you want to delete this news?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/news/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Delete failed');

      showToast('News deleted successfully', 'success');
      fetchNews(currentPage);
    } catch (error) {
      showToast('Failed to delete news', 'error');
      console.error('Delete error:', error);
    }
  };

  // Handle publish
  const handlePublish = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/news/${id}/publish`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Publish failed');

      showToast('News published successfully', 'success');
      fetchNews(currentPage);
    } catch (error) {
      showToast('Failed to publish news', 'error');
      console.error('Publish error:', error);
    }
  };

  // Handle unpublish
  const handleUnpublish = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/news/${id}/unpublish`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Unpublish failed');

      showToast('News unpublished successfully', 'success');
      fetchNews(currentPage);
    } catch (error) {
      showToast('Failed to unpublish news', 'error');
      console.error('Unpublish error:', error);
    }
  };

  // Handle form submit (Add/Update)
  const handleSubmitNews = async (formData: any) => {
    try {
      const method = selectedNews ? 'PUT' : 'POST';
      const url = selectedNews
        ? `/api/admin/news/${selectedNews.id}`
        : '/api/admin/news';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save');

      const successMessage = selectedNews
        ? 'News updated successfully'
        : 'News created successfully';

      showToast(successMessage, 'success');
      setIsModalOpen(false);
      setSelectedNews(null);
      setCurrentPage(1);
      fetchNews(1);
    } catch (error) {
      showToast('Failed to save news', 'error');
      console.error('Save error:', error);
    }
  };

  // Show toast notification
  const showToast = (
    message: string,
    type: 'success' | 'error' | 'warning'
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Toast Notification */}
      {toast && (
        <SuccessToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">News Management</h1>
        <button
          onClick={() => {
            setSelectedNews(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          + Add News
        </button>
      </div>

      {/* Table */}
      <TableNews
        news={news}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPublish={handlePublish}
        onUnpublish={handleUnpublish}
        isLoading={isLoading}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
        }}
      />

      {/* Modal */}
      <ModalAddNews
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedNews(null);
        }}
        onSubmit={handleSubmitNews}
        initialData={selectedNews}
        isLoading={isLoading}
      />
    </div>
  );
}

export default AdminNewsManagement;
```

### Column Visibility

```typescript
// Show specific columns only
<TableNews
  news={news}
  columns={{
    title: true,
    category: true,
    status: true,
    author: false,      // Hide author
    views: true,
    date: true,
  }}
/>
```

### Row Actions

```typescript
// Each row has these action buttons:
// - Edit: Opens modal to edit
// - Delete: Deletes the news
// - Publish: Publishes draft news
// - Unpublish: Unpublishes published news

// Status-dependent actions:
// - Draft status: Shows Publish button
// - Published status: Shows Unpublish button
```

### Sorting & Filtering

```typescript
// Table automatically supports:
// - Click column headers to sort
// - Ascending/Descending toggle
// - Sort indicator (↑ ↓)

// Example: Click "Title" header to sort by title
```

### Loading & Empty States

```typescript
// Loading state
<TableNews
  news={[]}
  isLoading={true}
/>
// Shows: Loading skeleton rows

// Empty state
<TableNews
  news={[]}
  isLoading={false}
/>
// Shows: "No news found" message
```

---

## Integration Tutorial

### Step 1: Basic Setup

```typescript
// pages/admin/news.tsx
import { TableNews } from '@/components/components-admin/table-news';
import { Pagination } from '@/components/common/Pagination';
import { useState, useEffect } from 'react';

export default function NewsManagement() {
  const [state, setState] = useState({
    news: [],
    currentPage: 1,
    totalPages: 1,
    loading: false,
  });

  useEffect(() => {
    fetchNews(1);
  }, []);

  const fetchNews = async (page: number) => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const response = await fetch(
        `/api/admin/news?page=${page}&limit=10`
      );
      const data = await response.json();

      setState((prev) => ({
        ...prev,
        news: data.news,
        currentPage: page,
        totalPages: Math.ceil(data.total / 10),
        loading: false,
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false }));
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>News Management</h1>
      <TableNews
        news={state.news}
        isLoading={state.loading}
        pagination={{
          currentPage: state.currentPage,
          totalPages: state.totalPages,
          onPageChange: fetchNews,
        }}
      />
    </div>
  );
}
```

### Step 2: Add Action Handlers

```typescript
const handleEdit = (id: number) => {
  // Option 1: Open modal
  openEditModal(id);

  // Option 2: Navigate to edit page
  // navigate(`/admin/news/${id}/edit`);
};

const handleDelete = async (id: number) => {
  if (!confirm("Delete this news?")) return;

  try {
    await fetch(`/api/admin/news/${id}`, {
      method: "DELETE",
    });
    fetchNews(state.currentPage);
  } catch (error) {
    console.error("Delete failed:", error);
  }
};

const handlePublish = async (id: number) => {
  try {
    await fetch(`/api/admin/news/${id}/publish`, {
      method: "POST",
    });
    fetchNews(state.currentPage);
  } catch (error) {
    console.error("Publish failed:", error);
  }
};
```

### Step 3: Add Toast Notifications

```typescript
import { SuccessToast } from '@/components/components-admin/success-toast';

const [toast, setToast] = useState(null);

const showToast = (message: string, type: string) => {
  setToast({ message, type });
  setTimeout(() => setToast(null), 3000);
};

// In handlers:
const handleDelete = async (id: number) => {
  try {
    // ... delete logic
    showToast('News deleted successfully', 'success');
  } catch (error) {
    showToast('Failed to delete news', 'error');
  }
};

// In JSX:
return (
  <>
    {toast && (
      <SuccessToast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(null)}
      />
    )}
    {/* ... */}
  </>
);
```

### Step 4: Add Modal for Create/Edit

```typescript
import { ModalAddNews } from '@/components/components-admin/modal-add-news';

const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedNews, setSelectedNews] = useState(null);

const handleAdd = () => {
  setSelectedNews(null);
  setIsModalOpen(true);
};

const handleEdit = (id: number) => {
  const item = state.news.find((n) => n.id === id);
  setSelectedNews(item);
  setIsModalOpen(true);
};

const handleSubmitNews = async (data: any) => {
  try {
    const method = selectedNews ? 'PUT' : 'POST';
    const url = selectedNews
      ? `/api/admin/news/${selectedNews.id}`
      : '/api/admin/news';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    showToast(
      selectedNews ? 'News updated' : 'News created',
      'success'
    );
    setIsModalOpen(false);
    fetchNews(1);
  } catch (error) {
    showToast('Failed to save', 'error');
  }
};

// In JSX:
return (
  <>
    <button onClick={handleAdd}>Add News</button>
    <ModalAddNews
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSubmit={handleSubmitNews}
      initialData={selectedNews}
    />
  </>
);
```

---

## Advanced Examples

### Example 1: Pagination with Search

```typescript
function NewsWithSearch() {
  const [state, setState] = useState({
    news: [],
    currentPage: 1,
    totalPages: 1,
    search: '',
    loading: false,
  });

  useEffect(() => {
    fetchNews(1, state.search);
  }, [state.search]);

  const fetchNews = async (page: number, searchTerm: string) => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const query = new URLSearchParams({
        page: String(page),
        search: searchTerm,
      });

      const response = await fetch(`/api/admin/news?${query}`);
      const data = await response.json();

      setState((prev) => ({
        ...prev,
        news: data.news,
        currentPage: page,
        totalPages: data.totalPages,
        loading: false,
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="space-y-6">
      <input
        type="text"
        placeholder="Search news..."
        value={state.search}
        onChange={(e) =>
          setState((prev) => ({ ...prev, search: e.target.value }))
        }
        className="w-full px-4 py-2 border rounded"
      />

      <TableNews
        news={state.news}
        isLoading={state.loading}
        pagination={{
          currentPage: state.currentPage,
          totalPages: state.totalPages,
          onPageChange: (page) => fetchNews(page, state.search),
        }}
      />
    </div>
  );
}
```

### Example 2: Multi-Select with Bulk Actions

```typescript
function NewsWithBulkActions() {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [news, setNews] = useState([]);

  const toggleSelect = (id: number) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  const selectAll = () => {
    if (selected.size === news.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(news.map((n) => n.id)));
    }
  };

  const bulkPublish = async () => {
    const ids = Array.from(selected);
    try {
      await Promise.all(
        ids.map((id) =>
          fetch(`/api/admin/news/${id}/publish`, {
            method: 'POST',
          })
        )
      );
      setSelected(new Set());
      // Refresh
    } catch (error) {
      console.error('Bulk publish failed:', error);
    }
  };

  return (
    <div className="space-y-4">
      {selected.size > 0 && (
        <div className="flex gap-2 p-4 bg-blue-100 rounded">
          <span>{selected.size} selected</span>
          <button
            onClick={bulkPublish}
            className="bg-blue-600 text-white px-4 py-1 rounded"
          >
            Publish All
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="bg-gray-400 text-white px-4 py-1 rounded"
          >
            Clear
          </button>
        </div>
      )}

      <TableNews news={news} />
    </div>
  );
}
```

### Example 3: Filtering & Sorting

```typescript
interface FilterState {
  category: string;
  status: 'all' | 'draft' | 'published';
  sortBy: 'title' | 'date' | 'views';
  sortOrder: 'asc' | 'desc';
}

function NewsWithFiltering() {
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    status: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
  });

  const [state, setState] = useState({
    news: [],
    currentPage: 1,
    totalPages: 1,
    loading: false,
  });

  useEffect(() => {
    fetchNews(1);
  }, [filters]);

  const fetchNews = async (page: number) => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const query = new URLSearchParams({
        page: String(page),
        category: filters.category,
        status: filters.status,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      const response = await fetch(`/api/admin/news?${query}`);
      const data = await response.json();

      setState((prev) => ({
        ...prev,
        news: data.news,
        currentPage: page,
        totalPages: data.totalPages,
        loading: false,
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-4 p-4 bg-gray-100 rounded">
        <select
          value={filters.category}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              category: e.target.value,
            }))
          }
        >
          <option value="all">All Categories</option>
          <option value="tech">Technology</option>
          <option value="science">Science</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              status: e.target.value as any,
            }))
          }
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        <select
          value={filters.sortBy}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              sortBy: e.target.value as any,
            }))
          }
        >
          <option value="date">Date</option>
          <option value="title">Title</option>
          <option value="views">Views</option>
        </select>

        <button
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc',
            }))
          }
        >
          {filters.sortOrder === 'asc' ? '↑' : '↓'}
        </button>
      </div>

      {/* Table */}
      <TableNews
        news={state.news}
        isLoading={state.loading}
        pagination={{
          currentPage: state.currentPage,
          totalPages: state.totalPages,
          onPageChange: fetchNews,
        }}
      />
    </div>
  );
}
```

---

**Last Updated:** January 28, 2026  
**Version:** 1.1.0  
**Author:** Documentation Team
