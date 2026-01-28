# Frontend News App - Documentation

## 📖 Daftar Isi

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Architecture](#architecture)
4. [Project Structure](#project-structure)
5. [Components](#components)
6. [Pages](#pages)
7. [Services](#services)
8. [Styling](#styling)
9. [Development](#development)
10. [Build & Deployment](#build--deployment)

---

## Overview

**Frontend News App** adalah aplikasi React modern untuk News Al-Muhtada, dibangun dengan:

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool (lightning fast)
- **React Router v7** - Navigation
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **Lucide React** - Icons

### Features

✅ Responsive design  
✅ Dark mode support  
✅ Admin dashboard  
✅ Post management  
✅ User authentication  
✅ Comments system  
✅ Search functionality  
✅ Category filtering  
✅ Tag system  
✅ Real-time statistics  
✅ Smooth animations

---

## Quick Start

### Prerequisites

- Node.js v18+
- npm or yarn

### Installation

```bash
# Clone repository
git clone <repo-url>
cd news_almuhtada

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env dengan API URL

# Start development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=News Al-Muhtada
VITE_APP_DESCRIPTION=Berita & Informasi Terkini
```

---

## Architecture

### Folder Structure

```
news_almuhtada/
├── src/
│   ├── components/          # Reusable components
│   ├── pages/               # Page components (routes)
│   ├── admin/               # Admin dashboard components
│   ├── services/            # API services
│   ├── hooks/               # Custom React hooks
│   ├── config/              # Configuration files
│   ├── utils/               # Utility functions
│   ├── assets/              # Images, fonts, etc.
│   ├── ui/                  # UI components (if shadcn-ui)
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html               # HTML template
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies
```

### Request Flow

```
User Action
  ↓
Component (React component)
  ↓
Service (API call)
  ↓
Backend API
  ↓
Response
  ↓
Component State (useState/useContext)
  ↓
Re-render UI
```

### State Management

```
App (Root Context)
├── AuthContext          # User authentication
├── ThemeContext         # Dark/Light mode
├── PostsContext         # Posts data
├── CategoriesContext    # Categories data
└── NotificationsContext # Notifications
```

---

## Project Structure

### `/src/components` - Reusable Components

Komponen yang dapat digunakan di berbagai halaman:

- `Header.tsx` - Navigation header
- `Footer.tsx` - Page footer
- `Navbar.tsx` - Top navigation bar
- `Sidebar.tsx` - Side navigation
- `PostCard.tsx` - Post display card
- `PostList.tsx` - List of posts
- `SearchBar.tsx` - Search input
- `CategoryFilter.tsx` - Category filter
- `LoadingSpinner.tsx` - Loading indicator
- `Modal.tsx` - Modal dialog
- `Button.tsx` - Button component
- `Card.tsx` - Card wrapper
- And more...

Example:

```typescript
// components/PostCard.tsx
interface PostCardProps {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
  author: string;
}

export const PostCard: React.FC<PostCardProps> = ({
  id,
  title,
  excerpt,
  category,
  date,
  image,
  author,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <h3 className="text-xl font-bold mt-4">{title}</h3>
      <p className="text-gray-600">{excerpt}</p>
      <span className="text-sm text-blue-600">{category}</span>
    </div>
  );
};
```

### `/src/pages` - Page Components

Halaman utama aplikasi (route-related):

- `Home.tsx` - Landing page
- `Posts.tsx` - All posts list
- `Post.tsx` - Single post detail
- `About.tsx` - About page
- `Contact.tsx` - Contact page
- `Search.tsx` - Search results
- `Category.tsx` - Posts by category
- `NotFound.tsx` - 404 page
- And more...

Example:

```typescript
// pages/Home.tsx
export const Home: React.FC = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts');
        setPosts(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <Hero />
      <PostList posts={posts} />
    </div>
  );
};
```

### `/src/admin` - Admin Dashboard Components

Komponen untuk admin panel:

- `Dashboard.tsx` - Admin dashboard
- `Posts/` - Post management
  - `PostList.tsx`
  - `PostCreate.tsx`
  - `PostEdit.tsx`
- `Users/` - User management
  - `UserList.tsx`
  - `UserCreate.tsx`
  - `UserEdit.tsx`
- `Categories/` - Category management
- `Statistics/` - Analytics dashboard
- And more...

Example:

```typescript
// admin/Dashboard.tsx
export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/stats').then(res => setStats(res.data));
  }, []);

  return (
    <AdminLayout>
      <StatsGrid stats={stats} />
      <RecentPosts />
      <AnalyticsChart />
    </AdminLayout>
  );
};
```

### `/src/services` - API Services

API communication layer:

- `api.ts` - API client setup
- `postService.ts` - Post API calls
- `authService.ts` - Authentication API
- `userService.ts` - User API calls
- `categoryService.ts` - Category API calls
- `commentService.ts` - Comment API calls
- And more...

Example:

```typescript
// services/postService.ts
import api from "./api";

export const postService = {
  // Get all posts
  getPosts: (page = 1, limit = 10) =>
    api.get(`/posts?page=${page}&limit=${limit}`),

  // Get single post
  getPost: (id: number) => api.get(`/posts/${id}`),

  // Create post (admin)
  createPost: (data: any) => api.post("/posts", data),

  // Update post
  updatePost: (id: number, data: any) => api.put(`/posts/${id}`, data),

  // Delete post
  deletePost: (id: number) => api.delete(`/posts/${id}`),
};
```

### `/src/hooks` - Custom Hooks

React hooks untuk reusable logic:

- `useAuth.ts` - Authentication hook
- `useTheme.ts` - Theme management
- `usePosts.ts` - Posts data fetching
- `useLocalStorage.ts` - Local storage access
- `useFetch.ts` - Generic fetch hook
- And more...

Example:

```typescript
// hooks/useAuth.ts
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/auth/profile");
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { user, loading };
};
```

### `/src/services` - API Configuration

```typescript
// services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

---

## Components

### Layout Components

#### Header & Navigation

```typescript
<Header>
  <Logo />
  <NavMenu />
  <SearchBar />
  <UserMenu />
</Header>
```

#### Sidebar

```typescript
<Sidebar>
  <NavLink href="/">Home</NavLink>
  <NavLink href="/posts">Posts</NavLink>
  <NavLink href="/about">About</NavLink>
  <NavLink href="/contact">Contact</NavLink>
</Sidebar>
```

### Post Components

#### PostCard

- Display single post preview
- Clickable to view full post
- Show category and author

#### PostList

- Display multiple posts
- Pagination support
- Filtering options

#### PostDetail

- Full post content
- Comments section
- Related posts
- Like/Share buttons

### Form Components

#### LoginForm

- Email input
- Password input
- Remember me checkbox
- Submit button

#### CommentForm

- Textarea for comment
- Author name input
- Submit button

### Common Components

#### LoadingSpinner

- Animated loader
- Full page or component level

#### Modal

- Reusable modal dialog
- Customizable title and content

#### Button

- Different variants (primary, secondary, danger)
- Loading state support

#### Card

- Container with shadow and border-radius
- Responsive padding

---

## Pages

### Public Pages

#### Home Page (`/`)

- Hero section with featured post
- Latest posts grid
- Category showcase
- Newsletter signup
- Footer with links

#### Posts Page (`/posts`)

- All posts listing
- Pagination
- Category filter
- Search functionality
- Sorting options

#### Post Detail Page (`/posts/:id`)

- Full post content
- Author info
- Related posts
- Comments section
- Share buttons

#### Category Page (`/category/:slug`)

- Posts filtered by category
- Category description
- Sub-categories
- Pagination

#### About Page (`/about`)

- About us content
- Team members
- Company info
- Contact information

#### Contact Page (`/contact`)

- Contact form
- Company address
- Social media links
- Map (if available)

#### Search Results Page (`/search`)

- Search query display
- Filtered posts results
- Result count
- No results message

### Admin Pages

#### Admin Dashboard (`/admin`)

- Statistics overview
- Recent posts
- User activity
- Analytics charts

#### Post Management (`/admin/posts`)

- List all posts
- Create new post
- Edit post
- Delete post
- Bulk actions

#### User Management (`/admin/users`)

- List all users
- Create user
- Edit user profile
- Change user role
- Delete user

#### Category Management (`/admin/categories`)

- List categories
- Create category
- Edit category
- Delete category

---

## Styling

### Tailwind CSS

Styling menggunakan Tailwind CSS utility classes:

```typescript
<div className="container mx-auto px-4 py-8">
  <h1 className="text-3xl font-bold text-gray-900 mb-4">
    Welcome to Our Blog
  </h1>
  <p className="text-gray-600 text-lg mb-8">
    Latest news and updates...
  </p>
</div>
```

### Tailwind Configuration

```javascript
// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",
        secondary: "#10B981",
      },
    },
  },
  plugins: [],
};
```

### Global Styles

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom utilities */
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition;
  }

  .card {
    @apply bg-white rounded-lg shadow-md p-4;
  }
}
```

### Dark Mode

```typescript
// Dark mode support via Tailwind
<div className="dark:bg-gray-900 dark:text-white">
  Content
</div>
```

---

## Development

### Running Development Server

```bash
npm run dev
```

Opens `http://localhost:5173` with hot module replacement (HMR).

### TypeScript

```bash
# Type checking
tsc --noEmit

# Build with type checking
npm run build
```

### Linting

```bash
# Check for lint errors
npm run lint

# Fix lint errors
npm run lint -- --fix
```

### Debugging

#### Browser DevTools

- React Developer Tools extension
- Network tab for API calls
- Console for errors

#### VSCode Debugging

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Chrome",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```

---

## Build & Deployment

### Production Build

```bash
npm run build
```

Generates optimized build in `dist/` folder.

### Build Output

```
dist/
├── index.html           # Main HTML
├── assets/
│   ├── main.[hash].js   # JS bundle
│   ├── main.[hash].css  # CSS bundle
│   └── ...other assets
└── ...
```

### Preview Build

```bash
npm run preview
```

Test production build locally.

### Deployment

#### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Deploy to Netlify

```bash
# Build
npm run build

# Deploy dist folder to Netlify
netlify deploy --prod --dir dist
```

#### Deploy to Traditional Server

```bash
# Build
npm run build

# Copy dist folder to server
scp -r dist/ user@server:/var/www/news-app

# Configure Nginx to serve dist folder
# (See VPS deployment guide)
```

#### Docker Deployment

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## Common Tasks

### Add New Page

1. Create page component in `src/pages/NewPage.tsx`
2. Add route in `src/App.tsx`:

```typescript
import NewPage from './pages/NewPage';

<Route path="/new-page" element={<NewPage />} />
```

3. Add navigation link in menu

### Add New Component

1. Create component in `src/components/NewComponent.tsx`
2. Export from component
3. Import and use in other components:

```typescript
import { NewComponent } from '@/components/NewComponent';

// Use component
<NewComponent prop="value" />
```

### Create API Service

1. Create service in `src/services/newService.ts`
2. Define API methods:

```typescript
export const newService = {
  getAll: () => api.get("/endpoint"),
  getOne: (id: number) => api.get(`/endpoint/${id}`),
  create: (data: any) => api.post("/endpoint", data),
};
```

### State Management

Using Context API for global state:

```typescript
// contexts/PostContext.tsx
const PostContext = React.createContext(null);

export const PostProvider: React.FC = ({ children }) => {
  const [posts, setPosts] = useState([]);

  return (
    <PostContext.Provider value={{ posts, setPosts }}>
      {children}
    </PostContext.Provider>
  );
};

// Use in component
const { posts } = useContext(PostContext);
```

---

## Environment Variables

```env
# API Configuration
VITE_API_URL=http://localhost:3001/api

# App Configuration
VITE_APP_NAME=News Al-Muhtada
VITE_APP_DESCRIPTION=Berita & Informasi Terkini

# Feature Flags (optional)
VITE_ENABLE_COMMENTS=true
VITE_ENABLE_SHARING=true
```

---

## Troubleshooting

### Port Already in Use

```bash
# Change port in vite.config.ts
export default {
  server: {
    port: 3000,
  },
};
```

### API Connection Error

- Check backend is running on correct port
- Verify `VITE_API_URL` in `.env`
- Check CORS configuration in backend

### Build Error

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

### Component Not Rendering

- Check component is exported correctly
- Verify route is added in `App.tsx`
- Check for console errors

---

## Resources

- [React Docs](https://react.dev/)
- [TypeScript Docs](https://www.typescriptlang.org/)
- [Vite Docs](https://vitejs.dev/)
- [React Router Docs](https://reactrouter.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [Framer Motion Docs](https://www.framer.com/motion/)

---

**Last Updated:** January 28, 2026  
**Version:** 1.0.0
