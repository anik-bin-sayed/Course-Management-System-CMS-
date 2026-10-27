import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../api/baseApi";

export const isEnrollmentEligible = (enrollment) =>
  ["active", "completed"].includes(enrollment?.status);

export const enrollmentApi = createApi({
  reducerPath: "enrollmentApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Enrollment"],
  endpoints: (builder) => ({
    getMyEnrollments: builder.query({
      query: () => ({ url: "/enrollments/me", method: "GET" }),
      providesTags: ["Enrollment"],
    }),
    createEnrollment: builder.mutation({
      query: (course_id) => ({
        url: "/enrollments",
        method: "POST",
        body: { course_id },
      }),
      invalidatesTags: ["Enrollment"],
    }),
    createPayment: builder.mutation({
      query: (enrollment_id) => ({
        url: "/payments",
        method: "POST",
        body: { enrollment_id },
      }),
      invalidatesTags: ["Enrollment"],
    }),
    initiatePayment: builder.mutation({
      query: (payment_id) => ({
        url: `/payments/${payment_id}/initiate`,
        method: "POST",
      }),
      invalidatesTags: ["Enrollment"],
    }),
  }),
});

export const {
  useGetMyEnrollmentsQuery,
  useCreateEnrollmentMutation,
  useCreatePaymentMutation,
  useInitiatePaymentMutation,
} = enrollmentApi;
