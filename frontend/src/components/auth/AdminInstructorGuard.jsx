"use client";

import { useRouter } from "@/lib/navigation";
import { useGetProfileQuery } from "../../lib/features/auth/authApi";
import Loader from "../../utils/Loader";
import { useEffect } from "react";

export default function AdminInstructorGuard({ children }) {
  const { data: user, isLoading, isError } = useGetProfileQuery();
  const router = useRouter();

  useEffect(() => {
    if (
      !isLoading &&
      (isError || (user?.role !== "admin" && user?.role !== "instructor"))
    ) {
      router.push("/");
    }
  }, [isLoading, isError, user, router]);

  if (isLoading) return <Loader />;
  if (isError || (user?.role !== "admin" && user?.role !== "instructor"))
    return null;

  return <>{children}</>;
}
