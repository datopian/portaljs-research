import { Dataset } from "@/schemas/ckan";

export function getDatasetStablePath(dataset: Pick<Dataset, "id" | "organization">) {
  const organizationName = dataset?.organization?.name;
  const datasetIdentifier = dataset?.id;

  if (!organizationName || !datasetIdentifier) {
    return "/";
  }

  return `/@${organizationName}/${datasetIdentifier}`;
}

export function getBrowserOrigin(
  windowLike?: { location?: { origin?: string } } | null,
  fallbackSiteUrl = "",
) {
  const browserOrigin = windowLike?.location?.origin;

  if (browserOrigin) {
    return String(browserOrigin).replace(/\/+$/, "");
  }

  return String(fallbackSiteUrl || "").replace(/\/+$/, "");
}

export function getDatasetStableUrl(
  dataset: Pick<Dataset, "id" | "organization">,
  siteUrl: string,
) {
  const baseUrl = getBrowserOrigin(undefined, siteUrl);
  const stablePath = getDatasetStablePath(dataset);

  return `${baseUrl}${stablePath}`;
}
