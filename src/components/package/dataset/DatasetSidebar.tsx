import { Dataset } from "@/schemas/ckan";
import { formatDateToDDMMYYYY } from "@/lib/utils";
import { Download, ExternalLink } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { envVars } from "@/lib/env";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import DatasetReusePanel from "./DatasetReusePanel";
import { generateMockDoi } from "@/lib/doi";

function SidebarItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="space-y-1 border-t border-[color:var(--border)] pt-3 first:border-t-0 first:pt-0">
      <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </div>
      <div className="text-[13px] leading-5 text-foreground">{value || "--"}</div>
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
  const datasetDoi = generateMockDoi(dataset.name);
  const datasetDoiUrl = `https://doi.org/${datasetDoi}`;
  const datasetSources = Array.isArray(dataset.source)
    ? dataset.source.filter(Boolean)
    : [];
  const datasetTags = dataset.tags ?? [];

  return (
    <div className="space-y-3  ">
      
      <section className="surface-panel rounded-2xl p-4 sm:p-5">
      {dataset.type === "dataset" && <div className="mb-5"><DatasetReusePanel  dataset={dataset} /></div>}
        <div className="space-y-3">
          <SidebarItem
            label="Files"
            value={dataset.resources?.length ?? 0}
          />
          <SidebarItem
            label="DOI"
            value={
              <a
                href={datasetDoiUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-primary transition hover:underline"
              >
                <span className="break-all">{datasetDoi}</span>
                <ExternalLink className="size-3.5" />
              </a>
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
          
          {datasetSources.length > 0 && (
            <SidebarItem
              label={`Source${datasetSources.length > 1 ? "s" : ""}`}
              value={
                <div className="space-y-1">
                  {datasetSources.map((sourceUrl) => (
                    <a
                      key={sourceUrl}
                      href={sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 break-all font-medium text-primary transition hover:underline"
                    >
                      <span>{sourceUrl}</span>
                      <ExternalLink className="size-3.5 shrink-0" />
                    </a>
                  ))}
                </div>
              }
            />
          )}
          {dataset.type === "dataset" && (
            <SidebarItem
              label={t("Common.license")}
              value={
                dataset.license_url ? (
                  <a
                    href={dataset.license_url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-primary transition hover:underline"
                  >
                    {dataset.license_title}
                  </a>
                ) : (
                  dataset.license_title
                )
              }
            />
          )}

          <SidebarItem label={t("Common.version")} value={dataset.version} />
          <SidebarItem
            label={t("Common.tags")}
            value={
              datasetTags.length ? (
                <span className="text-[13px] leading-5">
                  {datasetTags.map((tag, index) => (
                    <span key={tag.id}>
                      <Link
                        href={`/search?tags=${tag.name}`}
                        className="font-medium text-primary transition hover:underline"
                      >
                        {tag.display_name ?? tag.name}
                      </Link>
                      {index < datasetTags.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </span>
              ) : (
                "--"
              )
            }
          />
        </div>
      </section>
      {dataset.type === "dataset" && (
        <section className="surface-panel rounded-2xl p-4 sm:p-5">
          <div className="mb-4">
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Export metadata as
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {["rdf", "ttl", "jsonld"].map((type) => (
              <Button
                key={type}
                asChild
                variant="outline"
                className="h-9 justify-center px-3 text-xs"
              >
                <Link
                  href={`${dms}/dataset/${dataset.name}.${type}`}
                  target="_blank"
                >
                  <Download className="size-3.5" />
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
