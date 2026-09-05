# Handover: cyan redesign and optimisation pass

Branch: `codex/cyan-redesign` (uncommitted working tree; see "Release" below).
Date: 5 September 2026.

Every result below is tagged **Measured**, **Manually verified**,
**Inferred** or **Not tested**.

## 1. Run it

```bash
npm install
npm run build && npm test     # 16 checks against the build output
npm run serve                 # production-like server at http://localhost:4180
```

`npm run dev` for live editing. `npm run assets` regenerates favicon,
icons and the social card from `scripts/gen-assets.mjs`.

## 2. What changed, in order of consequence

1. **Positioning and structure.** The homepage is now: hero, delivery
   practices, three primary solutions (AI Reception & Lead Handling,
   Workflow Automation & Integrations, Custom AI Product Development),
   a labelled worked example, four-stage process with responsibilities,
   engineering approach, FAQs, enquiry CTA. Avatars and blockchain are
   secondary capabilities on `/services#capabilities`. Forge, fire, ore,
   weapon, chamber and quenching language is gone site-wide (a test
   enforces this).
2. **Evidence policy.** The three previous case studies (Meridian
   Estates, Northgate Clinics, LumenPay) and their figures (3.4×, 82%,
   6 weeks) had no supporting evidence and one mixed "qualified leads"
   with "viewings booked". They are removed from the public site and
   preserved in git history (commit `509e18f`, `src/data.js`).
   `/case-studies` now holds three worked examples, each labelled
   illustrative, with scope and metric definitions instead of results.
   A visible note on that page explains the evidence policy.
3. **The 3D forge journey is removed** along with `three`,
   `@react-three/fiber` and `@react-three/drei`, the custom cursor, the
   full-screen manifesto and the scroll-locked panels. Essential content
   is visible without any entrance animation. The only loop (the hero
   step highlight) is disabled under `prefers-reduced-motion`.
4. **Cyan design system** in `src/styles.css` with tokens for colour,
   gradient, type, spacing, container, radius, elevation, motion and
   focus. Brand assets regenerated in cyan (favicon, PWA icons, Apple
   touch icon, social card, manifest, theme colour).
5. **Service pages** for the three offers plus `/services/voice-agents`
   (previously a 404 that search engines had indexed). Each covers who
   it helps, problems, what is included, a concrete labelled example,
   integrations, delivery and cost drivers, ongoing costs, support,
   FAQs and CTA.
6. **Contact form** keeps Web3Forms and `?interest=` preselection (old
   interest names are mapped to the new ones). Added: visible labels,
   field-level validation with error association, input limits,
   honeypot, duplicate-submission guard, loading state, success only on
   `success: true` from the service, and recoverable errors that keep
   the entered text. Optional budget and timeline selects added.
7. **Performance.** Route-level code splitting (Home in the shell, every
   other page a separate chunk warmed before hydration), stylesheet
   inlined into each prerendered page, font preloads reduced to the two
   faces the first screen uses, ~600 kB of WebGL JavaScript removed.
8. **Security.** Content-Security-Policy (strict `script-src`, form
   endpoint and Vercel analytics allow-listed), COOP, existing HSTS and
   frame headers kept. The SPA rewrite is removed so unknown URLs
   return a real 404 status. `npm audit` is clean after non-breaking
   fixes.
9. **Analytics.** Conversion events through the existing Vercel
   Analytics, no personal data, documented in `ANALYTICS.md`.
10. **Accessibility.** Skip link, one `h1` per page, heading order fixed
    (footer, contact steps), icon button named, menu focus management
    (focus moves in on open, returns on close, Escape closes, page
    scroll locked), form errors associated with fields, live regions
    for success and failure, non-text contrast token for form borders,
    all text tokens ≥ 4.5:1.
11. **SEO.** Canonical host changed to `https://www.forgequbit.co.uk`
    (the apex 307-redirects to www, so the previous canonicals pointed
    at a redirect). Unique titles and descriptions, breadcrumb, Service
    and FAQ structured data reflecting visible content only, sitemap and
    RSS regenerated, permanent redirects for plausible legacy service
    URLs, error boundary and helpful 404.

