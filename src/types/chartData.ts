export type PlotModule = typeof import("@observablehq/plot") & {
  width?: number;
  document?: Document;
};
