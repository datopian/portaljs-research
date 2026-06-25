"use client";

import Container from "../ui/container";
import { Link, usePathname } from "@/i18n/navigation";
import clsx from "clsx";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";
import Image from "next/image";

export default function Header() {
  const loginUrl = "https://cloud.portaljs.com/auth/signin";
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations();

  const menu = [
    { href: "/search", label: t("Common.datasets") },
    { href: "/organizations", label: t("Common.organizations") },
    { href: "/groups", label: t("Common.groups") },
  ];

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--border)] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
      <Container className="max-w-[1380px]">
        <div className="flex min-h-17 items-center gap-3 pt-2.5">
          <Link href="/" className="min-w-0 shrink-0">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logos/MainLogo.svg"
                alt="Research Portal"
                width={240}
                height={72}
                className=""
              />
            </div>
          </Link>

          <nav className="ml-10 mr-auto hidden items-center gap-6 lg:flex" aria-label="Primary">
            {menu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "border-b-3 border-transparent px-1 py-5 text-[0.95rem] font-medium transition-colors",
                  isActive(item.href)
                    ? "[border-bottom-color:var(--brand-accent)] [color:var(--brand-accent)]"
                    : "text-foreground/85 hover:[color:var(--brand-accent)]"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto hidden items-center gap-3 lg:flex">

            <LanguageSwitcher />
          </div>

          <div className="ml-auto flex items-center gap-2 lg:hidden">
            <LanguageSwitcher />
            <button
              type="button"
              className="inline-flex h-10 w-11 items-center justify-center rounded-xl border border-input bg-background text-foreground"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
            >
              {menuOpen ? <X className="size-5 text-primary" /> : <Menu className="size-5 text-primary" />}
            </button>
          </div>
        </div>

        <div
          id="mobile-navigation"
          className={clsx(
            "overflow-hidden transition-all duration-300 lg:hidden",
            menuOpen ? "max-h-72 pb-4" : "max-h-0"
          )}
        >
          <nav className="surface-panel rounded-2xl p-2" aria-label="Mobile primary">
            <div className="flex flex-col gap-1">
              {menu.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-accent [color:var(--brand-accent)]"
                      : "text-muted-foreground hover:bg-accent hover:[color:var(--brand-accent)]"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <a
                href={loginUrl}
                className="rounded-xl px-4 py-3 text-sm font-medium [color:var(--brand-accent)] transition-colors hover:bg-accent hover:opacity-80"
              >
                Login
              </a>
            </div>
          </nav>
        </div>
      </Container>
    </header>
  );
}
