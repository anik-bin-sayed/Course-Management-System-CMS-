import { useEffect } from "react";
import { useRouter } from "@/lib/navigation";
import { useGetProfileQuery } from "../../lib/features/auth/authApi";
import Loader from "../../utils/Loader";

const AdminGuard = ({ children }) => {
  const { data: user, isLoading, isError } = useGetProfileQuery();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (isError || user?.role !== "admin")) {
      router.back();
    }
  }, [isLoading, isError, user, router]);

  if (isLoading) return <Loader />;
  if (isError || user?.role !== "admin") return null;

  return <>{children}</>;
};

export default AdminGuard;
