import { Link } from "@/i18n/navigation";
import type { ReactNode } from "react";
import type { ReportMeta } from "@/lib/reports";

type RelatedDatasetLink = {
  slug: string;
  title: string;
  href: string;
};

function formatReportDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);

  return new Date(year, (month || 1) - 1, day || 1).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  );
}

function toDatasetTitle(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function ReportContent({
  frontmatter,
  body,
  relatedDatasets,
}: {
  frontmatter: ReportMeta;
  body: ReactNode;
  relatedDatasets: RelatedDatasetLink[];
}) {
  return (
    <div className="space-y-10">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <Link href="/reports" className="transition-colors hover:text-foreground">
          Reports
        </Link>
        <span>/</span>
        <span className="truncate text-foreground">{frontmatter.title}</span>
      </nav>

      <header className="space-y-4 border-b border-[color:var(--border)] pb-10">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {formatReportDate(frontmatter.date)}
        </p>
        <h1 className="font-display text-[2.7rem] font-semibold leading-[1.05] tracking-tight text-foreground sm:text-[3.35rem]">
          {frontmatter.title}
        </h1>
        <p className="max-w-3xl text-[1.05rem] leading-8 text-muted-foreground">
          {frontmatter.description}
        </p>
      </header>

      <article className="prose prose-slate max-w-none prose-headings:font-semibold prose-a:text-[color:var(--brand-accent)] prose-img:rounded-2xl">
        {body}
      </article>

      {relatedDatasets.length > 0 ? (
        <section className="space-y-4 border-t border-[color:var(--border)] pt-10">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Related Datasets
          </h2>
          <div className="grid gap-3">
            {relatedDatasets.map((dataset) => (
              <Link
                key={dataset.slug}
                href={dataset.href}
                className="surface-panel flex items-center justify-between rounded-2xl px-5 py-4 transition hover:[border-color:var(--brand-border-tint)] hover:bg-[color:color-mix(in_srgb,var(--brand-accent)_3%,white)]"
              >
                <span className="text-sm font-medium text-foreground">
                  {dataset.title || toDatasetTitle(dataset.slug)}
                </span>
                <span className="text-sm font-semibold text-[color:var(--brand-accent)]">
                  View dataset
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
