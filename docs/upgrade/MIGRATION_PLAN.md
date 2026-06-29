# PortalJS Migration Plan: `_temp` to `v2`

## 1. Executive Summary

The migration objective is to move the real custom functionality from `_temp` into the newer `v2` PortalJS template without carrying forward obsolete Pages Router structure or old implementation patterns.

`_temp` is the source of existing custom functionality. `v2` is the new base template and should remain the architectural foundation for the upgraded project.

This plan is based only on modules and features discovered from the actual `_temp` codebase. No module list was assumed in advance.

### Confirmed Migration Decisions

The user confirmed that all real `_temp` features should be implemented in `v2`: topics, DOI, stories/reports, Queryless behavior, analytics, structured data, accessibility tooling, importer scripts, and related helper tests. The migration should preserve behavior while adapting implementation to the `v2` architecture.

| Area | Confirmed decision |
| --- | --- |
| Topics | Keep real `/topics` and `/topics/[topicName]` pages with Topics labels and slugs. |
| Resource routes | Keep the old resource route shape `/@org/dataset/r/resourceId`. This is the canonical resource URL. |
| Generated DOI | Keep exactly as `_temp`, including DOI display and links to `https://doi.org/{generatedDoi}`. |
| Stable dataset URLs | Keep `_temp` behavior: prefer dataset `id` over dataset `name`. |
| Citation | Keep `_temp` APA and BibTeX behavior exactly, but use `Research Portal` as publisher name. |
| API snippets | Merge `_temp` and `v2` snippet coverage so the final app supports curl, Python, R, and JavaScript. |
| Dataset reuse UI | Rebuild the `_temp` "Use this dataset" dropdown in `v2`, preserving all actions. |
| Dataset metadata | Show all metadata fields present in `_temp`. |
| Resource previews | Support CSV, PDF, GeoJSON, iframe, and JSON. Excel/XLS/XLSX should not be implemented yet. |
| GeoJSON | Add the needed GeoJSON/map dependencies. |
| Reports | Use `Reports` in labels and slug. Preserve `_temp` report behavior and story-specific chart mappings. |
| Reports localization | Reports should not be localized for now; use only the language/content present in `/content`. |
| Homepage visualizations | Keep `_temp` fixed remote CSV visualizations and URLs. |
| Homepage design | Keep `v2` visual design and add `_temp` AI prompts and Reports section. |
| Branding | Keep `v2` branding style, but site name should be `Research Portal`. |
| CKAN/DMS URL | Use `_temp` `NEXT_PUBLIC_DMS` value for the migrated app. |
| DMS compatibility | Support both PortalJS Cloud-style DMS URLs and plain CKAN URLs. |
| Search type filter | Use `_temp` CKAN search behavior: `dataset_type:${type}`. |
| Organization/group search | Keep `v2` query-param filtering; no need to restore MiniSearch. |
| Activity streams | Keep activity stream feature, but add an environment variable to control visibility. Default should be `false`. |
| Queryless enablement | Use `_temp` behavior: `NEXT_PUBLIC_QUERYLESS_ENABLED`. |
| AI terms | Restore `/ai-terms-of-use` and link to it from Queryless. |
| Queryless routes | Use the best route instructions based on canonical URLs; resource URLs should use old `/r/` canonical route. |
| Google Analytics | Restore `_temp` `NEXT_PUBLIC_GA_TRACKING_ID` behavior. |
| JSON-LD | Migrate all `_temp` structured data components: home, search, dataset, resource, group, organization. |
| Canonical URLs | Canonical URLs should not include locale prefixes; default language should be unprefixed. |
| i18n | Keep only English for now. |
| DataHub importer | Keep `_temp` importer behavior, target org defaults, dry-run/apply behavior, and docs. |
| Tests | Apply old utility tests into `v2` in the best maintainable way. |
| Accessibility | Restore `_temp` Playwright, Pa11y, and Lighthouse accessibility checks in addition to adapting for `v2`. |
| Build strictness | Keep `v2` strictness and fix issues as migration proceeds. |
| Migration order | Codex should choose the safest order. |
| Task tracking | Maintain a separate tasklist file and check items after each task is completed. |

## 2. Repository Comparison

| Area | `_temp` evidence | `_temp` summary | `v2` evidence | `v2` summary |
| --- | --- | --- | --- | --- |
| Framework version | `_temp/package.json` | Next.js `^13.0.0`, React `^18.0.0`, TypeScript `4.7.4`, Pages Router. | `v2/package.json` | Next.js `15.5.9`, React `^19.1.1`, TypeScript `^5`, App Router. |
| PortalJS packages | `_temp/package.json` | Uses `@portaljs/ckan`, `@portaljs/ckan-api-client-js`, `@portaljs/components`. | `v2/package.json` | Uses `@portaljs/ckan-api-client-js`; does not include `@portaljs/components` or `@portaljs/ckan`. |
| Main structure | `_temp/pages`, `_temp/components`, `_temp/lib`, `_temp/themes`, `_temp/content`, `_temp/scripts`, `_temp/tests` | Pages Router app with theme folder, MDX story content, custom scripts, and Playwright/node tests. | `v2/src/app`, `v2/src/components`, `v2/src/lib`, `v2/src/i18n`, `v2/messages`, `v2/cypress` | App Router template with localized routes, component primitives, CKAN lib layer, Cypress accessibility tests. |
| Routing approach | `_temp/pages/index.tsx`, `_temp/pages/search.tsx`, `_temp/pages/[org]/[dataset]/index.tsx`, `_temp/pages/[org]/[dataset]/r/[resourceId].tsx` | Pages Router with `getServerSideProps` and `getStaticProps`; dynamic dataset route uses `/@org/dataset`, resource route uses `/@org/dataset/r/resourceId`. | `v2/src/app/[locale]/...` | App Router under `[locale]`; dataset route is `/[locale]/@org/dataset`; resource route is `/[locale]/@org/dataset/resource`, without `/r`. |
| Styling approach | `_temp/tailwind.config.js`, `_temp/styles/*.scss`, `_temp/themes/default`, `_temp/themes/lighter`, `_temp/pages/_app.tsx` | Tailwind 3, SCSS modules, theme provider, imported PortalJS/Leaflet styles, Google fonts. | `v2/src/app/globals.css`, `v2/src/app/portal-theme.css`, `v2/components.json` | Tailwind 4 CSS-first setup, CSS variables, shadcn-style primitives, lucide icons, branded theme file. |
| CKAN/data fetching | `_temp/lib/queries/dataset.ts`, `_temp/lib/queries/groups.ts`, `_temp/lib/queries/orgs.ts` | Uses `NEXT_PUBLIC_DMS`, `@portaljs/ckan-api-client-js`, and `@portaljs/ckan` CKAN class. Search filters use `dataset_type:${type}`. | `v2/src/lib/ckan/*.ts`, `v2/src/lib/ckan/api.ts`, `v2/src/lib/isr.ts` | Fetch-based CKAN layer with retry helpers, ISR revalidation, slug normalization, and activity APIs. Search filters use `type:${type}`. |
| Build/deploy config | `_temp/next.config.js`, `_temp/.github/workflows/accessibility.yml`, `_temp/scripts/generate-routes.js` | Ignores ESLint/type errors during build, image domains configured, route generation for Pages Router and CKAN sample routes. | `v2/next.config.ts`, `v2/.github/workflows/a11y.yml`, `v2/scripts/generate-routes.mjs` | Next 15 config with `next-intl`, route generation for App Router, localized sample CKAN routes. |
| Important dependencies | `_temp/package.json` | `next-seo`, `next-mdx-remote`, `gray-matter`, `minisearch`, `@observablehq/plot`, `recharts`, `react-vega`, `primereact`, `sass`, `swr`, `papaparse`, `vega-embed`, Playwright/Pa11y/LHCI. | `v2/package.json` | `next-intl`, `@tanstack/react-query`, `lucide-react`, `@radix-ui/react-tabs`, `vega-embed`, `papaparse`, Cypress/Axe, Tailwind 4. |
| Notable differences | `_temp/pages/_app.tsx`, `_temp/pages/_document.tsx`, `_temp/components/theme/theme-provider.tsx` | Global shell includes `DefaultSeo`, theme provider, Queryless assistant, loader, GA route tracking. | `v2/src/app/[locale]/layout.tsx`, `v2/src/middleware.ts`, `v2/src/lib/seo.ts` | App Router layout, `next-intl` middleware, metadata API, localized SEO, no old theme provider. |

