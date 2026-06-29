"use client";

import { useTranslations } from "next-intl";
import { useSearchState } from "./SearchContext";
import { cn } from "@/lib/utils";
import { BarChart3, Database } from "lucide-react";

const ITEMS = [
  {
    value: "dataset",
    icon: Database,
  },
  {
    value: "visualization",
    icon: BarChart3,
  },
] as const;

export default function SearchTypeSwitcher({
  className = "",
}: {
  className?: string;
}) {
  const t = useTranslations();
  const { options, setOptions } = useSearchState();

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {ITEMS.map((item) => {
        const Icon = item.icon;
        const active = (options.type ?? "dataset") === item.value;
        const label =
          item.value === "visualization"
            ? t("Common.visualizations")
            : t("Common.datasets");

        return (
          <button
            key={item.value}
            type="button"
            onClick={() =>
              setOptions({
                type: item.value,
                offset: 0,
              })
            }
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
              active
                ? "border-[color:var(--brand-accent)] bg-[color:color-mix(in_srgb,var(--brand-accent)_10%,white)] text-[color:color-mix(in_srgb,var(--brand-accent)_86%,black)]"
                : "border-[color:var(--border)] bg-white text-foreground hover:[border-color:var(--brand-accent)] hover:[color:var(--brand-accent)]"
            )}
          >
            <Icon className="size-4" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
