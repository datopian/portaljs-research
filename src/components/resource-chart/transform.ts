import type {
  PreparedResourceChartData,
  ResourceChartAggregation,
  ResourceChartConfig,
  ResourceChartRow,
  ResourceChartSort,
  ResourceChartState,
} from "./types";

type Accumulator = {
  label: string;
  values: number[];
  count: number;
};

function toNumber(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string") return null;
  const normalized = value.replace(/[$,%\s,]/g, "");
  if (!normalized || normalized.toLowerCase() === "none") return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function rowMatchesFilters(
  row: ResourceChartRow,
  filters: ResourceChartConfig["filters"],
): boolean {
  if (!filters) return true;

  return Object.entries(filters).every(([column, expected]) => {
    const actual = row[column];
    if (actual == null) return false;
    return String(actual).trim().toLowerCase() === String(expected).trim().toLowerCase();
  });
}

function bucketValue(value: unknown, groupBy: ResourceChartConfig["groupBy"]): string {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  if (!groupBy || groupBy === "none") return raw;

  const dateOnly = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (dateOnly) {
    const [, year, month, day] = dateOnly;
    if (groupBy === "year") return year;
    if (groupBy === "month") return `${year}-${month}`;
    return `${year}-${month}-${day}`;
  }

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  if (groupBy === "year") return String(year);
  if (groupBy === "month") return `${year}-${month}`;
  return `${year}-${month}-${day}`;
}

function aggregate(acc: Accumulator, aggregation: ResourceChartAggregation): number {
  if (aggregation === "count") return acc.count;
  if (acc.values.length === 0) return 0;
  if (aggregation === "avg") {
    return acc.values.reduce((sum, value) => sum + value, 0) / acc.values.length;
  }
  if (aggregation === "min") return Math.min(...acc.values);
  if (aggregation === "max") return Math.max(...acc.values);
  return acc.values.reduce((sum, value) => sum + value, 0);
}

function compareLabels(a: string, b: string): number {
  const aDate = new Date(a).getTime();
  const bDate = new Date(b).getTime();
  if (!Number.isNaN(aDate) && !Number.isNaN(bDate)) return aDate - bDate;
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

function sortPoints<T extends { label: string; value: number }>(
  points: T[],
  sort: ResourceChartSort | undefined,
  chartType: ResourceChartConfig["type"],
): T[] {
  const resolvedSort = sort ?? (chartType === "line" ? "x-asc" : "y-desc");
  return [...points].sort((a, b) => {
    if (resolvedSort === "x-asc") return compareLabels(a.label, b.label);
    if (resolvedSort === "x-desc") return compareLabels(b.label, a.label);
    if (resolvedSort === "y-asc") {
      return a.value - b.value || compareLabels(a.label, b.label);
    }
    return b.value - a.value || compareLabels(a.label, b.label);
  });
}

function limitPoints<T>(points: T[], limit: number | undefined, preserveRange: boolean): T[] {
  if (!limit || limit <= 0 || points.length <= limit) return points;
  if (!preserveRange) return points.slice(0, limit);

  const step = (points.length - 1) / (limit - 1);
  const sampled = Array.from({ length: limit }, (_, index) => points[Math.round(index * step)]);
  return sampled.filter((point, index) => point && sampled.indexOf(point) === index);
}

export function buildResourceChartState(
  rows: ResourceChartRow[],
  config: ResourceChartConfig,
): ResourceChartState {
  const aggregation = config.aggregation ?? "sum";
  if (!config.x) return { status: "empty", message: "Choose an x column to render this chart." };
  if (aggregation !== "count" && !config.y) {
    return { status: "empty", message: "Choose a y column or use count aggregation." };
  }

  const groups = new Map<string, Accumulator>();
  for (const row of rows) {
    if (!rowMatchesFilters(row, config.filters)) continue;

    const label = bucketValue(row[config.x], config.groupBy);
    if (!label) continue;

    const acc = groups.get(label) ?? { label, values: [], count: 0 };
    acc.count += 1;

    if (aggregation !== "count") {
      const value = toNumber(row[config.y as string]);
      if (value === null) {
        groups.set(label, acc);
        continue;
      }
      acc.values.push(value);
    }

    groups.set(label, acc);
  }

  const points = Array.from(groups.values())
    .map((acc) => ({ label: acc.label, value: aggregate(acc, aggregation) }))
    .filter((point) => Number.isFinite(point.value));

  if (points.length === 0) {
    return { status: "empty", message: "No chartable values were found for this resource." };
  }

  const sorted = sortPoints(points, config.sort, config.type);
  const limited = limitPoints(sorted, config.limit, config.type === "line");

  const chart: PreparedResourceChartData =
    config.type === "line"
      ? { type: "line", points: limited.map((point) => ({ date: point.label, value: point.value })) }
      : { type: config.type, items: limited };

  return { status: "ready", chart };
}
