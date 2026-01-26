# Common Components

Komponen-komponen global yang bisa digunakan di seluruh aplikasi.

## Pagination

Komponen pagination global yang reusable untuk semua list.

### Penggunaan Langsung

```tsx
import { Pagination } from "../../components/common";

function MyListComponent() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;
  const totalItems = 100;
  const displayedCount = 10;

  return (
    <div>
      {/* Your list content here */}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        displayedCount={displayedCount}
        itemLabel="publikasi" // Custom label
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
```

### Penggunaan dengan Wrapper Component

Untuk konsistensi, buat wrapper component untuk setiap jenis list:

```tsx
// components/admin/publications/publication-pagination.tsx
import React from "react";
import Pagination from "../../common/Pagination";

interface PublicationPaginationProps {
  currentPage: number;
  totalPages: number;
  totalPublications: number;
  displayedCount: number;
  onPageChange: (page: number) => void;
}

const PublicationPagination: React.FC<PublicationPaginationProps> = ({
  currentPage,
  totalPages,
  totalPublications,
  displayedCount,
  onPageChange,
}) => {
  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalPublications}
      displayedCount={displayedCount}
      itemLabel="publikasi"
      onPageChange={onPageChange}
    />
  );
};

export default PublicationPagination;
```

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `currentPage` | `number` | ✅ | - | Halaman saat ini (1-based) |
| `totalPages` | `number` | ✅ | - | Total jumlah halaman |
| `totalItems` | `number` | ✅ | - | Total jumlah item |
| `displayedCount` | `number` | ✅ | - | Jumlah item yang ditampilkan di halaman ini |
| `itemLabel` | `string` | ❌ | `"item"` | Label untuk item (e.g., "artikel", "publikasi") |
| `onPageChange` | `(page: number) => void` | ✅ | - | Callback saat halaman berubah |
| `className` | `string` | ❌ | `""` | Custom CSS class |

### Contoh Label

- `"artikel"` - untuk news list
- `"publikasi"` - untuk publications list
- `"prestasi"` - untuk achievements list
- `"user"` atau `"pengguna"` - untuk user list
- `"notifikasi"` - untuk notifications list
- `"komentar"` - untuk comments list

### Features

- ✅ Responsive design
- ✅ Prev/Next navigation
- ✅ Page number buttons dengan smart ellipsis
- ✅ Accessibility attributes (aria-label, aria-current)
- ✅ Disabled state untuk tombol prev/next
- ✅ Custom styling dengan Tailwind
- ✅ Auto-hide jika hanya 1 halaman

### Smart Ellipsis

Component akan menampilkan:
- Halaman pertama (1)
- Halaman terakhir (totalPages)
- Halaman saat ini (currentPage)
- Halaman sebelum dan sesudah current (currentPage ± 1)
- Ellipsis (...) untuk gap antara halaman

Contoh untuk 10 halaman:
- Di halaman 1: `[1] 2 ... 10`
- Di halaman 5: `1 ... 4 [5] 6 ... 10`
- Di halaman 10: `1 ... 9 [10]`
