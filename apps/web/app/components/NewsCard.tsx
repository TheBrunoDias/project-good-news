import type { NewsSelect } from "@daily-good-news/db/schema";

interface ScoreBadgeProps {
  score: number;
}

function ScoreBadge({ score }: ScoreBadgeProps) {
  const isExcellent = score >= 9;
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold tracking-wide",
        isExcellent
          ? "bg-accent-green/10 text-accent-green"
          : "bg-accent-teal/10 text-accent-teal",
      ].join(" ")}
    >
      <span
        className={[
          "size-1.5 rounded-full",
          isExcellent ? "bg-accent-green" : "bg-accent-teal",
        ].join(" ")}
      />
      {isExcellent ? "Excellent" : "Positive"}
    </span>
  );
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

interface NewsCardProps {
  article: NewsSelect;
}

export function NewsCard({ article }: NewsCardProps) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col bg-canvas rounded-[12px] border border-hairline overflow-hidden transition-shadow hover:shadow-[0_0_0_1px_#e6e6e6,0_2px_8px_rgba(0,0,0,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {article.imageUrl && (
        <div className="aspect-[16/9] overflow-hidden bg-canvas-soft">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.imageUrl}
            alt=""
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      )}

      <div className="flex flex-col flex-1 p-6 gap-3">
        <h2 className="font-bold text-[17px] leading-snug tracking-[-0.25px] text-ink line-clamp-3 group-hover:text-primary transition-colors">
          {article.title}
        </h2>

        <p className="text-sm leading-relaxed text-ink-muted line-clamp-3 flex-1">
          {article.description}
        </p>

        <div className="flex items-center justify-between pt-1">
          <time className="text-xs text-ink-faint" dateTime={article.publishedAt.toISOString()}>
            {formatDate(article.publishedAt)}
          </time>
          <ScoreBadge score={article.score} />
        </div>
      </div>
    </a>
  );
}
