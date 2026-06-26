import { Dataset } from "@/schemas/ckan";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { generateMockDoi } from "@/lib/doi";
import { cn, formatDateToHumanReadable } from "@/lib/utils";
import { Building2, CalendarDays } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function DatasetCard({
  dataset,
  linkClassName = "",
  cardClassName = "",
}: {
  dataset: Dataset;
  linkClassName?: string;
  cardClassName?: string;
}) {
  const datasetDoi = generateMockDoi(dataset.name);
  /*const tagNames = dataset.tags
    ?.map((tag) => tag.display_name || tag.name)
    .filter(Boolean)
    .slice(0, 3);*/

  return (
    <Link
      href={`/@${dataset.organization?.name}/${dataset.name}`}
      className={cn("group block h-full", linkClassName)}
    >
      <Card
        key={dataset.id}
        className={cn(
          "flex h-full flex-col rounded-2xl border-[color:var(--border)] bg-white transition duration-200 group-hover:-translate-y-0.5 group-hover:[border-color:var(--brand-border-tint)] group-hover:shadow-[0_18px_36px_-28px_rgba(37,99,235,0.3)]",
          cardClassName,
        )}
      >
        <CardHeader className="pb-2">
          <div className="space-y-2">
            <h3 className="line-clamp-3 group-hover:text-primary transition text-[1.15rem] font-semibold leading-6 tracking-tight">
              {dataset.title}
            </h3>
            <div className="text-xs text-slate-500">
              <span className="mr-1 font-semibold uppercase tracking-[0.12em] text-slate-700">
                DOI
              </span>
              <code className="rounded bg-slate-100 px-2 py-1 text-[11px] text-slate-700">
                {datasetDoi}
              </code>
            </div>
          </div>
        </CardHeader>

        <CardContent className="mt-auto space-y-4">
          {dataset.notes ? (
            <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
              {dataset.notes.replace(/<\/?[^>]+(>|$)/g, "")}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.92rem] text-muted-foreground">
            {dataset.organization?.title ? (
              <span className="inline-flex items-center gap-2">
                <Building2 className="size-4" />
                <span className="line-clamp-1">{dataset.organization.title}</span>
              </span>
            ) : null}
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="size-4" />
              {formatDateToHumanReadable(dataset.metadata_modified ?? "")}
            </span>
          </div>

          {/*tagNames && tagNames.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tagNames.map((tag) => (
                <Badge key={tag} variant="outline" className="max-w-full">
                  <span className="truncate">{tag}</span>
                </Badge>
              ))}
              {dataset.tags && dataset.tags.length > tagNames.length ? (
                <span className="inline-flex items-center text-sm font-medium text-primary">
                  +{dataset.tags.length - tagNames.length} more
                </span>
              ) : null}
            </div>
          ) : null*/}
        </CardContent>
      </Card>
    </Link>
  );
}
