import { Link } from "@/i18n/navigation";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

type RelatedDatasetLink = {
  slug: string;
  title: string;
  href: string;
};

function toDatasetTitle(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function ReportContent({
  body,
  relatedDatasets,
}: {
  body: ReactNode;
  relatedDatasets: RelatedDatasetLink[];
}) {
  return (
    <div className="space-y-10 sm:space-y-12">
      <article className="report-richtext max-w-none">
        {body}
      </article>

      {relatedDatasets.length > 0 ? (
        <section className="space-y-4 border-t border-[color:var(--border)] pt-8 sm:pt-10">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
            Related Datasets
          </h2>
          <div className="grid gap-3">
            {relatedDatasets.map((dataset) => (
              <Link
                key={dataset.slug}
                href={dataset.href}
                className="surface-panel flex items-center justify-between rounded-2xl px-5 py-4 transition hover:[border-color:var(--brand-border-tint)] hover:bg-[color:color-mix(in_srgb,var(--brand-accent)_3%,white)]"
              >
                <span className="text-sm font-medium text-foreground sm:text-[0.96rem]">
                  {dataset.title || toDatasetTitle(dataset.slug)}
                </span>
                <span className="text-sm font-semibold text-[color:var(--brand-accent)]">
                  <ChevronRight className="size-4" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
