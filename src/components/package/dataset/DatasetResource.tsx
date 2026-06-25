import { Resource } from "@/schemas/ckan";
import MarkdownRender from "@/components/ui/markdown";
import { formatDateToDDMMYYYY, formatFileSize } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { supportsPreview } from "@/lib/resource";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Download, Eye, HardDrive } from "lucide-react";

function getResourceUpdatedDate(resource: Resource) {
  return resource.metadata_modified || resource.last_modified || resource.created || "";
}

function getResourceSize(resource: Resource) {
  return resource.size ? formatFileSize(resource.size) : "--";
}

export default async function DatasetResources({
  resources,
  dataset,
  organization,
}: Readonly<{
  resources: Resource[];
  dataset: string;
  organization: string;
}>) {
  const t = await getTranslations();

  if (!resources?.length) {
    return (
      <div className="surface-panel rounded-2xl px-5 py-6 text-sm text-muted-foreground sm:px-6">
        {t("Dataset.noResources")}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {resources.map((resource) => {
        const resourceHref = `/@${organization}/${dataset}/${resource.id}`;
        const updatedDate = getResourceUpdatedDate(resource);
        const formatLabel = resource.format?.toUpperCase() || "--";

        return (
          <article key={resource.id} className="surface-panel rounded-2xl p-5 sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1 space-y-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{formatLabel}</Badge>
                  </div>

                  <h3 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                    <Link href={resourceHref} className="transition hover:text-primary">
                      {resource.name || t("Common.resource")}
                    </Link>
                  </h3>

                  {resource.description && (
                    <div className="line-clamp-2 text-sm leading-7 text-muted-foreground sm:text-[0.95rem]">
                      <MarkdownRender textOnly content={resource.description} />
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="size-4" />
                    <span>
                      <span className="font-medium text-foreground/90">
                        {t("Common.updated")}:
                      </span>{" "}
                      {updatedDate ? formatDateToDDMMYYYY(updatedDate) : "--"}
                    </span>
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <HardDrive className="size-4" />
                    <span>
                      <span className="font-medium text-foreground/90">
                        {t("Common.size")}:
                      </span>{" "}
                      {getResourceSize(resource)}
                    </span>
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                {supportsPreview(resource) && (
                  <Button asChild variant="outline" size="sm">
                    <Link href={resourceHref} aria-label={`Preview resource ${resource.name}`}>
                      <Eye className="size-4" />
                      {t("Common.preview")}
                    </Link>
                  </Button>
                )}

                <Button asChild size="sm">
                  <Link
                    download
                    href={resource.url ?? ""}
                    target="_blank"
                    aria-label={`Download resource ${resource.name}`}
                  >
                    <Download className="size-4" />
                    {t("Common.download")}
                  </Link>
                </Button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
