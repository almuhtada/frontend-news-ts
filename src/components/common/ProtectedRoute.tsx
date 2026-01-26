import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem("admin_token");

  if (!token) {
    return <Navigate to="/login/admin" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
