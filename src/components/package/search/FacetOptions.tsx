"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useCallback } from "react";

type FacetOptionsProps = {
  name: string;
  value: string;
  label: string;
  count?: number;
  options: string[];
  onSelect: (v: string[]) => void;
};

export const FacetOptions = ({
  name,
  value,
  label,
  count,
  options,
  onSelect,
}: FacetOptionsProps) => {
  const isActive = options.includes(value);

  const toggleSelection = useCallback(() => {
    const updatedValues = isActive
      ? options.filter((v) => v !== value)
      : [...options, value];

    onSelect(updatedValues);
  }, [isActive, onSelect, options, value]);

  return (
    <div className="flex items-start gap-3">
      <input
        type="checkbox"
        id={`${name}-${value}`}
        checked={isActive}
        onChange={toggleSelection}
        className="sr-only"
      />

      <label
        htmlFor={`${name}-${value}`}
        tabIndex={0}
        onKeyDown={(e) => (e.key === " " || e.key === "Enter") && toggleSelection()}
        className={cn(
          "mt-0.5 flex h-5 w-5 min-w-5 items-center justify-center rounded-[4px] border cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isActive
            ? "border-primary bg-primary text-primary-foreground"
            : "border-input bg-background text-transparent"
        )}
      >
        <Check className="size-3.5" />
        <span className="sr-only">{label}</span>
      </label>

      <button
        type="button"
        onClick={toggleSelection}
        className="flex flex-1 items-center justify-between gap-3 text-left text-sm text-muted-foreground transition hover:text-foreground"
      >
        <span>{label}</span>
        {typeof count === "number" && (
          <span className="text-xs font-medium text-muted-foreground">{count}</span>
        )}
      </button>
    </div>
  );
};

export default FacetOptions;
