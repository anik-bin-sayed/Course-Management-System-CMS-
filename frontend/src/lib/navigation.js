import {
  useLocation,
  useNavigate,
  useParams as useRouteParams,
} from "react-router-dom";

export function useRouter() {
  const navigate = useNavigate();
  const location = useLocation();
  const isBanglaPath =
    location.pathname === "/bn" || location.pathname.startsWith("/bn/");

  const localize = (to) => {
    if (
      !isBanglaPath ||
      typeof to !== "string" ||
      !to.startsWith("/") ||
      to.startsWith("//") ||
      /^\/bn(?:\/|[?#]|$)/.test(to)
    ) {
      return to;
    }

    return to === "/" ? "/bn" : `/bn${to}`;
  };

  return {
    push: (to, options = {}) =>
      navigate(localize(to), {
        preventScrollReset: options.scroll === false,
      }),
    replace: (to, options = {}) =>
      navigate(localize(to), {
        replace: true,
        preventScrollReset: options.scroll === false,
      }),
    back: () => navigate(-1),
    refresh: () => window.location.reload(),
  };
}

export function usePathname() {
  return useLocation().pathname;
}

export function useSearchParams() {
  return new URLSearchParams(useLocation().search);
}

export function useParams() {
  return useRouteParams();
}
