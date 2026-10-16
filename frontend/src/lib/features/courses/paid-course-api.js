import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../api/baseApi";

const PAID_COURSES_CACHE_PREFIX = "paid-courses-v1:";
const UPCOMING_COURSES_CACHE_KEY = "upcoming-courses-v1";
const PAID_COURSES_CACHE_TTL = 10 * 60 * 1000;

let paidCoursesCacheVersion = 0;

// Sort object keys to create stable cache keys.
const sortQueryArgs = (value) => {
  if (Array.isArray(value)) {
    return value.map(sortQueryArgs);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, sortQueryArgs(value[key])]),
    );
  }

  return value;
};

const serializePaidCourseArgs = (args = {}) =>
  JSON.stringify(sortQueryArgs(args));

const getPaidCoursesCacheKey = (args) =>
  `${PAID_COURSES_CACHE_PREFIX}${encodeURIComponent(
    serializePaidCourseArgs(args),
  )}`;

const isPublicPaidCourseQuery = (args = {}) =>
  String(args.status ?? "").toLowerCase() === "published";

const isPaidCourseListResponse = (data) =>
  data !== null &&
  typeof data === "object" &&
  Array.isArray(data.data) &&
  Number.isFinite(data.total) &&
  Number.isFinite(data.page) &&
  Number.isFinite(data.limit) &&
  Number.isFinite(data.total_pages);

// Build the existing paginated course-list request.
const buildPaidCourseRequest = (args = {}) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    status,
    category_id,
    level,
    language,
  } = args;

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search.trim()) params.set("search", search.trim());
  if (status) params.set("status", status);

  if (category_id !== undefined && category_id !== null) {
    params.set("category_id", String(category_id));
  }

  if (level) params.set("level", level);
  if (language) params.set("language", language);

  return {
    url: `/courses?${params.toString()}`,
    method: "GET",
  };
};

// Paid Courses persistent cache

const readPaidCoursesCache = (args) => {
  try {
    const key = getPaidCoursesCacheKey(args);
    const raw = localStorage.getItem(key);

    if (!raw) return null;

    const cached = JSON.parse(raw);
    const age = Date.now() - cached.cachedAt;

    if (
      cached.version !== 1 ||
      cached.argsKey !== serializePaidCourseArgs(args) ||
      !Number.isFinite(cached.cachedAt) ||
      age < 0 ||
      age >= PAID_COURSES_CACHE_TTL ||
      !isPaidCourseListResponse(cached.data)
    ) {
      localStorage.removeItem(key);
      return null;
    }

    return cached.data;
  } catch {
    return null;
  }
};

export const getCachedPaidCourses = (args = {}) =>
  isPublicPaidCourseQuery(args) ? readPaidCoursesCache(args) : null;

export const getPersistedPaidCourseEntries = () => {
  const entries = [];

  try {
    for (let index = localStorage.length - 1; index >= 0; index -= 1) {
      const key = localStorage.key(index);

      if (!key?.startsWith(PAID_COURSES_CACHE_PREFIX)) continue;

      try {
        const cached = JSON.parse(localStorage.getItem(key));
        const args = JSON.parse(cached.argsKey);
        const data = readPaidCoursesCache(args);

        if (
          !isPublicPaidCourseQuery(args) ||
          getPaidCoursesCacheKey(args) !== key ||
          !data
        ) {
          localStorage.removeItem(key);
          continue;
        }

        entries.push({
          endpointName: "getAllCourse",
          arg: args,
          value: data,
        });
      } catch {
        localStorage.removeItem(key);
      }
    }
  } catch {}

  return entries;
};

const writePaidCoursesCache = (args, data) => {
  try {
    localStorage.setItem(
      getPaidCoursesCacheKey(args),
      JSON.stringify({
        version: 1,
        argsKey: serializePaidCourseArgs(args),
        cachedAt: Date.now(),
        data,
      }),
    );
  } catch {}
};

const readUpcomingCoursesCache = () => {
  try {
    const raw = localStorage.getItem(UPCOMING_COURSES_CACHE_KEY);

    if (!raw) return null;

    const cached = JSON.parse(raw);
    const age = Date.now() - cached.cachedAt;

    if (
      cached.version !== 1 ||
      !Number.isFinite(cached.cachedAt) ||
      age < 0 ||
      age >= PAID_COURSES_CACHE_TTL ||
      !Object.prototype.hasOwnProperty.call(cached, "data")
    ) {
      localStorage.removeItem(UPCOMING_COURSES_CACHE_KEY);
      return null;
    }

    return cached.data;
  } catch {
    return null;
  }
};

