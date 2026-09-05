/* ————————————————————————————————————————
   Illustrative visuals. Plain HTML and CSS — no canvas, no animation
   libraries. Every one of these carries a visible "illustrative" label
   because none of them is a screenshot of a production system.
   ———————————————————————————————————————— */

import { useEffect, useState } from 'react'

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

/* The hero visual: an enquiry moving through qualification to booking.
   Server-rendered with the final state so nothing depends on JS; the
   client then cycles a highlight through the steps. */
export function EnquiryFlow() {
  const [live, setLive] = useState(2)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setLive((v) => (v + 1) % HERO_STEPS.length), 2600)
    return () => clearInterval(id)
  }, [])

  return (
    <figure className="flow" aria-label="Illustration of an enquiry being answered, qualified and booked">
      <div className="flow-head">
        <div className="flow-title">
          Enquiry to booking
          <small>Heating engineer, WhatsApp channel</small>
        </div>
        <span className="label-illustrative">Illustrative</span>
      </div>

      <div className="chat">
        {HERO_CHAT.map((m, i) => (
          <div key={i} className={`bubble ${m.me ? 'me' : 'them'}`}>
            <span className="who">{m.who}</span>
            {m.text}
          </div>
        ))}
      </div>

      <ol className="flow-steps" aria-label="Steps">
        {HERO_STEPS.map((s, i) => (
          <li key={s.t} className={`flow-step ${i < live ? 'done' : ''} ${i === live ? 'live' : ''}`}>
            <b>{s.t}</b>
            {s.d}
          </li>
        ))}
      </ol>

      <figcaption className="flow-foot">
        <span>Sample conversation, not a production transcript.</span>
        <span>Handoff to a person on request</span>
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
  return (
    <figure className="wf" aria-label="Illustrative workflow diagram with a human approval step">
      {flow.map((n, i) => (
        <div key={i} className={`wf-node ${n.kind}`}>
          <span className="wf-icon" aria-hidden="true">{KIND[n.kind].icon}</span>
          <span>
            {n.label}
            <small>{KIND[n.kind].label}</small>
          </span>
        </div>
      ))}
      <figcaption>
        <div className="wf-legend">
          <span><i style={{ background: 'var(--grad)' }} /> AI step with confidence threshold</span>
          <span><i style={{ background: 'var(--ok)' }} /> Human approval</span>
          <span><i style={{ background: 'var(--warn)' }} /> Exception check</span>
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
