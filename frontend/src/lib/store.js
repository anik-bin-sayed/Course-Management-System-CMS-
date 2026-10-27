import {
  configureStore,
  createListenerMiddleware,
  isAnyOf,
} from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "./features/auth/authApi";
import { profileApi } from "./features/profile/profileApi";
import { freeCourseApi } from "./features/courses/free-course-api";
import authReducer, { logout } from "./features/auth/authSlice";
import { categoryApi } from "./features/category/category-api";
import {
  getPersistedPaidCourseEntries,
  paidCourseApi,
} from "./features/courses/paid-course-api";
import { lessonApi } from "./features/lesson/lessonApi";
import { lessonVideoApi } from "./features/lesson/lessonVideoApi";
import { upcomingCourse } from "./features/upcomingCourse/upcomingCourseApi";
import { enrollmentApi } from "./features/enrollment/enrollmentApi";

const profileCacheSync = createListenerMiddleware();

profileCacheSync.startListening({
  matcher: isAnyOf(
    logout,
    authApi.endpoints.login.matchFulfilled,
    authApi.endpoints.verifyEmail.matchFulfilled,
    authApi.endpoints.logoutUser.matchFulfilled,
  ),
  effect: (_, { dispatch }) => {
    dispatch(profileApi.util.resetApiState());
  },
});

profileCacheSync.startListening({
  matcher: isAnyOf(
    profileApi.endpoints.uploadAvatar.matchFulfilled,
    profileApi.endpoints.updateProfileInfo.matchFulfilled,
    profileApi.endpoints.userRoleChange.matchFulfilled,
  ),
  effect: (_, { dispatch }) => {
    dispatch(authApi.util.invalidateTags(["User"]));
  },
});

export const makeStore = () => {
  const store = configureStore({
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
        .prepend(profileCacheSync.middleware)
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

  setupListeners(store.dispatch);

  const persistedPaidCourseEntries = getPersistedPaidCourseEntries();
  if (persistedPaidCourseEntries.length > 0) {
    store.dispatch(
      paidCourseApi.util.upsertQueryEntries(persistedPaidCourseEntries),
    );
  }

  return store;
};
