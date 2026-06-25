import { Dataset } from "@/schemas/ckan";
import { formatDateToDDMMYYYY } from "@/lib/utils";
import { Download } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { envVars } from "@/lib/env";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";

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
      <div className="text-sm leading-6 text-foreground">{value || "--"}</div>
    </div>
  );
}

export default async function DatasetSidebar({
  dataset,
}: {
  dataset: Dataset;
}) {
  const t = await getTranslations();
  const dms = envVars.dms ?? "";

  return (
    <div className="space-y-4 lg:sticky lg:top-24 lg:-mt-30">
      <section className="surface-panel rounded-2xl p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            {t("Common.metadata")}
          </h2>
        </div>

        <div className="space-y-4">
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
          <SidebarItem
            label={t("Common.created")}
            value={formatDateToDDMMYYYY(dataset.metadata_created ?? "")}
          />
          <SidebarItem
            label={t("Common.updated")}
            value={formatDateToDDMMYYYY(dataset.metadata_modified ?? "")}
          />
          {dataset.type === "dataset" && (
            <SidebarItem
              label={t("Common.license")}
              value={dataset.license_title}
            />
          )}

          <SidebarItem label={t("Common.version")} value={dataset.version} />
        </div>
      </section>
      {dataset.type === "dataset" && (
        <section className="surface-panel rounded-2xl p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Export
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {["rdf", "ttl", "jsonld"].map((type) => (
              <Button
                key={type}
                asChild
                variant="outline"
                className="justify-center"
              >
                <Link
                  href={`${dms}/dataset/${dataset.name}.${type}`}
                  target="_blank"
                >
                  <Download className="size-4" />
                  <span>{type.toUpperCase()}</span>
                </Link>
              </Button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
