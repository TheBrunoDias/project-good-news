function CardSkeleton() {
  return (
    <div className="flex flex-col bg-canvas rounded-lg border border-hairline overflow-hidden animate-pulse">
      <div className="aspect-[16/9] bg-canvas-soft" />
      <div className="p-6 flex flex-col gap-3">
        <div className="h-4 bg-canvas-soft rounded w-full" />
        <div className="h-4 bg-canvas-soft rounded w-4/5" />
        <div className="h-3 bg-canvas-soft rounded w-full mt-1" />
        <div className="h-3 bg-canvas-soft rounded w-3/4" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-3 bg-canvas-soft rounded w-20" />
          <div className="h-5 bg-canvas-soft rounded-full w-16" />
        </div>
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-10">
        <div className="h-10 bg-canvas-soft rounded w-64 animate-pulse" />
        <div className="h-4 bg-canvas-soft rounded w-48 mt-3 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </main>
  );
}
