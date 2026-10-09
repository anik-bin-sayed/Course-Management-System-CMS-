import { Navigate } from "react-router-dom";
import { useGetProfileQuery } from "@/lib/features/auth/authApi";
import Loader from "@/utils/Loader";

const ProtectedRoute = ({ children }) => {
  const { isLoading, isError } = useGetProfileQuery();

  if (isLoading) return <Loader />;
  if (isError) return <Navigate to="/" replace />;
  return children;
};

export default ProtectedRoute;
