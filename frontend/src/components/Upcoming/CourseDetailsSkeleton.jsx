"use client";

const CourseDetailsSkeleton = () => {
  return (
    <main className="min-h-screen animate-pulse bg-[#f6f8f7]">
      {/* Hero Section */}
      <section className="bg-[#10251d] pb-12 pt-24 sm:pb-16 sm:pt-28">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-7 lg:px-10">
          <div className="mb-6 h-4 w-48 rounded bg-white/10" />
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            {/* Left Content */}
            <div>
              {/* Badges */}
              <div className="mb-5 flex flex-wrap gap-3">
                <div className="h-8 w-36 rounded-md bg-white/10" />
                <div className="h-8 w-28 rounded-md bg-white/10" />
              </div>

              {/* Title */}
              <div className="space-y-3">
                <div className="h-10 w-full rounded-md bg-white/10 sm:h-12" />
                <div className="h-10 w-4/5 rounded-md bg-white/10 sm:h-12" />
              </div>

              {/* Description */}
              <div className="mt-5 space-y-3">
                <div className="h-4 w-full rounded-md bg-white/10" />
                <div className="h-4 w-11/12 rounded-md bg-white/10" />
                <div className="h-4 w-3/4 rounded-md bg-white/10" />
              </div>

              {/* Course Meta */}
              <div className="mt-7 flex flex-wrap gap-5">
                <div className="h-5 w-24 rounded bg-gray-700" />
                <div className="h-5 w-20 rounded bg-gray-700" />
                <div className="h-5 w-24 rounded bg-gray-700" />
              </div>
            </div>

            {/* Thumbnail */}
            <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-xl">
              <div className="aspect-video w-full bg-white/10" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-[1400px] px-4 py-8 sm:px-7 sm:py-10 lg:px-10 lg:py-12">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] xl:gap-8">
          {/* Left Content */}
          <div className="order-last min-w-0 space-y-5 lg:order-first">
            {/* About Course */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="h-7 w-52 rounded bg-gray-200" />

              <div className="mt-5 space-y-3">
                <div className="h-4 w-full rounded bg-gray-200" />
                <div className="h-4 w-full rounded bg-gray-200" />
                <div className="h-4 w-11/12 rounded bg-gray-200" />
                <div className="h-4 w-4/5 rounded bg-gray-200" />
              </div>

              <div className="mt-4 space-y-3">
                <div className="h-4 w-full rounded bg-gray-200" />
                <div className="h-4 w-10/12 rounded bg-gray-200" />
              </div>
            </div>

            {/* What You'll Learn */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="h-7 w-48 rounded bg-gray-200" />

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-lg bg-gray-50 p-4"
                  >
                    <div className="mt-1 h-5 w-5 shrink-0 rounded-full bg-gray-200" />

                    <div className="h-5 w-4/5 rounded bg-gray-200" />
                  </div>
                ))}
              </div>
            </div>

            {/* Course Information */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="h-7 w-52 rounded bg-gray-200" />

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 rounded-xl border border-gray-100 p-4"
                  >
                    <div className="h-11 w-11 shrink-0 rounded-lg bg-gray-200" />

                    <div className="w-full space-y-2">
                      <div className="h-3 w-16 rounded bg-gray-200" />
                      <div className="h-5 w-24 rounded bg-gray-200" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Schedule */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="h-7 w-48 rounded bg-gray-200" />

              <div className="mt-6 space-y-4">
                {[1, 2].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 rounded-xl bg-gray-50 p-5"
                  >
                    <div className="h-12 w-12 shrink-0 rounded-full bg-gray-200" />

                    <div className="space-y-2">
                      <div className="h-3 w-24 rounded bg-gray-200" />
                      <div className="h-5 w-40 rounded bg-gray-200" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="order-first min-w-0 lg:order-last">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:sticky lg:top-24">
              {/* Price */}
              <div className="border-b border-gray-100 p-6">
                <div className="h-4 w-24 rounded bg-gray-200" />

                <div className="mt-3 flex items-end gap-3">
                  <div className="h-9 w-28 rounded bg-gray-200" />
                  <div className="h-4 w-20 rounded bg-gray-200" />
                </div>

                <div className="mt-3 h-6 w-24 rounded-full bg-gray-200" />
              </div>

              {/* Enrollment */}
              <div className="p-6">
                <div className="h-12 w-full rounded-xl bg-gray-200" />

                <div className="mx-auto mt-4 h-3 w-56 rounded bg-gray-200" />

                {/* Includes */}
                <div className="mt-7">
                  <div className="h-5 w-40 rounded bg-gray-200" />

                  <div className="mt-4 space-y-4">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <div className="h-4 w-4 rounded bg-gray-200" />
                        <div className="h-4 w-36 rounded bg-gray-200" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default CourseDetailsSkeleton;
