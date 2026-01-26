# Contoh Wrapper Components untuk Pagination

Berikut adalah contoh wrapper components untuk berbagai jenis list.
Copy dan sesuaikan dengan kebutuhan Anda.

## 1. Publications Pagination

```tsx
// components/components-admin/jurnal/publication-pagination.tsx
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

## 2. Achievements Pagination

```tsx
// components/components-admin/prestasi/achievement-pagination.tsx
import React from "react";
import Pagination from "../../common/Pagination";

interface AchievementPaginationProps {
  currentPage: number;
  totalPages: number;
  totalAchievements: number;
  displayedCount: number;
  onPageChange: (page: number) => void;
}

const AchievementPagination: React.FC<AchievementPaginationProps> = ({
  currentPage,
  totalPages,
  totalAchievements,
  displayedCount,
  onPageChange,
}) => {
  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalAchievements}
      displayedCount={displayedCount}
      itemLabel="prestasi"
      onPageChange={onPageChange}
    />
  );
};

export default AchievementPagination;
```

## 3. Users Pagination

```tsx
// components/components-admin/users/user-pagination.tsx
import React from "react";
import Pagination from "../../common/Pagination";

interface UserPaginationProps {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  displayedCount: number;
  onPageChange: (page: number) => void;
}

const UserPagination: React.FC<UserPaginationProps> = ({
  currentPage,
  totalPages,
  totalUsers,
  displayedCount,
  onPageChange,
}) => {
  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalUsers}
      displayedCount={displayedCount}
      itemLabel="pengguna"
      onPageChange={onPageChange}
    />
  );
};

export default UserPagination;
```

## 4. Notifications Pagination

```tsx
// components/components-admin/notification/notification-pagination.tsx
import React from "react";
import Pagination from "../../common/Pagination";

interface NotificationPaginationProps {
  currentPage: number;
  totalPages: number;
  totalNotifications: number;
  displayedCount: number;
  onPageChange: (page: number) => void;
}

const NotificationPagination: React.FC<NotificationPaginationProps> = ({
  currentPage,
  totalPages,
  totalNotifications,
  displayedCount,
  onPageChange,
}) => {
  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalNotifications}
      displayedCount={displayedCount}
      itemLabel="notifikasi"
      onPageChange={onPageChange}
    />
  );
};

export default NotificationPagination;
```

## Cara Menggunakan di Page Component

```tsx
// admin/dashboard/add-jurnal.tsx
import PublicationPagination from "../../components/components-admin/jurnal/publication-pagination";

const AdminPublications: React.FC = () => {
  const {
    publications,
    currentPage,
    totalPages,
    totalCount,
    displayedCount,
    setCurrentPage,
  } = useJurnalPage();

  return (
    <div>
      {/* Your content */}
      <JurnalContent publications={publications} />

      {/* Pagination */}
      <PublicationPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalPublications={totalCount}
        displayedCount={displayedCount}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
```

## Update Hook untuk Support Pagination

Jika hook belum support pagination, tambahkan state berikut:

```tsx
// components/components-admin/jurnal/use-jurnal-page.ts
export const useJurnalPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12; // Items per page

  const fetchData = useCallback(async () => {
    const response = await publicationsService.getPublications({
      page: currentPage,
      limit,
      // ... other params
    });

    setPublications(response.data);
    setTotalPages(response.totalPages);
  }, [currentPage]);

  return {
    // ... existing returns
    currentPage,
    totalPages,
    displayedCount: publications.length,
    setCurrentPage,
  };
};
```
