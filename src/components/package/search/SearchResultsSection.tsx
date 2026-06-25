"use client";

import { useSearchState } from "./SearchContext";
import SearchResultHeader from "./SearchResultHeader";
import SearchResultItem from "./SearchResultItem";
import Pagination from "./Pagination";
import NoDataFound from "./NoDataFound";
import SearchForm from "./SearchForm";
import { Funnel, X } from "lucide-react";
import ActiveFilters from "./ActiveFilters";
import SortBy from "./SortBy";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useState } from "react";
import { SearchResultsSkeleton } from "@/components/layout/PageLoading";
import Facets from "./Facets";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SearchResultsSection({
  embedded = false,
  showSearchForm = false,
  className,
}: {
  embedded?: boolean;
  showSearchForm?: boolean;
  className?: string;
}) {
  const t = useTranslations();
  const ts = useTranslations("Search");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { result, isLoading, options, defaultOrg, defaultGroup, setOptions } =
    useSearchState();
  const hasResults = (result?.count ?? 0) > 0;
  const isPaginated = (result?.count ?? 0) > (options?.limit ?? 10);
  const clearAllFilters = () => {
    setOptions({
      query: "",
      type: "dataset",
      resFormat: [],
      groups: defaultGroup ? [defaultGroup] : [],
      orgs: defaultOrg ? [defaultOrg] : [],
      tags: [],
      offset: 0,
    });
  };

  return (
    <section
      aria-labelledby="search-heading"
      className={cn(embedded ? "pb-6" : "pb-24", className)}
    >
      <h2 id="search-heading" className="sr-only">
        {ts("title")}
      </h2>

      {showSearchForm && (
        <div className="mb-6 space-y-4 sm:mb-8">
            <SearchForm
              value={options?.query}
              placeholder="Search datasets, organizations, topics..."
              onSubmit={(q) => {
                setOptions({
                  query: q,
                  offset: 0,
                });
              }}
              onClear={clearAllFilters}
            />
        </div>
      )}

      {isLoading ? (
        <SearchResultsSkeleton />
      ) : (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[350px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className={cn("sticky", embedded ? "top-6" : "top-24")}>
              <Facets />
            </div>
          </aside>

          <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <SearchResultHeader as={embedded ? "h2" : "h1"} />
              {hasResults && (
                <div className="sm:ml-auto">
                  <SortBy />
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  setMobileFiltersOpen(true);
                }}
                className="sm:ml-2 lg:hidden"
              >
                <span className="sr-only">{ts("filters")}</span>
                <Funnel aria-hidden="true" className="size-5" />
              </Button>
            </div>

            <div className="my-6">
              <ActiveFilters
                title="Active filters"
                hide={[
                  ...(defaultOrg ? ["orgs"] : []),
                  ...(defaultGroup ? ["groups"] : []),
                ]}
              />
            </div>

            <div className="flex flex-col gap-4">
              {result?.datasets?.map((d) => (
                <SearchResultItem
                  key={d.id}
                  dataset={d}
                  query={options.query}
                />
              ))}
            </div>

            <div>
              {isPaginated ? (
                <div className="mt-10">
                  <Pagination count={result?.count ?? 0} />
                </div>
              ) : (
                !isLoading &&
                !hasResults && <NoDataFound onClearFilters={clearAllFilters} />
              )}
            </div>
          </div>
        </div>
      )}

      <Dialog
        open={mobileFiltersOpen}
        onClose={setMobileFiltersOpen}
        className="relative z-40 lg:hidden"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-slate-950/30 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />

        <div className="fixed inset-0 z-40 flex">
          <DialogPanel
            transition
            className="relative ml-auto flex size-full max-w-sm transform flex-col overflow-y-auto bg-background p-4 shadow-xl transition duration-300 ease-in-out data-closed:translate-x-full"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                {ts("filters")}
              </h2>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="inline-flex size-10 items-center justify-center rounded-xl border border-input bg-white text-muted-foreground"
              >
                <span className="sr-only">{t("Common.close")}</span>
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>
            <div className="mb-4">
              <ActiveFilters
                title="Active filters"
                hide={[
                  ...(defaultOrg ? ["orgs"] : []),
                  ...(defaultGroup ? ["groups"] : []),
                ]}
              />
            </div>
            <Facets />
          </DialogPanel>
        </div>
      </Dialog>
    </section>
  );
}