const writeUpcomingCoursesCache = (data) => {
  try {
    localStorage.setItem(
      UPCOMING_COURSES_CACHE_KEY,
      JSON.stringify({
        version: 1,
        cachedAt: Date.now(),
        data,
      }),
    );
  } catch {}
};

// Cache invalidation

const clearPaidCoursesCache = () => {
  paidCoursesCacheVersion += 1;

  try {
    for (let index = localStorage.length - 1; index >= 0; index -= 1) {
      const key = localStorage.key(index);

      if (key?.startsWith(PAID_COURSES_CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    }

    localStorage.removeItem(UPCOMING_COURSES_CACHE_KEY);
  } catch {}
};

const invalidateCourses = () => {
  clearPaidCoursesCache();
  return ["Course"];
};

// API

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
      invalidatesTags: invalidateCourses,
    }),

    addCourseInstructor: builder.mutation({
      query: ({ courseId, instructorId }) => ({
        url: `/courses/${courseId}/instructors/${instructorId}`,
        method: "POST",
      }),
      invalidatesTags: invalidateCourses,
    }),

    removeCourseInstructor: builder.mutation({
      query: ({ courseId, instructorId }) => ({
        url: `/courses/${courseId}/instructors/${instructorId}`,
        method: "DELETE",
      }),
      invalidatesTags: invalidateCourses,
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
      invalidatesTags: invalidateCourses,
    }),

    getAllCourse: builder.query({
      async queryFn(args = {}, api, extraOptions, baseQuery) {
        if (isPublicPaidCourseQuery(args)) {
          const cachedData = readPaidCoursesCache(args);

          if (cachedData) {
            return { data: cachedData };
          }
        }

        const cacheVersion = paidCoursesCacheVersion;

        const result = await baseQuery(
          buildPaidCourseRequest(args),
          api,
          extraOptions,
        );

        if (
          isPublicPaidCourseQuery(args) &&
          result.data &&
          isPaidCourseListResponse(result.data) &&
          cacheVersion === paidCoursesCacheVersion
        ) {
          writePaidCoursesCache(args, result.data);
        }

        return result;
      },

      providesTags: ["Course"],
      keepUnusedDataFor: PAID_COURSES_CACHE_TTL / 1000,
    }),

    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/courses/${id}/delete`,
        method: "DELETE",
      }),
      invalidatesTags: invalidateCourses,
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
      invalidatesTags: invalidateCourses,
    }),

    getUpcomingCourse: builder.query({
      async queryFn(_arg, api, extraOptions, baseQuery) {
        const CACHE_KEY = "upcoming-courses-v1";
        const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

        // 1. Read persistent cache first
        try {
          const raw = localStorage.getItem(CACHE_KEY);

          if (raw) {
            const cached = JSON.parse(raw);
            const age = Date.now() - cached.cachedAt;

            if (
              cached.version === 1 &&
              Number.isFinite(cached.cachedAt) &&
              age >= 0 &&
              age < CACHE_TTL &&
              Object.prototype.hasOwnProperty.call(cached, "data")
            ) {
              return { data: cached.data };
            }

            localStorage.removeItem(CACHE_KEY);
          }
        } catch {
          // Ignore invalid or unavailable localStorage.
        }

        // 2. Cache miss: fetch from API
        const cacheVersion = paidCoursesCacheVersion;

        const result = await baseQuery(
          {
            url: "/courses/upcoming",
            method: "GET",
          },
          api,
          extraOptions,
        );

        // 3. Save successful response
        if (
          !result.error &&
          result.data !== undefined &&
          cacheVersion === paidCoursesCacheVersion
        ) {
          try {
            localStorage.setItem(
              CACHE_KEY,
              JSON.stringify({
                version: 1,
                cachedAt: Date.now(),
                data: result.data,
              }),
            );
          } catch {
            // Continue even if localStorage is unavailable.
          }
        }

        return result;
      },

      providesTags: ["Course"],
      keepUnusedDataFor: 600,
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
