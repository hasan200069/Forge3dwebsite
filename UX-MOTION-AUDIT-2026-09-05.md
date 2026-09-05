# ForgeQubit UX and motion audit — 5 September 2026

The site has a coherent visual identity, but its demonstrations are mostly reading exercises. The highest-value improvement is to make the service understandable through a short, controllable interaction while reducing the amount visitors must read before choosing a next step.

This is an expert inspection of the current local production site and source, not a conversion study. Business impact below is a hypothesis to validate. No source fixes or external form submissions were made. Source files changed between the earlier general audit and this pass; this report describes the newer version inspected here.

## Evidence and scope

- Desktop: 1280 × 720. Mobile: 390 × 844.
- Reviewed homepage, workflow service, voice service, contact journey, navigation and shared interaction code.
- Homepage measured 8,532px high on desktop: about 11.9 viewport heights, including the footer.
- Homepage measured 15,806px on mobile: about 18.7 viewport heights. Its hero alone was 1,692px; the demonstration started at approximately y=803px, solutions at y=2,731px, and FAQs at y=11,966px.
- Measurements describe the inspected build and viewport, not every device or deployment.
- Browser Back restored the homepage position in the journey tested. No scroll-restoration defect is claimed.
- The current source includes fixes for the earlier contact ID/preselection and menu-focus issues, plus a mobile form-first layout. Those earlier findings are not repeated as new defects.

## Motion inventory

| Element | Current behavior | Assessment |
| --- | --- | --- |
| Primary buttons | 250ms hover lift/glow and moving arrow; pressed transform | Useful existing feedback. Retain it. |
| Mobile menu | Panel opacity/translation, hamburger-to-close transition | An appropriate place for short motion. |
| Header | Background/border transition after scrolling | Subtle and functional. |
| Cards | Border changes and small lifts | Some suggest a larger clickable area than actually exists. |
| FAQs | Plus rotates to a close symbol; answer body appears immediately | Partial feedback: the icon animates but the layout jumps. |
| Hero flow | Active step changes every 2.6 seconds; active dot pulses every 1.6 seconds | Motion is disconnected from the static conversation. |
| Workflow and voice example | Static diagrams and written dialogue | Biggest missed opportunity to demonstrate the service. |
| Section entrances | No coordinated reveal system found | Optional polish, not a functional defect. |
| Route loading | Empty region with reserved height and aria-busy | Layout reservation exists, but visible loading feedback is absent. |
| Reduced motion | CSS greatly shortens animations; hero skips timer if preference is set at mount | Good foundation; live preference changes do not stop an already-running JS timer. |

## Prioritized findings

### 1. High opportunity: the hero animation does not explain the transaction

Source: `src/visuals.jsx`, `EnquiryFlow`.

All four messages are visible from the start. A timer changes the highlighted stage independently. It initially highlights the final stage, then wraps to the first. The final message offers appointment slots but does not show the customer choosing one or a booking confirmation, while the stage says “Booked & recorded.” This weakens the causal story even though the example is labelled illustrative.

Recommendation: show one coherent example: enquiry → qualification → slot selection → confirmed booking and CRM update. Add a clearly labelled “Play example” control, pause, replay, and a complete transcript. Keep the result visible at completion. A user should be able to understand the completed example immediately without waiting for playback.

Acceptance: stages advance only with corresponding evidence; the booking has a confirmation; text never shifts surrounding layout; keyboard users can operate controls; reduced-motion mode shows the complete result. Preserve the illustrative label.

### 2. High opportunity: the homepage demands too much reading before differentiation

Source: `src/pages/Home.jsx`.

Nine substantial sections repeatedly cover scoping, weekly demos, ownership, delivery and handoff. On mobile, the compact desktop structures become a long sequence of paragraphs and cards. The solutions section starts more than three screen heights down. More entrance effects will not solve this information-order problem.

Recommendation: restructure into six main blocks: concise promise and demo; three short service choices; strongest available evidence; compact delivery process; essential buying questions; enquiry CTA. Move detailed responsibilities and engineering practices into About and service pages. Merge repeated claims. Use shorter card summaries with an explicit detail link.

Acceptance: in a quick usability session, visitors can explain the offer and select the relevant service without reading most of the homepage. Treat a 30–40% mobile-height reduction as an initial design target, not a universal rule.

### 3. High opportunity: visitors cannot hear the voice product

Sources: `src/visuals.jsx`, `CallSample`; `src/pages/VoiceAgents.jsx`.

The voice page contains a written call, no audio element, and no playback controls in the inspected main content. Text cannot demonstrate vocal quality, response timing or interruption handling.

Recommendation: add an actual representative, permission-cleared recording with play/pause, duration, transcript and clear provenance. A synthetic illustration should be labelled as such and must not imply it measures production latency. Offer a test-number experience only when a real supported demonstration exists. Animate a waveform only during playback and tie it to the audio.

Acceptance: the visitor can start a short sample near the hero, pause it, access the transcript and understand what is real versus illustrative. Never autoplay audio.

### 4. High defect: checking the privacy policy can discard an enquiry draft

Source: `src/pages/Contact.jsx`.

Reproduction: entered a synthetic name and description, opened the inline privacy-policy link, then used browser Back. Both fields returned empty. The policy opens in the same tab and form state has no draft persistence.

Recommendation: make policy review preserve the draft, for example with a clearly indicated separate-tab policy link or an accessible disclosure that leaves the form mounted. Decide explicitly whether broader draft persistence is wanted; avoid silently storing enquiry text indefinitely.

Acceptance: enter all fields, review the policy, return, and verify exact values survive. Clear any persisted draft after confirmed completion or an explicit reset.

### 5. Medium defect: corrected inputs retain stale validation errors

Source: `src/pages/Contact.jsx`, field change handler.

