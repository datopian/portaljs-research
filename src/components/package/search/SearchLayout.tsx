"use client";

import Container from "@/components/ui/container";
import SearchHero from "./SearchHero";
import SearchResultsSection from "./SearchResultsSection";

export default function SearchLayout() {
  return (
    <div>
      <SearchHero />

      <Container className="py-8 sm:py-10">
        <SearchResultsSection />
      </Container>
    </div>
  );
}
