import { Navigate, Outlet } from "react-router-dom";
import { useGetProfileQuery } from "@/lib/features/auth/authApi";
import Loader from "@/utils/Loader";

export default function PublicRoute() {
  const { data: user, isLoading, isError } = useGetProfileQuery();

  if (isLoading) return <Loader />;
  if (!isError && user) return <Navigate to="/" replace />;
  return <Outlet />;
}
