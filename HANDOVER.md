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
   focus. Third pass deepened the palette (blue-black ground with two
   quiet pools of light, a teal partner in the gradient, one warm accent
   for the human moments) and added motion: hero entrance, scroll
   reveals with a scroll fallback, a looping enquiry-to-booking
   animation, a workflow token, a tool strip, button sheen and a logo
   pulse. All of it is transform/opacity, off under
   `prefers-reduced-motion`, and the prerendered HTML is the finished
   state so nothing depends on it.
4a. **New logo.** An open ring with a tail (a Q) and a bright pulse in
   the opening, in `src/logo.jsx` and mirrored in
   `scripts/gen-assets.mjs`; the wordmark is now mixed-case
   "ForgeQubit" in Space Grotesk, which let the Unbounded font (168 kB)
   be removed. Favicon, PWA icons, Apple touch icon and social card
   regenerated.
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
   the entered text. Optional budget and timeline selects added. Field
   ids are literal (`cf-name` …) and the query-string preselection is
   applied after hydration, so the prerendered and hydrated forms are
   identical. On narrow screens the form comes before the process
   steps.
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

### Fourth pass: audit follow-up

- **Pages "not opening"**: server-side every route and link returned
  200 in three separate crawls. The cause was client-side: after a
  rebuild, an open tab requests chunk filenames that no longer exist,
  which happens after every deployment too. Lazy routes now fall back
  to a full reload of the target page once (guarded against loops),
  verified by aborting a chunk request in headless Chrome.
- **Hero demonstration** now tells one complete story: enquiry →
  qualification → slot chosen → confirmed booking and CRM update, with
  Play / Pause / Show result / Replay. Stages complete only when the
  message that proves them is on screen. Every message is laid out from
  the start, so playback never moves the layout. The finished state is
  what is prerendered and what reduced-motion users see. Demonstrations
  stop off screen, in hidden tabs, and if reduced motion is switched on
  while the page is open.
- **Workflow demonstration** plays node by node and stops at the
  human decision; the visitor approves or queries the invoice and sees
  the corresponding branch.
- **Voice sample**: no recording exists, so none is faked. The written
  call now plays at spoken pace with controls and states plainly that
  it is text, not audio. A permission-cleared recording remains a
  missing asset (see §7).
- **Homepage** cut to six blocks; detailed responsibilities and
  engineering practices live on About and the service pages. Mobile
  height 15,967 → 9,592 px (−40%), desktop 8,665 → 5,672 px (−35%).
- **Contact form**: draft kept in `sessionStorage` for the life of the
  tab and cleared on success or Clear; privacy link opens in a new tab;
  corrected fields clear their own error after the first attempt;
  15-second timeout with a retry state that keeps the text; spinner in
  the busy button; focus moves to the success heading; success copy
  says the form service received it (not that an email was delivered).
- **Service pages**: in-page nav marks the section in view with
  `aria-current="location"` without moving focus; on narrow screens it
  is a sticky "On this page" disclosure.
- **Route loading**: a labelled progress bar appears only if a chunk
  takes longer than 150 ms; the area reserves height.
- **Motion polish**: FAQ answers ease in with the icon; hero light
  settles once instead of drifting forever; the tool strip has a Pause
  button; reveals limited to headings and demonstrations at 400 ms /
  12 px with 50 ms stagger.
- **SEO**: titles ≤ 70 and descriptions ≤ 165 characters on every page
  (tested), `max-image-preview:large`, `og:image` and `hreflang` on
  every page (tested), and a crawl test that starts the production-like
  server and checks every route, link, chunk, redirect (308 with the
  right target), unknown URL (404) and the CSP header.

### Fifth pass: glass redesign and the "blank areas" fix

