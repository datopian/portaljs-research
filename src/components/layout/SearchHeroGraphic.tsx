import { cn } from "@/lib/utils";

export default function SearchHeroGraphic({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-y-0 right-0 hidden overflow-hidden lg:block",
        className,
      )}
    >
      <div className="absolute right-6 top-12 h-56 w-56 rounded-full bg-primary/[0.08] blur-3xl" />

      <svg
        viewBox="0 0 420 260"
        className="absolute right-0 top-4 h-[260px] w-[420px] text-primary/60"
        fill="none"
      >
        <circle
          cx="318"
          cy="122"
          r="88"
          stroke="currentColor"
          strokeOpacity="0.08"
          strokeWidth="1.5"
        />
        <circle
          cx="318"
          cy="122"
          r="58"
          stroke="currentColor"
          strokeOpacity="0.06"
          strokeWidth="1.5"
        />

        <path
          d="M84 126C132 100 176 95 228 100C272 104 313 118 368 118"
          stroke="currentColor"
          strokeOpacity="0.14"
          strokeWidth="16"
          strokeLinecap="round"
        />
        <path
          d="M118 162C166 139 208 135 256 139C296 143 334 155 384 154"
          stroke="currentColor"
          strokeOpacity="0.09"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M154 89C196 72 230 69 272 72C308 76 338 88 378 88"
          stroke="currentColor"
          strokeOpacity="0.07"
          strokeWidth="10"
          strokeLinecap="round"
        />

        <g opacity="0.26">
          {Array.from({ length: 12 }).map((_, index) => {
            const x = 382 + (index % 3) * 14;
            const y = 110 + Math.floor(index / 3) * 14;
            return <circle key={index} cx={x} cy={y} r="3.5" fill="currentColor" />;
          })}
        </g>
      </svg>
    </div>
  );
}
