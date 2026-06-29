"use client";

import { useSearchState } from "./SearchContext";
import { useTranslations } from "next-intl";

export default function SearchResultHeader({
  as: Tag = "h1",
}: {
  as?: "h1" | "h2";
}) {
  const { options, result, isLoading } = useSearchState();
  const t = useTranslations("Search");
  const tc = useTranslations("Common");

  const count = result?.count ?? 0;
  const hasQuery = !!options?.query && options.query.trim().length > 0;
  const typeLabel =
    options?.type === "visualization"
      ? tc("visualizations")
      : tc("datasets");

  const title = hasQuery
    ? t("headerWithQuery", {
        query: options?.query ?? "",
        type: typeLabel.toLowerCase(),
      })
    : count > 0
      ? t(
          options?.type === "visualization" ? "headerCountVisualizations" : "headerCount",
          { count }
        )
      : "";

  return (
    <div className="flex flex-col gap-1">
      <Tag className="text-2xl font-bold tracking-tight text-foreground">
        {title}
      </Tag>

      {!isLoading && hasQuery && count > 0 && (
        <p className="text-sm text-muted-foreground">
          {t("headerShowing", { count, type: typeLabel.toLowerCase() })}
        </p>
      )}
    </div>
  );
}
