import { Dataset } from "@/schemas/ckan";

export type ApiAccessStyle = "curl" | "python" | "r" | "javascript";

function getApiBaseUrl(apiBaseUrl: string) {
  return String(apiBaseUrl || "").replace(/\/+$/, "");
}

function getDatasetIdentifier(dataset: Dataset) {
  return dataset?.id || dataset?.name || "";
}

function getOutputFileName(dataset: Dataset, resourceUrl: string) {
  const fileNameFromUrl = String(resourceUrl || "")
    .split("/")
    .filter(Boolean)
    .pop();

  if (fileNameFromUrl) {
    try {
      return decodeURIComponent(fileNameFromUrl);
    } catch {
      return fileNameFromUrl;
    }
  }

  return `${dataset?.name || "dataset"}.data`;
}

export function formatDatasetApiSnippet(
  dataset: Dataset,
  {
    style = "curl",
    apiBaseUrl,
  }: {
    style?: ApiAccessStyle;
    apiBaseUrl: string;
  },
) {
  const datasetIdentifier = getDatasetIdentifier(dataset);
  const packageShowUrl = `${getApiBaseUrl(apiBaseUrl)}/api/3/action/package_show?id=${datasetIdentifier}`;

  if (style === "python") {
    return `import requests

response = requests.get("${packageShowUrl}")
response.raise_for_status()
dataset = response.json()["result"]`;
  }

  if (style === "r") {
    return `library(httr2)
library(jsonlite)

response <- request("${packageShowUrl}") |> req_perform()
dataset <- resp_body_json(response)$result`;
  }

  if (style === "javascript") {
    return `const response = await fetch("${packageShowUrl}");
if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
const dataset = (await response.json()).result;`;
  }

  return `curl.exe -L "${packageShowUrl}"`;
}

export function formatResourceAccessSnippet(
  dataset: Dataset,
  {
    style = "curl",
    stableUrl,
    resourceUrl,
  }: {
    style?: ApiAccessStyle;
    stableUrl?: string;
    resourceUrl?: string;
  } = {},
) {
  const accessUrl = resourceUrl || stableUrl || "";
  const outputFileName = getOutputFileName(dataset, accessUrl);

  if (style === "python") {
    return `import pandas as pd

df = pd.read_csv("${accessUrl}")
df.head()`;
  }

  if (style === "r") {
    return `library(readr)

df <- read_csv("${accessUrl}")
head(df)`;
  }

  if (style === "javascript") {
    return `const response = await fetch("${accessUrl}");
if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
const text = await response.text();`;
  }

  if (!resourceUrl) {
    return `curl.exe -L "${accessUrl}"`;
  }

  return `curl.exe -L "${accessUrl}" -o "${outputFileName}"`;
}
