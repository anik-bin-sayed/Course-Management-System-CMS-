import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../auth/authSlice";
import { isDefinitiveAuthError } from "../auth/authErrors";

let refreshPromise;

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_BASE_URL}/api`,
  credentials: "include",
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  const requestUrl = typeof args === "string" ? args : args?.url;
  const shouldSkipRefresh =
    typeof requestUrl === "string" &&
    /^\/?auth\/(login|register|check-email|verify-email|refresh)$/.test(
      requestUrl,
    );

  if (result.error?.status !== 401 || shouldSkipRefresh) return result;

  if (!refreshPromise) {
    refreshPromise = baseQuery(
      {
        url: "/auth/refresh",
        method: "POST",
      },
      api,
      extraOptions,
    );
  }

  const currentRefreshPromise = refreshPromise;
  let refreshResult;
  try {
    refreshResult = await currentRefreshPromise;
  } finally {
    if (refreshPromise === currentRefreshPromise) {
      refreshPromise = undefined;
    }
  }

  if (!refreshResult.data) {
    if (isDefinitiveAuthError(refreshResult.error)) {
      api.dispatch(logout());
    }
    return refreshResult;
  }

  result = await baseQuery(args, api, extraOptions);
  if (result.error?.status === 401) {
    api.dispatch(logout());
  }

  return result;
};
