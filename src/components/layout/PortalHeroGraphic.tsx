import { cn } from "@/lib/utils";

type PortalHeroGraphicProps = {
  className?: string;
  wrapperClassName?: string;
  intensity?: "soft" | "default" | "strong";
  align?: "center" | "right";
};

const INTENSITY_CLASSES = {
  soft: {
    glow: "opacity-28",
    panel: "opacity-42",
    ring: "opacity-30",
    detail: "opacity-32",
  },
  default: {
    glow: "opacity-45",
    panel: "opacity-56",
    ring: "opacity-42",
    detail: "opacity-48",
  },
  strong: {
    glow: "opacity-58",
    panel: "opacity-68",
    ring: "opacity-52",
    detail: "opacity-58",
  },
} as const;

function PortalNodeCluster({
  tone,
}: {
  tone: (typeof INTENSITY_CLASSES)[keyof typeof INTENSITY_CLASSES];
}) {
  return (
    <svg
      className={cn("h-24 w-24 text-primary", tone.detail)}
      viewBox="0 0 80 80"
      fill="none"
    >
      <path
        d="M18 53 L35 35 L52 44 L61 28"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="18" cy="53" r="5" fill="currentColor" />
      <circle cx="35" cy="35" r="5" fill="currentColor" className="opacity-80" />
      <circle cx="52" cy="44" r="5" fill="currentColor" className="opacity-70" />
      <circle cx="61" cy="28" r="5.5" fill="currentColor" className="opacity-55" />
      <circle cx="45" cy="18" r="4.5" fill="currentColor" className="opacity-40" />
    </svg>
  );
}

export default function PortalHeroGraphic({
  intensity = "default",
  align = "right",
  className,
  wrapperClassName,
}: PortalHeroGraphicProps) {
  const tone = INTENSITY_CLASSES[intensity];

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute hidden overflow-hidden lg:block",
        "top-6 h-[17rem] w-[22rem] xl:top-5 xl:h-[20rem] xl:w-[27rem]",
        align === "right" && "right-0 xl:right-2",
        align === "center" && "left-1/2 -translate-x-1/2",
        wrapperClassName,
      )}
    >
      <div
        className={cn(
          "relative h-full w-full text-primary",
          className,
        )}
      >
        <div
          className={cn(
            "absolute right-3 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-primary/8 blur-3xl xl:right-2 xl:h-60 xl:w-60",
            tone.glow,
          )}
        />

        <div
          className={cn(
            "absolute bottom-3 right-8 h-36 w-36 rounded-full border border-primary/10 bg-primary/4 xl:bottom-5 xl:h-44 xl:w-44",
            tone.ring,
          )}
        />

        <div
          className={cn(
            "absolute bottom-9 right-16 h-20 w-20 rounded-full border border-primary/12 xl:bottom-12 xl:right-[4.5rem] xl:h-24 xl:w-24",
            tone.ring,
          )}
        />

        <div
          className={cn(
            "absolute right-12 top-4 rounded-[1.5rem] border border-primary/12 bg-white/78 px-3 py-3 shadow-[0_20px_48px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm xl:right-16 xl:top-5 xl:px-4 xl:py-4",
            tone.panel,
          )}
        >
          <div className="flex items-start gap-3">
            <PortalNodeCluster tone={tone} />
            <div className="space-y-2 pt-2">
              <span className="block h-2 w-16 rounded-full bg-primary/20" />
              <span className="block h-2 w-24 rounded-full bg-primary/12" />
              <span className="block h-2 w-20 rounded-full bg-primary/16" />
            </div>
          </div>
        </div>

        <div
          className={cn(
            "absolute bottom-[3.2rem] right-20 rounded-[1.15rem] border border-primary/10 bg-white/74 px-3 py-2.5 shadow-[0_16px_40px_-34px_rgba(15,23,42,0.32)] backdrop-blur-sm xl:bottom-[4.2rem] xl:right-24 xl:px-4 xl:py-3",
            tone.panel,
          )}
        >
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <span
                key={index}
                className="h-2 w-2 rounded-full bg-primary/60"
                style={{ opacity: 0.25 + ((index % 4) + 1) * 0.14 }}
              />
            ))}
          </div>
        </div>

        <div
          className={cn(
            "absolute bottom-[4.5rem] right-1 grid grid-cols-4 gap-1.5 xl:bottom-[5.8rem] xl:right-0 xl:gap-2",
            tone.detail,
          )}
        >
          {Array.from({ length: 12 }).map((_, index) => (
            <span
              key={index}
              className="h-1.5 w-1.5 rounded-full bg-primary/70"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
