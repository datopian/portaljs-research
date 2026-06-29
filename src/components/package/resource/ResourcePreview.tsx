"use client";

import dynamic from "next/dynamic";
import CSVExplorerWrapper from "@/components/csv-explorer";
import CodeViewer from "@/components/ui/code-viewer";
import IframeWrapper from "@/components/ui/iframe";
import PDFViewer from "@/components/ui/pdf-viewer";
import { Resource } from "@/schemas/ckan";
import { FileWarning } from "lucide-react";

const GeoJsonMap = dynamic(() => import("./GeoJsonMap"), {
  ssr: false,
});

function PreviewShell({
  children,
  padded = false,
}: {
  children: React.ReactNode;
  padded?: boolean;
}) {
  return (
    <div className="surface-panel overflow-hidden rounded-2xl">
      <div className={padded ? "p-4 sm:p-5" : ""}>{children}</div>
    </div>
  );
}

export default function ResourcePreview({ resource }: { resource: Resource }) {
  const format = resource.format?.toLowerCase() || "--";

  switch (format) {
    case "csv":
      return (
        <PreviewShell padded>
          <CSVExplorerWrapper dataUrl={resource.url || ""} />
        </PreviewShell>
      );

    case "pdf":
      return (
        <PreviewShell>
          <PDFViewer src={resource.url || ""} title={resource.name || "PDF"} />
        </PreviewShell>
      );

    case "json":
      return (
        <PreviewShell padded>
          <CodeViewer data={resource.url} label="JSON" />
        </PreviewShell>
      );

    case "geojson":
      return (
        <PreviewShell>
          <GeoJsonMap dataUrl={resource.url || ""} title={resource.name} />
        </PreviewShell>
      );

    default:
      if (resource.iframe) {
        return (
          <PreviewShell>
            <IframeWrapper src={resource.url || ""} title={resource.name} height={800} />
          </PreviewShell>
        );
      }

      return (
        <PreviewShell padded>
          <div className="flex min-h-40 flex-col items-center justify-center gap-3 text-center text-muted-foreground">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:color-mix(in_srgb,var(--brand-accent)_8%,white)] text-[color:var(--brand-accent)]">
              <FileWarning className="size-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Preview not available
              </p>
              <p className="text-sm">
                Open or download this resource to inspect its contents.
              </p>
            </div>
          </div>
        </PreviewShell>
      );
  }
}
