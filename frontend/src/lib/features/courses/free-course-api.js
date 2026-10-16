import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../api/baseApi";

const HOMEPAGE_CACHE_KEY = "homepage-free-courses-v1";
const HOMEPAGE_CACHE_TTL = 10 * 60 * 1000;
let homepageCacheVersion = 0;

const isHomepageRequest = ({ page = 1, limit = 16, search = "" } = {}) =>
  Number(page) === 1 && Number(limit) === 8 && search.trim() === "";

const readHomepageCache = () => {
  try {
    const value = localStorage.getItem(HOMEPAGE_CACHE_KEY);
    if (!value) return null;

    const cached = JSON.parse(value);
    const age = Date.now() - cached.cachedAt;

    if (
      cached.version !== 1 ||
      !Number.isFinite(cached.cachedAt) ||
      age < 0 ||
      age > HOMEPAGE_CACHE_TTL ||
      !Array.isArray(cached.data?.data)
    ) {
      localStorage.removeItem(HOMEPAGE_CACHE_KEY);
      return null;
    }

    return cached.data;
  } catch {
    try {
      localStorage.removeItem(HOMEPAGE_CACHE_KEY);
    } catch {}
    return null;
  }
};

export const getCachedHomepageFreeCourses = readHomepageCache;

const writeHomepageCache = (data) => {
  try {
    localStorage.setItem(
      HOMEPAGE_CACHE_KEY,
      JSON.stringify({ version: 1, cachedAt: Date.now(), data }),
    );
  } catch {}
};

const clearHomepageCache = () => {
  homepageCacheVersion += 1;
  try {
    localStorage.removeItem(HOMEPAGE_CACHE_KEY);
  } catch {}
};

export const freeCourseApi = createApi({
  reducerPath: "freeCourseApi",

  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth", "Course"],
  endpoints: (builder) => ({
    getFreeCourses: builder.query({
      queryFn: async (args = {}, api, extraOptions, baseQuery) => {
        const { page = 1, limit = 16, search = "" } = args;
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });
        if (search.trim()) params.set("search", search.trim());

        const request = {
          url: `/free-courses/all?${params.toString()}`,
          method: "GET",
        };

        const shouldPersist = isHomepageRequest(args);
        if (shouldPersist) {
          const cachedData = readHomepageCache();
          if (cachedData) return { data: cachedData };
        }

        const cacheVersion = homepageCacheVersion;
        const result = await baseQuery(request, api, extraOptions);
        if (
          shouldPersist &&
          result.data &&
          cacheVersion === homepageCacheVersion
        ) {
          writeHomepageCache(result.data);
        }

        return result;
      },
      providesTags: ["Course"],
      keepUnusedDataFor: 600,
    }),

    deleteFreeCourse: builder.mutation({
      query: (id) => ({
        url: `/free-courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: () => {
        clearHomepageCache();
        return ["Course"];
      },
    }),

    updateFreeCourse: builder.mutation({
      query: ({ id, data }) => ({
        url: `/free-courses/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: () => {
        clearHomepageCache();
        return ["Course"];
      },
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
      invalidatesTags: () => {
        clearHomepageCache();
        return ["Course"];
      },
    }),
  }),
});

export const {
  useGetFreeCoursesQuery,

  useCreateFreeVideoMutation,
  useDeleteFreeCourseMutation,
  useGetCourseBySlugQuery,
  useUpdateFreeCourseMutation,
} = freeCourseApi;
