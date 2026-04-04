# News Al-Muhtada Project - Complete Documentation

> **Dokumentasi lengkap untuk cara menggunakan components, setup, dan development**

## 🎯 Dokumentasi yang Tersedia

### 📚 **Utama Dokumentasi Project**

1. **[FRONTEND-DOCUMENTATION.md](./FRONTEND-DOCUMENTATION.md)** - Dokumentasi frontend lengkap
   - Project setup & installation
   - Folder structure
   - API integration
   - Routing system
   - State management
   - Build & deployment

2. **[DEVELOPMENT-GUIDE.md](./DEVELOPMENT-GUIDE.md)** - Development workflow
   - Local development setup
   - Common tasks
   - Debugging
   - Performance optimization
   - Testing

### 🧩 **Components Documentation**

#### **1. [COMPONENTS-USAGE-GUIDE.md](./src/components/COMPONENTS-USAGE-GUIDE.md)** - Panduan lengkap semua components

Dokumen ini menjelaskan:

- ✅ **Common Components**: Pagination, ProtectedRoute, NewsList, NewsSection
- ✅ **Global Components**: Card, Section, Trending lists
- ✅ **Admin Components**: Tables, Modals, Filters, Grid cards
- ✅ **Component Patterns**: Controlled components, Compound components, Render props
- ✅ **Complete Usage Examples**: Real-world implementations

**Cara Pakai:**

```typescript
// Example: Menggunakan Pagination
import { Pagination } from '@/components/common/Pagination';

<Pagination
  currentPage={1}
  totalPages={5}
  onPageChange={setPage}
/>
```

#### **2. [PAGINATION-TABLE-GUIDE.md](./src/components/PAGINATION-TABLE-GUIDE.md)** - Panduan Pagination & Table (Detailed)

Dokumen ini fokus pada:

- ✅ **Pagination Component**
  - Props details
  - Client-side vs Server-side pagination
  - Cursor-based pagination
  - Styling customization
- ✅ **Table News Component**
  - Full API documentation
  - Complete CRUD examples
  - Row actions
  - Sorting & filtering
  - Loading & empty states

- ✅ **Integration Tutorial**
  - Step-by-step setup
  - Add action handlers
  - Add toast notifications
  - Add modals

- ✅ **Advanced Examples**
  - Pagination with search
  - Multi-select with bulk actions
  - Filtering & sorting

**Cara Pakai:**

```typescript
// Example: Tabel berita dengan pagination
<TableNews
  news={news}
  pagination={{
    currentPage: page,
    totalPages: totalPages,
    onPageChange: setPage,
  }}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

#### **3. [AI-COMPONENTS-GUIDE.md](./src/components/AI-COMPONENTS-GUIDE.md)** - Panduan AI/ML Components

Dokumen ini menjelaskan:

- ✅ **AI Model Integration**
  - Python model setup
  - Express API routes
  - Inference script

- ✅ **Frontend AI Components**
  - AIClassification component
  - AIExcerptGenerator component
  - AIRecommendations component

- ✅ **Usage Examples**
  - News form dengan AI assistance
  - News detail dengan recommendations

- ✅ **API Endpoints**
  - `/api/ai/classify` - Classify articles
  - `/api/ai/generate-excerpt` - Auto excerpt
  - `/api/ai/recommend` - Recommendations

**Cara Pakai:**

```typescript
// Example: Form dengan AI classification
<AIClassification
  title={title}
  content={content}
  onCategoryChange={setCategory}
/>
```

#### **4. [COMPONENTS-INDEX.md](./src/components/COMPONENTS-INDEX.md)** - Index & Quick Reference

Dokumen ini menyediakan:

- ✅ **Complete Component Map** - Tabel semua components dengan props
- ✅ **Quick Start Guides** - 4 use case utama
- ✅ **Import Examples** - Cara import setiap component
- ✅ **Props Interfaces** - TypeScript interfaces semua components
- ✅ **Common Patterns** - Design patterns yang digunakan
- ✅ **Testing** - Cara test components
- ✅ **Accessibility** - Best practices A11y

---

## 🚀 Quick Start by Task

### Task 1: Menampilkan List Berita dengan Pagination

**Lihat:** [PAGINATION-TABLE-GUIDE.md - Basic Usage](./src/components/PAGINATION-TABLE-GUIDE.md#basic-usage)

```typescript
import { NewsList } from '@/components/common/NewsList';
import { Pagination } from '@/components/common/Pagination';

