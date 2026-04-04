# Frontend Development Guide

## 📋 Development Setup

### Prerequisites

- Node.js v18+
- npm or yarn
- Git
- VS Code (recommended) dengan extensions:
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - TypeScript Vue Plugin
  - Thunder Client atau REST Client

### Initial Setup

```bash
# 1. Clone repository
git clone <repo-url>
cd news_almuhtada

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env

# 4. Edit .env dengan backend API URL
nano .env

# 5. Start development server
npm run dev
```

---

## Environment Setup

### .env Configuration

```env
# Backend API
VITE_API_URL=http://localhost:3001/api

# Application
VITE_APP_NAME=News Al-Muhtada
VITE_APP_DESCRIPTION=Berita & Informasi Terkini

# Feature Flags
VITE_ENABLE_COMMENTS=true
VITE_ENABLE_SHARING=true
VITE_ENABLE_NOTIFICATIONS=true

# Analytics (optional)
# VITE_GA_ID=UA-XXXXXXXXX-X
```

### Accessing Env Variables

```typescript
// Access in code
const apiUrl = import.meta.env.VITE_API_URL;
const appName = import.meta.env.VITE_APP_NAME;

// Or with type safety
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

---

## Development Workflow

### Project Structure

```
news_almuhtada/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── PostCard.tsx
│   │   └── ...
│   ├── pages/               # Route-based pages
│   │   ├── Home.tsx
│   │   ├── Posts.tsx
│   │   ├── Post.tsx
│   │   └── ...
│   ├── admin/               # Admin panel components
│   │   ├── Dashboard.tsx
│   │   ├── Posts/
│   │   ├── Users/
│   │   └── ...
│   ├── services/            # API communication
│   │   ├── api.ts           # Axios instance
│   │   ├── postService.ts
│   │   ├── authService.ts
│   │   └── ...
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── usePosts.ts
│   │   └── ...
│   ├── config/              # Configuration files
│   │   └── api.ts
│   ├── utils/               # Utility functions
│   │   ├── formatDate.ts
│   │   ├── helpers.ts
│   │   └── ...
│   ├── assets/              # Images, fonts, etc.
│   │   ├── images/
│   │   ├── fonts/
│   │   └── ...
│   ├── ui/                  # UI component library (if using)
│   │   └── ...
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Entry point
│   ├── index.css            # Global styles
│   └── vite-env.d.ts        # Vite type definitions
├── public/                  # Static assets
├── index.html               # HTML template
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS config
├── tsconfig.json            # TypeScript config
├── eslint.config.js         # ESLint config
└── package.json             # Dependencies
```

---

## Component Development

### Creating Components

#### Function Component with TypeScript

```typescript
// src/components/PostCard.tsx
import React from 'react';

interface PostCardProps {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image?: string;
  author: string;
  onRead?: (id: number) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  id,
  title,
  excerpt,
  category,
  date,
  image,
  author,
  onRead,
}) => {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      {image && (
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <span className="inline-block text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
          {category}
        </span>
        <h3 className="text-xl font-bold mt-3 hover:text-blue-600 cursor-pointer">
          {title}
        </h3>
        <p className="text-gray-600 text-sm mt-2 line-clamp-2">
          {excerpt}
        </p>
        <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
          <span>{author}</span>
          <span>{date}</span>
        </div>
        <button
          onClick={() => onRead?.(id)}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Read More
        </button>
      </div>
    </article>
  );
};
```

#### Component with Hooks

```typescript
// src/components/SearchBar.tsx
import React, { useState, useCallback } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search posts...',
}) => {
  const [query, setQuery] = useState('');

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      onSearch(value);
    },
    [onSearch]
  );

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
      <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
    </div>
  );
};
```

### Component Patterns

#### Container/Presenter Pattern

```typescript
// Container Component (logic)
// src/containers/PostListContainer.tsx
import { useState, useEffect } from 'react';
import { postService } from '@/services/postService';
import PostListPresenter from '@/components/PostListPresenter';

