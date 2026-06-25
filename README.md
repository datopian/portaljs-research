# PortalJS Frontend Starter

<div align="center">

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/datopian/portaljs-frontend-starter)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Next.js 15](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white)](https://nextjs.org/) [![GitHub Stars](https://img.shields.io/github/stars/datopian/portaljs?style=social)](https://github.com/datopian/portaljs/stargazers)

**A modern, customizable frontend template for building high-performance CKAN-based data portals**

Powered by **[Next.js](https://nextjs.org)**, **[React](https://react.dev/)**, **[TypeScript](https://www.typescriptlang.org/)**, and **[Tailwind CSS](https://tailwindcss.com/)**

**[Live Demo](https://demo.portaljs.com/) • [Documentation](https://portaljs.com/docs) • [PortalJS Cloud](https://cloud.portaljs.com/) • [Website](https://portaljs.com/)**

</div>

---

## Overview

PortalJS Frontend Starter is the official frontend template used by PortalJS Cloud and by teams who want to build a decoupled CKAN portal with a modern UI stack.

Use it to:

- build CKAN frontends with Next.js and React
- customize dataset views, branding, and layouts
- support organizations, groups, datasets, resources, and search
- ship a portal experience that is responsive, accessible, and easy to extend
- deploy on Vercel, Netlify, Cloudflare Pages, or your own infrastructure

## Features

- **Modern UI** - clean, responsive design with a branded visual system
- **High performance** - built on Next.js App Router with server rendering and static generation where appropriate
- **CKAN integration** - data fetching through the PortalJS CKAN client layer
- **Localization** - locale-aware routing and navigation with `next-intl`
- **TypeScript** - strong typing and better developer experience
- **Accessibility** - built with accessibility checks and accessible components in mind
- **Search and browsing** - datasets, organizations, groups, and detail pages
- **Resource previews** - CSV, PDF, iframe, and rich resource presentation
- **Queryless AI ready** - optional assistant integration driven by environment variables
- **Deploy ready** - suited for direct deployment to modern hosting platforms

## Theme And Visual System

The starter ships with a branded theme instead of a default boilerplate look.

To change the main color, update `src/app/portal-theme.css`:

```css
:root {
  --brand-accent: #1d83d4;
  --brand-accent-foreground: #ffffff;
  --brand-logo: var(--brand-accent);
}
```

That single file drives the accent color, logo color, links, button styling, and the subtle surface tints used across the portal.

## Getting Started

### Option 1: PortalJS Cloud

PortalJS Cloud can create a new repository from this starter and deploy it automatically.

1. Sign up at <https://cloud.portaljs.com>
2. Create a portal
3. Find the generated repository in your dashboard
4. Customize it through pull requests or with support from the PortalJS team

### Option 2: Self-Hosted

If you want to use this starter on your own infrastructure, clone the repository and configure it locally.

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser to see the app.

## Environment Variables

Create a `.env` file with the values your portal needs:

```bash
NEXT_PUBLIC_DMS=https://api.example.com/@your-portal

# Optional Queryless AI assistant integration
NEXT_PUBLIC_QUERYLESS_ENABLED=false
NEXT_PUBLIC_QUERYLESS_API_ROUTE=/api/queryless-chat

# Server-side Queryless API config
QUERYLESS_URL=
QUERYLESS_TOKEN=
QUERYLESS_MODEL=agent:your-agent-id
```

## Quick Customization

### Logo Customization

Edit the header and footer branding in:

- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`

### Footer Links

Update the navigation links in `src/components/layout/Footer.tsx`.

### Homepage Content

Update the homepage content in `src/app/[locale]/page.tsx`.

### Search And Facets

Adjust the search behavior and facet fields in `src/lib/ckan/dataset.ts`.

### Resource Views

Resource presentation can be extended in:

- `src/components/package/resource/ResourceDetails.tsx`
- `src/components/package/resource/ResourceSidebar.tsx`
- `src/components/package/dataset/VisualizationPreview.tsx`

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **UI:** React, Tailwind CSS, and shared component primitives
- **Localization:** next-intl
- **Data:** CKAN API through the PortalJS data layer
- **Testing:** Cypress and axe-based accessibility checks

## Scripts

- `npm run dev` - start the development server
- `npm run build` - create a production build
- `npm run start` - run the production server
- `npm run routes:gen` - generate localized routes
- `npm run cy:run` - run Cypress tests
- `npm run test:e2e` - build, start, and run the full E2E suite

## Deployment

This starter can be deployed on any platform that supports Next.js.

### Vercel

1. Push the repository to GitHub
2. Connect it on [vercel.com](https://vercel.com/)
3. Add the required environment variables
4. Deploy

### Other Platforms

This starter also works on:

- Netlify
- Cloudflare Pages
- Docker-based hosting
- Your own server with `npm run build && npm run start`

## Contributing

Contributions are welcome. A good contribution flow is:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

## License

This project is licensed under the MIT License.

## Need Help?

If you need help with customization, portal design, advanced integrations, or migration from an existing CKAN frontend, contact the PortalJS team.

---

<div align="center">

Built with love by [Datopian](https://datopian.com/)

**[Docs](https://portaljs.com/docs) • [PortalJS Cloud](https://cloud.portaljs.com/) • [GitHub](https://github.com/datopian/portaljs)**

</div>
