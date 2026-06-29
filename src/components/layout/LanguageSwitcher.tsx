"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { locales } from "@/i18n/config";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  if (locales.length === 1) {
    return null;
  }

  const setLocale = (nextLocale: string) => {
    if (!nextLocale || nextLocale === locale) return;
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <Menu as="div" className="relative">
      <MenuButton className="theme-control inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <span className="text-primary">{locale.toUpperCase()}</span>
        <ChevronDown className="size-4 text-primary font-semibold" />
      </MenuButton>

      <MenuItems
        anchor="bottom end"
        transition
        className="surface-panel space-y-1 z-50 mt-2 min-w-28 origin-top-right rounded-xl bg-white p-1 transition duration-150 ease-out focus:outline-none data-closed:scale-95 data-closed:opacity-0"
      >
        {locales.map((lang) => {
          const isActive = lang === locale;

          return (
            <MenuItem key={lang}>
              <button
                type="button"
                onClick={() => setLocale(lang)}
                className={cn(
                  "theme-control-option flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition data-focus:outline-none",
                  isActive ? "theme-control-active font-semibold" : "text-foreground"
                )}
              >
                <span>{lang.toUpperCase()}</span>
                {isActive && <Check className="size-4" />}
              </button>
            </MenuItem>
          );
        })}
      </MenuItems>
    </Menu>
  );
}
