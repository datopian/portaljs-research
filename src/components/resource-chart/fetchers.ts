import { parseCsvRows } from "@/lib/csv";
import { getDmsActionUrl } from "@/lib/dms";
import { getResourceMetadata } from "@/lib/ckan/resource";
import type { ResourceChartRow } from "./types";

export type CkanResourceFetcherOptions = {
  baseUrl?: string;
  apiKey?: string;
  revalidate?: number;
};

export function createCkanResourceFetcher(options: CkanResourceFetcherOptions = {}) {
  const baseUrl = options.baseUrl ?? getDmsActionUrl();
  const apiKey = options.apiKey ?? process.env.PORTALJS_API_KEY;
  const revalidate = options.revalidate ?? 3600;

  return async function fetchResourceRows(resourceId: string): Promise<ResourceChartRow[]> {
    const resource = await getResourceMetadata(resourceId, {
      actionUrl: baseUrl,
      apiKey,
      revalidate,
    });

    if (!resource.url) {
      throw new Error(`CKAN resource ${resourceId} is unavailable.`);
    }

    const csvResponse = await fetch(resource.url, { next: { revalidate } });
    if (!csvResponse.ok) {
      throw new Error(`Failed to load CSV for CKAN resource ${resourceId}.`);
    }

    return parseCsvRows<ResourceChartRow>(await csvResponse.text());
  };
}

export const fetchCkanResourceRows = createCkanResourceFetcher();
