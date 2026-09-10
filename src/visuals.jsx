/* ————————————————————————————————————————
   Illustrative visuals. Plain HTML and CSS — no canvas, no animation
   libraries. Every one of these carries a visible "illustrative" label
   because none of them is a screenshot of a production system.

   Motion policy:
   · the prerendered HTML is the finished state, so a crawler, a visitor
     with JavaScript off and a visitor with reduced motion all see the
     complete example at once
   · demonstrations are user-started, have pause and replay, stop while
     off screen or in a hidden tab, and stop if the visitor switches on
     reduced motion while the page is open
   · playing never changes layout: every message is laid out from the
     start and hidden ones are only invisible
   ———————————————————————————————————————— */

import { useEffect, useRef, useState } from 'react'
import { track } from './analytics.js'

const MQ = '(prefers-reduced-motion: reduce)'

/* ———— a small player: frames with per-frame durations ———— */

function usePlayer(durations, { onStart, onComplete, autoplay = false } = {}) {
  const last = durations.length - 1
  const [index, setIndex] = useState(last) // finished state first
  const [playing, setPlaying] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [started, setStarted] = useState(false)
  const visible = useRef(true)
  const ref = useRef(null)
  const timer = useRef(0)
  const autoDone = useRef(false)
  const cb = useRef({ onStart, onComplete })
  cb.current = { onStart, onComplete }

  /* reduced motion: respected at mount and if it changes later */
  useEffect(() => {
    const mq = window.matchMedia(MQ)
    const apply = () => {
      setReduced(mq.matches)
      if (mq.matches) {
        setPlaying(false)
        setIndex(last)
      }
    }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [last])

  /* pause while off screen or in a hidden tab; with `autoplay`, run the
     example once the first time it is on screen (never under reduced
     motion, and the finished state is what the HTML ships with, so a
     visitor who scrolls past sees the result either way) */
  useEffect(() => {
    const el = ref.current
    const onVis = () => {
      if (document.hidden) setPlaying(false)
    }
    document.addEventListener('visibilitychange', onVis)
    let io
    let auto = 0
    if (el && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(([e]) => {
        visible.current = e.isIntersecting
        if (!e.isIntersecting) {
          setPlaying(false)
          clearTimeout(auto)
          return
        }
        if (autoplay && !autoDone.current && !window.matchMedia(MQ).matches && !document.hidden) {
          autoDone.current = true
          auto = setTimeout(() => {
            setIndex(0)
            setStarted(true)
            setPlaying(true)
            cb.current.onStart?.()
          }, 1400)
        }
      })
      io.observe(el)
    }
    return () => {
      clearTimeout(auto)
      document.removeEventListener('visibilitychange', onVis)
      io?.disconnect()
    }
  }, [autoplay])

  /* the schedule */
  useEffect(() => {
    clearTimeout(timer.current)
    if (!playing) return
    if (index >= last) {
      setPlaying(false)
      cb.current.onComplete?.()
      return
    }
    timer.current = setTimeout(() => setIndex((i) => i + 1), durations[index])
    return () => clearTimeout(timer.current)
  }, [playing, index, durations, last])

  const play = () => {
    if (reduced) return
    if (index >= last) setIndex(0)
    setStarted(true)
    setPlaying(true)
    cb.current.onStart?.()
  }
  const pause = () => setPlaying(false)
  const finish = () => {
    setPlaying(false)
    setIndex(last)
  }

  return { ref, index, playing, reduced, started, done: index >= last, play, pause, finish }
}

function Controls({ p, label, id }) {
  if (p.reduced) return null
  return (
    <div className="demo-controls" role="group" aria-label={`${label} playback`}>
      {p.playing ? (
        <button type="button" className="btn btn-secondary btn-xs" onClick={p.pause}>
          <span className="ico" aria-hidden="true">❚❚</span> Pause
        </button>
      ) : (
        <button type="button" className="btn btn-primary btn-xs" onClick={p.play} data-track={`demo-play-${id}`}>
          <span className="ico" aria-hidden="true">▶</span> {p.done ? 'Replay example' : 'Play example'}
        </button>
      )}
      {!p.done && (
        <button type="button" className="btn btn-secondary btn-xs" onClick={p.finish}>Show result</button>
      )}
      <span className="demo-status" role="status" aria-live="polite">
        {p.playing ? 'Playing' : p.done ? 'Complete' : 'Paused'}
      </span>
    </div>
  )
}

/* ———— the hero: one enquiry, start to booked ———— */

const HERO_CHAT = [
  { who: 'Customer', me: false, text: 'Hi, do you have any availability for a boiler service next week?' },
  { who: 'Assistant', me: true, text: 'Yes. Is this for a home or a rental property, and what is the postcode?' },
  { who: 'Customer', me: false, text: 'Home, SW11. Mornings are best.' },
  { who: 'Assistant', me: true, text: 'Tuesday 9am or Thursday 8:30am are free. Which suits?' },
  { who: 'Customer', me: false, text: 'Thursday 8:30, please.' },
  { who: 'Assistant', me: true, text: 'Booked for Thursday at 8:30. A confirmation is on its way, and the engineer has your address.' },
  { who: 'System', me: null, text: 'Job created: Thu 08:30, boiler service, SW11. CRM contact updated. Engineer notified.' },
]

const HERO_STEPS = [
  { t: 'Enquiry answered', d: 'First reply in seconds, on WhatsApp' },
  { t: 'Qualified', d: 'Property type, postcode, timing' },
  { t: 'Slot chosen', d: 'Two options offered, one picked' },
  { t: 'Booked & recorded', d: 'Confirmed, calendar and CRM updated' },
]

/* frame = how many messages are shown, whether someone is typing, and
   how many stages are complete. Stages only complete once the message
   that proves them is on screen. */
const HERO_FRAMES = [
  { msgs: 0, typing: 'them', done: 0, ms: 900 },
  { msgs: 1, typing: 'me', done: 0, ms: 1400 },
  { msgs: 2, typing: null, done: 1, ms: 1500 },
  { msgs: 2, typing: 'them', done: 1, ms: 1200 },
  { msgs: 3, typing: 'me', done: 2, ms: 1500 },
  { msgs: 4, typing: null, done: 2, ms: 1600 },
  { msgs: 4, typing: 'them', done: 2, ms: 1100 },
  { msgs: 5, typing: 'me', done: 3, ms: 1400 },
  { msgs: 6, typing: null, done: 3, ms: 1000 },
  { msgs: 7, typing: null, done: 4, ms: 0 },
]

export function EnquiryFlow({ autoplay = false }) {
  const p = usePlayer(
    HERO_FRAMES.map((f) => f.ms),
    { autoplay, onStart: () => track('demo_start', { id: 'hero' }), onComplete: () => track('demo_complete', { id: 'hero' }) }
  )
  const f = HERO_FRAMES[p.index]
  const chat = useRef(null)

  /* keep the newest message in view when the chat is height-capped;
     the finished state stays scrolled to the top so the whole example
     reads from the beginning */
  useEffect(() => {
    const el = chat.current
    if (!el || el.scrollHeight <= el.clientHeight) return
    if (!p.playing) {
      if (p.done) el.scrollTo({ top: 0 })
      return
    }
    const shown = el.querySelectorAll('.bubble:not(.pending)')
    const last = el.querySelector('.bubble.typing') || shown[shown.length - 1]
    if (!last) return
    el.scrollTo({ top: Math.max(0, last.offsetTop + last.offsetHeight - el.clientHeight + 12) })
  }, [f.msgs, f.typing, p.playing, p.done])

  return (
    <figure className="flow" ref={p.ref} aria-label="Illustration of an enquiry being answered, qualified, booked and recorded">
      <div className="flow-head">
        <div className="flow-title">
          <span className="flow-live" aria-hidden="true" />
          Enquiry to booking
          <small>Heating engineer, WhatsApp channel</small>
        </div>
        <span className="label-illustrative">Illustrative</span>
      </div>

      <div className="chat" aria-live="off" ref={chat}>
        {HERO_CHAT.map((m, i) => {
          const shown = i < f.msgs
          const cls = m.me === null ? 'sys' : m.me ? 'me' : 'them'
          return (
            <div key={i} className={`bubble ${cls} ${shown ? (p.playing || !p.done ? 'pop' : '') : 'pending'}`} aria-hidden={!shown}>
              <span className="who">{m.who}</span>
              {m.text}
            </div>
          )
        })}
        {f.typing && (
          <div className={`bubble typing ${f.typing}`} aria-hidden="true">
            <i /><i /><i />
          </div>
        )}
      </div>

      <ol className="flow-steps" aria-label="Stages">
        {HERO_STEPS.map((s, i) => (
          <li key={s.t} className={`flow-step ${i < f.done ? 'done' : ''} ${i === f.done && !p.done ? 'live' : ''}`}>
            <b>{s.t}</b>
            {s.d}
          </li>
        ))}
      </ol>

      <div className="flow-foot">
        <Controls p={p} label="Enquiry example" id="hero" />
        <span className="handoff">Handoff to a person on request</span>
      </div>
      <figcaption className="transcript-note">
        Sample conversation written to show the intended flow. Not a transcript from a live deployment.
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

/* ———— workflow with a human decision the visitor makes ———— */

const KIND = {
  trigger: { icon: 'IN', label: 'Trigger' },
  ai: { icon: 'AI', label: 'Language model step' },
  system: { icon: 'API', label: 'System action' },
  decision: { icon: '?', label: 'Check' },
  human: { icon: 'OK', label: 'Person decides' },
}

const HELD = { label: 'Invoice held; requester asked to confirm the purchase order', kind: 'system' }

export function Workflow({ flow, note }) {
  const humanAt = flow.findIndex((n) => n.kind === 'human')
  /* frames: 0..humanAt reveal nodes one by one, then wait for a choice */
  const durations = flow.slice(0, humanAt + 1).map((n) => (n.kind === 'decision' ? 1300 : 900)).concat([0])
  const p = usePlayer(durations, { onStart: () => track('demo_start', { id: 'workflow' }) })
  const [choice, setChoice] = useState(null) // 'approve' | 'hold' | null

  const waiting = p.started && p.done && choice === null && !p.reduced
  const shownUpTo = !p.started || p.reduced || (p.done && choice !== null) ? flow.length : Math.min(p.index, humanAt)
  const tail = choice === 'hold' ? [HELD] : flow.slice(humanAt + 1)

  const restart = () => {
    setChoice(null)
    p.play()
  }

  return (
    <figure className="wf" ref={p.ref} aria-label="Illustrative workflow diagram with a human approval step">
      {flow.slice(0, humanAt + 1).map((n, i) => (
        <div
          key={i}
          className={`wf-node ${n.kind} ${i <= shownUpTo ? '' : 'pending'} ${p.playing && i === p.index ? 'active' : ''} ${waiting && i === humanAt ? 'active' : ''}`}
        >
          <span className="wf-icon" aria-hidden="true">{KIND[n.kind].icon}</span>
          <span>
            {n.label}
            <small>{KIND[n.kind].label}</small>
          </span>
        </div>
      ))}

      {waiting ? (
        <div className="wf-choice" role="group" aria-label="Your decision">
          <span>You are the approver. What happens next?</span>
          <button type="button" className="btn btn-primary btn-xs" onClick={() => setChoice('approve')}>Approve</button>
          <button type="button" className="btn btn-secondary btn-xs" onClick={() => setChoice('hold')}>Query it</button>
        </div>
      ) : (
        tail.map((n, i) => (
          <div key={`t${i}`} className={`wf-node ${n.kind} ${choice === 'hold' ? 'held' : ''}`}>
            <span className="wf-icon" aria-hidden="true">{KIND[n.kind].icon}</span>
            <span>
              {n.label}
              <small>{KIND[n.kind].label}</small>
            </span>
          </div>
        ))
      )}

      <figcaption>
        <div className="wf-legend">
          <span><i style={{ background: 'var(--cyan)' }} /> AI step with confidence threshold</span>
          <span><i style={{ background: 'var(--ok)' }} /> Human decision</span>
          <span><i style={{ background: 'var(--warm)' }} /> Exception check</span>
        </div>
        {!p.reduced && (
          <div className="demo-controls" role="group" aria-label="Workflow example playback">
            {p.playing ? (
              <button type="button" className="btn btn-secondary btn-xs" onClick={p.pause}><span className="ico" aria-hidden="true">❚❚</span> Pause</button>
            ) : (
              <button type="button" className="btn btn-primary btn-xs" onClick={restart} data-track="demo-play-workflow">
                <span className="ico" aria-hidden="true">▶</span> {p.started ? 'Replay example' : 'Play example'}
              </button>
            )}
            <span className="demo-status" role="status" aria-live="polite">
              {p.playing ? 'Playing' : waiting ? 'Waiting for your decision' : choice ? 'Complete' : ''}
            </span>
          </div>
        )}
        {note && <p className="transcript-note" style={{ marginTop: 12 }}>{note}</p>}
      </figcaption>
    </figure>
  )
}

/* ———— a voice call, written out and paced like a call ———— */

const CALL = [
  { who: 'Agent', text: 'Thanks for calling Riverside Dental. I’m the practice’s automated assistant. How can I help?' },
  { who: 'Caller', text: 'I need to move my appointment on Thursday, something’s come up.' },
  { who: 'Agent', text: 'No problem. Can I take your date of birth to find the booking?' },
  { who: 'Caller', text: 'Fourth of March, eighty-eight.' },
  { who: 'Agent', text: 'Found it, Thursday 2:15 with Dr Patel. I can offer Friday 10:00 or Monday 3:30. Which would you like?' },
  { who: 'Caller', text: 'Friday at ten, please.' },
  { who: 'Agent', text: 'Done. Friday at 10:00 with Dr Patel. You’ll get a text confirmation in a moment. Anything else?' },
  { who: 'Caller', text: 'No, that’s all. Thanks.' },
  { who: 'System', text: 'Appointment moved in practice system. Confirmation SMS sent. Call summary logged.' },
]

export function CallSample() {
  const p = usePlayer(
    CALL.map((l) => Math.max(1100, l.text.length * 38)).concat([0]),
    { onStart: () => track('demo_start', { id: 'call' }), onComplete: () => track('demo_complete', { id: 'call' }) }
  )
  const shown = p.reduced ? CALL.length : Math.min(p.index, CALL.length)

  return (
    <figure className="call" ref={p.ref} aria-label="Illustrative phone call handled by a voice agent, shown as text">
      <div className="flow-head" style={{ padding: 0 }}>
        <div className="flow-title">
          Rescheduling by phone
          <small>Dental practice, main number. Written example, not audio.</small>
        </div>
        <span className="label-illustrative">Illustrative</span>
      </div>
      <div className="call-lines">
        {CALL.map((l, i) => (
          <div
            key={i}
            className={`call-line ${l.who === 'Agent' ? 'agent' : l.who === 'System' ? 'sys' : ''} ${i < shown ? (p.playing ? 'pop' : '') : 'pending'}`}
            aria-hidden={i >= shown}
          >
            <b>{l.who}</b>
            <span>{l.text}</span>
          </div>
        ))}
      </div>
      <Controls p={p} label="Call example" id="call" />
      <figcaption className="transcript-note">
        Sample call written to show scope and handoff behaviour, paced roughly as it would be spoken. Names are fictional. A recorded sample will be published only when a permission-cleared one exists.
      </figcaption>
    </figure>
  )
}

/* ———— integrations strip ———— */

export const TOOLS = [
  'WhatsApp Business', 'Twilio', 'Vonage', 'Google Calendar', 'Microsoft 365', 'Calendly',
  'HubSpot', 'Salesforce', 'Pipedrive', 'Zoho', 'Xero', 'QuickBooks', 'Zendesk', 'Intercom',
  'Slack', 'Microsoft Teams', 'Notion', 'Airtable', 'Stripe', 'Postgres', 'AWS', 'Google Cloud',
]

/* Two copies of the list scroll as one loop. Moving content that runs
   for more than a few seconds needs a way to stop it, so there is a
   pause button; under reduced motion the strip wraps instead. */
export function ToolStrip() {
  const [paused, setPaused] = useState(false)
  return (
    <div className={`strip-wrap ${paused ? 'paused' : ''}`}>
      <div className="strip" aria-label="Tools we integrate with">
        <ul className="strip-track">
          {TOOLS.map((t) => <li key={t}>{t}</li>)}
        </ul>
        <ul className="strip-track" aria-hidden="true">
          {TOOLS.map((t) => <li key={t}>{t}</li>)}
        </ul>
      </div>
      <button type="button" className="strip-pause" aria-pressed={paused} onClick={() => setPaused((v) => !v)}>
        {paused ? 'Resume' : 'Pause'}
      </button>
    </div>
  )
}
