export const isDefinitiveAuthError = (error) =>
  [401, 403, 404].includes(error?.status);