Reproduction: submitted an empty form, then supplied a name. The name field still had aria-invalid=true and “Please enter your name.” The change handler updates values without revalidating or clearing the error.

Recommendation: after the first validation attempt, revalidate affected fields on blur or change. Keep initial typing free of premature error messages. Use a short border/color change when validity changes; avoid shaking fields.

Acceptance: correcting the name clears its error while unrelated errors remain. Error descriptions stay associated with their fields and are announced without repeating on every keystroke.

### 6. Medium: service-page navigation does not show reading position

Source: `src/pages/ServicePage.jsx`, `.svc-nav` in `src/styles.css`.

The eight section links remain visually equivalent. After navigating to the example, none carried an active class or aria-current. On narrower screens they become static wrapped pills and disappear as the visitor scrolls.

Recommendation: mark the current section using a slim indicator and aria-current=location. On mobile, use a compact “On this page” disclosure if testing shows navigation is needed; eight persistent pills would consume too much screen space. Preserve native anchor behavior and header offset.

Acceptance: the marker follows the section in view without changing keyboard focus, and direct hash links reach the correct section.

### 7. Medium: hover motion promises more interaction than the solution cards provide

Sources: `src/pages/Home.jsx`, `.solution:hover` in `src/styles.css`.

The solution containers are now articles with a separate Explore link, but the whole article lifts and changes border on hover. The screenshot showed this response while the pointer was over the card body. This resembles feedback for a fully clickable card.

Recommendation: either make the intended larger target genuinely operable with one clear accessible name, or restrict interaction motion to the link and use a subtle focus-within treatment. Keep equivalent feedback for keyboard and touch users.

Acceptance: every area that strongly looks actionable responds as expected; no nested interactive controls; clear focus styling.

### 8. Medium: loading and submission need clearer state transitions

Sources: `src/App.jsx`, `Loading`; `src/pages/Contact.jsx`.

Code inspection shows a blank route-loading area and a submit button that changes to “Sending…” while keeping its arrow. The request has no application timeout. The success state replaces the form without explicit focus placement. A stalled network and successful receipt were not simulated in this audit.

Recommendation: add a restrained, labelled route-loading indicator, retain layout dimensions, and avoid delaying fast navigations to show it. For submission, use a clear busy indicator, a bounded timeout and an actionable retry state that preserves text. Move focus to a meaningful success heading on completion. Use a short success transition without confetti.

Acceptance: under throttled/offline conditions users can tell loading from failure; retries preserve input and do not permit duplicate in-flight requests. A successful response is distinguishable from a delivered email.

### 9. Medium: the existing loop needs better user control

Source: `src/visuals.jsx`, timer effect; reduced-motion CSS.

The hero timer loops for as long as the component remains mounted, with no pause/replay control or visibility observer. The JavaScript reduced-motion check happens once. Changing the preference after mount does not cancel the timer, even though CSS motion is shortened.

Recommendation: prefer user-started playback; listen for motion-preference changes; stop scheduling while offscreen or in a hidden document. Provide pause/stop for ongoing automatic demonstrations. W3C explains when automatically moving or updating content requires control in [Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html). This is an accessibility concern to resolve, not a claim of a completed WCAG conformance audit.

### 10. Lower priority: FAQ and section motion can be polished selectively

The FAQ icon rotates over 250ms while the answer appears immediately. A short expansion transition would connect the action with its result. For section entrances, introduce only major headings and demonstrations, once per visit, using modest opacity/translation changes. Leave long text, form fields, and the initial headline immediately readable.

Do not make text availability depend on an observer or animation completing. The existing prerendered content must remain visible if JavaScript fails.

## Proposed motion specification

These are starting design values, not measured conversion optimizations.

| Use | Suggested behavior |
| --- | --- |
| Press feedback | 80–120ms, small visual change; no layout movement |
| Hover/focus feedback | 140–200ms; consistent across equivalent controls |
| Menu/FAQ transition | 180–240ms; interruption-safe |
| Section introduction | 300–450ms, 8–16px movement, only selected elements |
| Card-group stagger | 40–60ms offsets, group completes within roughly 600ms |
| Hero demonstration | User-started, paced for reading, pause/replay, stable final state |
| Workflow demonstration | Advance node-by-node; stop at the human decision and let the visitor choose an illustrative branch |
| Success feedback | 180–250ms, stable layout, meaningful text and focus |

Use transform and opacity for decorative transitions where practical. Keep timers and animations idle offscreen. Reduced-motion mode should use static illustrations and immediate essential state changes. W3C's [Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) explains the rationale for disabling nonessential interaction-triggered motion.

Avoid scroll hijacking, mandatory intro sequences, parallax applied to reading text, continuously moving backgrounds, fake performance counters, and decorative waveforms that imply a live call. These would add activity without demonstrating value.

## Suggested implementation order and validation

1. Protect form drafts and repair stale errors. Make card feedback match real click targets.
2. Shorten the homepage and bring the most useful demonstration forward, especially on mobile.
3. Build a coherent, controlled hero sequence and add a real voice sample when available.
4. Improve route/form feedback and service-section orientation.
5. Add restrained FAQ, menu and section polish with reduced-motion support.

Validate with keyboard-only use, a small mobile viewport, reduced motion, slow loading, failed requests, and repeated navigation. Check layout shift and responsiveness before/after adding motion. Do not infer performance improvements from screenshots.

The existing CTA and form events provide a starting point. Measure demo starts/completions, service selection, enquiry starts and accepted submissions without recording entered text. Evaluate enquiry completion and qualified enquiries alongside demo engagement; longer dwell time alone may mean distraction. A small usability study should ask visitors what the company does, which service fits their situation, what they heard/saw in the demo, and what they expect after submitting.
