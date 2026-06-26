function isEnabledFlag(value: string | undefined) {
  if (!value) return false;

  switch (value.trim().toLowerCase()) {
    case "1":
    case "true":
    case "yes":
    case "on":
      return true;
    default:
      return false;
  }
}

const requiredQuerylessVars = [
  process.env.QUERYLESS_URL,
  process.env.QUERYLESS_TOKEN,
  process.env.QUERYLESS_MODEL,
];

const publicQuerylessEnabled = isEnabledFlag(
  process.env.NEXT_PUBLIC_QUERYLESS_ENABLED,
);

export const querylessConfig = {
  apiRoute: process.env.NEXT_PUBLIC_QUERYLESS_API_ROUTE || "/api/queryless-chat",
  enabled: publicQuerylessEnabled,
  serverReady: requiredQuerylessVars.every((value) => Boolean(value?.trim())),
} as const;

export const QUERYLESS_OPEN_EVENT = "queryless:open";

export function isQuerylessEnabled() {
  return querylessConfig.enabled;
}

export function isQuerylessServerReady() {
  return querylessConfig.serverReady;
}
