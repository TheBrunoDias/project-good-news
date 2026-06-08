function CardSkeleton() {
  return (
    <div className="bg-canvas border border-hairline rounded-xl overflow-hidden animate-pulse">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="size-9 rounded-full bg-canvas-soft shrink-0" />
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="h-3 bg-canvas-soft rounded w-28" />
          <div className="h-2.5 bg-canvas-soft rounded w-16" />
        </div>
        <div className="h-5 bg-canvas-soft rounded-full w-10" />
      </div>
      <div className="aspect-square bg-canvas-soft" />
      <div className="px-4 py-3 flex flex-col gap-2">
        <div className="h-3.5 bg-canvas-soft rounded w-full" />
        <div className="h-3.5 bg-canvas-soft rounded w-4/5" />
        <div className="h-3 bg-canvas-soft rounded w-full mt-0.5" />
        <div className="h-3 bg-canvas-soft rounded w-3/4" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <main className="mx-auto max-w-117.5 px-4 py-6">
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </main>
  );
}