function NewsPage() {
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(news.length / ITEMS_PER_PAGE);

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

### Task 2: Membuat Admin News Management

**Lihat:** [PAGINATION-TABLE-GUIDE.md - Complete Example](./src/components/PAGINATION-TABLE-GUIDE.md#complete-example-with-crud)

```typescript
import { TableNews } from '@/components/components-admin/table-news';
import { ModalAddNews } from '@/components/components-admin/modal-add-news';

function AdminNewsManagement() {
  const [news, setNews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>Add News</button>
      <TableNews
        news={news}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <ModalAddNews
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitNews}
      />
    </>
  );
}
```

### Task 3: Menggunakan AI untuk Auto-Classify & Generate Excerpt

**Lihat:** [AI-COMPONENTS-GUIDE.md - Example 1](./src/components/AI-COMPONENTS-GUIDE.md#example-1-news-form-with-ai-assistance)

```typescript
import { AIClassification } from '@/components/components-admin/ai-classification';
import { AIExcerptGenerator } from '@/components/components-admin/ai-excerpt-generator';

function AddNewsForm() {
  return (
    <form>
      <AIClassification
        title={title}
        content={content}
        onCategoryChange={setCategory}
      />
      <AIExcerptGenerator
        content={content}
        onExcerptGenerated={setExcerpt}
      />
    </form>
  );
}
```

### Task 4: Menampilkan Artikel dengan Recommendations

**Lihat:** [AI-COMPONENTS-GUIDE.md - Example 2](./src/components/AI-COMPONENTS-GUIDE.md#example-2-news-detail-with-recommendations)

```typescript
import { AIRecommendations } from '@/components/components-admin/ai-recommendations';

function NewsDetail({ newsId }) {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2">
        {/* Main content */}
      </div>
      <div className="col-span-1">
        <AIRecommendations newsId={newsId} limit={5} />
      </div>
    </div>
  );
}
```

### Task 5: Protect Admin Routes

**Lihat:** [COMPONENTS-USAGE-GUIDE.md - ProtectedRoute](./src/components/COMPONENTS-USAGE-GUIDE.md#4-protectedroutetsx)

```typescript
import { ProtectedRoute } from '@/components/common/ProtectedRoute';

<Route
  path="/admin/*"
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

---

## 📖 Dokumentasi by Component Type

### Common Components (Reusable)

| Component          | Dokumentasi                                                                                 | Use Case                |
| ------------------ | ------------------------------------------------------------------------------------------- | ----------------------- |
| **Pagination**     | [PAGINATION-TABLE-GUIDE.md](./src/components/PAGINATION-TABLE-GUIDE.md)                     | Navigasi antar halaman  |
| **NewsList**       | [COMPONENTS-USAGE-GUIDE.md](./src/components/COMPONENTS-USAGE-GUIDE.md#2-newslsttsx)        | Menampilkan list berita |
| **NewsSection**    | [COMPONENTS-USAGE-GUIDE.md](./src/components/COMPONENTS-USAGE-GUIDE.md#3-newssectiontsx)    | Section dengan title    |
| **ProtectedRoute** | [COMPONENTS-USAGE-GUIDE.md](./src/components/COMPONENTS-USAGE-GUIDE.md#4-protectedroutetsx) | Protect routes          |

### Global Components (Shared)

| Component         | Dokumentasi                                                                                | Use Case             |
| ----------------- | ------------------------------------------------------------------------------------------ | -------------------- |
| **ArticleCard**   | [COMPONENTS-USAGE-GUIDE.md](./src/components/COMPONENTS-USAGE-GUIDE.md#1-card-artikeltsx)  | Article card display |
| **TrendingList**  | [COMPONENTS-USAGE-GUIDE.md](./src/components/COMPONENTS-USAGE-GUIDE.md#2-trending-listtsx) | Trending articles    |
| **SectionCard**   | [COMPONENTS-USAGE-GUIDE.md](./src/components/COMPONENTS-USAGE-GUIDE.md#3-sectioncardtsx)   | Section wrapper      |
| **CardHeadliner** | [COMPONENTS-INDEX.md](./src/components/COMPONENTS-INDEX.md#global-components)              | Featured article     |

### Admin Components (Dashboard)

| Component        | Dokumentasi                                                                                  | Use Case              |
| ---------------- | -------------------------------------------------------------------------------------------- | --------------------- |
| **TableNews**    | [PAGINATION-TABLE-GUIDE.md](./src/components/PAGINATION-TABLE-GUIDE.md#table-news-component) | News management table |
| **ModalAddNews** | [COMPONENTS-USAGE-GUIDE.md](./src/components/COMPONENTS-USAGE-GUIDE.md#4-modal-add-newstsx)  | Add/edit news modal   |
| **FilterNews**   | [COMPONENTS-USAGE-GUIDE.md](./src/components/COMPONENTS-USAGE-GUIDE.md#3-filter-newstsx)     | Filter options        |
| **GridCard**     | [COMPONENTS-USAGE-GUIDE.md](./src/components/COMPONENTS-USAGE-GUIDE.md#2-grid-cardtsx)       | Grid layout           |
| **SuccessToast** | [COMPONENTS-USAGE-GUIDE.md](./src/components/COMPONENTS-USAGE-GUIDE.md#5-success-toasttsx)   | Notifications         |

### AI Components (Machine Learning)

| Component              | Dokumentasi                                                                                             | Use Case               |
| ---------------------- | ------------------------------------------------------------------------------------------------------- | ---------------------- |
| **AIClassification**   | [AI-COMPONENTS-GUIDE.md](./src/components/AI-COMPONENTS-GUIDE.md#1-ai-classification-display-component) | Auto-classify articles |
| **AIExcerptGenerator** | [AI-COMPONENTS-GUIDE.md](./src/components/AI-COMPONENTS-GUIDE.md#2-ai-excerpt-generator-component)      | Auto-generate excerpt  |
| **AIRecommendations**  | [AI-COMPONENTS-GUIDE.md](./src/components/AI-COMPONENTS-GUIDE.md#3-ai-recommendation-component)         | Recommend articles     |

---

## 🔧 Backend Dokumentasi

**Lihat:** [../backend-news-express/BACKEND-DOCUMENTATION.md](../backend-news-express/BACKEND-DOCUMENTATION.md)

Dokumentasi lengkap untuk:

- API endpoints
- Controllers
- Database schema
- Authentication
- File uploads
- Error handling

---

## 📝 Development Setup

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

**Lihat:** [DEVELOPMENT-GUIDE.md](./DEVELOPMENT-GUIDE.md) untuk detail lengkap.

### Backend Setup

```bash
cd ../backend-news-express

# Install dependencies
npm install

# Setup database
npm run migrate

# Start server
npm start
```

**Lihat:** [../backend-news-express/QUICK-START.md](../backend-news-express/QUICK-START.md)

---

## 📚 Dokumentasi Structure

```
news_almuhtada/
├── FRONTEND-DOCUMENTATION.md      ← Project overview & setup
├── DEVELOPMENT-GUIDE.md            ← Development workflow
└── src/
    └── components/
        ├── COMPONENTS-USAGE-GUIDE.md    ← Cara pakai semua components
        ├── PAGINATION-TABLE-GUIDE.md    ← Detail pagination & table
        ├── AI-COMPONENTS-GUIDE.md       ← AI/ML components
        ├── COMPONENTS-INDEX.md          ← Quick reference & index
        ├── common/                      ← Reusable components
        ├── components-admin/            ← Admin-specific components
        ├── components-global/           ← Global shared components
        └── ...                          ← Other component folders
```

---

## 🎓 Learning Path

### Beginner

1. Baca [COMPONENTS-INDEX.md](./src/components/COMPONENTS-INDEX.md) untuk overview
2. Lihat "Quick Start by Task" di atas
3. Copy-paste contoh dari dokumentasi

### Intermediate

1. Baca [COMPONENTS-USAGE-GUIDE.md](./src/components/COMPONENTS-USAGE-GUIDE.md) lengkap
2. Baca [PAGINATION-TABLE-GUIDE.md](./src/components/PAGINATION-TABLE-GUIDE.md) untuk admin features
3. Implementasikan fitur dengan mengikuti examples

### Advanced

1. Baca [AI-COMPONENTS-GUIDE.md](./src/components/AI-COMPONENTS-GUIDE.md)
2. Lihat [DEVELOPMENT-GUIDE.md](./DEVELOPMENT-GUIDE.md) untuk optimization
3. Setup AI/ML pipeline sesuai kebutuhan
4. Kontribusi ke project dengan best practices

---

## 🔍 Cara Mencari Informasi

### Cari Component Usage

1. Buka [COMPONENTS-INDEX.md](./src/components/COMPONENTS-INDEX.md)
2. Cari component name di "Complete Component Map"
3. Lihat file dan dokumentasi yang sesuai

### Cari Admin Feature

1. Buka [PAGINATION-TABLE-GUIDE.md](./src/components/PAGINATION-TABLE-GUIDE.md)
2. Lihat "Complete Example with CRUD"
3. Copy-paste dan modifikasi sesuai kebutuhan

### Cari AI Feature

1. Buka [AI-COMPONENTS-GUIDE.md](./src/components/AI-COMPONENTS-GUIDE.md)
2. Lihat "Usage Examples" section
3. Implementasikan sesuai use case

### Cari TypeScript Types

1. Buka [COMPONENTS-INDEX.md](./src/components/COMPONENTS-INDEX.md)
2. Scroll ke "Component Props TypeScript Interfaces"
3. Copy interface yang dibutuhkan

---

## ✅ Checklist Before Coding

- [ ] Baca dokumentasi yang relevan
- [ ] Pahami component props
- [ ] Cek example dari dokumentasi
- [ ] Setup state management
- [ ] Handle error & loading states
- [ ] Test component locally
- [ ] Check TypeScript errors
- [ ] Format code with Prettier

---

## 🐛 Debugging & Troubleshooting

**Lihat:** [DEVELOPMENT-GUIDE.md - Debugging Section](./DEVELOPMENT-GUIDE.md)

### Common Issues

1. **Component tidak render?** - Cek console errors, lihat example docs
2. **Props tidak work?** - Cek TypeScript interface di COMPONENTS-INDEX.md
3. **API error?** - Cek backend API docs di backend-news-express/
4. **Styling issue?** - Cek Tailwind CSS di project
5. **AI error?** - Cek Python setup di backend-news-express/ai-news/

---

## 📞 Support Resources

### Documentation Files

- Components: [COMPONENTS-USAGE-GUIDE.md](./src/components/COMPONENTS-USAGE-GUIDE.md)
- Pagination & Table: [PAGINATION-TABLE-GUIDE.md](./src/components/PAGINATION-TABLE-GUIDE.md)
- AI Features: [AI-COMPONENTS-GUIDE.md](./src/components/AI-COMPONENTS-GUIDE.md)
- Quick Reference: [COMPONENTS-INDEX.md](./src/components/COMPONENTS-INDEX.md)
- Development: [DEVELOPMENT-GUIDE.md](./DEVELOPMENT-GUIDE.md)
- Frontend: [FRONTEND-DOCUMENTATION.md](./FRONTEND-DOCUMENTATION.md)
- Backend: [../backend-news-express/BACKEND-DOCUMENTATION.md](../backend-news-express/BACKEND-DOCUMENTATION.md)

---

## 📊 Project Info

- **Frontend Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v7
- **Backend:** Express.js (See backend docs)
- **Database:** MySQL

---

## 🎯 Next Steps

1. ✅ Baca dokumentasi sesuai kebutuhan
2. ✅ Copy contoh dari dokumentasi
3. ✅ Implementasikan fitur
4. ✅ Test dengan local development
5. ✅ Deploy ke production

---

**Last Updated:** January 28, 2026  
**Version:** 1.0.0  
**Status:** Complete Documentation Set
