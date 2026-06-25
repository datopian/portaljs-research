const requiredQuerylessVars = [
  process.env.QUERYLESS_URL,
  process.env.QUERYLESS_TOKEN,
  process.env.QUERYLESS_MODEL,
];

export const querylessConfig = {
  apiRoute: process.env.NEXT_PUBLIC_QUERYLESS_API_ROUTE || "/api/queryless-chat",
  enabled: requiredQuerylessVars.every((value) => Boolean(value?.trim())),
} as const;

export const QUERYLESS_OPEN_EVENT = "queryless:open";

export function isQuerylessEnabled() {
  return querylessConfig.enabled;
}
