import React, { useState } from "react";
import { LuChevronDown, LuX } from "react-icons/lu";

const InstructorMultiSelect = ({
  instructors = [],
  selectedIds = [],
  onChange,
  isLoading = false,
  isError = false,
}) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const filteredInstructors = instructors.filter((instructor) => {
    const query = search.trim().toLowerCase();
    return (
      instructor.name?.toLowerCase().includes(query) ||
      instructor.email?.toLowerCase().includes(query)
    );
  });
  const selectedInstructors = instructors.filter((instructor) =>
    selectedIds.includes(instructor.id),
  );

  const toggleInstructor = (instructorId) => {
    onChange(
      selectedIds.includes(instructorId)
        ? selectedIds.filter((id) => id !== instructorId)
        : [...selectedIds, instructorId],
    );
  };

  return (
    <fieldset className="space-y-3">
      <legend className="mb-2 text-sm font-medium text-gray-700">
        Assigned instructors
      </legend>

      {selectedInstructors.length > 0 ? (
        <div className="flex flex-wrap gap-2" aria-label="Selected instructors">
          {selectedInstructors.map((instructor) => (
            <span
              key={instructor.id}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 py-1 pl-3 pr-1 text-sm text-gray-700"
            >
              {instructor.name}
              <button
                type="button"
                onClick={() => toggleInstructor(instructor.id)}
                aria-label={`Remove ${instructor.name}`}
                className="flex h-6 w-6 items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-900"
              >
                <LuX aria-hidden="true" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No instructors assigned.</p>
      )}

      <div className="relative">
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls="instructor-options"
          onClick={() => setIsOpen((open) => !open)}
          className="flex min-h-10 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 text-left text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
        >
          <span>
            {isOpen ? "Close instructor list" : "Select instructors"}
            {selectedIds.length > 0 && ` (${selectedIds.length} selected)`}
          </span>
          <LuChevronDown
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>

        {isOpen && (
          <div
            id="instructor-options"
            className="absolute z-20 mt-1 w-full rounded-lg border border-gray-200 bg-white p-2 shadow-lg"
          >
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search instructors by name or email"
              aria-label="Search instructors by name or email"
              className="mb-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
            />

            <div className="max-h-56 overflow-y-auto">
              {isLoading ? (
                <p className="px-3 py-4 text-sm text-gray-500" role="status">
                  Loading instructors...
                </p>
              ) : isError ? (
                <p className="px-3 py-4 text-sm text-red-600" role="alert">
                  Unable to load instructors. Refresh and try again.
                </p>
              ) : filteredInstructors.length === 0 ? (
                <p className="px-3 py-4 text-sm text-gray-500">
                  {instructors.length
                    ? "No matching instructors."
                    : "No instructors available."}
                </p>
              ) : (
                filteredInstructors.map((instructor) => (
                  <label
                    key={instructor.id}
                    className="flex cursor-pointer items-center gap-3 border-b border-gray-100 px-3 py-2.5 last:border-b-0 hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(instructor.id)}
                      onChange={() => toggleInstructor(instructor.id)}
                      className="h-4 w-4 accent-gray-900"
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-gray-800">
                        {instructor.name}
                      </span>
                      <span className="block truncate text-xs text-gray-500">
                        {instructor.email}
                      </span>
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </fieldset>
  );
};

export default InstructorMultiSelect;
