# PortalJS Migration Tasklist

This tasklist tracks implementation of all `_temp` features into `v2`. Check items only after implementation and validation are complete.

## Phase 1: Foundation

- [x] Bootstrap the root project structure from `v2` while keeping `v2/` intact as a reference.
- [x] Confirm `v2` uses `_temp` `NEXT_PUBLIC_DMS` as the target DMS value.
- [x] Ensure CKAN helpers support both PortalJS Cloud-style DMS URLs and plain CKAN URLs.
- [x] Change dataset/visualization filtering to preserve `_temp` `dataset_type:${type}` behavior.
- [x] Keep `v2` build/type strictness and fix migration issues as they appear.
- [x] Set final site name/copy to `Research Portal`.
- [x] Configure English-only routing with unprefixed canonical/default URLs.

## Phase 2: Routing

- [ ] Keep canonical resource route as `/@org/dataset/r/resourceId`.
- [ ] Update `v2` dataset resource links to use `/r/`.
- [ ] Update resource page implementation to use old canonical `/r/` route shape.
- [ ] Update route generation and accessibility dynamic route discovery to use `/r/`.
- [ ] Add real `/topics` page with Topics label.
- [ ] Add real `/topics/[topicName]` page with Topics label and slug.
- [ ] Add `/reports` index route.
- [ ] Add `/reports/[slug]` detail route.
- [ ] Restore `/ai-terms-of-use`.

## Phase 3: Dataset Search

- [ ] Re-open `_temp/pages/search.tsx` and `v2/src/app/[locale]/search/page.tsx`.
- [ ] Re-open `_temp/lib/queries/dataset.ts` and `v2/src/lib/ckan/dataset.ts`.
- [ ] Preserve `v2` search UI and query-param behavior.
- [ ] Ensure facets match `_temp`: groups, organization, res_format, tags.
- [ ] Ensure dataset and visualization type switching works with target CKAN.
- [ ] Validate search manually against live DMS.

## Phase 4: Dataset Detail and Reuse

- [ ] Migrate stable dataset URL helpers with `_temp` id-over-name behavior.
- [ ] Migrate deterministic DOI generation exactly as `_temp`.
- [ ] Display DOI exactly as `_temp` and link to `https://doi.org/{generatedDoi}`.
- [ ] Migrate citation helpers with APA and BibTeX exactly as `_temp`.
- [ ] Change citation publisher to `Research Portal`.
- [ ] Merge API snippets so curl, Python, R, and JavaScript are available.
- [ ] Rebuild `_temp` "Use this dataset" dropdown in `v2`.
- [ ] Include download, API access, cite dataset, copy DOI, and stable URL actions.
- [ ] Show all `_temp` dataset metadata fields.
- [ ] Preserve metadata export links for RDF, TTL, and JSON-LD.
- [ ] Add or adapt unit tests for DOI, citation, stable URL, and API snippet helpers.

## Phase 5: Resource Detail and Previews

- [ ] Preserve CSV preview using `v2` CSV explorer.
- [ ] Preserve PDF preview.
- [ ] Preserve JSON preview.
- [ ] Preserve iframe preview.
- [ ] Add GeoJSON preview support.
- [ ] Install needed GeoJSON/map dependencies.
- [ ] Do not implement Excel/XLS/XLSX preview yet.
- [ ] Document Excel preview as intentionally deferred.
- [ ] Validate each supported preview type manually.

## Phase 6: Organizations, Groups, Topics

- [ ] Keep `v2` organization listing/search behavior.
- [ ] Keep `v2` organization detail behavior.
- [ ] Keep `v2` group listing/search behavior.
- [ ] Keep `v2` group detail behavior.
- [ ] Add activity stream visibility env var with default `false`.
- [ ] Hide activity streams by default.
- [ ] Show activity streams only when the env var enables them.
- [ ] Implement topics pages using group-backed data while keeping Topics labels.

## Phase 7: Reports

