import React from "react";
import Pagination from "../../common/Pagination";

interface NotificationPaginationProps {
  currentPage: number;
  totalPages: number;
  totalNotifications: number;
  displayedCount: number;
  onPageChange: (page: number) => void;
}

/**
 * Notification Pagination Component
 * Wrapper around global Pagination component for notification list
 */
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
