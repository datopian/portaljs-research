"use client";

import Container from "@/components/ui/container";
import { HeroAbstractVisual } from "@/components/layout/PageHero";
import { useSearchState } from "./SearchContext";
import SearchForm from "./SearchForm";

export default function SearchHero() {
  const { options, setOptions } = useSearchState();

  return (
    <section className="hero-surface relative overflow-hidden border-[color:var(--border)]">
      <HeroAbstractVisual
        intensity="soft"
        align="right"
        wrapperClassName="right-0 w-[24rem] lg:block xl:w-[30rem]"
      />

      <Container className="relative z-10 py-14 sm:pt-16 sm:pb-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.35fr)] lg:items-center">
          <div className="max-w-xl">
            <p
              className="mb-4 text-sm font-semibold uppercase tracking-[0.16em]"
              style={{ color: "var(--brand-accent)" }}
            >
              Explore open data
            </p>
            <h1 className="text-4xl font-display font-[900] tracking-tight text-foreground sm:text-5xl">
              Find open data
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
              Explore research datasets, browse topics and organizations, and
              discover data you can analyze, cite, and reuse.
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
          </div>
        </div>
      </Container>
    </section>
  );
}
