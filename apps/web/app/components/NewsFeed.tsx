"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { NewsCard, type ArticleData } from "./NewsCard";

interface ApiResponse {
  articles: ArticleData[];
  pagination: {
    hasNextPage: boolean;
  };
}

interface NewsFeedProps {
  initialArticles: ArticleData[];
  hasNextPage: boolean;
}

export function NewsFeed({ initialArticles, hasNextPage: initialHasNextPage }: NewsFeedProps) {
  const [articles, setArticles] = useState<ArticleData[]>(initialArticles);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasNextPage) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/news?page=${page + 1}`);
      const data: ApiResponse = await res.json();
      setArticles((prev) => [...prev, ...data.articles]);
      setPage((p) => p + 1);
      setHasNextPage(data.pagination.hasNextPage);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasNextPage, page]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) loadMore();
      },
      { rootMargin: "300px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="flex flex-col gap-4">
      {articles.map((article) => (
        <NewsCard key={article.id} article={article} />
      ))}

      <div ref={sentinelRef} aria-hidden />

      {isLoading && (
        <div className="flex justify-center py-6">
          <div className="size-5 rounded-full border-2 border-hairline border-t-primary animate-spin" />
        </div>
      )}

      {!hasNextPage && articles.length > 0 && (
        <p className="text-center text-xs text-ink-faint py-8">You&apos;re all caught up.</p>
      )}
    </div>
  );
}
