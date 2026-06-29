import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

export interface ReportMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  relatedDatasets: string[];
}

const REPORTS_DIR = path.join(process.cwd(), "content/reports");

function parseFrontmatter(raw: string): {
  data: Record<string, unknown>;
  content: string;
} {
  const normalized = raw.replace(/^\uFEFF/, "");

  if (!normalized.startsWith("---\n") && !normalized.startsWith("---\r\n")) {
    return { data: {}, content: raw };
  }

  const delimiterMatch = /\r?\n---\r?\n/.exec(normalized);

  if (!delimiterMatch?.index) {
    return { data: {}, content: raw };
  }

  const frontmatter = normalized.slice(4, delimiterMatch.index);
  const content = normalized.slice(delimiterMatch.index + delimiterMatch[0].length);
  const parsed = yaml.load(frontmatter);
  const data =
    parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};

  return { data: data as Record<string, unknown>, content };
}

function toString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function readReportFrontmatter(slug: string, raw: string): ReportMeta {
  const { data } = parseFrontmatter(raw);

  return {
    slug,
    title: toString(data.title),
    date: toString(data.date),
    description: toString(data.description),
    relatedDatasets: Array.isArray(data.relatedDatasets)
      ? data.relatedDatasets
          .filter((dataset): dataset is string => typeof dataset === "string")
      : [],
  };
}

export function getAllReports(): ReportMeta[] {
  if (!fs.existsSync(REPORTS_DIR)) {
    return [];
  }

  return fs
    .readdirSync(REPORTS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(REPORTS_DIR, filename), "utf8");

      return readReportFrontmatter(slug, raw);
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getReportSource(slug: string): {
  content: string;
  frontmatter: ReportMeta;
} {
  const filePath = path.join(REPORTS_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { content } = parseFrontmatter(raw);

  return {
    content,
    frontmatter: readReportFrontmatter(slug, raw),
  };
}