## 3. Discovered Modules in `_temp`

| Module | Evidence / File Paths | Description | Confidence |
| --- | --- | --- | --- |
| Home page and research visualizations | `_temp/pages/index.tsx`, `_temp/components/home/**`, `_temp/types/chartData.ts`, `_temp/lib/parseCsv.ts` | Homepage aggregates CKAN stats, featured datasets, groups, story cards, and CSV-backed chart data. | High |
| Dataset search | `_temp/pages/search.tsx`, `_temp/components/dataset/search/**`, `_temp/lib/queries/dataset.ts` | Dataset and visualization search with facets, filters, pagination, SWR fallback, and search state. | High |
| Dataset detail and reuse affordances | `_temp/pages/[org]/[dataset]/index.tsx`, `_temp/components/dataset/individualPage/DatasetInfo.tsx`, `_temp/lib/citation.js`, `_temp/lib/doi.js`, `_temp/lib/dataset-links.js`, `_temp/lib/api-access.js` | Dataset page with ownership validation, metadata, resources, stable URL, generated DOI, citation, API snippets, metadata export links. | High |
| Resource detail and previews | `_temp/pages/[org]/[dataset]/r/[resourceId].tsx`, `_temp/components/dataset/individualPage/ResourcePreview.tsx`, `_temp/components/responsiveGrid/**`, `_temp/components/dataset/resource/GeoJsonMap.jsx` | Resource page and inline previews for CSV, PDF, Excel, GeoJSON, and iframe resources. | High |
| Organizations | `_temp/pages/organizations.tsx`, `_temp/pages/[org]/index.tsx`, `_temp/components/organization/**`, `_temp/lib/queries/orgs.ts` | Organization listing, text search, individual organization page, dataset tab. | High |
| Groups | `_temp/pages/groups/index.tsx`, `_temp/pages/groups/[groupName].tsx`, `_temp/components/groups/**`, `_temp/lib/queries/groups.ts` | Group listing, text search, individual group page, dataset tab. | High |
| Topics | `_temp/pages/topics/index.tsx`, `_temp/pages/topics/[topicName].tsx`, `_temp/components/groups/**`, `_temp/lib/queries/groups.ts` | Topics are implemented as a separate route surface backed by CKAN groups. | High |
| Stories / reports | `_temp/pages/stories/index.tsx`, `_temp/pages/stories/[slug].tsx`, `_temp/content/stories/*.mdx`, `_temp/content/stories/*.cover.ts`, `_temp/components/stories/**`, `_temp/lib/stories.ts` | MDX reports with frontmatter, related datasets, and story-specific chart components. | High |
| Queryless AI assistant | `_temp/pages/api/queryless-chat.ts`, `_temp/components/queryless/**`, `_temp/pages/ai-terms-of-use.tsx`, `_temp/pages/_app.tsx` | Floating AI assistant, streaming API proxy, page context, rate limits, daily limits, Markdown and Vega rendering, terms page. | High |
| SEO, structured data, and analytics | `_temp/next-seo.config.js`, `_temp/components/schema/**`, `_temp/pages/_app.tsx`, `_temp/pages/_document.tsx` | Default SEO, page-specific JSON-LD components, Google Analytics script and route tracking. | High |
| Theme, layout, and branding | `_temp/components/theme/theme-provider.tsx`, `_temp/themes/default/**`, `_temp/themes/lighter/**`, `_temp/components/_shared/**`, `_temp/styles/**`, `_temp/public/images/**` | Theme provider, headers/footers/sidebar layouts, shared layout components, global SCSS, logo/images/backgrounds. | High |
| DataHub demo importer | `_temp/scripts/import-datahub-demo.mjs`, `_temp/scripts/datahub-importer-lib.mjs`, `_temp/scripts/datahub-demo-manifest.mjs`, `_temp/tests/datahub-importer.test.mjs`, `_temp/README.md` | Scripted import/upsert workflow for curated DataHub datasets into CKAN. | High |
| Accessibility and route test tooling | `_temp/docs/accessibility.md`, `_temp/tests/a11y.spec.ts`, `_temp/scripts/generate-routes.js`, `_temp/scripts/run-pa11y-from-routes.js`, `_temp/scripts/run-lhci-from-routes.js`, `_temp/.pa11yci.json`, `_temp/.lighthouserc.base.json` | Route generation plus Playwright, Pa11y, and Lighthouse accessibility checks. | High |
| API utility tests | `_temp/tests/api-access.test.mjs`, `_temp/tests/citation.test.mjs`, `_temp/tests/dataset-links.test.mjs`, `_temp/tests/doi.test.mjs` | Node tests covering dataset reuse helper utilities. | High |

## 4. Feature Inventory from `_temp`

