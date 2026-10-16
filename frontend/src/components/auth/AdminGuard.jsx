import { Navigate, useLocation } from "react-router-dom";
import { useGetProfileQuery } from "../../lib/features/auth/authApi";
import Loader from "../../utils/Loader";
import AuthCheckFallback from "./AuthCheckFallback";
import { isDefinitiveAuthError } from "../../lib/features/auth/authErrors";

const AdminGuard = ({ children }) => {
  const {
    data: user,
    isError,
    isFetching,
    isLoading,
    isUninitialized,
    refetch,
    error,
  } = useGetProfileQuery();
  const location = useLocation();

  if (isUninitialized || isLoading || (isFetching && !user)) return <Loader />;

  if (isError && !isDefinitiveAuthError(error)) {
    if (user?.role === "admin") return <>{children}</>;
    return <AuthCheckFallback onRetry={refetch} />;
  }

  if (isError || user?.role !== "admin") {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (!user) return <AuthCheckFallback onRetry={refetch} />;

  return <>{children}</>;
};

export default AdminGuard;
