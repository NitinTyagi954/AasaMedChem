import { Navigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

export default function BuyerRoute({ children }) {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== "buyer") {
    return <Navigate to="/" replace />;
  }

  return children;
}