- **Blank areas on Vercel.** The live site worked in headless Chrome
  (hydrated, animations running, every reveal firing), so the blanks
  came from a browser or setting where the JavaScript-driven reveals
  never fired. That mechanism is gone. Nothing on the site is hidden by
  JavaScript any more; where the browser supports CSS scroll-driven
  animations, blocks ease in from a slightly dimmed, offset state
  (never from invisible), and elsewhere they are simply shown.
- **Glass system** appended to `src/styles.css`: translucent surfaces
  with inner highlight and soft cyan-tinted shadow; blur spent only on
  the nav, hero card, CTA band, form and worked examples; gradient rims
  on the signature pieces; a sheen that crosses cards on hover; a
  floating hero card; a pointer-following spotlight on the hero (fine
  pointers only); shimmering emphasised words; three slow lights and a
  faint grid behind every page (`Backdrop` in `src/chrome.jsx`).
  All of it is transform/opacity, switched off under
  `prefers-reduced-motion`, and blur is removed under
  `prefers-reduced-transparency`.
- Text contrast on glass is unchanged in practice: the translucent
  surfaces sit on the same dark ground, and every text token still
  passes AA.

### Sixth pass: inner pages brought up to the home page

- Every inner page now opens with the same hero rhythm as the home:
  breadcrumb pill, eyebrow, headline with gradient emphasis, staggered
  entrance, a pool of light, and a glass visual beside the copy.
  Solutions: a chooser that jumps to each solution. Service detail: an
  "at a glance" card (built for, connects to, first demo, ownership).
  Voice: the paced call sample in the hero and a "how it behaves" card.
  Work: a chooser for the three examples and the evidence note as a
  glass card. About: company facts beside the headline and a
  commitments card.
- A shared line-icon set (`src/icons.jsx`) marks each solution on the
  home cards, the solutions overview, service heroes and capabilities;
  tiles switch to the gradient on hover.
- Inner heroes are clipped to the page so the decorative light can no
  longer cause horizontal overflow (caught by the capture script and
  fixed: 1280/390 px, no overflow on any page).

### Seventh pass: search and AI discoverability

See `SEO.md` for the full table. Added: a distinct social card per
page; `llms.txt` and `llms-full.txt` generated from the content at
build; `robots.txt` explicitly allowing the AI crawlers; FAQ structured
data on the home page; keyword-aware titles (AI receptionist, WhatsApp
and voice agents, automation, UK); a related-solution link from every
blog post; three new build tests covering all of it. `SEO.md` also
lists the seven things only the business can do (Search Console, Google
Business Profile, company facts, real profiles for `sameAs`, evidence,
writing, earned links) and states plainly that no technique guarantees
a first position.

### Eighth pass: full-screen hero and the motion system

- **The home hero is one full screen** (`min-height: 100svh`, content
  centred, nav floating over it) with a scroll cue at its foot. Behind
  it: three slow lights, a receding floor of light lines, and a canvas
  network of points joined where they are near, with the occasional
  signal travelling along an edge (`HeroField` in `src/motion.jsx`).
  The canvas caps pixel ratio at 1.5, scales its point count with area,
  stops off screen and in hidden tabs, and draws one still frame under
  reduced motion. The headline rises word by word from behind a clip;
  the emphasised words keep the gradient. The demonstration card tilts
  toward a fine pointer with a glare, floats, and plays itself once when
  it first comes into view (Pause, Show result and Replay remain; under
  reduced motion it never plays). Its chat is height-capped and scrolls
  the newest message into view while playing. Everything in the hero
  recedes as the page scrolls (CSS scroll timeline; static elsewhere).
- **Navigation** morphs from a full-width bar into a floating glass pill
  once the page scrolls, with a reading-progress hairline (CSS scroll
  timeline, JS fallback writing `--scroll`).
- **Reveals** are JavaScript-observed again, but safely: the hidden
  starting state is scoped to `html.js` (set by `main.jsx` before
  hydration) and carries a 2.2 s safety animation, so an environment
  where the observer never fires still shows every block. Without
  JavaScript the page is simply complete. `Reveal` and `Stagger` in
  `src/motion.jsx`; verified with a headless run that counts elements
  still at opacity 0 after scrolling (zero).
