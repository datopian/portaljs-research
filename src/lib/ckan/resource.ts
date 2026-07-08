import type { Resource } from "@/schemas/ckan";
import { CkanResponse } from "@portaljs/ckan-api-client-js";
import { getDmsActionUrl } from "../dms";
import { ISR_REVALIDATE_SECONDS } from "../isr";
import { fetchJsonRetry } from "../utils";

const DMS = process.env.NEXT_PUBLIC_DMS;

type ResourceSearchResponse = {
  count: number;
  results: Resource[];
};

export type CkanResourceRequestOptions = {
  actionUrl?: string;
  apiKey?: string;
  revalidate?: number;
};

function ckanHeaders(apiKey?: string): Record<string, string> {
  return apiKey ? { Authorization: apiKey } : {};
}

export async function searchResources(query: string) {
  if (!query) return [];

  try {
    const res = await fetchJsonRetry<CkanResponse<ResourceSearchResponse>>({
      url: `${DMS}/api/3/action/resource_search?query=${encodeURIComponent(query)}`,
      retries: 3,
      opts: { next: { revalidate: ISR_REVALIDATE_SECONDS } },
    });

    return res.result.results ?? [];
  } catch (error) {
    console.error("Failed to search resources:", error);
    return [];
  }
}

export async function getResourceByName(name: string) {
  const resources = await searchResources(`name:${name}`);
  return resources.find((resource) => resource.name === name) ?? null;
}

export async function getResourceMetadata(
  resourceId: string,
  options: CkanResourceRequestOptions = {},
) {
  const actionUrl = options.actionUrl ?? getDmsActionUrl();
  const revalidate = options.revalidate ?? ISR_REVALIDATE_SECONDS;

  const res = await fetchJsonRetry<CkanResponse<Resource>>({
    url: `${actionUrl}/resource_show?id=${encodeURIComponent(resourceId)}`,
    retries: 3,
    opts: {
      headers: ckanHeaders(options.apiKey),
      next: { revalidate },
    },
  });

  return res.result;
}
