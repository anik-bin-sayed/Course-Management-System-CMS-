const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />
);

const ProfileLoader = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar Skeleton */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-32" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="hidden h-4 w-24 sm:block" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Mobile Section Bar */}
        <div className="mb-6 flex items-center justify-between lg:hidden">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          {/* Left Profile Card */}
          <aside className="h-fit lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col items-center px-6 pb-6 pt-8">
                {/* Avatar */}
                <Skeleton className="h-32 w-32 rounded-full" />

                {/* Name */}
                <Skeleton className="mt-5 h-7 w-40" />

                {/* Country */}
                <Skeleton className="mt-3 h-5 w-28" />

                {/* Email */}
                <Skeleton className="mt-3 h-4 w-48 max-w-full" />

                {/* Role Badge */}
                <Skeleton className="mt-4 h-7 w-24 rounded-full" />

                {/* Edit Profile Button */}
                <Skeleton className="mt-5 h-11 w-full rounded-xl" />

                {/* Bio */}
                <div className="mt-7 w-full border-t border-slate-100 pt-6">
                  <Skeleton className="mx-auto h-4 w-4/5" />
                  <Skeleton className="mx-auto mt-2 h-4 w-3/5" />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 border-t border-slate-100 bg-slate-50">
                <div className="px-4 py-4 text-center">
                  <Skeleton className="mx-auto h-3 w-14" />
                  <Skeleton className="mx-auto mt-2 h-5 w-20" />
                </div>

                <div className="border-l border-slate-200 px-4 py-4 text-center">
                  <Skeleton className="mx-auto h-3 w-20" />
                  <Skeleton className="mx-auto mt-2 h-5 w-16" />
                </div>
              </div>
            </div>
          </aside>

          {/* Right Account Information */}
          <section className="min-w-0">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* Section Header */}
              <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="w-full">
                    <Skeleton className="h-7 w-52 max-w-full" />
                    <Skeleton className="mt-2 h-4 w-64 max-w-full" />
                  </div>

                  <Skeleton className="h-10 w-36 max-w-full rounded-xl" />
                </div>
              </div>

              {/* Info Cards */}
              <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-7">
                {Array.from({ length: 12 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex min-h-25 items-start gap-4 rounded-xl border border-slate-200 p-4"
                  >
                    {/* Icon */}
                    <Skeleton className="h-11 w-11 shrink-0 rounded-xl" />

                    <div className="min-w-0 flex-1 pt-1">
                      {/* Label */}
                      <Skeleton className="h-3.5 w-24 max-w-full" />

                      {/* Value */}
                      <Skeleton className="mt-3 h-5 w-36 max-w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ProfileLoader;
