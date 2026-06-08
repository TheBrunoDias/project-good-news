import type { Metadata } from "next";
import { getLatestNews, getNewsCount } from "@/lib/db";
import { NewsFeed } from "../components/NewsFeed";

export const metadata: Metadata = {
  title: "News · Daily Good News",
  description: "Curated positive news, every day.",
};

const PAGE_SIZE = 10;

export default async function NewsPage() {
  const [articles, total] = await Promise.all([
    getLatestNews(PAGE_SIZE, 0),
    getNewsCount(),
  ]);

  const hasNextPage = total > PAGE_SIZE;

  return (
    <main className="mx-auto max-w-117.5 px-4 py-6">
      {articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-hairline bg-canvas py-24 text-center">
          <p className="text-2xl">🌱</p>
          <p className="mt-3 text-sm text-ink-muted">Stories are collected daily. Come back tomorrow!</p>
        </div>
      ) : (
        <NewsFeed initialArticles={articles} hasNextPage={hasNextPage} />
      )}
    </main>
  );
}
