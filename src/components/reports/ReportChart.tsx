"use client";

import Chart from "@/components/reports/Chart";
import * as greatDecouplingCovers from "../../../content/reports/great-decoupling.cover";
import * as biologyCovers from "../../../content/reports/biology-got-cheap-medicine-didnt.cover";

type ReportChartConfig = {
  csvUrl: string;
  spec: (typeof greatDecouplingCovers)["coverSpec"];
};

const REPORT_CHARTS: Record<string, Record<string, ReportChartConfig>> = {
  "great-decoupling": {
    cover: {
      csvUrl: greatDecouplingCovers.coverCsvUrl,
      spec: greatDecouplingCovers.coverSpec,
    },
    temperature: {
      csvUrl: greatDecouplingCovers.temperatureCsvUrl,
      spec: greatDecouplingCovers.temperatureSpec,
    },
    emitters: {
      csvUrl: greatDecouplingCovers.emittersCsvUrl,
      spec: greatDecouplingCovers.emittersSpec,
    },
  },
  "biology-got-cheap-medicine-didnt": {
    cover: {
      csvUrl: biologyCovers.coverCsvUrl,
      spec: biologyCovers.coverSpec,
    },
    pharma: {
      csvUrl: biologyCovers.pharmaCsvUrl,
      spec: biologyCovers.pharmaSpec,
    },
  },
};

export default function ReportChart({
  reportSlug,
  chartId,
  title,
}: {
  reportSlug: string;
  chartId: string;
  title?: string;
}) {
  const chart = REPORT_CHARTS[reportSlug]?.[chartId];

  if (!chart) {
    return null;
  }

  return <Chart title={title} csvUrl={chart.csvUrl} spec={chart.spec} />;
}