| Module | Feature | Evidence / File Paths | Description | Dependencies / Related Code | Confidence |
| --- | --- | --- | --- | --- | --- |
| Home page and research visualizations | Homepage stats from CKAN | `_temp/pages/index.tsx`, `_temp/lib/queries/dataset.ts`, `_temp/lib/queries/groups.ts`, `_temp/lib/queries/orgs.ts` | Counts datasets, groups, organizations, and visualizations. | `NEXT_PUBLIC_DMS`, `@portaljs/ckan-api-client-js` | High |
| Home page and research visualizations | Featured datasets | `_temp/pages/index.tsx`, `_temp/components/home/mainSection/PopularDatasets.tsx` | Shows latest datasets from CKAN. | `searchDatasets` | High |
| Home page and research visualizations | CSV-backed visual chart data | `_temp/pages/index.tsx`, `_temp/components/home/visualizationsCarousel/**`, `_temp/lib/parseCsv.ts`, `_temp/types/chartData.ts` | Fetches fixed remote CSV URLs and aggregates imports, exports, trade partners, and government finance data. | `@observablehq/plot`, `recharts`, remote `blob.datopian.com` CSVs | High |
| Home page and research visualizations | Featured reports on homepage | `_temp/pages/index.tsx`, `_temp/components/home/FeaturedStoriesSection.tsx`, `_temp/lib/stories.ts` | Reads MDX story metadata and displays featured report cards. | `gray-matter`, local `content/stories` | High |
| Dataset search | Search page with facets | `_temp/pages/search.tsx`, `_temp/components/dataset/search/DatasetSearchFilters.tsx`, `_temp/components/dataset/search/SearchContext.tsx` | Faceted search for groups, organizations, resource formats, and tags. | `SWRConfig`, `@portaljs/ckan`, `searchDatasets` | High |
| Dataset search | Dataset and visualization type switching | `_temp/pages/search.tsx`, `_temp/components/dataset/search/SearchContext.tsx`, `_temp/lib/queries/dataset.ts` | Search can target `dataset` or `visualization`. | CKAN search `dataset_type:${options.type}` | Medium |
| Dataset search | Search results cards and pagination | `_temp/components/dataset/search/ListOfDatasets.tsx`, `_temp/components/dataset/search/DatasetCard.tsx`, `_temp/components/dataset/search/Pagination.tsx` | Displays result list and pagination controls. | Search context | High |
| Dataset detail and reuse affordances | Dataset route ownership validation | `_temp/pages/[org]/[dataset]/index.tsx` | Requires URL org segment to start with `@` and match `dataset.organization.name`. | `getDataset` | High |
| Dataset detail and reuse affordances | Dataset metadata sidebar/info | `_temp/components/dataset/individualPage/DatasetInfo.tsx`, `_temp/components/_shared/MarkdownRenderer.tsx` | Shows description, dates, formats, file count, tags, source links, license. | `react-markdown`, `getTimeAgo` | High |
| Dataset detail and reuse affordances | Use this dataset dropdown | `_temp/components/dataset/individualPage/DatasetInfo.tsx` | Provides download, API access, citation, DOI copy, and stable URL actions. | `@headlessui/react`, clipboard API | High |
| Dataset detail and reuse affordances | Generated DOI | `_temp/lib/doi.js`, `_temp/components/dataset/individualPage/DatasetInfo.tsx`, `_temp/tests/doi.test.mjs` | Deterministically generates mock DOI from dataset name. | Node tests | High |
| Dataset detail and reuse affordances | Citation generation | `_temp/lib/citation.js`, `_temp/components/dataset/individualPage/DatasetInfo.tsx`, `_temp/tests/citation.test.mjs` | Formats APA and BibTeX dataset citations. | Generated DOI, stable URL | High |
| Dataset detail and reuse affordances | Stable dataset URL helpers | `_temp/lib/dataset-links.js`, `_temp/tests/dataset-links.test.mjs` | Builds stable `/@org/dataset-or-id` paths and absolute URLs. | `next-seo.config.js` site URL | High |
| Dataset detail and reuse affordances | API access snippets | `_temp/lib/api-access.js`, `_temp/components/dataset/individualPage/DatasetInfo.tsx`, `_temp/components/dataset/individualPage/ResourcesList.tsx`, `_temp/tests/api-access.test.mjs` | Generates curl, Python, and R snippets for dataset and resource access. | `NEXT_PUBLIC_DMS` | High |
| Dataset detail and reuse affordances | Metadata export links | `_temp/components/dataset/individualPage/DatasetInfo.tsx` | Links to CKAN RDF, TTL, and JSON-LD exports. | `NEXT_PUBLIC_DMS` | High |
| Resource detail and previews | Resource route and validation | `_temp/pages/[org]/[dataset]/r/[resourceId].tsx` | Loads resource metadata and displays resource page under `/r/`. | `@portaljs/ckan` CKAN class | High |
| Resource detail and previews | CSV explorer | `_temp/components/responsiveGrid/**`, `_temp/components/dataset/individualPage/ResourcePreview.tsx` | CSV table with global search, column filters, date/range handling, pin/hide columns, pagination. | `papaparse`, `rc-slider`, `primereact` | High |
| Resource detail and previews | PDF and Excel previews | `_temp/pages/[org]/[dataset]/r/[resourceId].tsx`, `_temp/components/dataset/individualPage/ResourcePreview.tsx` | Dynamically loads PortalJS PDF and Excel viewers. | `@portaljs/components`, `next/dynamic` | High |
| Resource detail and previews | GeoJSON map preview | `_temp/components/dataset/resource/GeoJsonMap.jsx`, `_temp/components/dataset/individualPage/ResourcePreview.tsx` | Dynamic GeoJSON preview. | `leaflet` CSS imported in `_app.tsx` | Medium |
| Resource detail and previews | Iframe preview | `_temp/pages/[org]/[dataset]/r/[resourceId].tsx`, `_temp/components/dataset/individualPage/ResourcePreview.tsx` | Embeds resource URL if `resource.iframe` is set. | Resource metadata | High |
| Organizations | Organization listing with MiniSearch | `_temp/pages/organizations.tsx`, `_temp/components/organization/ListOfOrganizations.tsx` | Lists organizations and filters client-side by text. | `minisearch` | High |
| Organizations | Organization detail with dataset tab | `_temp/pages/[org]/index.tsx`, `_temp/components/organization/individualPage/**`, `_temp/components/_shared/DatasetList.tsx` | Shows organization metadata and datasets filtered by owner org. | `searchDatasets` with `owner_org` fq | High |
| Groups | Group listing with MiniSearch | `_temp/pages/groups/index.tsx`, `_temp/components/groups/ListOfGroups.tsx` | Lists groups and filters client-side by text. | `minisearch` | High |
| Groups | Group detail with dataset tab | `_temp/pages/groups/[groupName].tsx`, `_temp/components/groups/individualPage/**`, `_temp/components/_shared/DatasetList.tsx` | Shows group metadata and datasets filtered by group. | `searchDatasets` with `groups` fq | High |
| Topics | Topics listing backed by groups | `_temp/pages/topics/index.tsx` | Separate `/topics` listing using CKAN groups. | `getAllGroups`, `ListOfGroups` | High |
| Topics | Topic detail backed by group | `_temp/pages/topics/[topicName].tsx` | Separate `/topics/:topicName` detail page using group data and datasets. | `getGroup`, `DatasetList` | High |
| Stories / reports | Report index | `_temp/pages/stories/index.tsx`, `_temp/lib/stories.ts`, `_temp/components/stories/StoryCard.tsx` | Lists local MDX reports as "Reports". | `gray-matter` | High |
| Stories / reports | MDX report pages | `_temp/pages/stories/[slug].tsx`, `_temp/content/stories/*.mdx` | Static report pages with frontmatter, breadcrumbs, related datasets. | `next-mdx-remote` | High |
| Stories / reports | Story chart components | `_temp/pages/stories/[slug].tsx`, `_temp/content/stories/*.cover.ts`, `_temp/components/stories/Chart.tsx` | Injects story-specific chart components into MDX. | `vega-embed` / chart specs | High |
| Queryless AI assistant | Queryless API proxy | `_temp/pages/api/queryless-chat.ts` | POST route proxies messages to Queryless, supports streaming SSE. | `QUERYLESS_URL`, `QUERYLESS_TOKEN`, `QUERYLESS_MODEL`, `NEXT_PUBLIC_DMS` | High |
| Queryless AI assistant | Floating AI assistant UI | `_temp/components/queryless/QuerylessAssistant.tsx`, `_temp/pages/_app.tsx` | Floating "Ask AI" drawer with page-aware context, Markdown rendering, localStorage persistence. | `NEXT_PUBLIC_QUERYLESS_ENABLED`, `NEXT_PUBLIC_QUERYLESS_API_ROUTE` | High |
| Queryless AI assistant | Queryless chart rendering | `_temp/components/queryless/VegaSpecRenderer.tsx`, `_temp/components/queryless/ChartRenderer.tsx` | Parses chart/vega code blocks and renders Vega or Recharts-based charts. | `vega-embed`, `recharts`, `zod` | Medium |
| Queryless AI assistant | AI terms page | `_temp/pages/ai-terms-of-use.tsx`, `_temp/components/queryless/QuerylessAssistant.tsx` | Assistant footer links to terms of use. | Static page | High |
| SEO, structured data, and analytics | Default SEO config | `_temp/next-seo.config.js`, `_temp/pages/_app.tsx` | Site title, description, canonical, Open Graph, Twitter, icons. | `next-seo` | High |
| SEO, structured data, and analytics | Page JSON-LD structured data | `_temp/components/schema/**`, `_temp/pages/index.tsx`, `_temp/pages/search.tsx`, `_temp/pages/groups/**`, `_temp/pages/organizations.tsx`, `_temp/pages/[org]/**` | Injects structured data for home, search, dataset, resource, group, organization pages. | React schema components | High |
| SEO, structured data, and analytics | Google Analytics tracking | `_temp/pages/_document.tsx`, `_temp/pages/_app.tsx` | Loads gtag and tracks route changes. | `NEXT_PUBLIC_GA_TRACKING_ID` | High |
| Theme, layout, and branding | Theme provider and theme variants | `_temp/components/theme/theme-provider.tsx`, `_temp/themes/default/**`, `_temp/themes/lighter/**` | Provides default/lighter themes with header, footer, sidebar, layout. | React context | High |
| Theme, layout, and branding | Shared page chrome and assets | `_temp/components/_shared/**`, `_temp/styles/**`, `_temp/public/images/**` | Shared top bar, footer, hero, loader, tabs, logos, backgrounds. | Tailwind/SCSS | High |
| DataHub demo importer | DataHub manifest import/upsert | `_temp/scripts/import-datahub-demo.mjs`, `_temp/scripts/datahub-importer-lib.mjs`, `_temp/scripts/datahub-demo-manifest.mjs` | Imports curated DataHub demo datasets, groups, tags, resources into CKAN. | `CKAN_API_KEY`, `NEXT_PUBLIC_DMS`, `dotenv` | High |
| Accessibility and route test tooling | Accessibility CI | `_temp/docs/accessibility.md`, `_temp/.github/workflows/accessibility.yml`, `_temp/tests/a11y.spec.ts`, `_temp/.pa11yci.json`, `_temp/.lighthouserc.base.json` | Playwright/Axe, Pa11y, Lighthouse route checks. | `public/__routes.json`, generated routes | High |
| API utility tests | Node utility tests | `_temp/tests/*.test.mjs` | Tests helper behavior for DOI, citation, API snippets, stable URLs, importer. | Node test runner | High |

## 5. Feature Coverage in `v2`

