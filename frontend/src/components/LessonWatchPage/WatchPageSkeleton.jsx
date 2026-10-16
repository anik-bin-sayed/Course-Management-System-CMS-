const WatchPageSkeleton = () => {
  return (
    <main className="min-h-screen bg-[#f6f7fb] p-4 sm:p-7">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-6 h-12 max-w-xs animate-pulse rounded-xl bg-slate-200" />

        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-5">
            <div className="aspect-video animate-pulse rounded-2xl bg-slate-200" />

            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
              <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
              <div className="h-7 w-3/4 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-5 h-6 w-2/3 animate-pulse rounded bg-slate-200" />

            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="mb-3 flex gap-3">
                <div className="h-[62px] w-[104px] shrink-0 animate-pulse rounded-xl bg-slate-200" />

                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                  <div className="h-3 w-16 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default WatchPageSkeleton;
