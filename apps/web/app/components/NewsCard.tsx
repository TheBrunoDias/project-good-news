export interface ArticleData {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string | null;
  score: number;
  publishedAt: Date | string;
  createdAt: Date | string;
}

function formatRelativeDate(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(d);
}

function ScoreBadge({ score }: { score: number }) {
  const isExcellent = score >= 9;
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide shrink-0",
        isExcellent ? "bg-accent-green/10 text-accent-green" : "bg-accent-teal/10 text-accent-teal",
      ].join(" ")}
    >
      <span
        className={["size-1.5 rounded-full shrink-0", isExcellent ? "bg-accent-green" : "bg-accent-teal"].join(" ")}
      />
      {score}/10
    </span>
  );
}

interface NewsCardProps {
  article: ArticleData;
}

export function NewsCard({ article }: NewsCardProps) {
  let source: string | null = null;
  try {
    source = new URL(article.url).hostname.replace(/^www\./, "");
  } catch {
    // invalid URL — leave null
  }

  const initials = (source ?? "GN").slice(0, 2).toUpperCase();
  const isoDate = new Date(article.publishedAt).toISOString();

  return (
    <article className="bg-canvas border border-hairline rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0 select-none">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-ink truncate">{source ?? "Daily Good News"}</p>
          <time className="text-[11px] text-ink-faint" dateTime={isoDate}>
            {formatRelativeDate(article.publishedAt)}
          </time>
        </div>
        <ScoreBadge score={article.score} />
      </div>

      {article.imageUrl && (
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="block aspect-square overflow-hidden bg-canvas-soft">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={article.imageUrl} alt="" className="w-full h-full object-cover" />
        </a>
      )}

      <div className="px-4 py-3 flex flex-col gap-1.5">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[14px] font-bold text-ink leading-snug hover:text-primary transition-colors"
        >
          {article.title}
        </a>
        {article.description && (
          <p className="text-[13px] text-ink-muted leading-relaxed line-clamp-3">{article.description}</p>
        )}
      </div>
    </article>
  );
}
