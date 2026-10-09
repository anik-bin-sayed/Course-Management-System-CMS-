import {
  useLocation,
  useNavigate,
  useParams as useRouteParams,
} from "react-router-dom";

export function useRouter() {
  const navigate = useNavigate();

  return {
    push: (to, options = {}) =>
      navigate(to, { preventScrollReset: options.scroll === false }),
    replace: (to, options = {}) =>
      navigate(to, {
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
