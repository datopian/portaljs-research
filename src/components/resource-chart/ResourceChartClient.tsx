"use client";

import * as Plot from "@observablehq/plot";
import { useRef } from "react";
import { formatCompactNumber } from "@/lib/charts/format";
import { usePlot } from "@/lib/charts/usePlot";
import type { PreparedResourceChartData, ResourceChartConfig } from "./types";

type Props = {
  chart: PreparedResourceChartData;
  config: ResourceChartConfig;
  title?: string;
  description?: string;
  meta?: string;
};

const ACCENT = "var(--brand-accent)";
const LABEL = "hsl(var(--muted-foreground))";
const GRID = "rgba(15,23,42,0.08)";
const FONT = "Inter, system-ui, sans-serif";

const TIP_STYLE = {
  fill: "#0f172a",
  stroke: "none",
  fillOpacity: 0.92,
  fontSize: 11,
  fontFamily: FONT,
  textPadding: 10,
  lineHeight: 1.5,
} as const;

function applyStyles(plot: SVGSVGElement | HTMLElement) {
  plot.querySelectorAll("text").forEach((el) => el.setAttribute("fill", LABEL));
  const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
  style.textContent = 'g[aria-label="tip"] text { fill: #f8fafc !important; }';
  plot.appendChild(style);
}

function LineChart({ chart, config }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  usePlot(ref, (width, height) => {
    const rawData =
      chart.type === "line"
        ? chart.points.map((point) => ({ label: point.date, value: point.value }))
        : [];
    const dateLike = rawData.every((point) => !Number.isNaN(new Date(point.label).getTime()));
    const data = rawData.map((point) => ({
      ...point,
      x: dateLike ? new Date(point.label) : point.label,
    }));

    return Plot.plot({
      width,
      height,
      marginLeft: 64,
      marginRight: 20,
      marginTop: 20,
      marginBottom: 40,
      style: { background: "transparent", fontSize: "10px", fontFamily: FONT, overflow: "visible" },
      x: { label: config.xLabel ?? null, tickSize: 0 },
      y: { label: config.yLabel ?? null, tickSize: 0, ticks: 5, tickFormat: formatCompactNumber, grid: true },
      marks: [
        Plot.areaY(data, { x: "x", y: "value", fill: ACCENT, fillOpacity: 0.08 }),
        Plot.lineY(data, { x: "x", y: "value", stroke: ACCENT, strokeWidth: 2 }),
        Plot.ruleX(data, Plot.pointerX({ x: "x", stroke: ACCENT, strokeOpacity: 0.4, strokeWidth: 1.5 })),
        Plot.tip(
          data.map((d) => ({ Label: d.x, Value: d.value })),
          Plot.pointerX({
            x: "Label",
            y: "Value",
            ...TIP_STYLE,
            format: {
              x: (value: Date | string) =>
                value instanceof Date
                  ? value.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                  : value,
              y: (value: number) => formatCompactNumber(value),
            },
          }),
        ),
      ],
    });
  }, applyStyles);

  return <div ref={ref} style={{ width: "100%", height: "100%" }} />;
}

function BarChart({ chart, config }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const items = chart.type === "bar-h" || chart.type === "bar-v" ? chart.items : [];
  const horizontal = chart.type === "bar-h";
  const minHeight = horizontal ? Math.min(720, Math.max(280, 82 + items.length * 30)) : 320;

  usePlot(ref, (width, height) => {
    const compact = width < 420;
    const plotHeight = horizontal ? Math.max(height, minHeight) : height;
    return Plot.plot({
      width,
      height: plotHeight,
      marginLeft: horizontal ? (compact ? 104 : width < 640 ? 140 : 220) : 64,
      marginRight: horizontal ? (compact ? 36 : 72) : 20,
      marginTop: horizontal ? 10 : 16,
      marginBottom: horizontal ? (compact ? 24 : 42) : items.length > 20 ? 60 : 46,
      style: { background: "transparent", fontSize: horizontal ? (compact ? "10px" : "11px") : "10px", fontFamily: FONT, overflow: "visible" },
      x: horizontal
        ? { label: compact ? null : config.xLabel ?? null, tickSize: 0, ticks: compact ? 3 : 5, tickFormat: formatCompactNumber }
        : { type: "band", label: config.xLabel ?? null, tickSize: 0, tickRotate: items.length > 20 ? -45 : 0 },
      y: horizontal
        ? { label: compact ? null : config.yLabel ?? null, tickSize: 0, tickFormat: (value: string) => (value.length > (compact ? 14 : 28) ? `${value.slice(0, compact ? 14 : 28)}...` : value) }
        : { label: config.yLabel ?? null, tickSize: 0, ticks: 5, tickFormat: formatCompactNumber, grid: true },
      marks: horizontal
        ? [
            Plot.gridX({ stroke: GRID, strokeWidth: 1 }),
            Plot.barX(items, { x: "value", y: "label", fill: ACCENT, fillOpacity: 0.9, rx: 3 }),
            Plot.text(items, {
              x: "value",
              y: "label",
              text: (d: { value: number }) => formatCompactNumber(d.value),
              dx: compact ? 5 : 8,
              textAnchor: "start",
              fill: LABEL,
              fontSize: compact ? 9 : 10,
            }),
            Plot.tip(
              items.map((d) => ({ Label: d.label, Value: d.value })),
              Plot.pointerY({
                x: "Value",
                y: "Label",
                ...TIP_STYLE,
                format: { x: (value: number) => formatCompactNumber(value), y: (value: string) => value },
              }),
            ),
          ]
        : [
            Plot.barY(items, { x: "label", y: "value", fill: ACCENT, fillOpacity: 0.9, rx: 2 }),
            Plot.ruleY([0], { stroke: GRID }),
            Plot.tip(
              items.map((d) => ({ Label: d.label, Value: d.value })),
              Plot.pointerX({
                x: "Label",
                y: "Value",
                ...TIP_STYLE,
                format: { x: (value: string) => value, y: (value: number) => formatCompactNumber(value) },
              }),
            ),
          ],
    });
  }, applyStyles);

  return (
    <div className={horizontal ? "h-full overflow-hidden" : "h-full"}>
      <div ref={ref} style={{ width: "100%", height: "100%", minHeight }} />
    </div>
  );
}

export function ResourceChartClient(props: Props) {
  const height = props.config.height ?? 420;
  const chart = props.chart.type === "line" ? <LineChart {...props} /> : <BarChart {...props} />;

  return (
    <div className="min-w-0">
      {(props.title || props.description || props.meta) && (
        <div className="mb-4 space-y-1.5">
          {props.title && (
            <h2 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
              {props.title}
            </h2>
          )}
          {props.description && (
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              {props.description}
            </p>
          )}
          {props.meta && (
            <p className="text-xs font-medium text-muted-foreground/80">
              {props.meta}
            </p>
          )}
        </div>
      )}
      <div style={{ height }} className="min-w-0">
        {chart}
      </div>
    </div>
  );
}
