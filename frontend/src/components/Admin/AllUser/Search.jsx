import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "@/lib/navigation";

const Search = ({ searchTerm, handleSearchChange, pagination, users }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";

  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];

    return users
      .filter((user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .slice(0, 5);
  }, [searchTerm, users]);

  const handleSearch = (e) => {
    const value = e.target.value;

    // Existing search handler
    handleSearchChange(e);

    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    params.set("page", "1");

    router.replace(`?${params.toString()}`);

    setShowSuggestions(true);
  };

  const handleSuggestionClick = (name) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("search", name);
    params.set("page", "1");

    router.replace(`?${params.toString()}`);

    handleSearchChange({
      target: {
        value: name,
      },
    });

    setShowSuggestions(false);
  };

  return (
    <div className="mb-4 flex flex-col items-center gap-4">
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search ? search : searchTerm}
          onChange={handleSearch}
          onFocus={() => setShowSuggestions(true)}
          className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:ring focus:ring-yellow-400"
        />

        {/* Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
            {suggestions.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => handleSuggestionClick(user.name)}
                className="block w-full border-b border-gray-100 px-4 py-2 text-left text-sm transition hover:bg-gray-100 last:border-b-0"
              >
                <p className="font-medium text-gray-800">{user.name}</p>

                <p className="text-xs text-gray-500">{user.email}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      <span className="text-sm text-gray-500">
        Total: {pagination.total || users.length} users
      </span>
    </div>
  );
};

export default Search;
