import { useEffect, useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { useRouter, useSearchParams } from "@/lib/navigation";

const Search = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
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
      <div className="relative flex items-center group">
        {/* Search Icon (Left Side) */}
        <HiMagnifyingGlass
          className="
            absolute left-4
            h-4 w-4
            text-gray-400
            pointer-events-none
            group-focus-within:text-gray-600
            transition-colors duration-200
          "
        />

        {/* Input Field */}
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search for courses..."
          aria-label="Search courses"
          className="
            w-full
            rounded-full
            bg-gray-100
            border border-transparent
            py-2.5
            pl-10
            pr-4
            text-sm
            text-gray-800
            outline-none
            transition-all duration-300
            placeholder:text-gray-500
            hover:bg-gray-200/70
            focus:bg-white
            focus:border-gray-300
            focus:ring-1
            focus:ring-yellow-400
          "
        />
      </div>
    </form>
  );
};

export default Search;
