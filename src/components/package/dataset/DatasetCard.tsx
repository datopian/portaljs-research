import { Dataset } from "@/schemas/ckan";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn, formatDateToHumanReadable } from "@/lib/utils";
import { CalendarDays } from "lucide-react";
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
          <div className="space-y-1">
            <h3 className="line-clamp-2 group-hover:text-primary transition text-[1.15rem] font-semibold leading-6 tracking-tight">
              {dataset.title}
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-sm text-foreground/88">
              {dataset.groups && dataset.groups.length > 0 && (
                <span className="line-clamp-1 overflow-hidden ">
                  {dataset.groups
                    .slice(0, 2)
                    .map(
                      (group) =>
                        group.display_name || group.title || group.name,
                    )
                    .join(", ")}
                  {dataset.groups.length > 2 &&
                    `, +${dataset.groups.length - 2}`}
                </span>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="mt-auto space-y-3">

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.92rem] text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="size-4" />
              {formatDateToHumanReadable(dataset.metadata_modified ?? "")}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
