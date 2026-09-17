import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="p-10 text-center text-ink-500">Đang tải...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
