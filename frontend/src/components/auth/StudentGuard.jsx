import { useRouter } from "@/lib/navigation";
import { useGetProfileQuery } from "../../lib/features/auth/authApi";
import { useEffect } from "react";
import Loader from "../../utils/Loader";

const StudentGuard = () => {
  const { data: user, isLoading, isError } = useGetProfileQuery();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (isError || user?.role !== "student")) {
      router.back();
    }
  }, [isLoading, isError, user, router]);

  if (isLoading) return <Loader />;
  if (isError || user?.role !== "student") return null;

  return <>{children}</>;
};

export default StudentGuard;
