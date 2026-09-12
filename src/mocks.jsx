/* ————————————————————————————————————————
   Device and product mocks for the home page. Plain HTML and CSS,
   labelled illustrative like every other visual: they show the shape
   of what gets built, not a screenshot of a client system.
   ———————————————————————————————————————— */

import { Transcript } from './visuals.jsx'

/* a phone holding a WhatsApp-style conversation */
export function PhoneFrame({ title, subtitle, steps, note }) {
  return (
    <figure className="device phone" aria-label={`${title}, shown on a phone`}>
      <div className="phone-body">
        <div className="phone-notch" aria-hidden="true" />
        <div className="phone-bar">
          <span className="phone-avatar" aria-hidden="true">{title.slice(0, 1)}</span>
          <span>
            <b>{title}</b>
            <small>{subtitle}</small>
          </span>
          <span className="phone-status" aria-hidden="true">
            <i /><i /><i />
          </span>
        </div>
        <div className="phone-screen">
          <Transcript steps={steps} compact />
        </div>
        <div className="phone-compose" aria-hidden="true">
          <span>Message</span>
          <i />
        </div>
      </div>
      <figcaption className="sr-only">{note}</figcaption>
    </figure>
  )
}

/* an application window: a document-review assistant */
export function ProductWindow({ note }) {
  const docs = [
    { name: 'Master services agreement.pdf', pages: 42, state: 'Reviewed' },
    { name: 'Data processing addendum.docx', pages: 11, state: 'Flagged 3' },
    { name: 'Lease schedule 2026.pdf', pages: 18, state: 'In review' },
    { name: 'Supplier terms v4.pdf', pages: 9, state: 'Queued' },
  ]
  const flags = [
    { k: 'Liability cap', v: 'Uncapped for data breach', tone: 'warn' },
    { k: 'Termination', v: '90 days, either party', tone: 'ok' },
    { k: 'Governing law', v: 'Differs from precedent (NY vs E&W)', tone: 'warn' },
  ]
  return (
    <figure className="device window" aria-label="Illustrative document review assistant, shown as an application window">
      <div className="window-chrome" aria-hidden="true">
        <i /><i /><i />
        <span>Review assistant</span>
      </div>
      <div className="window-body">
        <aside className="window-side" aria-label="Documents">
          <b>Today</b>
          {docs.map((d, i) => (
            <div key={d.name} className={`window-doc ${i === 1 ? 'active' : ''}`}>
              <span>{d.name}</span>
              <small>{d.pages} pages · {d.state}</small>
            </div>
          ))}
        </aside>
        <div className="window-main">
          <div className="window-head">
            <b>Data processing addendum</b>
            <span className="label-illustrative">Illustrative</span>
          </div>
          <p className="window-summary">
            Standard DPA with two departures from the firm’s precedent. Sub-processor list is current. Breach notice period is 48 hours.
          </p>
          <ul className="window-flags" aria-label="Flagged clauses">
            {flags.map((f) => (
              <li key={f.k} className={f.tone}>
                <b>{f.k}</b>
                <span>{f.v}</span>
              </li>
            ))}
          </ul>
          <div className="window-actions" aria-hidden="true">
            <span className="btn btn-primary btn-xs">Accept summary</span>
            <span className="btn btn-secondary btn-xs">Correct</span>
            <small>Corrections feed the evaluation set</small>
          </div>
        </div>
      </div>
      <figcaption className="sr-only">{note}</figcaption>
    </figure>
  )
}

/* ———— small line icons for the four practices ———— */

const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: 'false',
}

export const ScopeIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M7 3h7l5 5v13H7z" />
    <path d="M14 3v5h5M10 13h6M10 17h4" />
  </svg>
)

export const DemoIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="M3 9h18M8 3v4M16 3v4" />
    <path d="M10.5 13.2v3.6l3-1.8z" fill="currentColor" stroke="none" />
  </svg>
)

export const PersonIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20a7 7 0 0 1 14 0" />
    <path d="M17.5 3.5l1 1 2-2" />
  </svg>
)

export const KeyIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="8" cy="15" r="4.5" />
    <path d="M11.2 11.8L20 3M16 7l2.5 2.5M13.5 9.5l2.5 2.5" />
  </svg>
)
