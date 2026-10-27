import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

function getLanguageFromPath(pathname) {
  const isBangla = pathname === "/bn" || pathname.startsWith("/bn/");

  return isBangla ? "bn" : "en";
}

export default function LanguageProvider({ children }) {
  const location = useLocation();
  const { i18n } = useTranslation();

  useEffect(() => {
    const language = getLanguageFromPath(location.pathname);

    if (i18n.resolvedLanguage !== language) {
      i18n.changeLanguage(language);
    }

    document.documentElement.lang = language;
  }, [location.pathname, i18n]);

  return children;
}
