import { Button } from "@/components/ui/button";
import { envVars } from "@/lib/env";
import { formatDateToDDMMYYYY, formatFileSize } from "@/lib/utils";
import { Dataset, Resource } from "@/schemas/ckan";
import { Download, ExternalLink } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

function SidebarItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5 border-t border-[color:var(--border)] pt-4 first:border-t-0 first:pt-0">
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </div>
      <div className="break-words text-sm leading-6 text-foreground">{value || "--"}</div>
    </div>
  );
}

export default async function ResourceSidebar({
  resource,
  dataset,
}: {
  resource: Resource;
  dataset: Dataset;
}) {
  const t = await getTranslations();
  const dms = envVars.dms ?? "";

  return (
    <div className="space-y-4 lg:sticky lg:top-24 lg:-mt-30">
      <section className="surface-panel rounded-2xl p-5 sm:p-6">


        <div className="flex flex-col gap-2">
          <Button asChild>
            <Link href={resource.url ?? ""} target="_blank" download>
              <Download className="size-4" />
              {t("Common.download")}
            </Link>
          </Button>

          <Button asChild variant="outline">
            <Link href={`${dms}/api/3/action/resource_show?id=${resource.id}`} target="_blank">
              <ExternalLink className="size-4" />
              API JSON
            </Link>
          </Button>
        </div>
      </section>
      <section className="surface-panel rounded-2xl p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            {t("Common.metadata")}
          </h2>
        </div>

        <div className="space-y-4">
          <SidebarItem label={t("Common.format")} value={resource.format?.toUpperCase() || "--"} />
          <SidebarItem
            label={t("Common.created")}
            value={resource.created ? formatDateToDDMMYYYY(resource.created) : "--"}
          />
          <SidebarItem
            label={t("Common.updated")}
            value={
              resource.metadata_modified
                ? formatDateToDDMMYYYY(resource.metadata_modified)
                : resource.last_modified
                  ? formatDateToDDMMYYYY(resource.last_modified)
                  : "--"
            }
          />
          <SidebarItem
            label={t("Common.size")}
            value={resource.size ? formatFileSize(resource.size) : "--"}
          />
          <SidebarItem
            label={t("Common.dataset")}
            value={
              <Link
                href={`/@${dataset.organization?.name}/${dataset.name}`}
                className="font-medium text-primary transition hover:underline"
              >
                {dataset.title || dataset.name}
              </Link>
            }
          />
          <SidebarItem
            label={t("Common.organization")}
            value={
              dataset.organization?.name ? (
                <Link
                  href={`/@${dataset.organization.name}`}
                  className="font-medium text-primary transition hover:underline"
                >
                  {dataset.organization?.title || dataset.organization.name}
                </Link>
              ) : (
                "--"
              )
            }
          />
          <SidebarItem label="MIME type" value={resource.mimetype || "--"} />
        </div>
      </section>

      
    </div>
  );
}
