const CourseCardLoader = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading Skeleton */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <div className="mx-auto mb-3 h-8 w-64 animate-pulse rounded bg-gray-200" />
          <div className="mx-auto h-4 w-96 max-w-full animate-pulse rounded bg-gray-200" />
        </div>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
            >
              <div className="h-48 animate-pulse bg-gray-200" />

              <div className="space-y-3 p-5">
                <div className="h-5 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseCardLoader;
