import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./features/auth/authApi";
import { profileApi } from "./features/profile/profileApi";
import { freeCourseApi } from "./features/courses/free-course-api";
import authReducer from "./features/auth/authSlice";
import { categoryApi } from "./features/category/category-api";
import { paidCourseApi } from "./features/courses/paid-course-api";
import { lessonApi } from "./features/lesson/lessonApi";
import { lessonVideoApi } from "./features/lesson/lessonVideoApi";
import { upcomingCourse } from "./features/upcomingCourse/upcomingCourseApi";
import { enrollmentApi } from "./features/enrollment/enrollmentApi";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      [authApi.reducerPath]: authApi.reducer,
      [profileApi.reducerPath]: profileApi.reducer,
      [freeCourseApi.reducerPath]: freeCourseApi.reducer,
      [categoryApi.reducerPath]: categoryApi.reducer,
      [paidCourseApi.reducerPath]: paidCourseApi.reducer,
      [lessonApi.reducerPath]: lessonApi.reducer,
      [lessonVideoApi.reducerPath]: lessonVideoApi.reducer,
      [upcomingCourse.reducerPath]: upcomingCourse.reducer,
      [enrollmentApi.reducerPath]: enrollmentApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(authApi.middleware)
        .concat(profileApi.middleware)
        .concat(freeCourseApi.middleware)
        .concat(categoryApi.middleware)
        .concat(paidCourseApi.middleware)
        .concat(lessonApi.middleware)
        .concat(lessonVideoApi.middleware)
        .concat(upcomingCourse.middleware)
        .concat(enrollmentApi.middleware),
  });
};
