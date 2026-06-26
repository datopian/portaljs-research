"use client";

import Container from "../ui/container";

export default function SiteDemoBanner() {
  return (
    <div className="border-b border-[color:var(--border)] bg-[color:color-mix(in_srgb,var(--brand-accent)_7%,white)]">
      <Container className="max-w-[1380px] py-2.5">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center sm:justify-start sm:text-left">
          <span className="inline-flex rounded-full bg-white px-2.5 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-primary shadow-[var(--shadow-soft)]">
            Demo
          </span>
          <p className="text-sm font-medium text-foreground/85">
            This site is a demo for research data portals.
          </p>
        </div>
      </Container>
    </div>
  );
}
