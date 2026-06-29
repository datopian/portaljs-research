import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export interface ReportMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  relatedDatasets: string[];
}

const REPORTS_DIR = path.join(process.cwd(), "content/reports");

function readReportFrontmatter(slug: string, raw: string): ReportMeta {
  const { data } = matter(raw);

  return {
    slug,
    title: data.title ?? "",
    date: data.date ?? "",
    description: data.description ?? "",
    relatedDatasets: Array.isArray(data.relatedDatasets)
      ? data.relatedDatasets
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
  const { content } = matter(raw);

  return {
    content,
    frontmatter: readReportFrontmatter(slug, raw),
  };
}
