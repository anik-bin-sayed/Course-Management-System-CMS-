import { Link as RouterLink } from "react-router-dom";

const AppLink = ({ href, to, ...props }) => {
  const destination = to ?? href ?? "";

  if (/^(https?:|mailto:|tel:|#)/.test(destination)) {
    return <a href={destination} {...props} />;
  }

  return <RouterLink to={destination} {...props} />;
};

export default AppLink;
