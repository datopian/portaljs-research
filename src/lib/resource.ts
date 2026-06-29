import { Resource } from "@/schemas/ckan";

export const supportedPreviewFormats = [
  "csv",
  "json",
  "pdf",
  "geojson",
  //"xlsx",
  //"xls",
  //"kml",
  //"shp",
];

export const supportsPreview = (res: Resource) => {
  return (
    res.iframe ||
    supportedPreviewFormats.some(
      (format) => format.toLowerCase() === (res.format ?? "").toLowerCase()
    )
  );
};