## 3. Final design tokens

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#061017` | page background |
| `--bg-alt` | `#091923` | alternate sections, footer |
| `--surface` / `--surface-2` | `#102532` / `#153040` | cards, hover |
| `--ink` / `--ink-2` / `--ink-3` | `#F2FAFD` / `#B4CAD4` / `#8AA7B4` | text (18.2 / 11.3 / 7.6 : 1 on `--bg`) |
| `--cyan` / `--cyan-bright` / `--cyan-deep` | `#22D3EE` / `#67E8F9` / `#0891B2` | accents, focus, deep fills |
| `--cyan-ink` | `#04141B` | text on the gradient (5.1:1 at the darkest stop) |
| `--line` / `--line-strong` | `#254452` / `#3A6072` | decorative borders |
| `--field-border` | `#4F7A8F` | form control boundaries (≥ 3:1 on field and card) |
| `--ok` / `--warn` / `--err` | `#34D399` / `#FBBF24` / `#FB7185` | semantic states |
| `--grad` | `linear-gradient(135deg, #67E8F9 0%, #22D3EE 48%, #0891B2 100%)` | primary buttons, signature graphics |
| `--grad-text` | `linear-gradient(120deg, #9DF0FB, #22D3EE 55%, #0FB0D3)` | emphasised words only |
| Type | Space Grotesk (body and headings), Instrument Serif italic (emphasis), Unbounded (wordmark, numerals) | |
| Layout | `--shell: 1160px`, `--gutter: clamp(20px, 5vw, 56px)`, `--section: clamp(64px, 9vw, 112px)`, radii 16/10 px | |

## 4. Routes and redirects

Prerendered (16): `/`, `/services`, `/services/ai-reception`,
`/services/workflow-automation`, `/services/custom-ai-products`,
`/services/voice-agents`, `/case-studies`, `/about`, `/contact`, `/blog`,
`/blog/whatsapp-agent-next-hire`, `/blog/voice-agents-uncanny-valley`,
`/blog/ai-saas-six-weeks`, `/privacy`, `/terms`, `/404` (noindex).

Permanent redirects (`vercel.json`, mirrored in `public/_redirects`):
`/services/whatsapp-automation`, `/services/whatsapp-agents` →
`/services/ai-reception`; `/services/custom-ai-agents`,
`/services/custom-agents`, `/services/ai-powered-saas`, `/services/ai-saas`
→ `/services/custom-ai-products`; `/services/avatar-agents`,
`/services/ai-blockchain` → `/services#capabilities`; `/work` →
`/case-studies`; `/solutions` → `/services`. These legacy slugs are
**inferred** from the old service names; only `/services/voice-agents`
was confirmed in search results. Unknown URLs return 404.

## 5. Verification

