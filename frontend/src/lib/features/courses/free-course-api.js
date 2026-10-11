import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../api/baseApi";

export const freeCourseApi = createApi({
  reducerPath: "freeCourseApi",

  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth", "Course"],
  endpoints: (builder) => ({
    getSomeFreeCourse: builder.query({
      query: () => ({
        url: `/free-courses`,
        method: "GET",
      }),
      providesTags: ["Course"],
    }),

    getAllFreeCourses: builder.query({
      query: ({ page = 1, limit = 16, search = "" } = {}) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });
        if (search.trim()) params.set("search", search.trim());

        return {
          url: `/free-courses/all?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Course"],
    }),

    deleteFreeCourse: builder.mutation({
      query: (id) => ({
        url: `/free-courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Course"],
    }),

    updateFreeCourse: builder.mutation({
      query: ({ id, data }) => ({
        url: `/free-courses/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Course"],
    }),

    getCourseBySlug: builder.query({
      query: (slug) => ({
        url: `/free-courses/${slug}`,
        method: "GET",
      }),
      providesTags: ["Course"],
    }),

    // create free videos
    createFreeVideo: builder.mutation({
      query: (data) => ({
        url: `/free-courses`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Course"],
    }),
  }),
});

export const {
  useGetSomeFreeCourseQuery,
  useGetAllFreeCoursesQuery,
  useCreateFreeVideoMutation,
  useDeleteFreeCourseMutation,
  useGetCourseBySlugQuery,
  useUpdateFreeCourseMutation,
} = freeCourseApi;
