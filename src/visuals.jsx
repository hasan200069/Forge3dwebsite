/* ————————————————————————————————————————
   Illustrative visuals. Plain HTML and CSS — no canvas, no animation
   libraries. Every one of these carries a visible "illustrative" label
   because none of them is a screenshot of a production system.

   Motion: the enquiry flow and the workflow diagram "play" on the
   client (a message arrives, the steps light up, a token moves down the
   workflow). The prerendered HTML is the finished state, so nothing is
   hidden from a crawler or from anyone with JavaScript off, and under
   prefers-reduced-motion the finished state is what stays on screen.
   ———————————————————————————————————————— */

import { useEffect, useState } from 'react'

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* runs `fn(step)` on a schedule of delays, looping; returns a stop() */
function play(steps, fn, loopPause) {
  let i = 0
  let t = 0
  let stopped = false
  const next = () => {
    if (stopped) return
    fn(i)
    const delay = i === steps.length - 1 ? loopPause : steps[i + 1]
    i = (i + 1) % steps.length
    t = setTimeout(next, delay)
  }
  t = setTimeout(next, steps[0])
  return () => {
    stopped = true
    clearTimeout(t)
  }
}

const HERO_CHAT = [
  { who: 'Customer', me: false, text: 'Hi, do you have any availability for a boiler service next week?' },
  { who: 'Assistant', me: true, text: 'Yes. Is this for a home or a rental property, and what is the postcode?' },
  { who: 'Customer', me: false, text: 'Home, SW11. Mornings are best.' },
  { who: 'Assistant', me: true, text: 'Tuesday 9am or Thursday 8:30am are free. Which suits?' },
]

const HERO_STEPS = [
  { t: 'Enquiry answered', d: 'WhatsApp or phone, in seconds' },
  { t: 'Qualified', d: 'Property type, postcode, timing' },
  { t: 'Booked & recorded', d: 'Calendar slot, CRM updated, team notified' },
]

/* frames: how many messages are visible, whether a typing indicator
   shows, and which step is live. The last frame is the finished state
   and is what the server renders. */
const HERO_FRAMES = [
  { msgs: 1, typing: true, step: 0, delay: 900 },
  { msgs: 2, typing: false, step: 0, delay: 1300 },
  { msgs: 2, typing: true, step: 1, delay: 1800 },
  { msgs: 3, typing: false, step: 1, delay: 1200 },
  { msgs: 3, typing: true, step: 1, delay: 1600 },
  { msgs: 4, typing: false, step: 2, delay: 1400 },
  { msgs: 4, typing: false, step: 3, delay: 1000 },
]
const DONE = HERO_FRAMES.length - 1

export function EnquiryFlow() {
  const [frame, setFrame] = useState(DONE)

  useEffect(() => {
    if (reduced()) return
    return play(HERO_FRAMES.map((f) => f.delay), (i) => setFrame(i), 4200)
  }, [])

  const f = HERO_FRAMES[frame]
  const playing = frame !== DONE

  return (
    <figure className="flow" aria-label="Illustration of an enquiry being answered, qualified and booked">
      <div className="flow-head">
        <div className="flow-title">
          Enquiry to booking
          <small>Heating engineer, WhatsApp channel</small>
        </div>
        <span className="label-illustrative">Illustrative</span>
      </div>

      <div className="chat" aria-live="off">
        {HERO_CHAT.slice(0, f.msgs).map((m, i) => (
          <div key={i} className={`bubble ${m.me ? 'me' : 'them'} ${playing ? 'pop' : ''}`}>
            <span className="who">{m.who}</span>
            {m.text}
          </div>
        ))}
        {f.typing && (
          <div className={`bubble typing ${f.msgs % 2 ? 'me' : 'them'}`} aria-hidden="true">
            <i /><i /><i />
          </div>
        )}
      </div>

      <ol className="flow-steps" aria-label="Steps">
        {HERO_STEPS.map((s, i) => (
          <li key={s.t} className={`flow-step ${i < f.step ? 'done' : ''} ${i === f.step ? 'live' : ''}`}>
            <b>{s.t}</b>
            {s.d}
          </li>
        ))}
      </ol>

      <figcaption className="flow-foot">
        <span>Sample conversation, not a production transcript.</span>
        <span className="handoff">Handoff to a person on request</span>
      </figcaption>
    </figure>
  )
}

/* ———— chat transcript from data (service pages, work page) ———— */