| Check | Result | Status |
| --- | --- | --- |
| Build and 16 output tests | pass | Measured |
| Lighthouse 12, mobile emulation, `/` | perf 98, a11y 100 (was 94), best-practices 96, SEO 100; LCP 2.2 s (was 2.3), CLS 0, TBT 0 ms | Measured (lab) |
| Lighthouse, mobile, `/services/ai-reception` | perf 96, a11y 100 (was 98); LCP 2.4 s, CLS 0 | Measured (lab) |
| Lighthouse, mobile, `/contact` | perf 98, a11y 100 (was 98); LCP 2.3 s, CLS 0 | Measured (lab) |
| Lighthouse, desktop, `/` | perf 100, a11y 100 (was 93); LCP 0.6 s | Measured (lab) |
| Shell JavaScript transferred on `/` | 97 kB (was 104 kB); the old site also loaded a deferred WebGL chunk of ~600 kB that no longer exists | Measured |
| Contrast of every text token pair | ≥ 4.5:1; form borders ≥ 3:1 | Measured |
| Horizontal overflow at 360, 390, 768, 1280, 1920 px | none | Measured (Chromium emulation) |
| 150% root font size at 390 px | no overflow, no clipped headings | Measured (Chromium emulation) |
| Touch targets | all controls ≥ 24 px except one inline text link (exempt) | Measured |
| Mobile menu: focus moves in, Escape closes, focus returns, scroll locked | works | Manually verified via scripted events in Chromium |
| Contact form: validation, error association, focus to first error, error path keeps text, success only on `success: true`, triple-click sends once | works | Manually verified against a stubbed endpoint; nothing sent to the live inbox |
| Legacy `?interest=Voice%20Agents` preselects "Voice Agent" | works | Manually verified |
| Client-side navigation between chunks, title/canonical update | works, no console errors | Manually verified |
| CSP: no violations on load, form endpoint reachable | no violations | Manually verified on the local production-like server |
| 404 status for unknown URLs, 308 for legacy slugs | works | Measured on the local server; **Not tested** on Vercel until deployed |
| Firefox, Safari/WebKit, physical devices | | **Not tested** (only Chromium was available) |
| Field Core Web Vitals | | **Not tested**; Speed Insights will report after deployment |
| Live Web3Forms delivery | | **Not tested** on purpose; the key is unchanged from the working production form |

Two console errors appear locally: the Vercel Analytics and Speed
Insights scripts 404 outside Vercel. They resolve on the Vercel
deployment. **Inferred.**

## 6. Remaining issues, ranked

1. **No verifiable proof yet.** The site is honest but proof-light. The
   biggest credibility gain is one real case study with permission.
2. **No named people.** The About page describes accountability
   structurally. A founder name, photo and a professional link would
   materially raise trust.
3. **Response-time promise removed.** The old "within 24 hours" was
   unverified. Restore it in `src/data.js`/`Contact.jsx` only if it is
   a real commitment.
4. **Company number not shown.** Legal pages say "registered in the
   United Kingdom"; adding the Companies House number and registered
   address is expected for a UK business.
5. **Voice demo.** A short, approved recording on
   `/services/voice-agents` would be the strongest demonstration; none
   exists, so none is faked.
6. **Cross-browser.** Firefox and WebKit should be checked before
   launch, in particular the inline `<style>`, `inert` on the menu and
   the details/summary FAQ.
7. **Shell JavaScript is still ~97 kB gzipped** (React, ReactDOM,
   Router). Further reduction means dropping client-side hydration for
   content pages, which is a framework change and was not done.

## 7. Missing facts, assets and credentials

- Client permission, baseline, measurement period and metric
  definitions for any case study to be published.
- Founder/engineer name(s), photo(s), professional links.
- Companies House number and registered office address.
- Confirmation of business terms stated on the site: fixed-scope
  proposals, weekly demos, deliverables assigned on payment, accounts
  set up in the client's name, optional support retainer.
- Actual response-time commitment, if any.
- A real scheduling link, if you want a "book a call" action.
- Any product screenshots or an approved voice recording.
- Vercel: confirm Web Analytics is enabled for the project so custom
  events are recorded.

## 8. Release and rollback

Nothing has been deployed. Steps that need your go-ahead:

1. Review the branch, then commit:
   ```bash
   git add -A && git commit -m "Cyan redesign: positioning, evidence policy, performance, accessibility, CSP"
   ```
2. Push `codex/cyan-redesign` and open a PR to `main`; Vercel creates a
   preview deployment automatically. On the preview, check:
   `/services/voice-agents` (200), `/nope` (404), a legacy slug (308),
   the CSP in response headers, no console CSP errors, and that the
   analytics scripts load.
3. Send one real test enquiry from the preview and confirm it arrives
   at the Web3Forms inbox.
4. Merge to `main` for production. In Vercel, confirm the primary
   domain is `www.forgequbit.co.uk` (the canonicals now assume it).
5. Submit the new sitemap in Google Search Console and request
   re-indexing of `/services/voice-agents`.

Rollback: Vercel → Deployments → promote the previous production
deployment (instant), or `git revert` the merge commit. The old content
is intact in commit `509e18f`.
