"use client";

import { useEffect, useMemo, useState } from "react";
import { GeoJSON, MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { Skeleton } from "@/components/ui/skeleton";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatTooltipContent(properties?: Record<string, unknown> | null) {
  if (!properties) {
    return null;
  }

  const rows = Object.entries(properties).filter(([, value]) => {
    return value !== null && value !== undefined && String(value).trim() !== "";
  });

  if (!rows.length) {
    return null;
  }

  return rows
    .map(([key, value]) => {
      return `<div><strong>${escapeHtml(key)}</strong>: ${escapeHtml(String(value))}</div>`;
    })
    .join("");
}

function FitToGeoJson({ data }: { data: GeoJSON.GeoJsonObject }) {
  const map = useMap();

  useEffect(() => {
    const bounds = L.geoJSON(data).getBounds();

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [24, 24] });
    }
  }, [data, map]);

  return null;
}

function GeoJsonMapLoading() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--border)] bg-white">
      <div className="relative h-[600px] overflow-hidden bg-[radial-gradient(circle_at_top,_color-mix(in_srgb,var(--brand-accent)_9%,white),_transparent_55%)]">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(227,233,243,0.65)_1px,transparent_1px),linear-gradient(rgba(227,233,243,0.65)_1px,transparent_1px)] bg-[size:48px_48px]" />

        <Skeleton className="absolute left-8 top-8 h-10 w-36 rounded-xl bg-white/85 shadow-sm" />
        <Skeleton className="absolute right-8 top-8 h-24 w-24 rounded-2xl bg-white/80 shadow-sm" />
        <Skeleton className="absolute right-10 top-40 h-3 w-44 rounded-full bg-primary/12" />
        <Skeleton className="absolute right-12 top-48 h-3 w-28 rounded-full bg-primary/10" />

        <div className="absolute inset-x-16 top-1/2 -translate-y-1/2">
          <svg
            className="h-40 w-full text-primary/25"
            viewBox="0 0 800 220"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M40 170 C120 130 180 160 250 118 C305 86 360 90 418 122 C470 151 520 149 570 114 C624 76 680 70 760 112"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="10 10"
            />
            <path
              d="M70 145 C150 90 220 102 286 138 C342 168 398 172 470 126 C532 86 608 82 706 126"
              stroke="currentColor"
              strokeWidth="18"
              strokeLinecap="round"
              className="opacity-20"
            />
          </svg>
        </div>

        <Skeleton className="absolute bottom-10 left-10 h-28 w-48 rounded-2xl bg-white/82 shadow-sm" />
        <div className="absolute bottom-14 left-14 space-y-3">
          <Skeleton className="h-3 w-24 rounded-full bg-primary/12" />
          <Skeleton className="h-3 w-32 rounded-full bg-primary/10" />
          <Skeleton className="h-3 w-20 rounded-full bg-primary/10" />
        </div>

        <div className="absolute left-[18%] top-[28%]">
          <Skeleton className="h-4 w-4 rounded-full bg-primary/28" />
        </div>
        <div className="absolute left-[38%] top-[48%]">
          <Skeleton className="h-5 w-5 rounded-full bg-primary/30" />
        </div>
        <div className="absolute left-[64%] top-[34%]">
          <Skeleton className="h-4 w-4 rounded-full bg-primary/24" />
        </div>
        <div className="absolute left-[74%] top-[62%]">
          <Skeleton className="h-5 w-5 rounded-full bg-primary/26" />
        </div>
      </div>

      <div className="border-t border-[color:var(--border)] bg-white px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-2">
            <Skeleton className="h-3 w-24 rounded-full bg-primary/10" />
            <Skeleton className="h-3 w-40 rounded-full bg-primary/8" />
          </div>
          <span className="text-sm text-muted-foreground">Loading map preview...</span>
        </div>
      </div>
    </div>
  );
}

export default function GeoJsonMap({
  dataUrl,
}: {
  dataUrl: string;
  title?: string;
}) {
  const [data, setData] = useState<GeoJSON.GeoJsonObject | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadGeoJson() {
      try {
        setError(null);

        const response = await fetch(dataUrl);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const json = (await response.json()) as GeoJSON.GeoJsonObject;
        if (!cancelled) {
          setData(json);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load map preview",
          );
        }
      }
    }

    void loadGeoJson();

    return () => {
      cancelled = true;
    };
  }, [dataUrl]);

  const geoJsonOptions = useMemo(() => {
    return {
      onEachFeature(
        feature: GeoJSON.Feature<GeoJSON.Geometry, Record<string, unknown>>,
        layer: L.Layer,
      ) {
        const tooltipContent = formatTooltipContent(feature.properties);
        if (tooltipContent && "bindTooltip" in layer) {
          layer.bindTooltip(tooltipContent, {
            sticky: true,
            direction: "top",
          });
        }
      },
      pointToLayer(_feature: GeoJSON.Feature, latlng: L.LatLngExpression) {
        return L.circleMarker(latlng, {
          radius: 6,
          weight: 2,
          color: "#2357d5",
          fillColor: "#3b82f6",
          fillOpacity: 0.82,
        });
      },
      style() {
        return {
          color: "#2357d5",
          weight: 2,
          fillColor: "#3b82f6",
          fillOpacity: 0.18,
        };
      },
    };
  }, []);

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Failed to load GeoJSON preview: {error}
      </div>
    );
  }

  if (!data) {
    return <GeoJsonMapLoading />;
  }

  return (
    <div className="overflow-hidden rounded-2xl ">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        scrollWheelZoom={false}
        style={{ height: 600, width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON data={data} {...geoJsonOptions} />
        <FitToGeoJson data={data} />
      </MapContainer>

    </div>
  );
}
