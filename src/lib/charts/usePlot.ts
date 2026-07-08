"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import type * as Plot from "@observablehq/plot";

type PlotElement = SVGSVGElement | HTMLElement;

export function usePlot(
  ref: RefObject<HTMLDivElement | null>,
  builder: (width: number, height: number) => ReturnType<typeof Plot.plot>,
  afterRender?: (plot: PlotElement) => void,
) {
  const builderRef = useRef(builder);
  const afterRenderRef = useRef(afterRender);

  useEffect(() => {
    builderRef.current = builder;
    afterRenderRef.current = afterRender;
  }, [builder, afterRender]);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const ro = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width || 720;
      const height = entry.contentRect.height || 380;
      const plot = builderRef.current(width, height);
      afterRenderRef.current?.(plot);
      el.innerHTML = "";
      el.appendChild(plot);
    });

    ro.observe(el);
    return () => {
      ro.disconnect();
      el.innerHTML = "";
    };
  }, [ref]);
}
