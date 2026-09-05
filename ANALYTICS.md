# Analytics and conversion measurement

The site already ships Vercel Web Analytics and Vercel Speed Insights
(`@vercel/analytics`, `@vercel/speed-insights`). No second provider was
added. Custom events are sent through Vercel's `track()` from
`src/analytics.js`; they appear under **Analytics → Events** in the Vercel
project once Web Analytics is enabled for the project.

Vercel Analytics is cookie-less and records no personal identifiers. The
events below carry only fixed-list values (which button, which service).
Names, email addresses and message text are never sent, and a test guards
against that (`scripts/check-dist.test.mjs`, "no personal data fields").

## Event model

| Event | When it fires | Properties |
| --- | --- | --- |
| `cta_click` | Any element with `data-track` is clicked | `id` (which CTA), `kind` (`link`, `email`, `phone`), `page` |
| `form_start` | First keystroke in the contact form, once per form instance | `interest` |
| `form_submit_accepted` | Web3Forms returned `success: true` | `interest`, `budget`, `timeline` |
| `form_submit_failed` | Validation passed but delivery failed | `interest`, `reason` (`network` or `rejected`) |

`data-track` ids in use: `hero-primary`, `hero-secondary`, `nav-cta`,
`menu-cta`, `cta-band`, `cta-band-email`, `footer-email`,
`feature-enquiry`, `solution-<slug>`, `service-hero-<slug>`.

There is no booking link on the site, so there is no booking event. If a
scheduling link is added later, track the click as `booking_link_click`
and treat a **confirmed** booking as a separate event that only the
scheduling tool can report. A click is not a booking.

## Reading the numbers

- **Enquiries by service**: `form_submit_accepted` grouped by `interest`.
  Compare with `cta_click` grouped by `id` to see which page and button
  produced the enquiry.
- **Enquiries by source**: Vercel Analytics attributes page views and
  events to referrer and UTM parameters. Use UTM-tagged links in outbound
  campaigns and email signatures so the source is attributable.
- **Form completion**: `form_submit_accepted` ÷ `form_start`. A high
  `form_start` with low acceptance means friction in the form; a high
  `form_submit_failed` means a delivery problem worth checking in the
  Web3Forms dashboard first.
- **Qualified enquiry rate**: not measurable from the site alone. Record
  in the inbox or CRM whether each accepted enquiry led to a discovery
  call, and whether the call led to a proposal. The `budget` and
  `timeline` properties on the accepted event allow a rough early read.
- **Booked conversations and proposals**: track in the CRM, keyed by the
  enquiry's email address, which the site deliberately does not send to
  analytics.

## Experiments

Traffic to a studio site of this size is far too low for A/B tests to
produce reliable results in any reasonable time. Prefer:

- Watching five to ten session recordings or asking three prospective
  clients to find "what it costs" and "what happens after I enquire".
- Reading every enquiry for signs of confusion about the offer.
- Changing one thing at a time and comparing month over month, while
  accepting that the noise will be large.

Do not declare a winner between variants without a pre-agreed sample
size.
