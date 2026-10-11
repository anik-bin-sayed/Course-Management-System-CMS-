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
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <div className="group relative">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="What do you want to learn?"
          aria-label="Search courses"
          className="
          w-full
          rounded-xl
          border border-gray-200
          bg-white
          py-3
          pl-12
          pr-14
          text-[15px]
          text-gray-700
          shadow-sm
          outline-none
          transition-all
          duration-300
          placeholder:text-gray-400
          hover:border-yellow-300
          hover:shadow-md
          focus:border-yellow-400
          focus:shadow-[0_0_0_4px_rgba(250,204,21,0.12)]
        "
        />

        <HiMagnifyingGlass
          className="
          absolute
          left-4
          top-1/2
          h-5
          w-5
          -translate-y-1/2
          text-gray-400
          transition-colors
          duration-300
          group-focus-within:text-yellow-500
        "
        />

        <button
          type="submit"
          aria-label="Search courses"
          className="
          absolute
          right-1.5
          top-1/2
          flex
          h-9
          w-9
          -translate-y-1/2
          items-center
          justify-center
          rounded-lg
          bg-yellow-400
          text-black
          shadow-sm
          transition-all
          duration-300
          hover:bg-yellow-500
          hover:shadow-md
          active:scale-95
        "
        >
          <HiMagnifyingGlass className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
};

export default Search;
