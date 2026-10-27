import { Link as RouterLink, useLocation } from "react-router-dom";

const AppLink = ({ href, to, ...props }) => {
  const location = useLocation();
  let destination = to ?? href ?? "";

  if (/^(https?:|mailto:|tel:|#)/.test(destination)) {
    return <a href={destination} {...props} />;
  }

  const isBanglaPath =
    location.pathname === "/bn" || location.pathname.startsWith("/bn/");
  const alreadyLocalized = /^\/bn(?:\/|[?#]|$)/.test(destination);

  if (
    isBanglaPath &&
    destination.startsWith("/") &&
    !destination.startsWith("//") &&
    !alreadyLocalized
  ) {
    destination = destination === "/" ? "/bn" : `/bn${destination}`;
  }

  return <RouterLink to={destination} {...props} />;
};

export default AppLink;