| `_temp` Module | `_temp` Feature | `_temp` Evidence | Closest `v2` Equivalent | `v2` Evidence | Coverage Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Home page and research visualizations | Homepage stats from CKAN | `_temp/pages/index.tsx` | Home stats | `v2/src/app/[locale]/page.tsx` | Already implemented in `v2` | `v2` has dataset/org/group/visualization stats. |
| Home page and research visualizations | Featured datasets | `_temp/pages/index.tsx` | Featured datasets | `v2/src/app/[locale]/page.tsx`, `v2/src/components/package/dataset/DatasetCard.tsx` | Already implemented in `v2` | Uses App Router and current card system. |
| Home page and research visualizations | CSV-backed visual chart data | `_temp/pages/index.tsx`, `_temp/components/home/visualizationsCarousel/**` | None found | None found in `v2/src/app/[locale]/page.tsx` | Missing in `v2` | Research-specific visualization carousel is absent. |
| Home page and research visualizations | Featured reports on homepage | `_temp/components/home/FeaturedStoriesSection.tsx` | None found | No `v2/src/app/[locale]/stories` or content stories | Missing in `v2` | Depends on stories module migration. |
| Dataset search | Search page with facets | `_temp/pages/search.tsx` | Search layout and facets | `v2/src/app/[locale]/search/page.tsx`, `v2/src/components/package/search/**` | Implemented differently in `v2` | Similar feature, App Router and `next-intl` architecture. |
| Dataset search | Dataset and visualization type switching | `_temp/components/dataset/search/SearchContext.tsx` | Search type switcher | `v2/src/components/package/search/SearchTypeSwitcher.tsx`, `v2/src/lib/ckan/dataset.ts` | Partially implemented in `v2` | Needs verification of CKAN filter field: `_temp` uses `dataset_type`, `v2` uses `type`. |
| Dataset search | Search results cards and pagination | `_temp/components/dataset/search/**` | Search results section and pagination | `v2/src/components/package/search/SearchResultsSection.tsx`, `v2/src/components/package/search/Pagination.tsx` | Already implemented in `v2` | Keep `v2` UI. |
| Dataset detail and reuse affordances | Dataset route ownership validation | `_temp/pages/[org]/[dataset]/index.tsx` | Dataset page validation | `v2/src/app/[locale]/[org]/[dataset]/page.tsx` | Already implemented in `v2` | `v2` also validates org ownership. |
| Dataset detail and reuse affordances | Dataset metadata sidebar/info | `_temp/components/dataset/individualPage/DatasetInfo.tsx` | Dataset sidebar/Page metadata | `v2/src/components/package/dataset/DatasetSidebar.tsx`, `v2/src/app/[locale]/[org]/[dataset]/page.tsx` | Partially implemented in `v2` | `v2` has metadata but not all old fields/actions. |
| Dataset detail and reuse affordances | Use this dataset dropdown | `_temp/components/dataset/individualPage/DatasetInfo.tsx` | API tab/export/download areas | `v2/src/components/package/api/ApiTab.tsx`, `v2/src/components/package/dataset/DatasetSidebar.tsx` | Missing in `v2` | No combined reuse dropdown with DOI/citation/stable URL actions. |
| Dataset detail and reuse affordances | Generated DOI | `_temp/lib/doi.js` | None found | No `v2/src/lib/doi` | Missing in `v2` | Need manual confirmation whether mock DOI should remain. |
| Dataset detail and reuse affordances | Citation generation | `_temp/lib/citation.js` | None found | No `v2/src/lib/citation` | Missing in `v2` | Should be rebuilt if research citation behavior is still required. |
| Dataset detail and reuse affordances | Stable dataset URL helpers | `_temp/lib/dataset-links.js` | SEO/site URL helpers | `v2/src/lib/seo.ts`, `v2/src/lib/env.ts` | Partially implemented in `v2` | `v2` has site URL metadata, not old stable path helper behavior. |
| Dataset detail and reuse affordances | API access snippets | `_temp/lib/api-access.js` | API tabs | `v2/src/components/package/api/ApiTab.tsx`, `v2/src/lib/utils.ts` | Implemented differently in `v2` | `v2` offers Python/JavaScript tabs; `_temp` offers curl/Python/R and resource snippets. |
| Dataset detail and reuse affordances | Metadata export links | `_temp/components/dataset/individualPage/DatasetInfo.tsx` | Export buttons | `v2/src/components/package/dataset/DatasetSidebar.tsx` | Already implemented in `v2` | RDF/TTL/JSON-LD export exists. |
| Resource detail and previews | Resource route and validation | `_temp/pages/[org]/[dataset]/r/[resourceId].tsx` | Resource page | `v2/src/app/[locale]/[org]/[dataset]/[resource]/page.tsx` | Implemented differently in `v2` | `v2` omits `/r` segment and validates package/resource relationship. |
| Resource detail and previews | CSV explorer | `_temp/components/responsiveGrid/**` | CSV explorer | `v2/src/components/csv-explorer/**` | Replaced by better `v2` approach | Similar module already adapted to `v2`. |
| Resource detail and previews | PDF and Excel previews | `_temp/components/dataset/individualPage/ResourcePreview.tsx` | PDF/JSON/CSV/iframe preview | `v2/src/components/package/resource/ResourcePreview.tsx`, `v2/src/lib/resource.ts` | Partially implemented in `v2` | PDF covered; Excel not covered. |
| Resource detail and previews | GeoJSON map preview | `_temp/components/dataset/resource/GeoJsonMap.jsx` | None active | `v2/src/lib/resource.ts` comments out `geojson` | Missing in `v2` | Needs manual review before migrating map support. |
| Resource detail and previews | Iframe preview | `_temp/components/dataset/individualPage/ResourcePreview.tsx` | Iframe preview | `v2/src/components/package/resource/ResourcePreview.tsx` | Already implemented in `v2` | Keep `v2` implementation. |
| Organizations | Organization listing with MiniSearch | `_temp/pages/organizations.tsx` | Server-rendered query filtering | `v2/src/app/[locale]/organizations/page.tsx` | Implemented differently in `v2` | `v2` uses query param filtering, not MiniSearch. |
| Organizations | Organization detail with dataset tab | `_temp/pages/[org]/index.tsx` | Organization detail | `v2/src/app/[locale]/[org]/page.tsx` | Already implemented in `v2` | `v2` also includes activity stream. |
| Groups | Group listing with MiniSearch | `_temp/pages/groups/index.tsx` | Server-rendered query filtering | `v2/src/app/[locale]/groups/page.tsx` | Implemented differently in `v2` | `v2` uses query param filtering and slug normalization. |
| Groups | Group detail with dataset tab | `_temp/pages/groups/[groupName].tsx` | Group detail | `v2/src/app/[locale]/groups/[group]/page.tsx` | Already implemented in `v2` | `v2` also includes activity stream. |
| Topics | Topics listing backed by groups | `_temp/pages/topics/index.tsx` | Groups page | `v2/src/app/[locale]/groups/page.tsx` | Missing in `v2` | No `/topics` alias/surface found. |
| Topics | Topic detail backed by group | `_temp/pages/topics/[topicName].tsx` | Group detail page | `v2/src/app/[locale]/groups/[group]/page.tsx` | Missing in `v2` | No `/topics/:topicName` route found. |
| Stories / reports | Report index | `_temp/pages/stories/index.tsx` | None found | No `v2/src/app/[locale]/stories` | Missing in `v2` | Must migrate if reports remain required. |
| Stories / reports | MDX report pages | `_temp/pages/stories/[slug].tsx` | None found | No MDX story stack in `v2/package.json` | Missing in `v2` | Requires new App Router MDX strategy. |
| Stories / reports | Story chart components | `_temp/components/stories/Chart.tsx` | Vega renderer only in Queryless | `v2/src/components/queryless/VegaSpecRenderer.tsx` | Partially implemented in `v2` | Chart rendering exists but not story integration. |
| Queryless AI assistant | Queryless API proxy | `_temp/pages/api/queryless-chat.ts` | App Router route handler | `v2/src/app/api/queryless-chat/route.ts` | Replaced by better `v2` approach | Same core behavior, modern route handler. |
| Queryless AI assistant | Floating AI assistant UI | `_temp/components/queryless/QuerylessAssistant.tsx` | Queryless assistant | `v2/src/components/queryless/QuerylessAssistant.tsx`, `v2/src/lib/queryless.ts` | Replaced by better `v2` approach | `v2` version is adapted to App Router and design system. |
| Queryless AI assistant | Queryless chart rendering | `_temp/components/queryless/VegaSpecRenderer.tsx`, `_temp/components/queryless/ChartRenderer.tsx` | Vega renderer | `v2/src/components/queryless/VegaSpecRenderer.tsx` | Partially implemented in `v2` | Vega covered; old Recharts `ChartRenderer` not found in use. |
| Queryless AI assistant | AI terms page | `_temp/pages/ai-terms-of-use.tsx` | None found | No `v2/src/app/[locale]/ai-terms-of-use/page.tsx` | Missing in `v2` | `v2` footer text no longer links terms; confirm requirement. |
| SEO, structured data, and analytics | Default SEO config | `_temp/next-seo.config.js` | Metadata helper | `v2/src/lib/seo.ts`, `v2/src/app/[locale]/**/page.tsx` | Implemented differently in `v2` | Use App Router metadata, not `next-seo`. |
| SEO, structured data, and analytics | Page JSON-LD structured data | `_temp/components/schema/**` | Metadata only | `v2/src/lib/seo.ts` | Missing in `v2` | No JSON-LD components found. |
| SEO, structured data, and analytics | Google Analytics tracking | `_temp/pages/_document.tsx`, `_temp/pages/_app.tsx` | None found | No GA env usage in `v2` | Missing in `v2` | Needs confirmation before adding analytics. |
| Theme, layout, and branding | Theme provider and theme variants | `_temp/themes/**`, `_temp/components/theme/theme-provider.tsx` | Portal theme CSS and layout components | `v2/src/app/portal-theme.css`, `v2/src/components/layout/**` | Replaced by better `v2` approach | Do not migrate old theme provider directly. |
| Theme, layout, and branding | Shared page chrome and assets | `_temp/components/_shared/**`, `_temp/public/images/**` | Layout/UI primitives | `v2/src/components/layout/**`, `v2/src/components/ui/**`, `v2/public/logo.svg` | Partially implemented in `v2` | Migrate only brand assets/copy that are still needed. |
| DataHub demo importer | DataHub manifest import/upsert | `_temp/scripts/import-datahub-demo.mjs` | None found | No `v2/scripts/import-datahub-demo.mjs` | Missing in `v2` | README in `_temp` documents it; migrate if data seeding is part of project. |
| Accessibility and route test tooling | Accessibility CI | `_temp/docs/accessibility.md`, `_temp/tests/a11y.spec.ts` | Cypress/Axe a11y | `v2/cypress/e2e/a11y-all-pages.cy.ts`, `v2/scripts/generate-routes.mjs`, `v2/docs/accessibility/README.md` | Replaced by better `v2` approach | Keep `v2` Cypress stack unless Pa11y/LHCI are explicitly required. |
| API utility tests | Node utility tests | `_temp/tests/*.test.mjs` | None found for those utilities | `v2/cypress/**` only | Missing in `v2` | Recreate focused tests when migrating utilities. |

