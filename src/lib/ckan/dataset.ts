import {
  Dataset,
  PackageSearchOptions,
  PackageSearchResponse,
  SearchFacetResult,
} from "@/schemas/ckan";
import { CkanResponse } from "@portaljs/ckan-api-client-js";
import { fetchJsonRetry, fetchRetry, joinTermsWithOr } from "../utils";
import { ISR_REVALIDATE_SECONDS } from "../isr";
import { toPublicGroupSlug, toPublicOrgSlug, toSearchGroupName, toSearchOrgName } from "../portal-name";

const DMS = process.env.NEXT_PUBLIC_DMS;

export interface SearchDatasetsParams {
  options: PackageSearchOptions;
  owner_org?: string | null;
  facetFields?: string[];
}

const emptySearchResponse: PackageSearchResponse = {
  count: 0,
  facets: {
    groups: {},
    organization: {},
    res_format: {},
    tags: {},
  },
  results: [],
  sort: "",
  search_facets: {},
  datasets: [],
};

export async function searchDatasets({
  options,
  owner_org = null,
  facetFields = ["groups", "organization", "res_format", "tags"],
}: SearchDatasetsParams) {
  const baseAction = `package_search`;

  const _facetFields = (facetFields ?? []).map((f) => `"${f}"`).join(",");

  const queryParams: string[] = [];

  if (options?.query) {
    queryParams.push(`q=${options.query}`);
  }

  if (options?.offset) {
    queryParams.push(`start=${options.offset}`);
  }

  if (options?.limit || options?.limit == 0) {
    queryParams.push(`rows=${options.limit}`);
  }

  if (options?.sort) {
    queryParams.push(`sort=${options?.sort}`);
  }

  const fqList: string[] = [];

  if (options?.fq) {
    fqList.push(options.fq);
  }

  const fqListGroups: string[] = [];

  if (owner_org) {
    fqListGroups.push(`owner_org:${owner_org}`);
  } else if (options?.orgs?.length) {
    fqListGroups.push(
      `organization:(${joinTermsWithOr(options.orgs.map(toSearchOrgName))})`
    );
  }

  if (options?.groups?.length) {
    fqListGroups.push(
      `groups:(${joinTermsWithOr(options.groups.map(toSearchGroupName))})`
    );
  }

  if (options?.resFormat?.length) {
    fqListGroups.push(`res_format:(${joinTermsWithOr(options.resFormat)})`);
  }

  if (options?.tags?.length) {
    fqListGroups.push(`tags:(${joinTermsWithOr(options.tags)})`);
  }

  if (options?.type) {
    fqListGroups.push(`dataset_type:${options.type}`);
  }

  if (fqListGroups?.length) {
    fqList.push(`+(${fqListGroups.join(" AND ")})`);
  }

  if (fqList?.length) {
    queryParams.push(`fq=${fqList.join(" ")}`);
  }

  const action = `${baseAction}?${queryParams.join(
    "&"
  )}&facet.field=[${_facetFields}]&facet.limit=9999`;

  let res: CkanResponse<PackageSearchResponse>;

  try {
    res = await fetchJsonRetry<CkanResponse<PackageSearchResponse>>({
      url: `${DMS}/api/3/action/${action}`,
      retries: 3,
      opts: { next: { revalidate: ISR_REVALIDATE_SECONDS } },
    });
  } catch (error) {
    console.error("Failed to search datasets:", error);
    return emptySearchResponse;
  }

  const searchFacets = { ...(res.result.search_facets ?? {}) };

  if (searchFacets.groups?.items) {
    searchFacets.groups = {
      ...searchFacets.groups,
      items: searchFacets.groups.items.map((item) => ({
        ...item,
        name: toPublicGroupSlug(item.name),
      })),
    } satisfies SearchFacetResult;
  }

  if (searchFacets.organization?.items) {
    searchFacets.organization = {
      ...searchFacets.organization,
      items: searchFacets.organization.items.map((item) => ({
        ...item,
        name: toPublicOrgSlug(item.name),
      })),
    } satisfies SearchFacetResult;
  }

  return { ...res.result, search_facets: searchFacets, datasets: res.result.results };
}

export async function getDatasetDetails(datasetName: string) {
  const response = await fetchRetry(
    `${DMS}/api/3/action/package_show?id=${datasetName}`,
    1,
    {
      next: { revalidate: ISR_REVALIDATE_SECONDS },
    }
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch dataset: ${response.status} ${response.statusText}`
    );
  }
  const responseData = await response.json();
  if (responseData.success === false) {
    throw new Error("Could not find dataset");
  }
  const dataset: Dataset = responseData.result;
  return dataset;
}

export const getDataset = async ({ name }: { name: string }) => {
  const dataset = await getDatasetDetails(name);
  return dataset;
};

export const getGroupsFromFacets= async () => {
  const response = await searchDatasets({
    options: {
      limit: 0,
    },
    facetFields: ["groups"],
  });
  const groups  = response.search_facets?.groups?.items || [];
  return groups
};
