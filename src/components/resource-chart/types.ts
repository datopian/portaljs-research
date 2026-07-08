export type ResourceChartRow = Record<string, string | number | null | undefined>;

export type ResourceChartType = "line" | "bar-v" | "bar-h";

export type ResourceChartAggregation = "sum" | "avg" | "count" | "min" | "max";

export type ResourceChartGroupBy = "none" | "day" | "month" | "year";

export type ResourceChartSort = "x-asc" | "x-desc" | "y-asc" | "y-desc";

export type ResourceChartConfig = {
  type: ResourceChartType;
  x: string;
  y?: string;
  filters?: Record<string, string | number | boolean>;
  aggregation?: ResourceChartAggregation;
  groupBy?: ResourceChartGroupBy;
  sort?: ResourceChartSort;
  limit?: number;
  xLabel?: string;
  yLabel?: string;
  height?: number;
};

export type PreparedResourceChartData =
  | { type: "line"; points: { date: string; value: number }[] }
  | { type: "bar-v" | "bar-h"; items: { label: string; value: number }[] };

export type ResourceChartState =
  | { status: "ready"; chart: PreparedResourceChartData }
  | { status: "empty"; message: string };
