import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../api/baseApi";

export const lessonVideoApi = createApi({
  reducerPath: "lessonVideoApi",

  baseQuery: baseQueryWithReauth,
  tagTypes: ["Lesson", "LessonVideo", "Course"],
  endpoints: (builder) => ({
    createLessonVideo: builder.mutation({
      query: (data) => ({
        url: `/lesson-videos`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Lesson", "LessonVideo", "Course"],
    }),

    getLessonVideos: builder.query({
      query: ({ id }) => ({
        url: `/lesson-videos/lesson/${id}`,
        method: "GET",
      }),
      providesTags: ["Lesson", "LessonVideo", "Course"],
    }),

    getLessonVideoById: builder.query({
      query: ({ id }) => ({
        url: `/lesson-videos/${id}`,
        method: "GET",
      }),
      providesTags: ["LessonVideo"],
    }),

    updateLessonVideo: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/lesson-videos/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Lesson", "LessonVideo", "Course"],
    }),

    deleteLessonVideo: builder.mutation({
      query: ({ id }) => ({
        url: `/lesson-videos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Lesson", "LessonVideo", "Course"],
    }),

    getVideoCountAndDuration: builder.query({
      query: ({ id }) => ({
        url: `/lesson-videos/lesson/${id}/stats`,
        method: "GET",
      }),
      providesTags: ["Lesson"],
    }),

    deleteLesson: builder.mutation({
      query: ({ id }) => ({
        url: `/lessons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Lesson", "Course"],
    }),

    getLessonById: builder.query({
      query: ({ id }) => ({
        url: `/lessons/${id}`,
        method: "GET",
      }),
      invalidatesTags: ["Lesson", "Course"],
    }),

    updateLesson: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/lessons/${id}`,
        method: "PUT",
        body: patch,
      }),
      providesTags: ["Lesson", "Course"],
    }),
  }),
});

export const {
  useCreateLessonVideoMutation,
  useGetLessonVideosQuery,
  useGetLessonVideoByIdQuery,
  useUpdateLessonVideoMutation,
  useDeleteLessonVideoMutation,
  useGetVideoCountAndDurationQuery,
  useDeleteLessonMutation,
  useUpdateLessonMutation,
  useGetLessonByIdQuery,
} = lessonVideoApi;
