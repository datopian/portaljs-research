"use client";

import { usePackageSearch } from "@/hooks/package";
import { PackageSearchOptions, PackageSearchResponse } from "@/schemas/ckan";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createContext,
  JSX,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

type setQueryParamFn<T> = (value: T) => void;

interface SearchStateContext {
  defaultOrg?: string | null;
  defaultGroup?: string | null;
  result: Partial<PackageSearchResponse> | null;
  options: PackageSearchOptions;
  isLoading: boolean;
  isFetching: boolean;
  hasFiltersApplied: boolean;
  setOptions: setQueryParamFn<Partial<PackageSearchOptions>>;
  error: Error | null;
}

export const SearchStateContext = createContext<SearchStateContext>({
  defaultOrg: null,
  defaultGroup: null,
  result: null,
  options: {
    offset: 0,
    limit: 10,
    tags: [],
    groups: [],
    orgs: [],
    resFormat: [],
    query: "",
    sort: "score desc",
    type: "dataset",
    include_private: false,
  },
  isLoading: true,
  isFetching: true,
  hasFiltersApplied: false,
  error: null,
  setOptions: () => null,
});

const ignoredParams: { [key: string]: boolean } = {
  limit: true,
  include_private: true,
};

export const useSearchState = () => useContext(SearchStateContext);

export const SearchStateProvider = ({
  defaultOrg,
  defaultGroup,
  children,
}: {
  defaultOrg?: string | null;
  defaultGroup?: string | null;
  children: React.ReactNode | JSX.Element;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Sync state from URL once
  const initialOptions: PackageSearchOptions = useMemo(() => {
    const getParam = (key: string) => searchParams.get(key);
    const getParamArray = (key: string) => searchParams.getAll(key);

    return {
      offset: parseInt(getParam("offset") ?? "0"),
      limit: 10,
      tags: getParamArray("tags"),
      groups: defaultGroup ? [defaultGroup] : getParamArray("groups"),
      orgs: defaultOrg ? [defaultOrg] : getParamArray("orgs"),
      resFormat: getParamArray("resFormat"),
      query: getParam("query") ?? "",
      sort: getParam("sort") ?? "metadata_modified desc",
      type: getParam("type") ?? "dataset",
      include_private: false,
    };
  }, [searchParams, defaultOrg, defaultGroup]);

  const [options, setOptionsState] =
    useState<PackageSearchOptions>(initialOptions);

  useEffect(() => {
    setOptionsState(initialOptions);
  }, [initialOptions]);

  // 2. Apply new params to URL only (debounced, optional)
  const updateURLParams = useCallback(
    (partial: Partial<PackageSearchOptions>) => {
      const url = new URL(window.location.href);
      const params = url.searchParams;

      Object.entries(partial).forEach(([key, value]) => {
        if (!ignoredParams[key]) {
          params.delete(key);
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v));
          } else if (
            value !== undefined &&
            value !== null &&
            !(typeof value === "string" && value.trim() === "")
          ) {
            params.set(key, String(value));
          }
        }
      });

      router.push(`${url.pathname}?${params.toString()}`);
    },
    [router]
  );

  const setOptions = useCallback(
    (partial: Partial<PackageSearchOptions>) => {
      setOptionsState((prev) => ({
        ...prev,
        ...partial,
      }));
      updateURLParams(partial);
    },
    [updateURLParams]
  );

  // 3. Determine filter state
  const hasFiltersApplied = useMemo(() => {
    return (
      (options.resFormat ?? []).length > 0 ||
      (!defaultGroup && (options.groups ?? []).length > 0) ||
      (!defaultOrg && (options.orgs ?? []).length > 0) ||
      (options.tags ?? []).length > 0
    );
  }, [options, defaultOrg, defaultGroup]);

  // 4. Fetch data
  const { data, error, isLoading, isFetching } = usePackageSearch(options, defaultOrg??undefined);

  const value: SearchStateContext = {
    defaultOrg,
    defaultGroup,
    options,
    result: data ?? null,
    error,
    isLoading,
    isFetching,
    hasFiltersApplied,
    setOptions,
  };

  return (
    <SearchStateContext.Provider value={value}>
      {children}
    </SearchStateContext.Provider>
  );
};