## 6. Migration Decisions

| Module | Feature | Coverage Status | Migration Decision | Reason | Implementation Notes |
| --- | --- | --- | --- | --- | --- |
| Home page and research visualizations | Homepage stats from CKAN | Already implemented in `v2` | Keep `v2` implementation | Equivalent feature exists in current architecture. | Verify visual count filter field. |
| Home page and research visualizations | Featured datasets | Already implemented in `v2` | Keep `v2` implementation | Current card system matches template. | Preserve `v2` design. |
| Home page and research visualizations | CSV-backed visual chart data | Missing in `v2` | Rebuild using `v2` architecture | Old code is Pages Router server-side aggregation. | Add a localized App Router section only if still desired. |
| Home page and research visualizations | Featured reports on homepage | Missing in `v2` | Rebuild using `v2` architecture | Depends on story migration. | Use `v2` layout/cards. |
| Dataset search | Search page with facets | Implemented differently in `v2` | Keep `v2` implementation | Existing App Router search is the right base. | Compare filter semantics before changing. |
| Dataset search | Dataset and visualization type switching | Partially implemented in `v2` | Merge `_temp` behavior into existing `v2` feature | Possible CKAN field mismatch. | Confirm whether target API expects `type` or `dataset_type`. |
| Dataset search | Search results cards and pagination | Already implemented in `v2` | Keep `v2` implementation | Current template has equivalent functionality. | No old component copying. |
| Dataset detail and reuse affordances | Dataset route ownership validation | Already implemented in `v2` | Keep `v2` implementation | `v2` validation is at least equivalent. | Keep App Router `notFound`. |
| Dataset detail and reuse affordances | Dataset metadata sidebar/info | Partially implemented in `v2` | Merge `_temp` behavior into existing `v2` feature | Some custom fields/actions missing. | Add only missing research metadata fields. |
| Dataset detail and reuse affordances | Use this dataset dropdown | Missing in `v2` | Rebuild using `v2` architecture | Valuable custom feature, but old UI is tied to old components. | Implement with `v2` UI primitives. |
| Dataset detail and reuse affordances | Generated DOI | Missing in `v2` | Needs manual review | Mock DOI may be demo-only. | Confirm whether deterministic fake DOI is acceptable. |
| Dataset detail and reuse affordances | Citation generation | Missing in `v2` | Migrate from `_temp` | Utility is small and tested. | Convert to TypeScript under `v2/src/lib`. |
| Dataset detail and reuse affordances | Stable dataset URL helpers | Partially implemented in `v2` | Merge `_temp` behavior into existing `v2` feature | Stable URL helper is not covered by metadata helper. | Use `NEXT_PUBLIC_SITE_URL` from `v2/src/lib/env.ts`. |
| Dataset detail and reuse affordances | API access snippets | Implemented differently in `v2` | Merge `_temp` behavior into existing `v2` feature | `v2` API examples lack curl/R and resource direct snippets. | Extend `ApiTab` or add reuse panel. |
| Dataset detail and reuse affordances | Metadata export links | Already implemented in `v2` | Keep `v2` implementation | Feature exists in `DatasetSidebar`. | Validate DMS URL format. |
| Resource detail and previews | Resource route and validation | Implemented differently in `v2` | Keep `v2` implementation | `v2` validation is stronger, but route shape changed. | Decide whether old `/r/` redirects are needed. |
| Resource detail and previews | CSV explorer | Replaced by better `v2` approach | Keep `v2` implementation | `v2` has adapted `csv-explorer`. | Validate feature parity manually. |
| Resource detail and previews | PDF and Excel previews | Partially implemented in `v2` | Merge `_temp` behavior into existing `v2` feature | PDF covered, Excel missing. | Add Excel only if required and dependency accepted. |
| Resource detail and previews | GeoJSON map preview | Missing in `v2` | Needs manual review | Behavior exists but implementation details unclear from static read. | Confirm data and map dependency requirements. |
| Resource detail and previews | Iframe preview | Already implemented in `v2` | Keep `v2` implementation | Equivalent behavior exists. | No action. |
| Organizations | Organization listing with MiniSearch | Implemented differently in `v2` | Keep `v2` implementation | Query param search is simpler and localized. | No MiniSearch migration unless behavior proves insufficient. |
| Organizations | Organization detail with dataset tab | Already implemented in `v2` | Keep `v2` implementation | Equivalent plus activity stream. | Validate owner org filtering. |
| Groups | Group listing with MiniSearch | Implemented differently in `v2` | Keep `v2` implementation | Query param search and slug helpers are current. | No MiniSearch migration. |
| Groups | Group detail with dataset tab | Already implemented in `v2` | Keep `v2` implementation | Equivalent plus activity stream. | Validate group slug conversion. |
| Topics | Topics listing backed by groups | Missing in `v2` | Rebuild using `v2` architecture | `/topics` is an old public route surface backed by groups. | Implement as alias or redirect after product decision. |
| Topics | Topic detail backed by group | Missing in `v2` | Rebuild using `v2` architecture | Same data as group page but different URL and labels. | Consider redirect to `/groups` if acceptable. |
| Stories / reports | Report index | Missing in `v2` | Rebuild using `v2` architecture | Real local content exists. | Add App Router stories routes. |
| Stories / reports | MDX report pages | Missing in `v2` | Rebuild using `v2` architecture | Old `next-mdx-remote` pattern should not be copied blindly. | Choose App Router-compatible MDX approach. |
| Stories / reports | Story chart components | Partially implemented in `v2` | Merge `_temp` behavior into existing `v2` feature | Chart renderer exists only for Queryless. | Share Vega renderer if possible. |
| Queryless AI assistant | Queryless API proxy | Replaced by better `v2` approach | Keep `v2` implementation | App Router route handler is equivalent and cleaner. | Check route instructions still include correct resource path shape. |
| Queryless AI assistant | Floating AI assistant UI | Replaced by better `v2` approach | Keep `v2` implementation | Current UI is adapted to `v2`. | Verify enabled logic vs old public env flag. |
| Queryless AI assistant | Queryless chart rendering | Partially implemented in `v2` | Keep `v2` implementation | Vega rendering is covered; old Recharts renderer appears unused. | Manual review before dropping Recharts chart renderer. |
| Queryless AI assistant | AI terms page | Missing in `v2` | Needs manual review | Old UI linked to terms, new UI does not. | Confirm legal/content requirement. |
| SEO, structured data, and analytics | Default SEO config | Implemented differently in `v2` | Keep `v2` implementation | App Router Metadata API replaces `next-seo`. | Migrate copy/site defaults, not package. |
| SEO, structured data, and analytics | Page JSON-LD structured data | Missing in `v2` | Rebuild using `v2` architecture | Structured data is a real custom feature. | Add JSON-LD in App Router pages/components. |
| SEO, structured data, and analytics | Google Analytics tracking | Missing in `v2` | Needs manual review | Requires analytics decision and tracking ID. | Use App Router-compatible script if needed. |
| Theme, layout, and branding | Theme provider and theme variants | Replaced by better `v2` approach | Remove / do not migrate | Old theme provider conflicts with `v2` design system. | Preserve only intentional branding values/assets. |
| Theme, layout, and branding | Shared page chrome and assets | Partially implemented in `v2` | Merge `_temp` behavior into existing `v2` feature | Some assets/copy may be project-specific. | Copy only needed public assets; adapt layout to `v2`. |
| DataHub demo importer | DataHub manifest import/upsert | Missing in `v2` | Migrate from `_temp` | Script is project utility with tests. | Port scripts and tests; avoid app bundle impact. |
| Accessibility and route test tooling | Accessibility CI | Replaced by better `v2` approach | Keep `v2` implementation | Cypress stack matches App Router. | Consider Pa11y/LHCI only if required. |
| API utility tests | Node utility tests | Missing in `v2` | Migrate from `_temp` | Needed when migrating utilities. | Convert or keep Node tests and add scripts. |

