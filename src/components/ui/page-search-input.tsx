"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { Search, X } from "lucide-react";
import { Button } from "./button";

export default function PageSearchInput({
  defaultValue = "",
  placeholder = "Search...",
  paramName = "q",
  submitLabel = "Search",
}: {
  defaultValue?: string;
  placeholder?: string;
  paramName?: string;
  submitLabel?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(defaultValue);

  function updateQueryParam(newValue: string) {
    const params = new URLSearchParams(searchParams?.toString() ?? "");

    if (newValue) {
      params.set(paramName, newValue);
    } else {
      params.delete(paramName);
    }

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    updateQueryParam(value);
  }

  function handleClear() {
    setValue("");
    updateQueryParam("");
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex w-full items-stretch gap-1.5 rounded-3xl border border-[color:var(--border)] bg-white p-1.5 shadow-[var(--shadow-soft)]">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            disabled={isPending}
            className="h-12 w-full border-0 bg-transparent py-3 pl-12 pr-4 text-base text-foreground outline-0 placeholder:text-muted-foreground"
          />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <Button type="submit" size="lg" className="h-12 cursor-pointer shadow-lg shrink-0 rounded-xl px-6 sm:min-w-32">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