export function Transcript({ steps, note, compact = false }) {
  return (
    <div className={compact ? 'chat' : 'transcript'}>
      {steps.map((s, i) => {
        const cls = s.who === 'System' ? 'sys' : s.who === 'Agent' || s.who === 'Assistant' ? 'me' : 'them'
        return (
          <div key={i} className={`bubble ${cls}`}>
            <span className="who">{s.who}</span>
            {s.text}
          </div>
        )
      })}
      {note && <p className="transcript-note">{note}</p>}
    </div>
  )
}

/* ———— workflow diagram with an explicit human approval node ———— */

const KIND = {
  trigger: { icon: 'IN', label: 'Trigger' },
  ai: { icon: 'AI', label: 'Language model step' },
  system: { icon: 'API', label: 'System action' },
  decision: { icon: '?', label: 'Check' },
  human: { icon: 'OK', label: 'Person approves' },
}

export function Workflow({ flow, note }) {
  /* -1 = finished state (server render); otherwise the active node */
  const [active, setActive] = useState(-1)

  useEffect(() => {
    if (reduced()) return
    const delays = flow.map((n) => (n.kind === 'human' ? 1900 : n.kind === 'decision' ? 1300 : 900))
    return play(delays, (i) => setActive(i), 2600)
  }, [flow])

  return (
    <figure className="wf" aria-label="Illustrative workflow diagram with a human approval step">
      {flow.map((n, i) => (
        <div
          key={i}
          className={`wf-node ${n.kind} ${active === i ? 'active' : ''} ${active >= 0 && i < active ? 'passed' : ''}`}
        >
          <span className="wf-icon" aria-hidden="true">{KIND[n.kind].icon}</span>
          <span>
            {n.label}
            <small>{KIND[n.kind].label}</small>
          </span>
        </div>
      ))}
      <figcaption>
        <div className="wf-legend">
          <span><i style={{ background: 'var(--cyan)' }} /> AI step with confidence threshold</span>
          <span><i style={{ background: 'var(--ok)' }} /> Human approval</span>
          <span><i style={{ background: 'var(--warm)' }} /> Exception check</span>
        </div>
        {note && <p className="transcript-note" style={{ marginTop: 12 }}>{note}</p>}
      </figcaption>
    </figure>
  )
}

/* ———— a voice call, written out ———— */

const CALL = [
  { who: 'Agent', text: 'Thanks for calling Riverside Dental. I’m the practice’s automated assistant. How can I help?' },
  { who: 'Caller', text: 'I need to move my appointment on Thursday, something’s come up.' },
  { who: 'Agent', text: 'No problem. Can I take your date of birth to find the booking?' },
  { who: 'Caller', text: 'Fourth of March, eighty-eight.' },
  { who: 'Agent', text: 'Found it, Thursday 2:15 with Dr Patel. I can offer Friday 10:00 or Monday 3:30. Which would you like?' },
  { who: 'Caller', text: 'Friday at ten, please.' },
  { who: 'System', text: 'Appointment moved in practice system. Confirmation SMS sent. Call summary logged.' },
]

export function CallSample() {
  return (
    <figure className="call" aria-label="Illustrative phone call handled by a voice agent">
      <div className="flow-head" style={{ padding: 0 }}>
        <div className="flow-title">
          <span className="live-dot" aria-hidden="true" />
          Rescheduling by phone
          <small>Dental practice, main number</small>
        </div>
        <span className="label-illustrative">Illustrative</span>
      </div>
      {CALL.map((l, i) => (
        <div key={i} className={`call-line ${l.who === 'Agent' ? 'agent' : l.who === 'System' ? 'sys' : ''}`}>
          <b>{l.who}</b>
          <span>{l.text}</span>
        </div>
      ))}
      <figcaption className="transcript-note">Sample call written to show scope and handoff behaviour. Names are fictional.</figcaption>
    </figure>
  )
}

/* ———— integrations strip ———— */

export const TOOLS = [
  'WhatsApp Business', 'Twilio', 'Vonage', 'Google Calendar', 'Microsoft 365', 'Calendly',
  'HubSpot', 'Salesforce', 'Pipedrive', 'Zoho', 'Xero', 'QuickBooks', 'Zendesk', 'Intercom',
  'Slack', 'Microsoft Teams', 'Notion', 'Airtable', 'Stripe', 'Postgres', 'AWS', 'Google Cloud',
]

/* Two copies of the list scroll as one loop; the second is hidden from
   assistive tech so tool names are not announced twice. Under reduced
   motion the strip stops and wraps instead. */
export function ToolStrip() {
  return (
    <div className="strip" aria-label="Tools we integrate with">
      <ul className="strip-track">
        {TOOLS.map((t) => <li key={t}>{t}</li>)}
      </ul>
      <ul className="strip-track" aria-hidden="true">
        {TOOLS.map((t) => <li key={t}>{t}</li>)}
      </ul>
    </div>
  )
}