## 7. Module-by-Module Implementation Plan

### Module: Home page and research visualizations

* Evidence from `_temp`: `_temp/pages/index.tsx`, `_temp/components/home/**`, `_temp/lib/parseCsv.ts`, `_temp/types/chartData.ts`.
* Current state in `v2`: `v2/src/app/[locale]/page.tsx` already has stats, search, groups, featured datasets, API/request panels.
* Features to keep from `v2`: stats, featured datasets, App Router data fetching, localized copy.
* Features to migrate from `_temp`: report teaser section if stories are migrated.
* Features to rebuild using `v2` architecture: CSV-backed visualizations, if still required.
* Files likely to be changed in `v2`: `v2/src/app/[locale]/page.tsx`, possible new `v2/src/components/home/*`, possible `v2/src/lib/parse-csv.ts`.
* Dependencies: CKAN helpers, `papaparse` or existing parser, possible chart dependency.
* Risks: hardcoded remote CSV URLs may be demo-only; chart content may not belong in generic template.
* Validation steps: `npm run build`, manual homepage check, verify CKAN stats and chart data render.
* Acceptance criteria: Homepage retains `v2` layout and includes only confirmed research-specific sections.

### Module: Dataset search

* Evidence from `_temp`: `_temp/pages/search.tsx`, `_temp/components/dataset/search/**`, `_temp/lib/queries/dataset.ts`.
* Current state in `v2`: `v2/src/app/[locale]/search/page.tsx`, `v2/src/components/package/search/**`, `v2/src/lib/ckan/dataset.ts`.
* Features to keep from `v2`: search layout, filters, pagination, type switcher, localized messages.
* Features to migrate from `_temp`: only behavior not already present after verification.
* Features to rebuild using `v2` architecture: any missing visualization search semantics.
* Files likely to be changed in `v2`: `v2/src/lib/ckan/dataset.ts`, `v2/src/components/package/search/SearchContext.tsx`, `SearchTypeSwitcher.tsx`.
* Dependencies: CKAN `package_search`, facet fields.
* Risks: `_temp` uses `dataset_type:${type}` while `v2` uses `type:${type}`.
* Validation steps: search datasets, search visualizations, apply each facet.
* Acceptance criteria: Search results and facets match CKAN data and support dataset/visualization filtering as intended.

### Module: Dataset detail and reuse affordances

