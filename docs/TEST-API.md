# Test API Integration

## ✅ URL Building Fixed!

### Masalah Yang Diperbaiki:
**Before:** `http://localhost:3001/categories` ❌ (404 Not Found)
**After:** `http://localhost:3001/api/categories` ✅ (Works!)

### Penjelasan Fix:
File `src/services/api.ts` sekarang dengan benar menggabungkan:
- Base URL: `http://localhost:3001/api`
- Endpoint: `/categories`
- Result: `http://localhost:3001/api/categories`

## 🧪 Test Endpoints

### 1. Categories
```bash
curl http://localhost:3001/api/categories
```
Expected: JSON dengan 18 categories

### 2. Posts
```bash
curl http://localhost:3001/api/posts?limit=5&status=publish
```
Expected: JSON dengan 5 posts

### 3. Popular Posts
```bash
curl http://localhost:3001/api/posts/popular?limit=3
```
Expected: JSON dengan 3 popular posts

## 📊 Expected Data Flow

1. **Frontend Request:**
   ```typescript
   categoriesService.getCategories()
   ```

2. **API Call:**
   ```
   GET http://localhost:3001/api/categories
   ```

3. **Backend Response:**
   ```json
   {
     "success": true,
     "data": [
       { "id": 1, "name": "Berita", "slug": "berita" },
       { "id": 14, "name": "Doa Harian", "slug": "doa-harian" },
       ...
     ]
   }
   ```

4. **Frontend Display:**
   - Categories ditampilkan di filter
   - Posts ditampilkan di cards
   - Trending posts di sidebar

## ✅ Checklist

- [x] Backend API running (port 3001)
- [x] Frontend dev server running (port 5174)
- [x] URL building fixed
- [x] CORS enabled
- [x] Environment variable loaded
- [x] TypeScript errors fixed
- [x] API endpoints responding

## 🎯 Next: Refresh Browser

Setelah save file `api.ts`, frontend akan auto-reload dan seharusnya data sudah muncul!

Buka browser: http://localhost:5174

Expected Result:
- ✅ Carousel dengan featured posts
- ✅ Categories filter dari database
- ✅ Article cards dengan data real
- ✅ Trending posts di sidebar
- ✅ NO more 404 errors in console