- [ ] Migrate `_temp/content/stories` content into the new reports content location.
- [ ] Preserve `_temp` MDX/frontmatter behavior.
- [ ] Preserve story-specific chart component mappings from `_temp`.
- [ ] Use `Reports` label and `/reports` slug.
- [ ] Do not localize reports for now.
- [ ] Render content in the language provided in `/content`.
- [ ] Add Reports section to the homepage.
- [ ] Preserve related dataset links.

## Phase 8: Homepage

- [ ] Keep `v2` visual design.
- [ ] Add `_temp` homepage AI prompts if still present in the old UI components.
- [ ] Add Reports section.
- [ ] Preserve `_temp` fixed remote CSV visualizations and URLs.
- [ ] Validate homepage charts against remote CSV data.
- [ ] Keep `v2` branding while using `Research Portal` as the site name.

## Phase 9: Queryless AI

- [ ] Use `NEXT_PUBLIC_QUERYLESS_ENABLED` as the public enablement flag.
- [ ] Keep Queryless server env vars: `QUERYLESS_URL`, `QUERYLESS_TOKEN`, `QUERYLESS_MODEL`.
- [ ] Update Queryless route instructions to use canonical `/r/` resource URLs.
- [ ] Restore `/ai-terms-of-use`.
- [ ] Link Queryless footer to `/ai-terms-of-use`.
- [ ] Preserve streaming, rate limits, daily limits, Markdown rendering, and Vega rendering.
- [ ] Validate Queryless on home, search, dataset, resource, organization, group, and topic pages.

## Phase 10: SEO, Structured Data, Analytics

- [ ] Migrate home JSON-LD structured data.
- [ ] Migrate search JSON-LD structured data.
- [ ] Migrate dataset JSON-LD structured data.
- [ ] Migrate resource JSON-LD structured data.
- [ ] Migrate group JSON-LD structured data.
- [ ] Migrate organization JSON-LD structured data.
- [ ] Restore Google Analytics using `NEXT_PUBLIC_GA_TRACKING_ID`.
- [ ] Track route changes in the App Router-compatible way.
- [ ] Ensure canonical URLs are unprefixed default-English URLs.
- [ ] Update metadata/site title to `Research Portal`.

## Phase 11: DataHub Importer

- [ ] Migrate `_temp/scripts/datahub-demo-manifest.mjs`.
- [ ] Migrate `_temp/scripts/datahub-importer-lib.mjs`.
- [ ] Migrate `_temp/scripts/import-datahub-demo.mjs`.
- [ ] Preserve `_temp` dry-run/apply behavior.
- [ ] Preserve `_temp` default target owner org behavior.
- [ ] Preserve `CKAN_API_KEY` requirement for apply/write mode.
- [ ] Add importer scripts to `v2/package.json`.
- [ ] Migrate importer tests.
- [ ] Update docs.

## Phase 12: Accessibility and Tests

- [ ] Keep/adapt `v2` Cypress/Axe route checks.
- [ ] Restore Playwright/Axe checks from `_temp`.
- [ ] Restore Pa11y checks from `_temp`.
- [ ] Restore Lighthouse CI checks from `_temp`.
- [ ] Update route generation for App Router, topics, reports, and `/r/` resource routes.
- [ ] Restore utility tests in the best `v2`-appropriate way.
- [ ] Add validation commands to README/docs.
- [ ] Ensure CI runs the agreed checks.

## Phase 13: Documentation and Final Review

- [ ] Update `MIGRATION_PLAN.md` after each completed module.
- [ ] Update environment variable docs.
- [ ] Fix i18n docs to match actual English-only/default-unprefixed behavior.
- [ ] Document activity stream env var.
- [ ] Document GeoJSON support and deferred Excel support.
- [ ] Document Queryless env vars and AI terms route.
- [ ] Run lint.
- [ ] Run typecheck if available.
- [ ] Run build.
- [ ] Run route generation.
- [ ] Run accessibility checks.
- [ ] Perform manual smoke test of all migrated routes.
