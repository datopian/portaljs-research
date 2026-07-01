// Pre-calculated Queryless answers used to simulate an AI response for the
// home-page suggested-question chips. Clicking one of these chips opens the
// assistant, shows the "Thinking..." indicator for a moment, and then renders
// the matching canned answer below — no real API request is made.
//
// The map is keyed by the exact prompt text shown on the chip, so
// QUERYLESS_SUGGESTED_PROMPTS is the single source of truth: the home page
// renders these strings as chips and the assistant looks the answer up by the
// same string.

const TEMPERATURE_ANSWER = `Global surface temperatures have warmed markedly since 1980. Compared with the 20th-century average, the annual temperature anomaly has risen from roughly **+0.3 °C** in 1980 to about **+1.2 °C** in 2023 — a gain of nearly a full degree in just over four decades, with the steepest warming after 2000.

\`\`\`chart
{
  "title": "Global temperature anomaly since 1980",
  "mark": {"type": "line", "point": true, "color": "#e11d48"},
  "data": {
    "values": [
      {"year": 1980, "anomaly": 0.28},
      {"year": 1985, "anomaly": 0.14},
      {"year": 1990, "anomaly": 0.45},
      {"year": 1995, "anomaly": 0.46},
      {"year": 2000, "anomaly": 0.42},
      {"year": 2005, "anomaly": 0.69},
      {"year": 2010, "anomaly": 0.72},
      {"year": 2015, "anomaly": 0.90},
      {"year": 2020, "anomaly": 1.02},
      {"year": 2023, "anomaly": 1.17}
    ]
  },
  "encoding": {
    "x": {"field": "year", "type": "quantitative", "title": "Year", "axis": {"format": "d"}},
    "y": {"field": "anomaly", "type": "quantitative", "title": "Temp anomaly (°C)"}
  }
}
\`\`\`

The warming is not steady year to year, but the long-term trend is unmistakable and accelerating.

[[QUERYLESS_METHOD]]
Values are global land–ocean temperature anomalies relative to the 1901–2000 mean, sampled at five-year intervals (plus the latest year). Figures are illustrative of the widely reported GISTEMP/HadCRUT records.
[[/QUERYLESS_METHOD]]`;

const CO2_ANSWER = `Atmospheric CO₂ has risen steadily since 2000. Measured at Mauna Loa, the annual mean climbed from about **369 ppm** in 2000 to roughly **421 ppm** in 2023 — an increase of more than **50 ppm** (about 14%) in a little over two decades, with the yearly rise itself getting faster.

\`\`\`chart
{
  "title": "Atmospheric CO₂ concentration since 2000 (ppm)",
  "mark": {"type": "line", "point": true, "color": "#0f766e"},
  "data": {
    "values": [
      {"year": 2000, "ppm": 369.5},
      {"year": 2003, "ppm": 375.8},
      {"year": 2006, "ppm": 381.9},
      {"year": 2009, "ppm": 387.4},
      {"year": 2012, "ppm": 393.8},
      {"year": 2015, "ppm": 400.8},
      {"year": 2018, "ppm": 408.5},
      {"year": 2021, "ppm": 416.4},
      {"year": 2023, "ppm": 421.1}
    ]
  },
  "encoding": {
    "x": {"field": "year", "type": "quantitative", "title": "Year", "axis": {"format": "d"}},
    "y": {"field": "ppm", "type": "quantitative", "title": "CO₂ (ppm)", "scale": {"zero": false}}
  }
}
\`\`\`

The trend line is remarkably smooth — annual growth has averaged around 2 ppm per year and shows no sign of slowing.

[[QUERYLESS_METHOD]]
Values are annual mean atmospheric CO₂ concentrations in parts per million, in the style of the NOAA Mauna Loa (Keeling Curve) record, sampled at three-year intervals plus the latest year. Figures are illustrative.
[[/QUERYLESS_METHOD]]`;

const PHARMA_ANSWER = `Pharmaceutical spending per capita is highest in the United States by a wide margin, followed by other high-income economies. On a per-person basis, the **United States** spends roughly **$1,430 per year** on pharmaceuticals — well ahead of Switzerland, Germany and Japan.

\`\`\`chart
{
  "title": "Pharmaceutical spending per capita (USD/year)",
  "mark": {"type": "bar", "color": "#4f46e5"},
  "data": {
    "values": [
      {"country": "United States", "spend": 1432},
      {"country": "Switzerland", "spend": 963},
      {"country": "Germany", "spend": 884},
      {"country": "Japan", "spend": 817},
      {"country": "Canada", "spend": 790},
      {"country": "France", "spend": 646},
      {"country": "Italy", "spend": 592},
      {"country": "United Kingdom", "spend": 497}
    ]
  },
  "encoding": {
    "y": {"field": "country", "type": "nominal", "title": null, "sort": "-x"},
    "x": {"field": "spend", "type": "quantitative", "title": "USD per capita"}
  }
}
\`\`\`

The gap between the US and the next-highest spenders is striking — reflecting both higher drug prices and higher utilisation.

[[QUERYLESS_METHOD]]
Values are illustrative annual pharmaceutical expenditure per capita in US dollars, in the style of OECD Health Statistics. Countries are sorted from highest to lowest spend.
[[/QUERYLESS_METHOD]]`;

export const QUERYLESS_CANNED_RESPONSES: Record<string, string> = {
  "How has global temperature changed since 1980?": TEMPERATURE_ANSWER,
  "Compare atmospheric CO2 trends since 2000": CO2_ANSWER,
  "Which countries spend most on pharmaceuticals?": PHARMA_ANSWER,
};

// Order matters: this is the exact list rendered as home-page chips.
export const QUERYLESS_SUGGESTED_PROMPTS = Object.keys(QUERYLESS_CANNED_RESPONSES);

export function getCannedResponse(prompt: string): string | null {
  return QUERYLESS_CANNED_RESPONSES[prompt.trim()] ?? null;
}
