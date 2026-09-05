# forgequbit.co.uk

Marketing site for ForgeQubit. Vite + React 19 + React Router 7, prerendered
to static HTML for every route at build time, hosted on Vercel.

## Run locally

```bash
npm install
npm run dev          # Vite dev server with hot reload
```

To see exactly what production serves (clean URLs, redirects, headers,
the Content-Security-Policy and real 404 statuses):

```bash
npm run build
npm run serve        # http://localhost:4180
```

`npm run preview` is the plain Vite preview without the Vercel headers.

## Checks

```bash
npm run build && npm test
```

`npm test` runs `scripts/check-dist.test.mjs` against the build output:
route inventory, internal links, titles/canonicals, sitemap, structured
data validity, redirect targets, security headers, inline CSS, code
splitting, contact-form validation and analytics privacy.

## Where things live

| Concern | File |
| --- | --- |
| All copy and business content | `src/data.js` |
| Design tokens and every style | `src/styles.css` |
| Nav, footer, breadcrumbs, FAQ, CTA band | `src/chrome.jsx` |
| Illustrative visuals (chat, workflow, call) | `src/visuals.jsx` |
| Routes and code splitting | `src/App.jsx`, `src/main.jsx`, `src/entry-server.jsx` |
| Per-route `<head>` and structured data | `src/seo.jsx` |
| Contact form logic (validation, limits, response handling) | `src/contact-logic.js` |
| Analytics events | `src/analytics.js`, `ANALYTICS.md` |
| Prerender, sitemap, RSS, robots | `scripts/prerender.mjs` |
| Brand assets (favicon, icons, social card) | `scripts/gen-assets.mjs` → `npm run assets` |
| Hosting: redirects, headers, CSP | `vercel.json` (Netlify mirror in `public/_redirects`) |

## Content rules

- Nothing on the site is presented as client work. Every scenario,
  transcript and figure is labelled illustrative in the UI. Real case
  studies go in `src/data.js` only with the evidence listed in
  `HANDOVER.md`.
- The contact form posts to Web3Forms with the public access key in
  `src/contact-logic.js`. Success is shown only when the service returns
  `success: true`.

## Deployment

Vercel builds from `npm run build` and serves `dist/`. See `HANDOVER.md`
for the release and rollback steps.
