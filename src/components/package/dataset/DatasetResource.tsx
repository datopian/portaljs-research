"use client";

import { useMemo, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Dataset, Resource } from "@/schemas/ckan";
import MarkdownRender from "@/components/ui/markdown";
import { formatDateToDDMMYYYY, formatFileSize } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { supportsPreview } from "@/lib/resource";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clipboard, Code2, Download, HardDrive, X } from "lucide-react";
import ResourcePreview from "@/components/package/resource/ResourcePreview";
import {
  ApiAccessStyle,
  formatResourceAccessSnippet,
} from "@/lib/api-access";
import { getDatasetStableUrl } from "@/lib/dataset-links";
import { envVars } from "@/lib/env";

function getResourceUpdatedDate(resource: Resource) {
  return resource.metadata_modified || resource.last_modified || resource.created || "";
}

function getResourceSize(resource: Resource) {
  return resource.size ? formatFileSize(resource.size) : "--";
}

const accessStyles = [
  { id: "curl", label: "curl" },
  { id: "python", label: "Python" },
  { id: "r", label: "R" },
] as const;

function ResourceApiAccessDialog({
  dataset,
  resource,
  open,
  onClose,
}: {
  dataset: Dataset;
  resource: Resource;
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("Common");
  const [accessStyle, setAccessStyle] = useState<ApiAccessStyle>("curl");
  const [copied, setCopied] = useState(false);

  const stableDatasetUrl = useMemo(
    () => getDatasetStableUrl(dataset, envVars.siteUrl),
    [dataset],
  );

  const snippet = useMemo(
    () =>
      formatResourceAccessSnippet(dataset, {
        style: accessStyle,
        stableUrl: stableDatasetUrl,
        resourceUrl: resource.url,
      }),
    [accessStyle, dataset, resource.url, stableDatasetUrl],
  );

  const copySnippet = async () => {
    if (!snippet) {
      return;
    }

    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error("Failed to copy API access snippet", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-[90]">
      <DialogBackdrop className="fixed inset-0 bg-black/35" />
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-2xl rounded-3xl bg-white p-5 shadow-2xl sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">API access</h3>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Use one of these starter snippets to access this resource directly.
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="panel-icon-button"
            >
              <X className="size-4" />
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {accessStyles.map((style) => (
              <Button
                key={style.id}
                type="button"
                variant={accessStyle === style.id ? "default" : "outline"}
                size="sm"
                onClick={() => setAccessStyle(style.id)}
              >
                {style.label}
              </Button>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--foreground)] p-4">
            <pre className="whitespace-pre-wrap break-words text-sm leading-7 text-white/90">
              <code>{snippet}</code>
            </pre>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" onClick={copySnippet}>
              <Clipboard className="size-4" />
              {copied ? `${t("copied")}!` : "Copy snippet"}
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default function DatasetResources({
  resources,
  dataset,
}: Readonly<{
  resources: Resource[];
  dataset: Dataset;
}>) {
  const t = useTranslations();
  const [activeResourceId, setActiveResourceId] = useState<string | null>(null);

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
        const resourceHref = `/@${dataset.organization?.name}/${dataset.name}/r/${resource.id}`;
        const updatedDate = getResourceUpdatedDate(resource);
        const formatLabel = resource.format?.toUpperCase() || "--";

        return (
          <article key={resource.id} className="surface-panel rounded-2xl p-5 sm:p-6">
            <div className="space-y-5">
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveResourceId(resource.id)}
                  >
                    <Code2 className="size-4" />
                    API access
                  </Button>

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

              {supportsPreview(resource) && (
                <div className="border-t border-[color:var(--border)] pt-5">
                  <ResourcePreview resource={resource} />
                </div>
              )}
            </div>

            <ResourceApiAccessDialog
              dataset={dataset}
              resource={resource}
              open={activeResourceId === resource.id}
              onClose={() => setActiveResourceId(null)}
            />
          </article>
        );
      })}
    </div>
  );
}
