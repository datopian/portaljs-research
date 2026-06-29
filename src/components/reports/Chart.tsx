"use client";

import { useEffect, useRef, useState } from "react";
import { parseCsv } from "@/lib/parseCsv";
import type { PlotModule } from "@/types/chartData";

interface ChartProps {
  title?: string;
  csvUrl: string;
  spec: (Plot: PlotModule, data: unknown[]) => SVGSVGElement | HTMLElement;
}

export default function Chart({ title = "", csvUrl, spec }: ChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const container = containerRef.current;
    let cancelled = false;

    async function renderChart() {
      try {
        const proxyUrl = `/api/csv?url=${encodeURIComponent(csvUrl)}`;
        const [response, Plot] = await Promise.all([
          fetch(proxyUrl),
          import("@observablehq/plot"),
        ]);

        if (!response.ok) {
          throw new Error(`Failed to fetch chart data (${response.status})`);
        }

        const text = await response.text();
        const data = parseCsv(text);

        if (cancelled) {
          return;
        }

        const width = container.clientWidth || 640;
        const plot = spec({ ...Plot, width } as PlotModule, data);
        container.innerHTML = "";
        container.appendChild(plot);
      } catch (chartError) {
        if (!cancelled) {
          setError(String(chartError));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    renderChart();

    return () => {
      cancelled = true;
      container.innerHTML = "";
    };
  }, [csvUrl, spec]);

  return (
    <figure className="my-8 space-y-3">
      {title ? (
        <figcaption className="text-sm font-semibold text-foreground/75">
          {title}
        </figcaption>
      ) : null}

      {loading && !error ? (
        <div className="h-[320px] animate-pulse rounded-2xl bg-muted" />
      ) : null}

      {error ? (
        <div className="flex h-[320px] items-center justify-center rounded-2xl border border-dashed border-[color:var(--border)] text-sm text-destructive">
          Failed to load chart
        </div>
      ) : null}

      <div
        ref={containerRef}
        className="overflow-hidden rounded-2xl [&>figure]:max-w-full [&>svg]:max-w-full"
      />
    </figure>
  );
}