export default function PostListContainer() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postService.getPosts();
        setPosts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return <PostListPresenter posts={posts} loading={loading} />;
}

// Presenter Component (UI only)
// src/components/PostListPresenter.tsx
import { PostCard } from './PostCard';

interface PostListPresenterProps {
  posts: any[];
  loading: boolean;
}

export default function PostListPresenter({
  posts,
  loading,
}: PostListPresenterProps) {
  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} {...post} />
      ))}
    </div>
  );
}
```

---

## Pages & Routing

### Adding Routes

```typescript
// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Posts from './pages/Posts';
import Post from './pages/Post';
import About from './pages/About';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/:id" element={<Post />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
```

### Creating Pages

```typescript
// src/pages/Posts.tsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { postService } from '@/services/postService';
import { PostCard } from '@/components/PostCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const category = searchParams.get('category');
        const search = searchParams.get('search');

        const data = await postService.getPosts({
          category,
          search,
        });

        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [searchParams]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">All Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
}
```

---

## API Services

### Axios Setup

```typescript
// src/services/api.ts
import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
```

### Service Methods

```typescript
// src/services/postService.ts
import api from "./api";

export interface Post {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  categoryId: number;
  authorId: number;
  image?: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
}

export const postService = {
  // Get all posts
  getPosts: async (filters?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.limit) params.append("limit", String(filters.limit));
    if (filters?.category) params.append("category", filters.category);
    if (filters?.search) params.append("search", filters.search);

    return api.get<Post[]>("/posts?" + params.toString());
  },

  // Get single post
  getPost: (id: number) => api.get<Post>(`/posts/${id}`),

  // Create post
  createPost: (data: Partial<Post>) => api.post<Post>("/posts", data),

  // Update post
  updatePost: (id: number, data: Partial<Post>) =>
    api.put<Post>(`/posts/${id}`, data),

  // Delete post
  deletePost: (id: number) => api.delete(`/posts/${id}`),

  // Get comments
  getComments: (postId: number) => api.get(`/posts/${postId}/comments`),
};
```

---

## Hooks

### Custom Hooks

```typescript
// src/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/authService';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const userData = await authService.getProfile();
          setUser(userData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Auth error');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login
  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        const response = await authService.login(email, password);
        localStorage.setItem('auth_token', response.token);
        setUser(response.user);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Login failed');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setUser(null);
  }, []);

  return { user, loading, error, login, logout };
};

// Usage
function MyComponent() {
  const { user, loading, login, logout } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {user ? (
        <>
          <p>Welcome, {user.name}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={() => login('email@example.com', 'password')}>
          Login
        </button>
      )}
    </div>
  );
}
```

### Fetch Hook

```typescript
// src/hooks/useFetch.ts
import { useState, useEffect } from 'react';
import api from '@/services/api';

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useFetch = <T>(url: string): UseFetchState<T> => {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get<T>(url);
        setState({ data: response, loading: false, error: null });
      } catch (err) {
        setState({
          data: null,
          loading: false,
          error: err instanceof Error ? err.message : 'Error',
        });
      }
    };

    fetchData();
  }, [url]);

  return state;
};

// Usage
function Component() {
  const { data: posts, loading, error } = useFetch('/posts');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>{/* Render posts */}</div>;
}
```

---

## Styling

### Tailwind CSS Usage

```typescript
// Basic styling
<div className="container mx-auto px-4 py-8">
  <h1 className="text-4xl font-bold text-gray-900 mb-4">
    Hello World
  </h1>
  <p className="text-gray-600 text-lg">
    This is a paragraph with Tailwind CSS.
  </p>
</div>

// Responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>

// Dark mode
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  Content
</div>

// Hover & animations
<button className="bg-blue-600 hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105">
  Click me
</button>
```

### Custom CSS

```css
/* src/App.css */
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition;
  }

  .card {
    @apply bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition;
  }

  .container-fluid {
    @apply w-full max-w-screen-2xl mx-auto px-4;
  }
}

