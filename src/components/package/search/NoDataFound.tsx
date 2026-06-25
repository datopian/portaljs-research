import { useTranslations } from "next-intl";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NoDataFound({
  onClearFilters,
}: {
  onClearFilters?: () => void;
}) {
  const t = useTranslations();
  return (
    <div className="surface-panel relative overflow-hidden rounded-[28px] border-[color:var(--brand-border-tint)] bg-white px-5 py-6 sm:px-6 sm:py-7">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--brand-accent)_10%,white),transparent_28%),radial-gradient(circle_at_bottom_left,color-mix(in_srgb,var(--brand-accent)_6%,white),transparent_24%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 top-5 h-28 w-28 rounded-full border border-[color:var(--brand-border-tint)] bg-white/70"
      />


      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[color:color-mix(in_srgb,var(--brand-accent)_10%,white)] text-[color:var(--brand-accent)] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--brand-accent)_10%,white)]">
            <SearchX className="size-5" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">
              {t("Common.noResults")}
            </h3>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Try broadening your search or removing some filters to explore more results.
            </p>
          </div>
        </div>

        {onClearFilters ? (
          <div className="sm:shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClearFilters}
              className="h-11 rounded-xl border-[color:var(--brand-border-tint)] bg-white/90 px-4 text-sm font-medium text-foreground hover:bg-[color:color-mix(in_srgb,var(--brand-accent)_6%,white)]"
            >
              {t("Common.clearAll")}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
