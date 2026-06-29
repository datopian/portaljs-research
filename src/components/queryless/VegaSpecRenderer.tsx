"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type VegaSpec = Record<string, unknown> & {
  mark?: unknown;
  encoding?: unknown;
  data?: { values?: unknown[] } & Record<string, unknown>;
  layer?: unknown;
  hconcat?: unknown;
  vconcat?: unknown;
  concat?: unknown;
  spec?: unknown;
};

function isVegaSpec(value: unknown): value is VegaSpec {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const spec = value as VegaSpec;
  return Boolean(spec.mark || spec.layer || spec.hconcat || spec.vconcat || spec.concat || spec.spec);
}

export function parseVegaSpec(value: unknown): VegaSpec | null {
  return isVegaSpec(value) ? value : null;
}

export function parseVegaSpecText(specText: string): VegaSpec | null {
  try {
    return parseVegaSpec(JSON.parse(specText));
  } catch {
    return null;
  }
}

export default function VegaSpecRenderer({ specText }: { specText: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);
  const parsedSpec = useMemo(() => parseVegaSpecText(specText), [specText]);

  const spec = useMemo(() => {
    if (!parsedSpec) return null;

    const normalizedSpec = JSON.parse(JSON.stringify(parsedSpec));
    const markType =
      typeof normalizedSpec.mark === "string"
        ? normalizedSpec.mark
        : (normalizedSpec.mark as { type?: string } | undefined)?.type;
    const isBarChart = markType === "bar";
    const valueCount = Array.isArray(normalizedSpec.data?.values)
      ? normalizedSpec.data.values.length
      : null;

    if (!normalizedSpec.width) {
      normalizedSpec.width = "container";
    }

    if (!normalizedSpec.autosize) {
      normalizedSpec.autosize = {
        type: "fit-x",
        contains: "padding",
        resize: false,
      };
    }

    if (
      !normalizedSpec.height &&
      !normalizedSpec.concat &&
      !normalizedSpec.hconcat &&
      !normalizedSpec.vconcat
    ) {
      if (isBarChart && valueCount) {
        normalizedSpec.height = Math.max(220, Math.min(420, valueCount * 28));
      } else {
        normalizedSpec.height = 220;
      }
    }

    if (typeof normalizedSpec.height === "number") {
      normalizedSpec.height = Math.min(normalizedSpec.height, 420);
    }

    return normalizedSpec;
  }, [parsedSpec]);

  useEffect(() => {
    let view: { finalize: () => void } | undefined;
    let disposed = false;

    const render = async () => {
      if (!containerRef.current) return;
      if (!spec) {
        setRenderError("Invalid chart specification");
        return;
      }

      try {
        const embed = (await import("vega-embed")).default;
        containerRef.current.innerHTML = "";
        const result = await embed(containerRef.current, spec as never, {
          mode: "vega-lite",
          actions: false,
          renderer: "svg",
          tooltip: true,
        });

        if (!disposed) {
          setRenderError(null);
          view = result?.view;
        }
      } catch (error) {
        if (!disposed) {
          setRenderError(error instanceof Error ? error.message : "Failed to render chart");
        }
      }
    };

    render();

    return () => {
      disposed = true;
      view?.finalize();
    };
  }, [spec, specText]);

  return (
    <div className="mt-3 w-full min-w-0 rounded-2xl border border-[color:var(--border)] bg-white p-3">
      {renderError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Could not render chart: {renderError}
        </div>
      ) : (
        <div
          ref={containerRef}
          className="max-h-[420px] min-h-[220px] w-full min-w-0 overflow-x-hidden overflow-y-auto [&_.vega-embed]:w-full [&_.vega-embed>svg]:block [&_.vega-embed>svg]:max-w-full"
        />
      )}
    </div>
  );
}
