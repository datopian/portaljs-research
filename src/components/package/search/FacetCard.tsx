import { PackageFacetOptions } from "@/schemas/ckan";
import { useRef, useState } from "react";
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Input } from "@/components/ui/input";
import FacetOptions from "./FacetOptions";
import { useTranslations } from "next-intl";

export default function FacetCard({
  name,
  title,
  icon,
  items,
  options,
  searchPlaceholder = "Common.search",
  onSelect,
}: {
  name: string;
  title?: React.ReactNode;
  icon?: React.ReactNode;
  items: PackageFacetOptions[];
  children?: React.ReactNode;
  options?: string[];
  searchPlaceholder?: string;
  onSelect: (v: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [seeMore, setSeeMore] = useState(false);
  const [facetOptionQuery, setFacetOptionQuery] = useState("");
  const maxPerView = 6;
  const t = useTranslations();

  const visibleItems = facetOptionQuery
    ? items.filter((item) =>
        item.display_name?.toLowerCase()?.includes(facetOptionQuery.toLowerCase())
      )
    : items;

  return (
    <Disclosure as="div" className="border-[color:var(--border)] py-4 last:border-b-0">
      <h3 className="flow-root">
        <DisclosureButton className="group flex w-full cursor-pointer items-center justify-between py-2 text-left">
          <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <div className="text-primary">
            {icon}</div>
            {title}
          </span>
          <span className="ml-6 flex items-center text-muted-foreground">
            <ChevronDown aria-hidden="true" className="size-5 group-data-open:hidden" />
            <ChevronUp aria-hidden="true" className="size-5 group-not-data-open:hidden" />
          </span>
        </DisclosureButton>
      </h3>

      <DisclosurePanel className="pt-3">
        {items.length > maxPerView && (
          <div className="relative mb-4">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={facetOptionQuery}
              onChange={(e) => setFacetOptionQuery(e.target.value)}
              placeholder={t(searchPlaceholder)}
              className="pl-10 pr-10"
            />
            {facetOptionQuery && (
              <button
                className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground"
                onClick={(e) => {
                  e.preventDefault();
                  setFacetOptionQuery("");
                  inputRef.current?.focus();
                  return false;
                }}
              >
                <X width={16} />
              </button>
            )}
          </div>
        )}

        <div className="space-y-3">
          {visibleItems
            .slice(0, seeMore ? visibleItems.length : maxPerView)
            .map((item) => (
              <FacetOptions
                name={name}
                value={item.name}
                label={item.display_name || item.name}
                count={item.count}
                key={item.name}
                options={options || []}
                onSelect={onSelect}
              />
            ))}
        </div>

        {visibleItems.length > maxPerView && (
          <button
            onClick={() => setSeeMore(!seeMore)}
            type="button"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary"
          >
            {seeMore ? (
              <>
                <span>{t("Common.showLess")}</span>
                <ChevronUp width={18} />
              </>
            ) : (
              <>
                <span>{t("Common.showMore")}</span>
                <ChevronDown width={18} />
              </>
            )}
          </button>
        )}
      </DisclosurePanel>
    </Disclosure>
  );
}
