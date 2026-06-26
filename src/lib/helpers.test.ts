import assert from "node:assert/strict";
import test from "node:test";

import { formatDatasetApiSnippet, formatResourceAccessSnippet } from "./api-access.ts";
import { formatDatasetCitation, getCitationAuthor, getCitationYear } from "./citation.ts";
import { getBrowserOrigin, getDatasetStablePath, getDatasetStableUrl } from "./dataset-links.ts";
import { generateMockDoi } from "./doi.ts";

const dataset = {
  id: "dataset-stable-id",
  name: "dataset-slug",
  title: "Global CO2 Emissions",
  author: "Data Team",
  metadata_modified: "2024-02-03T10:30:00.000Z",
  organization: {
    name: "south-asia-water-foundation",
    title: "South Asia Water Foundation",
  },
} as const;

test("generateMockDoi is deterministic and namespaced", () => {
  const first = generateMockDoi("great-decoupling");
  const second = generateMockDoi("great-decoupling");
  const third = generateMockDoi("another-dataset");

  assert.equal(first, second);
  assert.match(first, /^10\.5281\/portaljs\.2026\.[0-9a-f]{8}$/);
  assert.notEqual(first, third);
});

test("getCitationAuthor prefers explicit author and falls back to organization then site name", () => {
  assert.equal(getCitationAuthor(dataset), "Data Team");
  assert.equal(
    getCitationAuthor({
      ...dataset,
      author: "",
      organization: { ...dataset.organization, title: "Org Title" },
    }),
    "Org Title",
  );
  assert.equal(
    getCitationAuthor({
      ...dataset,
      author: "",
      organization: { ...dataset.organization, title: "" },
    }),
    "south-asia-water-foundation",
  );
  assert.equal(
    getCitationAuthor({
      ...dataset,
      author: "",
      organization: undefined,
    }),
    "Research Portal",
  );
});

test("getCitationYear uses metadata_modified and falls back to current UTC year", () => {
  assert.equal(getCitationYear(dataset), "2024");
  assert.equal(
    getCitationYear({
      ...dataset,
      metadata_modified: "not-a-date",
    }),
    String(new Date().getUTCFullYear()),
  );
});

test("formatDatasetCitation builds APA output with DOI URL", () => {
  const citation = formatDatasetCitation(dataset, {
    style: "apa",
    stableUrl: "https://research.example/@south-asia-water-foundation/dataset-stable-id",
    doi: "10.5281/portaljs.2026.1234abcd",
    publisher: "Research Portal",
  });

  assert.equal(
    citation,
    "Data Team. (2024). Global CO2 Emissions [Data set]. Research Portal. https://doi.org/10.5281/portaljs.2026.1234abcd",
  );
});

test("formatDatasetCitation builds BibTeX output with stable URL and DOI", () => {
  const citation = formatDatasetCitation(dataset, {
    style: "bibtex",
    stableUrl: "https://research.example/@south-asia-water-foundation/dataset-stable-id",
    doi: "10.5281/portaljs.2026.1234abcd",
    publisher: "Research Portal",
  });

  assert.match(citation, /@misc\{dataset-slug,/);
  assert.match(citation, /author    = \{Data Team\}/);
  assert.match(citation, /title     = \{Global CO2 Emissions\}/);
  assert.match(citation, /doi       = \{10\.5281\/portaljs\.2026\.1234abcd\}/);
  assert.match(
    citation,
    /url       = \{https:\/\/research\.example\/@south-asia-water-foundation\/dataset-stable-id\}/,
  );
});

test("getDatasetStablePath and URL use dataset.id rather than dataset.name", () => {
  assert.equal(
    getDatasetStablePath(dataset),
    "/@south-asia-water-foundation/dataset-stable-id",
  );
  assert.equal(getDatasetStablePath({ id: "", organization: dataset.organization }), "/");
  assert.equal(
    getDatasetStableUrl(dataset, "https://research.example/"),
    "https://research.example/@south-asia-water-foundation/dataset-stable-id",
  );
});

test("getBrowserOrigin prefers browser origin and trims trailing slashes", () => {
  assert.equal(
    getBrowserOrigin({ location: { origin: "https://portal.example///" } }, "https://fallback.example/"),
    "https://portal.example",
  );
  assert.equal(getBrowserOrigin(undefined, "https://fallback.example///"), "https://fallback.example");
});

test("formatDatasetApiSnippet uses dataset.id and trims api base URL", () => {
  const curlSnippet = formatDatasetApiSnippet(dataset, {
    style: "curl",
    apiBaseUrl: "https://ckan.example///",
  });

  assert.equal(
    curlSnippet,
    'curl -L "https://ckan.example/api/3/action/package_show?id=dataset-stable-id"',
  );

  const jsSnippet = formatDatasetApiSnippet(dataset, {
    style: "javascript",
    apiBaseUrl: "https://ckan.example/",
  });

  assert.match(jsSnippet, /package_show\?id=dataset-stable-id/);
  assert.match(jsSnippet, /await fetch/);
});

test("formatResourceAccessSnippet outputs file downloads when resource URL is present", () => {
  const snippet = formatResourceAccessSnippet(dataset, {
    style: "curl",
    stableUrl: "https://research.example/@south-asia-water-foundation/dataset-stable-id",
    resourceUrl: "https://files.example/data/global-co2-emissions.csv",
  });

  assert.equal(
    snippet,
    'curl -L "https://files.example/data/global-co2-emissions.csv" -o "global-co2-emissions.csv"',
  );
});

test("formatResourceAccessSnippet falls back to stable URL when no resource URL is present", () => {
  const snippet = formatResourceAccessSnippet(dataset, {
    style: "python",
    stableUrl: "https://research.example/@south-asia-water-foundation/dataset-stable-id",
  });

  assert.equal(
    snippet,
    'import pandas as pd\n\ndf = pd.read_csv("https://research.example/@south-asia-water-foundation/dataset-stable-id")\ndf.head()',
  );
});
