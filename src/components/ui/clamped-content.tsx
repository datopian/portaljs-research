"use client";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import {
  CSSProperties,
  ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

export default function ClampedContent({
  children,
  lines = 3,
  className,
  contentClassName,
  buttonClassName,
  expandLabel = "Show more",
  collapseLabel = "Show less",
}: {
  children: ReactNode;
  lines?: number;
  className?: string;
  contentClassName?: string;
  buttonClassName?: string;
  expandLabel?: string;
  collapseLabel?: string;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const contentId = useId();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);

  useEffect(() => {
    const element = contentRef.current;

    if (!element) return;

    const measure = () => {
      const current = contentRef.current;
      if (!current) return;

      const wasExpanded = current.getAttribute("data-expanded") === "true";

      if (wasExpanded) {
        current.setAttribute("data-expanded", "false");
        current.style.display = "-webkit-box";
        current.style.webkitBoxOrient = "vertical";
        current.style.webkitLineClamp = String(lines);
        current.style.overflow = "hidden";
      }

      const nextIsClamped = current.scrollHeight > current.clientHeight + 1;
      setIsClamped(nextIsClamped);

      if (wasExpanded) {
        current.setAttribute("data-expanded", "true");
        current.style.display = "";
        current.style.webkitBoxOrient = "";
        current.style.webkitLineClamp = "";
        current.style.overflow = "";
      }

      if (!nextIsClamped) {
        setIsExpanded(false);
      }
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [children, lines]);

  const clampStyle: CSSProperties | undefined = !isExpanded
    ? {
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: lines,
        overflow: "hidden",
      }
    : undefined;

  return (
    <div className={cn("space-y-2.5", className)}>
      <div
        id={contentId}
        ref={contentRef}
        data-expanded={isExpanded ? "true" : "false"}
        style={clampStyle}
        className={cn("min-w-0", contentClassName)}
      >
        {children}
      </div>

      {isClamped && (
        <Button
          type="button"
          variant="link"
          size="sm"
          aria-expanded={isExpanded}
          aria-controls={contentId}
          onClick={() => setIsExpanded((current) => !current)}
          className={cn("h-auto px-0 py-0 text-sm font-medium", buttonClassName)}
        >
          {isExpanded ? collapseLabel : expandLabel}
        </Button>
      )}
    </div>
  );
}
