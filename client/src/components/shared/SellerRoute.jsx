import { Navigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

export default function SellerRoute({ children }) {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== "seller") {
    return <Navigate to="/" replace />;
  }

  return children;
}
