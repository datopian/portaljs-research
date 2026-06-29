import { useTranslations } from "next-intl";
import { Building2, Files, FolderKanban, Tags } from "lucide-react";
import FilterBadge from "./FilterBadge";
import { useSearchState } from "./SearchContext";
import { PackageFacetOptions, PackageSearchOptions } from "@/schemas/ckan";

export default function ActiveFilters({
  title,
  hide = [],
}: {
  title?: string;
  hide?: string[];
}) {
  const t = useTranslations();
  const {
    options,
    setOptions,
    result,
    hasFiltersApplied,
    defaultOrg,
    defaultGroup,
  } = useSearchState();

  const groups = options?.groups ?? [];
  const orgs = options?.orgs ?? [];
  const tags = options?.tags ?? [];
  const resFormat = options?.resFormat ?? [];

  const removeItemFromFilter = (
    filterType: keyof PackageSearchOptions,
    item: string
  ) => {
    if (Array.isArray(options?.[filterType])) {
      const updatedFilters = options[filterType]?.filter((i: string) => i !== item);
      setOptions({
        ...options,
        [filterType]: updatedFilters,
      });
    }
  };

  return (
    hasFiltersApplied && (
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {title && <div className="text-sm font-semibold text-foreground">{title}</div>}
          <button
            type="button"
            onClick={() => {
              setOptions({
                resFormat: [],
                groups: defaultGroup ? [defaultGroup] : [],
                ...(defaultOrg ? {} : { orgs: [] }),
                tags: [],
              });
            }}
            className="text-sm font-medium text-primary"
          >
            {t("Common.clearAll")}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {orgs.length > 0 && !hide.includes("orgs") && (
            <FilterBadge
              icon={<Building2 className="size-3.5" />}
              items={orgs}
              itemTitleRender={(item: string) =>
                result?.search_facets?.organization?.items.find(
                  (i: PackageFacetOptions) => i.name === item
                )?.display_name ?? item
              }
              onItemClick={(item) => {
                removeItemFromFilter("orgs", item);
              }}
              description={t("Common.organization")}
            />
          )}

          {groups.length > 0 && !hide.includes("groups") && (
            <FilterBadge
              icon={<FolderKanban className="size-3.5" />}
              description={t("Common.groups")}
              items={groups}
              itemTitleRender={(item: string) =>
                result?.search_facets?.groups?.items.find(
                  (i: PackageFacetOptions) => i.name === item
                )?.display_name ?? item
              }
              onItemClick={(item) => {
                removeItemFromFilter("groups", item);
              }}
            />
          )}

          {resFormat.length > 0 && (
            <FilterBadge
              icon={<Files className="size-3.5" />}
              description={t("Common.formats")}
              items={resFormat}
              itemTitleRender={(item: string) =>
                result?.search_facets?.res_format?.items.find(
                  (i: PackageFacetOptions) => i.name === item
                )?.display_name ?? item
              }
              onItemClick={(item) => {
                removeItemFromFilter("resFormat", item);
              }}
            />
          )}

          {tags.length > 0 && (
            <FilterBadge
              icon={<Tags className="size-3.5" />}
              description={t("Common.tags")}
              items={tags}
              itemTitleRender={(item: string) =>
                result?.search_facets?.tags?.items.find(
                  (i: PackageFacetOptions) => i.name === item
                )?.display_name ?? item
              }
              onItemClick={(item) => {
                removeItemFromFilter("tags", item);
              }}
            />
          )}
        </div>
      </div>
    )
  );
}
