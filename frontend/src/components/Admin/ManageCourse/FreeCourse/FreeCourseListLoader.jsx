import React from "react";

const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />
);

const FreeCourseListLoader = () => {
  return (
    <div className="min-h-screen bg-white px-4 py-12">
      {/* Header */}
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <Skeleton className="mx-auto h-9 w-72 max-w-full" />

        <Skeleton className="mx-auto mt-4 h-4 w-[420px] max-w-full" />
      </div>

      {/* Table Container */}
      <div className="mx-auto max-w-7xl overflow-x-auto rounded-xl border border-yellow-100 bg-white shadow-sm">
        <table className="w-full min-w-[950px]">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {["Course", "Duration", "Language", "Actions"].map((heading) => (
                <th
                  key={heading}
                  className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          {/* Skeleton Rows */}
          <tbody className="divide-y divide-gray-100">
            {Array.from({ length: 6 }).map((_, index) => (
              <tr key={index}>
                {/* Course Thumbnail + Details */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-16 w-24 shrink-0 rounded-lg" />

                    <div className="w-full max-w-md">
                      <Skeleton className="h-5 w-52 max-w-full" />
                      <Skeleton className="mt-2 h-4 w-72 max-w-full" />
                    </div>
                  </div>
                </td>

                {/* Duration */}
                <td className="px-4 py-4">
                  <Skeleton className="h-5 w-20" />
                </td>

                {/* Language */}
                <td className="px-4 py-4">
                  <Skeleton className="h-7 w-20 rounded-full" />
                </td>

                {/* Action Buttons */}
                <td className="px-5 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <Skeleton className="h-9 w-[68px] rounded-lg" />
                    <Skeleton className="h-9 w-[58px] rounded-lg" />
                    <Skeleton className="h-9 w-[72px] rounded-lg" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View All Button Placeholder */}
      <div className="mt-8 flex justify-center">
        <Skeleton className="h-9 w-44 rounded-md" />
      </div>
    </div>
  );
};

export default FreeCourseListLoader;