- **Cards**: pointer spotlight (one listener per grid writing `--px`/
  `--py`), outlined numeral watermark on solutions, a rotating conic rim
  on hover (`@property --angle`), lift and sheen. The process on the
  home page is a timeline whose gradient line draws as it scrolls in.
  FAQ answers animate height where `interpolate-size` is supported.
  CTA band has a wandering light and a rotating rim; the footer carries
  a large gradient wordmark watermark.
- **Pointer effects** (magnetic buttons, tilt, spotlights) run only on
  fine pointers and never under reduced motion. All motion is transform
  and opacity; the reduced-motion block leaves zero infinite animations
  (measured) and nothing hidden.
- `scripts/verify-behaviour.mjs` now accounts for the hero autoplay
  (jumps to the finished state before its playback checks).

### Ninth pass: continuity ("no refreshes")

- **Route transitions** (`RouteView` in `src/App.jsx`): the outgoing
  page fades for 240 ms, the swap happens inside `startTransition` so a
  page that still has to suspend keeps the old one on screen instead of
  dropping to the loading fallback, and the incoming page fades up.
  Scroll resets at the swap, not at the click. A hash-only change is
  left to the browser's smooth scroll. The old per-page `page-in`
  animation is retired in favour of this.
- **Every page chunk is warmed on idle** after hydration (`main.jsx`),
  so a navigation never waits on the network. Measured: 12 chunks
  loaded within 3 s of arrival, no fallback ever shown on navigation.
- **Inertia scrolling** (`useSmoothScroll` in `src/motion.jsx`): wheel
  input on fine pointers eases toward its target with `window.scrollTo`,
  so scroll timelines, observers, sticky elements and anchors keep
  working. Off for touch, reduced motion, an open menu, and over
  elements that scroll themselves (the hero chat); keyboard, scrollbar
  and anchor scrolling stay native and cancel the easing.
- **Hero canvas** no longer re-rolls its points on resize (a phone's
  address bar used to reseed the whole scene); points are scaled into
  the new box and the count topped up or trimmed.
- **Nav pill** uses hysteresis (28 px on, 6 px off).
- The chunk-recovery reload (see the fourth pass) still exists: after a
  deploy, a tab holding the old shell reloads once when it asks for a
  chunk that no longer exists. That is the only full reload the site
  performs, and only ever once per tab.

### Tenth pass: the Apple-style home

- The home page is rebuilt as a sequence of centred "product tiles":
  one short headline, one line of copy, a Learn more / Discuss it link
  pair, and one large visual. Paragraph copy is gone from the home.
- Visuals: the enquiry demonstration under a two-line headline in the
  hero; AI Reception's example conversation inside a phone frame;
  the interactive workflow; a document-review assistant in an
  application window (`ProductWindow` in `src/mocks.jsx`, illustrative
  and labelled); two mini tiles (voice with a live waveform, avatars
  and blockchain with orbits); four practice tiles; four stages as a
  row; five questions in a narrow column; a large "Let's talk." close.
- Copy that left the home page still lives on Solutions, About and the
  service pages, which are unchanged in structure.
- Checks: 21 build tests, 18 browser behaviour checks, zero hidden
  blocks after scrolling at 1440 and 390 px, no horizontal overflow.

