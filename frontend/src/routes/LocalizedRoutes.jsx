import { Navigate, Outlet, useLocation } from "react-router-dom";

import LanguageProvider from "../i18n/LanguageProvider";

function LanguageLayout() {
  return (
    <LanguageProvider>
      <Outlet />
    </LanguageProvider>
  );
}

export function BanglaRedirect() {
  const location = useLocation();

  const destination =
    location.pathname === "/" ? "/bn" : `/bn${location.pathname}`;

  return (
    <Navigate to={`${destination}${location.search}${location.hash}`} replace />
  );
}

export { LanguageLayout };
