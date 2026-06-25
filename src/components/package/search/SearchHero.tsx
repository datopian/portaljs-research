"use client";

import Container from "@/components/ui/container";
import { useSearchState } from "./SearchContext";
import SearchForm from "./SearchForm";
import SearchTopicHints, { SearchTopicHintItem } from "./SearchTopicHints";
import { useMemo } from "react";

export default function SearchHero() {
  const { result, options, setOptions } = useSearchState();

  const quickTopics = useMemo<SearchTopicHintItem[]>(() => {
    const groupItems = result?.search_facets?.groups?.items ?? [];
    const tagItems = result?.search_facets?.tags?.items ?? [];
    const source = groupItems.length > 0 ? groupItems : tagItems;

    return source.slice(0, 5).map((item) => ({
      label: item.display_name || item.name,
      value: item.name,
      type: groupItems.length > 0 ? "groups" : "tags",
    }));
  }, [result]);

  return (
    <section className="hero-surface border-[color:var(--border)]">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.35fr)] lg:items-end">
          <div className="max-w-xl">
            <p
              className="mb-4 text-sm font-semibold uppercase tracking-[0.16em]"
              style={{ color: "var(--brand-accent)" }}
            >
              Explore open data
            </p>
            <h1 className="text-4xl font-display font-bold tracking-tight text-foreground sm:text-5xl">
              Find open data
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
              Search thousands of datasets from public organizations. Explore,
              reuse, and build with open data.
            </p>
          </div>

          <div>
            <SearchForm
              value={options?.query}
              placeholder="Search datasets, organizations, topics..."
              onSubmit={(q) => {
                setOptions({
                  query: q,
                  offset: 0,
                });
              }}
            />

            <SearchTopicHints
              items={quickTopics}
              onSelect={(topic) =>
                setOptions({
                  [topic.type]: [topic.value],
                  offset: 0,
                })
              }
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