@layer utilities {
  .text-gradient {
    @apply bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent;
  }
}
```

---

## Forms & Validation

### Form Component

```typescript
// src/components/PostForm.tsx
import { useState, FormEvent } from 'react';
import { postService } from '@/services/postService';

interface PostFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const PostForm: React.FC<PostFormProps> = ({
  onSuccess,
  onError,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      await postService.createPost(formData);
      onSuccess?.();
      setFormData({ title: '', content: '', categoryId: '' });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error creating post';
      onError?.(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          className={`w-full px-4 py-2 border rounded-lg ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Content</label>
        <textarea
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          rows={6}
          className={`w-full px-4 py-2 border rounded-lg ${
            errors.content ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.content && (
          <p className="text-red-500 text-sm">{errors.content}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Category</label>
        <select
          value={formData.categoryId}
          onChange={(e) =>
            setFormData({ ...formData, categoryId: e.target.value })
          }
          className={`w-full px-4 py-2 border rounded-lg ${
            errors.categoryId ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select a category</option>
          <option value="1">Technology</option>
          <option value="2">Business</option>
        </select>
        {errors.categoryId && (
          <p className="text-red-500 text-sm">{errors.categoryId}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  );
};
```

---

## State Management

### Context API

```typescript
// src/contexts/PostContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

interface Post {
  id: number;
  title: string;
  content: string;
}

interface PostContextType {
  posts: Post[];
  addPost: (post: Post) => void;
  removePost: (id: number) => void;
  updatePost: (id: number, post: Post) => void;
}

export const PostContext = createContext<PostContextType | undefined>(
  undefined
);

interface PostProviderProps {
  children: ReactNode;
}

export const PostProvider: React.FC<PostProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);

  const addPost = (post: Post) => {
    setPosts([...posts, post]);
  };

  const removePost = (id: number) => {
    setPosts(posts.filter((p) => p.id !== id));
  };

  const updatePost = (id: number, updatedPost: Post) => {
    setPosts(posts.map((p) => (p.id === id ? updatedPost : p)));
  };

  return (
    <PostContext.Provider value={{ posts, addPost, removePost, updatePost }}>
      {children}
    </PostContext.Provider>
  );
};

// Usage in component
export const usePost = () => {
  const context = React.useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePost must be used within PostProvider');
  }
  return context;
};
```

---

## Testing

### Component Testing

```typescript
// src/components/__tests__/PostCard.test.tsx
import { render, screen } from '@testing-library/react';
import { PostCard } from '../PostCard';

describe('PostCard Component', () => {
  const mockPost = {
    id: 1,
    title: 'Test Post',
    excerpt: 'This is a test excerpt',
    category: 'Technology',
    date: '2024-01-01',
    author: 'John Doe',
  };

  it('renders post card with title', () => {
    render(<PostCard {...mockPost} />);
    expect(screen.getByText('Test Post')).toBeInTheDocument();
  });

  it('renders category badge', () => {
    render(<PostCard {...mockPost} />);
    expect(screen.getByText('Technology')).toBeInTheDocument();
  });

  it('calls onRead callback when button clicked', () => {
    const onRead = jest.fn();
    render(<PostCard {...mockPost} onRead={onRead} />);
    screen.getByText('Read More').click();
    expect(onRead).toHaveBeenCalledWith(1);
  });
});
```

---

## Build & Optimization

### Production Build

```bash
npm run build
```

Output in `dist/` folder.

### Code Splitting

```typescript
// Lazy load components
import { lazy, Suspense } from 'react';

const AdminPanel = lazy(() => import('./pages/AdminPanel'));

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminPanel />
    </Suspense>
  );
}
```

### Performance Tips

1. Use React.memo for expensive components
2. Optimize re-renders with useCallback
3. Lazy load images
4. Use Code splitting
5. Minimize bundle size

---

**Last Updated:** January 28, 2026