## 3. Final design tokens

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#061017` | page background |
| `--bg-alt` | `#091923` | alternate sections, footer |
| `--surface` / `--surface-2` | `#102532` / `#153040` | cards, hover |
| `--ink` / `--ink-2` / `--ink-3` | `#F2FAFD` / `#B4CAD4` / `#8AA7B4` | text (18.2 / 11.3 / 7.6 : 1 on `--bg`) |
| `--bg` / `--bg-alt` / `--surface` (final) | `#050D14` / `#081722` / `#0E2230` | deepened in the third pass |
| `--cyan` / `--cyan-bright` / `--cyan-deep` | `#22D3EE` / `#7DF0FF` / `#0E7490` | accents, focus, deep fills |
| `--teal` / `--warm` | `#2DD4BF` / `#FFB86B` | gradient partner; illustrative labels and exception nodes |
| `--cyan-ink` | `#04141B` | text on the gradient (5.1:1 at the darkest stop) |
| `--line` / `--line-strong` | `#254452` / `#3A6072` | decorative borders |
| `--field-border` | `#4F7A8F` | form control boundaries (≥ 3:1 on field and card) |
| `--ok` / `--warn` / `--err` | `#34D399` / `#FBBF24` / `#FB7185` | semantic states |
| `--grad` | `linear-gradient(135deg, #7DF0FF 0%, #22D3EE 40%, #14B8C9 70%, #0891B2 100%)` | primary buttons (dark text keeps ≥ 5:1 at every stop), signature graphics |
| `--grad-text` | `linear-gradient(120deg, #B5F5FF, #22D3EE 50%, #2DD4BF)` | emphasised words only |
| Type | Space Grotesk (body, headings, wordmark), Instrument Serif italic (emphasis) | |
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
| Mobile menu: focus moves in, Tab and Shift+Tab wrap inside the menu, page behind is `inert`, Escape closes, focus returns, scroll locked | works | Manually verified via scripted events in Chromium |
| Contact form on a direct load: field ids identical before and after hydration, no hydration warnings, invalid submit focuses the first invalid field (name → email → message), error text associated via `aria-describedby` | works | Manually verified in Chromium at 390 px |
| Contact form: error path keeps text, success only on `success: true`, triple-click sends once | works | Manually verified against a stubbed endpoint; nothing sent to the live inbox |
| Direct link `/contact?interest=Voice%20Agent` shows "Voice Agent" immediately after hydration; legacy `?interest=Voice%20Agents` maps to it | works | Manually verified |
| Mobile contact layout: form starts at ~417 px on an 844 px viewport, before the process steps; "Jump to the form" link on narrow screens | works | Measured (Chromium emulation) |
| Client-side navigation between chunks, title/canonical update | works, no console errors | Manually verified |
| CSP: no violations on load, form endpoint reachable | no violations | Manually verified on the local production-like server |
| 404 status for unknown URLs, 308 for legacy slugs | works | Measured on the local server; **Not tested** on Vercel until deployed |
| Behaviour checks (`npm run verify`): hero play/pause/show-result/stable layout, workflow decision branch, draft persistence across navigation, error clearing, busy state, 15 s timeout with kept text, success focus, scrollspy, chunk-failure recovery | 17/17 pass | Measured in headless Chrome |
| Vite dev server (`npm run dev`) serves every route | 200 | Measured |
| Live site (www.forgequbit.co.uk) before the fifth pass: hydrated, animations present, all reveals firing after scroll, no console errors | works | Measured in headless Chrome; the blanks you saw could not be reproduced there, hence the removal of the JS dependency |
| Glass build: every page fully rendered in stitched full-page captures at 1280 and 390 px, no overflow | works | Measured in headless Chrome |
| Scroll reveals fire on every block on `/`, `/services`, `/services/ai-reception`, `/case-studies`, `/contact` at 1280 and 390 px (29/29, 10/10, 13/13, 4/4, 3/3) | works | Measured in headless Chrome via `scripts/shots.mjs` |
| Enquiry-flow loop, workflow token, tool strip, logo pulse | running | Manually verified in Chromium |
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
   structurally. `TEAM` and `COMPANY` in `src/data.js` are wired up:
   fill in names, roles, photos, links, the Companies House number and
   registered office and the About page renders them (with a link to
   the Companies House record). They are empty on purpose; a test
   fails if placeholder people appear.
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
