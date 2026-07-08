import { ResourceChartClient } from "./ResourceChartClient";
import { fetchCkanResourceRows } from "./fetchers";
import { buildResourceChartState } from "./transform";
import type { ResourceChartConfig, ResourceChartRow } from "./types";

type ResourceChartProps = {
  resourceId: string;
  config: ResourceChartConfig;
  title?: string;
  description?: string;
  meta?: string;
  fetchRows?: (resourceId: string) => Promise<ResourceChartRow[]>;
  emptyMessage?: string;
};

export async function ResourceChart({
  resourceId,
  config,
  title,
  description,
  meta,
  fetchRows = fetchCkanResourceRows,
  emptyMessage,
}: ResourceChartProps) {
  const state = await (async () => {
    try {
      const rows = await fetchRows(resourceId);
      return buildResourceChartState(rows, config);
    } catch (error) {
      console.error(`Failed to render resource chart for ${resourceId}:`, error);
      return { status: "empty" as const, message: "This chart could not be loaded." };
    }
  })();

  if (state.status === "empty") {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-3xl border border-border bg-card px-4 text-sm text-muted-foreground">
        {emptyMessage ?? state.message}
      </div>
    );
  }

  return (
    <ResourceChartClient
      chart={state.chart}
      config={config}
      title={title}
      description={description}
      meta={meta}
    />
  );
}
