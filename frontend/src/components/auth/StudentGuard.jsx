import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useGetProfileQuery } from "../../lib/features/auth/authApi";
import {
  isEnrollmentEligible,
  useGetMyEnrollmentsQuery,
} from "../../lib/features/enrollment/enrollmentApi";
import Loader from "../../utils/Loader";
import AuthCheckFallback from "./AuthCheckFallback";
import { isDefinitiveAuthError } from "../../lib/features/auth/authErrors";

const StudentGuard = ({ children }) => {
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
  const {
    data: enrollments,
    isError: isEnrollmentError,
    isFetching: isFetchingEnrollments,
    isLoading: isLoadingEnrollments,
    isUninitialized: areEnrollmentsUninitialized,
    refetch: refetchEnrollments,
    error: enrollmentError,
  } = useGetMyEnrollmentsQuery(undefined, {
    skip: !user || user.role !== "student",
  });

  if (isUninitialized || isLoading || (isFetching && !user)) {
    return;
  }

  if (isError && !isDefinitiveAuthError(error)) {
    return <AuthCheckFallback inline onRetry={refetch} />;
  }

  if (isError || !user) {
    return (
      <Navigate to="/" replace state={{ from: location, openLogin: true }} />
    );
  }

  if (user.role !== "student") {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  const hasEligibleEnrollment = enrollments?.some(isEnrollmentEligible);

  if (isEnrollmentError && isDefinitiveAuthError(enrollmentError)) {
    return (
      <Navigate to="/" replace state={{ from: location, openLogin: true }} />
    );
  }

  const isEnrollmentLoading =
    areEnrollmentsUninitialized ||
    isLoadingEnrollments ||
    (isFetchingEnrollments && !hasEligibleEnrollment);

  if (!isEnrollmentLoading && !isEnrollmentError && !hasEligibleEnrollment) {
    return <Navigate to="/upcoming-course" replace />;
  }

  return (
    children ?? (
      <Outlet
        context={{
          profile: user,
          enrollments,
          isLoading: isEnrollmentLoading,
          isError: isEnrollmentError,
          refetchEnrollments,
        }}
      />
    )
  );
};

export default StudentGuard;
