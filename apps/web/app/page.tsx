import { getLatestNews, getNewsCount } from "@/lib/db";
import { NewsCard } from "./components/NewsCard";
import { Pagination } from "./components/Pagination";

const PAGE_SIZE = 15;

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? 1));

  const [articles, total] = await Promise.all([
    getLatestNews(PAGE_SIZE, (page - 1) * PAGE_SIZE),
    getNewsCount(),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-[-1px] text-ink leading-tight">
          Today&apos;s Good News
        </h1>
        <p className="mt-2 text-base text-ink-muted">
          {total > 0
            ? `Showing ${from}–${to} of ${total} positive stories`
            : "No stories yet — check back soon."}
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-hairline bg-canvas py-24 text-center">
          <p className="text-2xl">🌱</p>
          <p className="mt-3 text-sm text-ink-muted">
            Stories are collected daily. Come back tomorrow!
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} />
        </>
      )}
    </main>
  );
}
