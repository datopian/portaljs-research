const CKAN_ACTION_PATH = "/api/3/action";

export function cleanEnvUrl(value: string | undefined): string {
  return (value ?? "").replace(/\\n/g, "").trim().replace(/\/+$/, "");
}

export function getDmsBaseUrl(): string {
  const dms = cleanEnvUrl(process.env.NEXT_PUBLIC_DMS);
  if (!dms) {
    throw new Error("Missing NEXT_PUBLIC_DMS environment variable.");
  }
  return dms;
}

export function getDmsActionUrl(): string {
  return `${getDmsBaseUrl()}${CKAN_ACTION_PATH}`;
}
