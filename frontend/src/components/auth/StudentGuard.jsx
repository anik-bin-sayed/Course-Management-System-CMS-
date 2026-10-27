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
    return <Loader variant="inline" />;
  }

  if (isError && !isDefinitiveAuthError(error)) {
    return <AuthCheckFallback inline onRetry={refetch} />;
  }

  if (isError || !user) {
    return (
      <Navigate
        to="/"
        replace
        state={{ from: location, openLogin: true }}
      />
    );
  }

  if (user.role !== "student") {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  const hasEligibleEnrollment = enrollments?.some(isEnrollmentEligible);

  if (
    areEnrollmentsUninitialized ||
    isLoadingEnrollments ||
    (isFetchingEnrollments && !hasEligibleEnrollment)
  ) {
    return <Loader variant="inline" />;
  }

  if (isEnrollmentError && isDefinitiveAuthError(enrollmentError)) {
    return (
      <Navigate
        to="/"
        replace
        state={{ from: location, openLogin: true }}
      />
    );
  }

  if (isEnrollmentError) {
    return <AuthCheckFallback inline onRetry={refetchEnrollments} />;
  }

  if (!hasEligibleEnrollment) {
    return <Navigate to="/upcoming-course" replace />;
  }

  return children ?? <Outlet />;
};

export default StudentGuard;
