"use client";

import IframeWrapper from "@/components/ui/iframe";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileWarning } from "lucide-react";

export default function VisualizationPreview({
  title,
  externalUrl,
}: {
  title?: string;
  externalUrl?: string;
}) {
  if (!externalUrl) {
    return (
      <div className="surface-panel rounded-2xl p-6">
        <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-center text-muted-foreground">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:color-mix(in_srgb,var(--brand-accent)_8%,white)] text-[color:var(--brand-accent)]">
            <FileWarning className="size-5" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              Visualization not available
            </p>
            <p className="text-sm">
              This visualization does not include an external URL.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button asChild variant="outline" size="sm">
          <a href={externalUrl} target="_blank" rel="noreferrer">
            <ExternalLink className="size-4" />
            Open visualization
          </a>
        </Button>
      </div>
      <div className="surface-panel overflow-hidden rounded-2xl">
        <IframeWrapper src={externalUrl} title={title} height={820} />
      </div>
    </div>
  );
}
