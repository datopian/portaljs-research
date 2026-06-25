import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useSearchState } from "./SearchContext";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function SortBy() {
  const { options, setOptions } = useSearchState();
  const t = useTranslations("Search");

  const isActive = (option: string) => options?.sort === option;

  const sortOptions = [
    { name: t("sortRelevance"), value: "score desc" },
    { name: t("sortLastModified"), value: "metadata_modified desc" },
    { name: t("sortNameAsc"), value: "title asc" },
    { name: t("sortNameDesc"), value: "title desc" },
  ];

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="theme-control inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium">
          <span className="text-muted-foreground">{t("sortLabel")}</span>
          <span>
            {sortOptions.find((item) => item.value === options?.sort)?.name ||
              sortOptions[0].name}
          </span>
          <ChevronDown
            aria-hidden="true"
            className="size-4 shrink-0 text-muted-foreground"
          />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="surface-panel space-y-1 absolute right-0 z-10 mt-2 w-52 origin-top-right rounded-2xl bg-white p-1 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
      >
        {sortOptions.map((option) => (
          <MenuItem key={option.value}>
            <button
              type="button"
              onClick={() => setOptions({ sort: option.value, offset: 0 })}
              className={cn(
                "theme-control-option block w-full cursor-pointer rounded-xl px-3 py-2 text-left text-sm transition data-focus:outline-hidden",
                isActive(option.value)
                  ? "theme-control-active font-medium"
                  : "text-muted-foreground"
              )}
            >
              {option.name}
            </button>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
}
