import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-117.5 px-4">
      <section className="flex flex-col items-center justify-center gap-6 py-24 text-center">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold tracking-tight text-ink">
            Good things happen every day.
          </h1>
          <p className="text-[17px] text-ink-muted leading-relaxed max-w-md mx-auto">
            Daily Good News is a curated feed of uplifting stories from around the world — collected and scored by AI, delivered fresh each morning.
          </p>
        </div>

        <Link
          href="/news"
          className="mt-2 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-canvas transition-opacity hover:opacity-80"
        >
          Read today&apos;s news
        </Link>

        <div className="mt-8 grid grid-cols-3 divide-x divide-hairline border border-hairline rounded-xl overflow-hidden w-full max-w-sm">
          <div className="flex flex-col items-center gap-1 px-4 py-5">
            <span className="text-xl">📰</span>
            <span className="text-[11px] text-ink-muted text-center leading-tight">Fresh stories daily</span>
          </div>
          <div className="flex flex-col items-center gap-1 px-4 py-5">
            <span className="text-xl">✨</span>
            <span className="text-[11px] text-ink-muted text-center leading-tight">AI-scored positivity</span>
          </div>
          <div className="flex flex-col items-center gap-1 px-4 py-5">
            <span className="text-xl">🚫</span>
            <span className="text-[11px] text-ink-muted text-center leading-tight">No outrage, no doom</span>
          </div>
        </div>
      </section>
    </main>
  );
}
