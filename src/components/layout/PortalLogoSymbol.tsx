import { cn } from "@/lib/utils";

export default function PortalLogoSymbol({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-full w-full", className)}
      aria-hidden="true"
    >
      <rect width="96" height="96" rx="24" fill="#EFF6FF" />
      <path
        d="M28 62L46 44L58 56"
        stroke="#2563EB"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M46 44H66"
        stroke="#93C5FD"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M46 44V28"
        stroke="#93C5FD"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="28" cy="62" r="6" fill="#1D4ED8" />
      <circle cx="46" cy="44" r="6" fill="#2563EB" />
      <circle cx="58" cy="56" r="6" fill="#1E40AF" />
      <circle cx="66" cy="44" r="6" fill="#60A5FA" />
      <circle cx="46" cy="28" r="6" fill="#60A5FA" />
    </svg>
  );
}
