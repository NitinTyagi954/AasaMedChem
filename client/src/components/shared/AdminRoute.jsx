import { Navigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

export default function AdminRoute({ children }) {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}