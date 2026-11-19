import { useEffect, useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { useRouter, useSearchParams } from "@/lib/navigation";
import { useTranslation } from "react-i18next";

const Search = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const currentQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(currentQuery);

  useEffect(() => {
    setQuery(currentQuery);
  }, [currentQuery]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/search?q=${encodeURIComponent(value)}` : "/search");
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="group relative flex items-center">
        <HiMagnifyingGlass
          className="pointer-events-none absolute left-3.5 h-4 w-4 text-gray-400 transition-colors duration-200 group-focus-within:text-[#1b704b]"
        />
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("common.searchCourses")}
          aria-label={t("common.searchCourses")}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-gray-800 outline-none transition duration-200 placeholder:text-gray-400 hover:border-gray-300 hover:bg-white focus:border-[#1b704b]/50 focus:bg-white focus:ring-4 focus:ring-[#1b704b]/10"
        />
      </div>
    </form>
  );
};

export default Search;
