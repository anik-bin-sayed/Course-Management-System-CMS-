import { Navigate, useLocation } from "react-router-dom";
import { useGetProfileQuery } from "../../lib/features/auth/authApi";
import Loader from "../../utils/Loader";
import AuthCheckFallback from "./AuthCheckFallback";
import { isDefinitiveAuthError } from "../../lib/features/auth/authErrors";

const AdminInstructorGuard = ({ children }) => {
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
  const allowedRole = user?.role === "admin" || user?.role === "instructor";

  if (isUninitialized || isLoading || (isFetching && !user)) {
    return <Loader variant="inline" />;
  }

  if (isError && !isDefinitiveAuthError(error)) {
    if (user && allowedRole) return <>{children}</>;
    return <AuthCheckFallback inline onRetry={refetch} />;
  }

  if (isError || !allowedRole) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (!user) return <AuthCheckFallback inline onRetry={refetch} />;

  return <>{children}</>;
};
export default AdminInstructorGuard;
