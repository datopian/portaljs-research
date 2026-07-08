import { ResourceChart } from "@/components/resource-chart";
import { getDatasetDetails } from "@/lib/ckan/dataset";
import { getResourceByName } from "@/lib/ckan/resource";
import { toPublicOrgSlug } from "@/lib/portal-name";
import type { ResourceChartConfig } from "@/components/resource-chart";
import HomeDataSignalCarouselClient, {
  type HomeDataSignalSlide,
} from "./HomeDataSignalCarouselClient";

type SlideDefinition = HomeDataSignalSlide & {
  resourceName: string;
  config: ResourceChartConfig;
};

type ResolvedSlide = SlideDefinition & {
  resourceId: string;
  resourceHref?: string;
};

const SLIDES: SlideDefinition[] = [
  {
    id: "co2-concentration",
    resourceName: "co2-annmean-mlo",
    eyebrow: "Data signal",
    title: "Atmospheric CO2 concentration",
    description:
      "Annual mean carbon dioxide levels measured at Mauna Loa, showing the long-run trend in atmospheric concentration.",
    badges: ["CO2 concentration", "Annual series"],
    config: {
      type: "line",
      x: "Year",
      y: "Mean",
      aggregation: "avg",
      sort: "x-asc",
      limit: 90,
      xLabel: "Year",
      yLabel: "CO2 concentration (ppm)",
      height: 270,
    },
  },
  {
    id: "temperature-anomaly",
    resourceName: "annual",
    eyebrow: "Climate record",
    title: "Global temperature anomaly",
    description:
      "Annual global surface temperature anomaly, useful for seeing how measured temperatures diverge from the historical baseline.",
    badges: ["Temperature anomaly", "Annual series"],
    config: {
      type: "line",
      x: "Year",
      y: "Mean",
      filters: { Source: "GCAG" },
      aggregation: "avg",
      sort: "x-asc",
      limit: 180,
      xLabel: "Year",
      yLabel: "Temperature anomaly",
      height: 270,
    },
  },
  {
    id: "fossil-co2-emitters",
    resourceName: "top-emitters",
    eyebrow: "Country comparison",
    title: "Largest fossil CO2 emitters in 2020",
    description:
      "A ranked snapshot of country-level fossil-fuel and cement-related CO2 emissions for the latest year in this resource.",
    badges: ["Million tonnes CO2", "Top countries"],
    config: {
      type: "bar-h",
      x: "country",
      y: "total_mt",
      filters: { year: 2020 },
      aggregation: "sum",
      sort: "y-desc",
      limit: 8,
      xLabel: "Total emissions",
      yLabel: "Country",
      height: 270,
    },
  },
];

function toClientSlide(slide: SlideDefinition): HomeDataSignalSlide {
  return {
    id: slide.id,
    eyebrow: slide.eyebrow,
    title: slide.title,
    description: slide.description,
    badges: slide.badges,
    resourceHref: slide.resourceHref,
  };
}

export default async function HomeDataSignalCarousel() {
  const resources = await Promise.all(
    SLIDES.map((slide) => getResourceByName(slide.resourceName)),
  );
  const datasets = await Promise.all(
    resources.map((resource) =>
      resource?.package_id ? getDatasetDetails(resource.package_id).catch(() => null) : null,
    ),
  );

  const slides = SLIDES.reduce<ResolvedSlide[]>((resolvedSlides, slide, index) => {
    const resource = resources[index];
    const dataset = datasets[index];

    if (!resource?.id) return resolvedSlides;

    resolvedSlides.push({
      ...slide,
      resourceId: resource.id,
      resourceHref:
        dataset?.name && dataset.organization?.name
          ? `/@${toPublicOrgSlug(dataset.organization.name)}/${dataset.name}`
          : undefined,
    });

    return resolvedSlides;
  }, []);

  if (slides.length === 0) return null;

  return (
    <HomeDataSignalCarouselClient
      slides={slides.map(toClientSlide)}
    >
      {slides.map((slide) => (
        <ResourceChart
          key={slide.id}
          resourceId={slide.resourceId}
          config={slide.config}
        />
      ))}
    </HomeDataSignalCarouselClient>
  );
}
