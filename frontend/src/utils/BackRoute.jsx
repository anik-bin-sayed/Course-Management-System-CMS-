import { GoArrowLeft } from "react-icons/go";
import AppLink from "@/components/common/AppLink";

const BackRoute = ({ Text, backUrl }) => {
  return (
    <AppLink
      href={backUrl}
      className="group inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 hover:shadow-md active:scale-95 mb-4"
    >
      <GoArrowLeft
        size={18}
        className="transition-transform duration-200 group-hover:-translate-x-1"
      />
      <span>{Text}</span>
    </AppLink>
  );
};

export default BackRoute;
