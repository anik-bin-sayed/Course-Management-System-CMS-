const AllCourseError = ({ error }) => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-700">Failed to load courses</h2>

          <p className="mt-1 text-sm text-red-600">
            {error?.data?.detail || "Something went wrong."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AllCourseError;