* Evidence from `_temp`: `_temp/pages/[org]/[dataset]/index.tsx`, `_temp/components/dataset/individualPage/DatasetInfo.tsx`, `_temp/lib/api-access.js`, `_temp/lib/citation.js`, `_temp/lib/dataset-links.js`, `_temp/lib/doi.js`.
* Current state in `v2`: `v2/src/app/[locale]/[org]/[dataset]/page.tsx`, `v2/src/components/package/dataset/DatasetSidebar.tsx`, `v2/src/components/package/api/ApiTab.tsx`.
* Features to keep from `v2`: route validation, `Page` layout, metadata sidebar, resources tab, API tab, metadata export buttons.
* Features to migrate from `_temp`: citation helper, stable URL helper, curl/R snippets, resource direct snippet behavior.
* Features to rebuild using `v2` architecture: "Use this dataset" actions/panel and any DOI UI after manual approval.
* Files likely to be changed in `v2`: `v2/src/components/package/dataset/DatasetSidebar.tsx`, `v2/src/components/package/api/ApiTab.tsx`, new `v2/src/lib/citation.ts`, `v2/src/lib/dataset-links.ts`, `v2/src/lib/api-access.ts`.
* Dependencies: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_DMS`, clipboard support for client-side actions.
* Risks: mock DOI may be inappropriate for production; stable URL helper prefers dataset ID but route pages fetch by dataset name.
* Validation steps: dataset page, copy actions, generated snippets, export links, tests for helpers.
* Acceptance criteria: Dataset reuse workflows work without regressing `v2` layout.

### Module: Resource detail and previews

* Evidence from `_temp`: `_temp/pages/[org]/[dataset]/r/[resourceId].tsx`, `_temp/components/responsiveGrid/**`, `_temp/components/dataset/individualPage/ResourcePreview.tsx`, `_temp/components/dataset/resource/GeoJsonMap.jsx`.
* Current state in `v2`: `v2/src/app/[locale]/[org]/[dataset]/[resource]/page.tsx`, `v2/src/components/package/resource/ResourcePreview.tsx`, `v2/src/components/csv-explorer/**`, `v2/src/lib/resource.ts`.
* Features to keep from `v2`: current resource validation, sidebar, CSV/PDF/JSON/iframe preview shell.
* Features to migrate from `_temp`: only confirmed missing formats such as Excel or GeoJSON.
* Features to rebuild using `v2` architecture: optional `/r/` compatibility redirects if required.
* Files likely to be changed in `v2`: `v2/src/lib/resource.ts`, `v2/src/components/package/resource/ResourcePreview.tsx`, possibly route redirect files.
* Dependencies: preview format libraries if Excel/GeoJSON are restored.
* Risks: adding old `@portaljs/components`/Leaflet dependencies may increase bundle size.
* Validation steps: open CSV, PDF, JSON, iframe, Excel, GeoJSON resources where available.
* Acceptance criteria: Supported preview formats are documented and render reliably.

### Module: Organizations

* Evidence from `_temp`: `_temp/pages/organizations.tsx`, `_temp/pages/[org]/index.tsx`, `_temp/components/organization/**`, `_temp/lib/queries/orgs.ts`.
* Current state in `v2`: `v2/src/app/[locale]/organizations/page.tsx`, `v2/src/app/[locale]/[org]/page.tsx`.
* Features to keep from `v2`: organization listing, query search, detail page, dataset tab, activity stream.
* Features to migrate from `_temp`: none currently identified.
* Features to rebuild using `v2` architecture: none unless MiniSearch behavior is explicitly required.
* Files likely to be changed in `v2`: none initially.
* Dependencies: CKAN organization helpers.
* Risks: slug normalization may differ for PortalJS Cloud org paths.
* Validation steps: list organizations, search organizations, open an organization, verify datasets.
* Acceptance criteria: Organization browsing remains functional in localized routes.

### Module: Groups

* Evidence from `_temp`: `_temp/pages/groups/index.tsx`, `_temp/pages/groups/[groupName].tsx`, `_temp/components/groups/**`, `_temp/lib/queries/groups.ts`.
* Current state in `v2`: `v2/src/app/[locale]/groups/page.tsx`, `v2/src/app/[locale]/groups/[group]/page.tsx`.
* Features to keep from `v2`: group listing, query search, slug candidates, detail dataset tab, activity stream.
* Features to migrate from `_temp`: none currently identified.
* Features to rebuild using `v2` architecture: none unless old exact URL behavior is required.
* Files likely to be changed in `v2`: possibly `v2/src/lib/portal-name.ts` after validation.
* Dependencies: CKAN group helpers.
* Risks: public slug conversion may not match all existing links.
* Validation steps: list groups, search groups, open group, verify filtered datasets.
* Acceptance criteria: Group browsing works and old public slugs are handled or redirected.

### Module: Topics

* Evidence from `_temp`: `_temp/pages/topics/index.tsx`, `_temp/pages/topics/[topicName].tsx`.
* Current state in `v2`: no `/topics` route found; groups route is closest equivalent.
* Features to keep from `v2`: group list/detail implementation.
* Features to migrate from `_temp`: public `/topics` and `/topics/:topicName` route surface if still required.
* Features to rebuild using `v2` architecture: topics pages as localized App Router pages or redirects to groups.
* Files likely to be changed in `v2`: new `v2/src/app/[locale]/topics/page.tsx`, new `v2/src/app/[locale]/topics/[topic]/page.tsx`, or redirects.
* Dependencies: group helpers and `SearchResultsSection`.
* Risks: duplicate content and SEO overlap with groups.
* Validation steps: visit `/en/topics`, `/en/topics/:topic`, verify dataset filtering.
* Acceptance criteria: Product decision is reflected consistently: either topics routes exist or redirect intentionally.

### Module: Stories / reports

* Evidence from `_temp`: `_temp/pages/stories/**`, `_temp/content/stories/**`, `_temp/lib/stories.ts`, `_temp/components/stories/**`.
* Current state in `v2`: no stories routes/content found.
* Features to keep from `v2`: layout primitives, metadata helper, design system.
* Features to migrate from `_temp`: existing MDX content and related dataset metadata.
* Features to rebuild using `v2` architecture: App Router report index/detail pages and chart component integration.
* Files likely to be changed in `v2`: new `v2/content/stories/**`, new `v2/src/app/[locale]/stories/**`, new `v2/src/lib/stories.ts`, new story components.
* Dependencies: MDX strategy, `gray-matter`, possible `next-mdx-remote` or native MDX.
* Risks: old story chart imports are slug-specific and may not scale.
* Validation steps: build static report pages, verify charts, related dataset links, metadata.
* Acceptance criteria: All existing reports render and retain content without old Pages Router patterns.

### Module: Queryless AI assistant

* Evidence from `_temp`: `_temp/pages/api/queryless-chat.ts`, `_temp/components/queryless/**`, `_temp/pages/ai-terms-of-use.tsx`, `_temp/pages/_app.tsx`.
* Current state in `v2`: `v2/src/app/api/queryless-chat/route.ts`, `v2/src/components/queryless/QuerylessAssistant.tsx`, `v2/src/lib/queryless.ts`.
* Features to keep from `v2`: App Router route handler, drawer UI, rate limits, streaming, page context, Vega rendering.
* Features to migrate from `_temp`: AI terms page only if required.
* Features to rebuild using `v2` architecture: update Queryless route context if resource URL shape changes or `/r/` compatibility is added.
* Files likely to be changed in `v2`: `v2/src/components/queryless/QuerylessAssistant.tsx`, `v2/src/app/api/queryless-chat/route.ts`, optional terms route.
* Dependencies: Queryless server env vars.
* Risks: `v2` enables Queryless based on server env vars, while `_temp` used `NEXT_PUBLIC_QUERYLESS_ENABLED`; verify desired behavior.
* Validation steps: open assistant, send prompt, stream response, verify page context and route links.
* Acceptance criteria: Assistant works in localized routes and respects intended enablement rules.

### Module: SEO, structured data, and analytics

* Evidence from `_temp`: `_temp/next-seo.config.js`, `_temp/components/schema/**`, `_temp/pages/_document.tsx`, `_temp/pages/_app.tsx`.
* Current state in `v2`: `v2/src/lib/seo.ts`, App Router `generateMetadata` functions.
* Features to keep from `v2`: Metadata API and localized alternates.
* Features to migrate from `_temp`: research portal copy, JSON-LD structured data, analytics only if approved.
* Features to rebuild using `v2` architecture: JSON-LD script injection in App Router pages.
* Files likely to be changed in `v2`: `v2/src/lib/seo.ts`, page files, new `v2/src/components/schema/**`, layout script integration if GA is approved.
* Dependencies: `NEXT_PUBLIC_SITE_URL`, possible `NEXT_PUBLIC_GA_TRACKING_ID`.
* Risks: structured data must match actual page URLs and localized paths.
* Validation steps: inspect metadata, validate JSON-LD, confirm analytics events.
* Acceptance criteria: SEO metadata remains localized and structured data is valid.

### Module: Theme, layout, and branding

* Evidence from `_temp`: `_temp/components/theme/theme-provider.tsx`, `_temp/themes/**`, `_temp/components/_shared/**`, `_temp/styles/**`, `_temp/public/images/**`.
* Current state in `v2`: `v2/src/app/portal-theme.css`, `v2/src/components/layout/**`, `v2/src/components/ui/**`.
* Features to keep from `v2`: design system, CSS variables, layout components, lucide icons.
* Features to migrate from `_temp`: only confirmed logos, images, text, or brand values.
* Features to rebuild using `v2` architecture: any old custom header/footer content.
* Files likely to be changed in `v2`: `v2/src/app/portal-theme.css`, `v2/src/components/layout/Header.tsx`, `Footer.tsx`, `v2/public/*`.
* Dependencies: none beyond existing UI stack.
* Risks: old theme provider and SCSS modules conflict with `v2` conventions.
* Validation steps: visual review across pages and mobile.
* Acceptance criteria: Branding is preserved without importing old theme architecture.

### Module: DataHub demo importer

* Evidence from `_temp`: `_temp/scripts/import-datahub-demo.mjs`, `_temp/scripts/datahub-importer-lib.mjs`, `_temp/scripts/datahub-demo-manifest.mjs`, `_temp/tests/datahub-importer.test.mjs`.
* Current state in `v2`: no equivalent script found.
* Features to keep from `v2`: package scripts style and environment docs.
* Features to migrate from `_temp`: importer scripts and tests if data seeding remains required.
* Features to rebuild using `v2` architecture: npm scripts and docs.
* Files likely to be changed in `v2`: `v2/scripts/*`, `v2/package.json`, `v2/README.md`, possibly tests.
* Dependencies: `CKAN_API_KEY`, `NEXT_PUBLIC_DMS`, `dotenv`.
* Risks: target DMS URL format differs between `_temp` and `v2`.
* Validation steps: dry run importer, run importer tests.
* Acceptance criteria: Dry run works and no API writes happen without explicit `--apply` plus key.

### Module: Accessibility and route test tooling

* Evidence from `_temp`: `_temp/docs/accessibility.md`, `_temp/tests/a11y.spec.ts`, `_temp/scripts/generate-routes.js`, `_temp/scripts/run-pa11y-from-routes.js`, `_temp/scripts/run-lhci-from-routes.js`.
* Current state in `v2`: `v2/cypress/e2e/a11y-all-pages.cy.ts`, `v2/scripts/generate-routes.mjs`, `v2/docs/accessibility/README.md`.
* Features to keep from `v2`: Cypress/Axe route testing.
* Features to migrate from `_temp`: none unless Pa11y/LHCI are required by CI policy.
* Features to rebuild using `v2` architecture: optional Pa11y/LHCI additions.
* Files likely to be changed in `v2`: possibly `.github/workflows/a11y.yml`, docs, package scripts.
* Dependencies: Cypress, Axe, generated route file.
* Risks: route generator currently adds localized CKAN sample routes; dynamic route shape must match final resource URL.
* Validation steps: `npm run routes:gen`, `npm run cy:run`, `npm run test:e2e`.
* Acceptance criteria: Accessibility test coverage includes static plus sample dataset/resource pages.

### Module: API utility tests

* Evidence from `_temp`: `_temp/tests/api-access.test.mjs`, `_temp/tests/citation.test.mjs`, `_temp/tests/dataset-links.test.mjs`, `_temp/tests/doi.test.mjs`.
* Current state in `v2`: no equivalent utility tests found.
* Features to keep from `v2`: Cypress E2E stack.
* Features to migrate from `_temp`: focused unit tests for any migrated helper.
* Features to rebuild using `v2` architecture: test scripts compatible with TypeScript or Node ESM.
* Files likely to be changed in `v2`: tests folder, `package.json` scripts.
* Dependencies: Node test runner or existing test framework decision.
* Risks: adding a second test style should be documented.
* Validation steps: run utility tests and build.
* Acceptance criteria: Migrated helpers have regression tests.

## 8. Recommended Migration Order

| Step | Module | Why this should be done at this stage | Dependencies | Validation command or manual test |
| --- | --- | --- | --- | --- |
| 1 | CKAN/data behavior inside Dataset search | Search and filtering semantics affect homepage, groups, orgs, topics, datasets, and Queryless routes. | `NEXT_PUBLIC_DMS`, `v2/src/lib/ckan/dataset.ts` | Search manually; `npm run build` |
| 2 | Dataset detail and reuse affordances | Citation, stable URL, API snippets, and metadata fields are core research features. | Dataset routes, env vars, helper tests | Add/run helper tests; open dataset page |
| 3 | Resource detail and previews | Resource preview support is user-facing and depends on route/data decisions. | Dataset page, resource route | Open CSV/PDF/iframe and any Excel/GeoJSON resources |
| 4 | Stories / reports | Reports are a separate content system and can be migrated after core data routes are stable. | Dataset links, chart renderer decision | Build report index/detail pages |
| 5 | Home page research sections | Homepage can then reference migrated stories and any retained visualization components. | Stories, chart data decisions | Manual homepage review; `npm run build` |
| 6 | Topics | Topics duplicate group data and should be added only after group route behavior is confirmed. | Group pages, slug strategy | Visit `/topics` and `/topics/:topic` or redirects |
| 7 | SEO, structured data, and analytics | SEO should reflect final routes and content. | Final route shapes, site URL | Inspect metadata and JSON-LD |
| 8 | DataHub demo importer | Tooling can be migrated after app behavior is stable. | Env docs, scripts | Dry run importer; utility tests |
| 9 | Accessibility and utility tests | Finalize automated validation once route set and migrated features are known. | Route generator, migrated pages | `npm run routes:gen`, `npm run test:e2e` |
| 10 | Theme, layout, and branding | Polish pass after functionality lands. | All user-facing pages | Visual pass desktop/mobile |

## 9. AI-Assisted Upgrade Workflow

After this plan is created, Codex should be used as follows:

* Work one discovered module at a time.
* Before editing a module, re-open the relevant `_temp` and `v2` files.
* Do not blindly copy old code.
* Preserve feature behavior, but adapt implementation to `v2`.
* Keep the new template's design system and conventions.
* Avoid large unrelated rewrites.
* Run lint, typecheck, and build after each module.
* Update `MIGRATION_PLAN.md` after each module with progress.
* Stop after each module and summarize what changed.

## 10. Open Questions / Manual Review

Most product decisions have been resolved by the confirmed migration decisions above. Remaining manual review items are implementation and validation details:

* Confirm the best App Router MDX implementation for Reports while preserving `_temp` story-specific chart mappings.
* Validate GeoJSON map behavior after adding the chosen map dependencies.
* Leave Excel/XLS/XLSX preview intentionally deferred; document the deferral.
* Validate target CKAN behavior for `dataset_type:${type}` against the `_temp` DMS value.
* Validate support for both PortalJS Cloud-style DMS URLs and plain CKAN URLs.
* Validate default-English unprefixed canonical URLs after i18n simplification.
* Implement and validate the activity stream visibility env var, defaulting to `false`.
* `v2` docs mention `NEXT_PUBLIC_I18N_LANGUAGES_AVAILABLE`, but code uses `NEXT_PUBLIC_I18N_SUPPORTED_LOCALES`. This should be corrected during docs work.
* Several features require live CKAN data to validate: visualization type search, org/group/topic slug mapping, resource preview formats, activity streams, and Queryless route context.

## 11. Final Migration Checklist

### Home page and research visualizations

* [ ] Reviewed in `_temp`
* [ ] Compared with `v2`
* [ ] Migration decision confirmed
* [ ] Implemented or intentionally skipped
* [ ] Tested
* [ ] Documentation updated

### Dataset search

* [ ] Reviewed in `_temp`
* [ ] Compared with `v2`
* [ ] Migration decision confirmed
* [ ] Implemented or intentionally skipped
* [ ] Tested
* [ ] Documentation updated

### Dataset detail and reuse affordances

* [ ] Reviewed in `_temp`
* [ ] Compared with `v2`
* [ ] Migration decision confirmed
* [ ] Implemented or intentionally skipped
* [ ] Tested
* [ ] Documentation updated

### Resource detail and previews

* [ ] Reviewed in `_temp`
* [ ] Compared with `v2`
* [ ] Migration decision confirmed
* [ ] Implemented or intentionally skipped
* [ ] Tested
* [ ] Documentation updated

### Organizations

* [ ] Reviewed in `_temp`
* [ ] Compared with `v2`
* [ ] Migration decision confirmed
* [ ] Implemented or intentionally skipped
* [ ] Tested
* [ ] Documentation updated

### Groups

* [ ] Reviewed in `_temp`
* [ ] Compared with `v2`
* [ ] Migration decision confirmed
* [ ] Implemented or intentionally skipped
* [ ] Tested
* [ ] Documentation updated

### Topics

* [ ] Reviewed in `_temp`
* [ ] Compared with `v2`
* [ ] Migration decision confirmed
* [ ] Implemented or intentionally skipped
* [ ] Tested
* [ ] Documentation updated

### Stories / reports

* [ ] Reviewed in `_temp`
* [ ] Compared with `v2`
* [ ] Migration decision confirmed
* [ ] Implemented or intentionally skipped
* [ ] Tested
* [ ] Documentation updated

### Queryless AI assistant

* [ ] Reviewed in `_temp`
* [ ] Compared with `v2`
* [ ] Migration decision confirmed
* [ ] Implemented or intentionally skipped
* [ ] Tested
* [ ] Documentation updated

### SEO, structured data, and analytics

* [ ] Reviewed in `_temp`
* [ ] Compared with `v2`
* [ ] Migration decision confirmed
* [ ] Implemented or intentionally skipped
* [ ] Tested
* [ ] Documentation updated

### Theme, layout, and branding

* [ ] Reviewed in `_temp`
* [ ] Compared with `v2`
* [ ] Migration decision confirmed
* [ ] Implemented or intentionally skipped
* [ ] Tested
* [ ] Documentation updated

### DataHub demo importer

* [ ] Reviewed in `_temp`
* [ ] Compared with `v2`
* [ ] Migration decision confirmed
* [ ] Implemented or intentionally skipped
* [ ] Tested
* [ ] Documentation updated

### Accessibility and route test tooling

* [ ] Reviewed in `_temp`
* [ ] Compared with `v2`
* [ ] Migration decision confirmed
* [ ] Implemented or intentionally skipped
* [ ] Tested
* [ ] Documentation updated

### API utility tests

* [ ] Reviewed in `_temp`
* [ ] Compared with `v2`
* [ ] Migration decision confirmed
* [ ] Implemented or intentionally skipped
* [ ] Tested
* [ ] Documentation updated
