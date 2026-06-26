"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

export default function PortalLogo({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: {
      wrapper: "gap-3",
      symbolWrap: "h-14 w-14 rounded-[1.35rem]",
      symbolPad: "p-0",
      title: "text-[1.1rem]",
      subtitle: "text-[10px] tracking-[0.16em]",
    },
    md: {
      wrapper: "gap-3.5",
      symbolWrap: "h-14 w-14 rounded-[1.1rem]",
      symbolPad: "p-0",
      title: "text-[1.15rem]",
      subtitle: "text-[10.5px] tracking-[0.18em]",
    },
    lg: {
      wrapper: "gap-4",
      symbolWrap: "h-20 w-20 rounded-[1.4rem]",
      symbolPad: "p-0",
      title: "text-[1.55rem]",
      subtitle: "text-[11px] tracking-[0.2em]",
    },
  } as const;

  const current = sizes[size];

  return (
    <div className={cn("inline-flex items-center", current.wrapper, className)}>
      <div
        className={cn(
          "relative shrink-0 bg-[color:color-mix(in_srgb,var(--brand-accent)_6%,white)] shadow-[var(--shadow-soft)]",
          current.symbolWrap,
        )}
      >
        <Image
          src="/images/logos/MainLogoSymbol.svg"
          alt="Research Portal"
          fill
          className={cn("object-contain", current.symbolPad)}
          priority
        />
      </div>

      <div className="min-w-0">
        <p
          className={cn(
            "font-logo truncate font-bold leading-none tracking-tight text-foreground",
            current.title,
          )}
        >
          Open Research
        </p>
        <p
          className={cn(
            "font-logo truncate font-semibold uppercase leading-none text-primary/90",
            current.subtitle,
          )}
        >
          Data Portal
        </p>
      </div>
    </div>
  );
}
