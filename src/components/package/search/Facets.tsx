import { useTranslations } from "next-intl";
import { Building2, Files, FolderKanban, Tags } from "lucide-react";
import { useSearchState } from "./SearchContext";
import FacetCard from "@/components/package/search/FacetCard";
import SearchTypeSwitcher from "./SearchTypeSwitcher";
import { BarChart3 } from "lucide-react";

export default function Facets() {
  const { result, options, defaultOrg, defaultGroup, setOptions } = useSearchState();
  const searchResultFacets = result?.search_facets || {};
  const t = useTranslations();

  return (
    <div className="surface-panel rounded-2xl bg-white">
      <div className="border-b border-[color:var(--border)] px-5 py-4 sm:px-6">
        <h2 className="text-lg font-semibold text-foreground">Refine results</h2>
      </div>

      <div className="px-5 py-2 sm:px-6 divide-y">
        <div className="border-[color:var(--border)] py-4">
          <div className="flex items-center gap-2 py-2 text-sm font-semibold text-foreground">
            <div className="text-primary">
              <BarChart3 className="size-4" />
            </div>
            <span>Type</span>
          </div>
          <SearchTypeSwitcher className="pt-3" />
        </div>

        {searchResultFacets?.organization?.items?.length > 0 && !defaultOrg && (
          <FacetCard
            name="orgs"
            title={t("Common.organization")}
            icon={<Building2 className="size-4" />}
            items={searchResultFacets.organization.items}
            options={options?.orgs}
            onSelect={(updatedValues) => {
              setOptions({ orgs: updatedValues, offset: 0 });
            }}
          />
        )}

        {searchResultFacets?.groups?.items?.length > 0 && !defaultGroup && (
          <FacetCard
            name="groups"
            title={t("Common.groups")}
            icon={<FolderKanban className="size-4" />}
            items={searchResultFacets.groups.items}
            options={options?.groups}
            onSelect={(updatedValues) => {
              setOptions({ groups: updatedValues, offset: 0 });
            }}
          />
        )}

        {searchResultFacets?.res_format?.items?.length > 0 && (
          <FacetCard
            name="resFormat"
            title={t("Common.formats")}
            icon={<Files className="size-4" />}
            items={searchResultFacets.res_format.items}
            options={options?.resFormat}
            onSelect={(updatedValues) => {
              setOptions({ resFormat: updatedValues, offset: 0 });
            }}
          />
        )}

        {searchResultFacets?.tags?.items?.length > 0 && (
          <FacetCard
            name="tags"
            title={t("Common.tags")}
            icon={<Tags className="size-4" />}
            items={searchResultFacets.tags.items}
            options={options?.tags}
            onSelect={(updatedValues) => {
              setOptions({ tags: updatedValues, offset: 0 });
            }}
          />
        )}
      </div>
    </div>
  );
}
