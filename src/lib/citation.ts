import { Dataset } from "@/schemas/ckan";

export type CitationStyle = "apa" | "bibtex";

export function getCitationAuthor(dataset: Dataset) {
  return (
    dataset?.author ||
    dataset?.organization?.title ||
    dataset?.organization?.name ||
    "Research Portal"
  );
}

export function getCitationTitle(dataset: Dataset) {
  return dataset?.title || dataset?.name || "Untitled dataset";
}

export function getCitationYear(dataset: Dataset) {
  const rawDate = dataset?.metadata_modified;
  const parsedDate = rawDate ? new Date(rawDate) : null;

  if (parsedDate && !Number.isNaN(parsedDate.getTime())) {
    return String(parsedDate.getUTCFullYear());
  }

  return String(new Date().getUTCFullYear());
}

export function formatDatasetCitation(
  dataset: Dataset,
  {
    style = "apa",
    stableUrl,
    doi,
    publisher = "Research Portal",
  }: {
    style?: CitationStyle;
    stableUrl?: string;
    doi?: string;
    publisher?: string;
  } = {},
) {
  const author = getCitationAuthor(dataset);
  const title = getCitationTitle(dataset);
  const year = getCitationYear(dataset);
  const doiUrl = doi ? `https://doi.org/${doi}` : stableUrl || "";

  if (style === "bibtex") {
    return `@misc{${dataset?.name || "dataset"},
  author    = {${author}},
  title     = {${title}},
  year      = {${year}},
  publisher = {${publisher}},
  doi       = {${doi || ""}},
  url       = {${stableUrl || ""}},
  note      = {Data set}
}`;
  }

  return `${author}. (${year}). ${title} [Data set]. ${publisher}. ${doiUrl}`;
}
