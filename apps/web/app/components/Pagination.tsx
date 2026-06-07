import Link from "next/link";

interface PaginationProps {
  page: number;
  totalPages: number;
}

export function Pagination({ page, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null;

  const prev = page - 1;
  const next = page + 1;

  const pages = buildPageRange(page, totalPages);

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1 mt-12">
      <PaginationLink href={`/?page=${prev}`} disabled={page <= 1} aria-label="Previous page">
        ←
      </PaginationLink>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="px-2 text-ink-faint text-sm select-none">
            …
          </span>
        ) : (
          <PaginationLink
            key={p}
            href={`/?page=${p}`}
            active={p === page}
            aria-label={`Page ${p}`}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </PaginationLink>
        ),
      )}

      <PaginationLink href={`/?page=${next}`} disabled={page >= totalPages} aria-label="Next page">
        →
      </PaginationLink>
    </nav>
  );
}

interface PaginationLinkProps {
  href: string;
  disabled?: boolean;
  active?: boolean;
  "aria-label"?: string;
  "aria-current"?: "page" | undefined;
  children: React.ReactNode;
}

function PaginationLink({ href, disabled, active, children, ...rest }: PaginationLinkProps) {
  const base =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors";

  if (disabled) {
    return (
      <span className={`${base} border-hairline text-ink-faint cursor-not-allowed`} {...rest}>
        {children}
      </span>
    );
  }

  if (active) {
    return (
      <span
        className={`${base} border-primary bg-primary text-white`}
        aria-current="page"
        {...rest}
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={`${base} border-hairline bg-canvas text-ink hover:border-ink-faint`}
      {...rest}
    >
      {children}
    </Link>
  );
}

function buildPageRange(current: number, total: number): Array<number | "…"> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: Array<number | "…"> = [1];

  if (current > 3) pages.push("…");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("…");

  pages.push(total);
  return pages;
}
