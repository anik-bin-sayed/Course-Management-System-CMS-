import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../api/baseApi";

export const paidCourseApi = createApi({
  reducerPath: "paidCourseApi",

  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth", "Course", "Instructor"],
  endpoints: (builder) => ({
    getAssignableInstructors: builder.query({
      query: ({ search = "" } = {}) => ({
        url: "/users/instructors",
        method: "GET",
        params: search ? { search } : undefined,
      }),
      providesTags: ["Instructor"],
    }),

    getCourseInstructors: builder.query({
      query: (courseId) => ({
        url: `/courses/${courseId}/instructors`,
        method: "GET",
      }),
      providesTags: ["Course"],
    }),

    replaceCourseInstructors: builder.mutation({
      query: ({ courseId, instructorIds }) => ({
        url: `/courses/${courseId}/instructors`,
        method: "PUT",
        body: { instructor_ids: instructorIds },
      }),
      invalidatesTags: ["Course"],
    }),

    addCourseInstructor: builder.mutation({
      query: ({ courseId, instructorId }) => ({
        url: `/courses/${courseId}/instructors/${instructorId}`,
        method: "POST",
      }),
      invalidatesTags: ["Course"],
    }),

    removeCourseInstructor: builder.mutation({
      query: ({ courseId, instructorId }) => ({
        url: `/courses/${courseId}/instructors/${instructorId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Course"],
    }),

    getCoursesForInstructor: builder.query({
      query: (instructorId) => ({
        url: `/courses/instructors/${instructorId}/courses`,
        method: "GET",
      }),
      providesTags: ["Course"],
    }),

    createCourse: builder.mutation({
      query: (data) => ({
        url: "/courses",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Course"],
    }),

    getAllCourse: builder.query({
      query: ({ page = 1, limit = 10, search = "", status } = {}) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });
        if (search.trim()) params.set("search", search.trim());
        if (status) params.set("status", status);

        return {
          url: `/courses?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Course"],
    }),

    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/courses/${id}/delete`,
        method: "DELETE",
      }),
      invalidatesTags: ["Course"],
    }),

    getCourseBySlug: builder.query({
      query: (slug) => ({
        url: `/courses/${encodeURIComponent(slug)}/`,
        method: "GET",
      }),
      providesTags: ["Course"],
    }),

    getCourseById: builder.query({
      query: (id) => ({
        url: `/courses/${id}`,
        method: "GET",
      }),
      providesTags: ["Course"],
    }),

    updateCourse: builder.mutation({
      query: ({ id, data }) => ({
        url: `/courses/${id}/update`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Course"],
    }),

    getUpcomingCourse: builder.query({
      query: () => ({
        url: `/courses/upcoming`,
        method: "GET",
      }),
      providesTags: ["Course"],
    }),
  }),
});

export const {
  useGetAssignableInstructorsQuery,
  useGetCourseInstructorsQuery,
  useReplaceCourseInstructorsMutation,
  useAddCourseInstructorMutation,
  useRemoveCourseInstructorMutation,
  useGetCoursesForInstructorQuery,
  useCreateCourseMutation,
  useGetAllCourseQuery,
  useDeleteCourseMutation,
  useGetCourseBySlugQuery,

  useUpdateCourseMutation,

  useGetCourseByIdQuery,

  useGetUpcomingCourseQuery,
} = paidCourseApi;
