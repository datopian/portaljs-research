 "use client";

import { Link } from "@/i18n/navigation";
import { Dataset } from "@/schemas/ckan";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateToDDMMYYYY } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Building2, CalendarDays, Files } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function SearchResultItem({
  dataset,
  query,
}: {
  dataset: Dataset;
  query?: string;
}) {
  const t = useTranslations("Common");
  const uniqueFormats = [
    ...new Set(
      dataset.resources?.filter((r) => r.format).map((r) => r.format?.toUpperCase())
    ),
  ];

  const highlightText = (text: string = "", currentQuery: string = "") => {
    if (!currentQuery.trim()) return text;
    const escapedQuery = currentQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedQuery})`, "gi");
    return text.split(regex).map((part, i) =>
      i % 2 === 1 ? (
        <mark
          key={i}
          className="rounded-sm px-0.5"
          style={{ background: "color-mix(in srgb, var(--brand-accent) 18%, white)" }}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <article className="surface-panel rounded-2xl bg-white p-5 sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            <Link
              href={`/@${dataset.organization?.name}/${dataset.name}`}
              className="transition text-foreground hover:text-primary"
            >
              {highlightText(dataset.title || dataset.name, query)}
            </Link>
          </h2>

          <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5">
            <div className="inline-flex items-center gap-2">
              <Building2 className="size-4" />
              <Link className="hover:underline" href={`/@${dataset.organization?.name}`}>
                {highlightText(dataset.organization?.title || "", query)}
              </Link>
            </div>

            <div className="inline-flex items-center gap-2">
              <CalendarDays className="size-4" />
              {formatDateToDDMMYYYY(dataset.metadata_modified ?? "")}
            </div>

            {dataset.resources.length > 0 && (
              <div className="inline-flex items-center gap-2">
                <Files className="size-4" />
                <span>
                  {dataset.resources.length} file
                  {dataset.resources.length > 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>

          {dataset.notes && (
            <p className="mt-4 max-w-3xl line-clamp-3 text-sm leading-7 text-muted-foreground sm:text-base">
              {highlightText(
                dataset.notes?.replace(/<\/?[^>]+(>|$)/g, "") || "",
                query
              )}
            </p>
          )}

          {uniqueFormats.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {uniqueFormats.slice(0, 4).map((format) => (
                <Badge key={format} variant="outline">
                  {format}
                </Badge>
              ))}
              {uniqueFormats.length > 4 && (
                <span className="inline-flex items-center text-sm font-medium text-primary">
                  +{uniqueFormats.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 lg:flex-col lg:items-end">

          <Button asChild variant="outline" className="min-w-36">
            <Link href={`/@${dataset.organization?.name}/${dataset.name}`}>
              {dataset.type === "visualization"
                ? t("viewVisualization")
                : t("viewDataset")}
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

export function SearchResultItemSkeleton() {
  return (
    <div className="space-y-3 w-full rounded">
      <Skeleton className="h-6 w-32" />
      <div className="space-y-1">
        <Skeleton className="h-36 w-full rounded-2xl" />
      </div>
    </div>
  );
}
