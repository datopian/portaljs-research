import { Group } from "@/schemas/ckan";
import { CkanResponse } from "@portaljs/ckan-api-client-js";
import { fetchJsonRetry } from "../utils";
import { ISR_REVALIDATE_SECONDS } from "../isr";

const DMS = process.env.NEXT_PUBLIC_DMS;

export const getGroup = async ({
  name,
  include_datasets = false,
}: {
  name: string;
  include_datasets?: boolean;
}) => {
  try {
    const group = await fetchJsonRetry<CkanResponse<Group>>({
      url: `${DMS}/api/3/action/group_show?id=${name}&include_datasets=${include_datasets}`,
      opts: { next: { revalidate: ISR_REVALIDATE_SECONDS } },
    });
    return group.result;
  } catch (err) {
    console.error("Failed to fetch group:", err);
    return null;
  }
};

export const getAllGroups = async () => {
  try {
    const groups = await fetchJsonRetry<CkanResponse<Group[]>>({
      url: `${DMS}/api/3/action/group_list?all_fields=True`,
      opts: { next: { revalidate: ISR_REVALIDATE_SECONDS } },
    });

    return groups.result;
  } catch (err) {
    console.error("Failed to fetch groups:", err);
    return [];
  }
};
