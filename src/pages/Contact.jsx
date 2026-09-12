import { AREA_SERVED } from '../markets.js'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { INTERESTS } from '../data.js'
import { ACCESS_KEY, ENDPOINT, LIMITS, resolveInterest, validate, interpretResponse } from '../contact-logic.js'
import { Crumbs, EMAIL, Footer } from '../chrome.jsx'
import { track } from '../analytics.js'
import { Seo, SITE_URL, ogFor, orgRef, graph, webPageLd, breadcrumbLd } from '../seo.jsx'

const TITLE = 'Contact ForgeQubit: Discuss Your AI Project'
const DESC =
  'Tell us about the enquiries, process or product you have in mind. We reply by email to arrange a short call, then send a written scope and price before work starts.'

const JSON_LD = graph(
  webPageLd({ path: '/contact', title: TITLE, description: DESC, type: 'ContactPage' }),
  breadcrumbLd([{ label: 'Contact', path: '/contact' }]),
  {
    '@type': 'ContactPoint',
    '@id': `${SITE_URL}/contact#point`,
    email: EMAIL,
    contactType: 'sales',
    availableLanguage: 'English',
    areaServed: AREA_SERVED,
    parentOrganization: orgRef,
  }
)

const STEPS = [
  { t: 'We read it and reply by email', d: 'A person replies to arrange a short call, or asks a couple of questions first if the brief is clear enough to skip one.' },
  { t: 'A 30-minute call', d: 'We go through the enquiries, process or product, the tools involved, and what a good outcome looks like.' },
  { t: 'A written scope and price', d: 'Fixed scope, defined outcomes, price, timeline and an estimate of ongoing third-party costs. Nothing starts until you sign.' },
]

const BUDGETS = ['Not sure yet', 'Under £5k', '£5k – £15k', '£15k – £50k', 'Over £50k']
const TIMELINES = ['Not sure yet', 'As soon as possible', 'Within 3 months', 'Later this year', 'Just researching']

/* Draft persistence. sessionStorage only: it survives following a link
   and coming back, and is gone when the tab closes, so enquiry text is
   never stored indefinitely. Cleared on success or an explicit reset. */
const DRAFT_KEY = 'fq-enquiry-draft'
const DRAFT_FIELDS = ['name', 'email', 'interest', 'message', 'budget', 'timeline']
const readDraft = () => {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
const writeDraft = (values) => {
  try {
    const d = Object.fromEntries(DRAFT_FIELDS.map((k) => [k, values[k]]))
    if (DRAFT_FIELDS.some((k) => k !== 'interest' && k !== 'budget' && k !== 'timeline' && values[k])) sessionStorage.setItem(DRAFT_KEY, JSON.stringify(d))
    else sessionStorage.removeItem(DRAFT_KEY)
  } catch {
    /* storage unavailable: the form still works, the draft is not kept */
  }
}
const clearDraft = () => {
  try { sessionStorage.removeItem(DRAFT_KEY) } catch { /* ignore */ }
}

/* Delivery is bounded so a stalled network shows a retry instead of
   an endless "Sending…" */
const TIMEOUT_MS = 15000

/* Field ids are literal: there is one form per page, and literal ids
   are identical in the prerendered HTML and after hydration. useId()
   is not used because the server and client trees are assembled
   differently (static vs lazy pages) and its ids could drift. */
const id = 'cf'

export function ContactForm({ preselect, submit = defaultSubmit }) {
  const [values, setValues] = useState({
    name: '',
    email: '',
    /* the prerendered page has no query string, so the first render on
       both server and client uses the default; the effect below applies
       ?interest= after hydration without a mismatch */
    interest: INTERESTS[0],
    message: '',
    budget: BUDGETS[0],
    timeline: TIMELINES[0],
    botcheck: '',
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | busy | sent | error
  const [serverError, setServerError] = useState('')
  const inFlight = useRef(false)
  const statusRef = useRef(null)
  const started = useRef(false)
  const attempted = useRef(false)
  const fields = useRef({})
  const successRef = useRef(null)

  /* Preserve an unsent draft; an explicit service link overrides its interest. */
  useEffect(() => {
    const draft = readDraft()
    setValues((v) => ({ ...v, ...(draft || {}), interest: resolveInterest(preselect || draft?.interest) }))
  }, [preselect])

  useEffect(() => {
    if (status === 'idle' || status === 'error') writeDraft(values)
  }, [values, status])

  useEffect(() => {
    if (status === 'sent') successRef.current?.focus()
  }, [status])

  /* after the first submit attempt, a corrected field clears its own
     error as soon as it is valid; other errors stay until fixed */
  const set = (k) => (e) => {
    const next = { ...values, [k]: e.target.value }
    setValues(next)
    if (attempted.current) {
      const errs = validate(next)
      setErrors((prev) => (prev[k] !== errs[k] ? { ...prev, [k]: errs[k] } : prev))
    }
  }

  /* one "form started" event per form instance, on the first keystroke */
  const onFirstInput = () => {
    if (started.current) return
    started.current = true
    track('form_start', { interest: values.interest })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (inFlight.current) return

    attempted.current = true
    const errs = validate(values)
    setErrors(errs)
    if (Object.keys(errs).length) {
      const first = ['name', 'email', 'message'].find((k) => errs[k])
      fields.current[first]?.focus()
      return
    }

    inFlight.current = true
    setStatus('busy')
    setServerError('')
    try {
      await submit(values)
      clearDraft()
      setStatus('sent')
      track('form_submit_accepted', { interest: values.interest, budget: values.budget, timeline: values.timeline })
    } catch (err) {
      setStatus('error')
      setServerError(err?.message || 'That did not send.')
      track('form_submit_failed', { interest: values.interest, reason: err?.code || 'rejected' })
      // the entered text is kept in state, so nothing is lost
      requestAnimationFrame(() => statusRef.current?.focus())
    } finally {
      inFlight.current = false
    }
  }

  if (status === 'sent') {
    return (
      <div className="form-sent" role="status" aria-live="polite">
        <span className="tick" aria-hidden="true">✓</span>
        <h2 ref={successRef} tabIndex={-1}>Thanks, your message has been received by our form service.</h2>
        <p>
          A person will reply by email to <strong>{values.email}</strong> to arrange a short call.
          If you do not hear from us, write to <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
        </p>
        <div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => {
              attempted.current = false
              setErrors({})
              setValues((v) => ({ ...v, message: '' }))
              setStatus('idle')
            }}
          >
            Send another message
          </button>
        </div>
      </div>
    )
  }

  const busy = status === 'busy'
  const field = (k, label, control, { hint, optional } = {}) => (
    <div className={`field ${errors[k] ? 'invalid' : ''}`}>
      <label htmlFor={`${id}-${k}`}>
        {label}{optional && <span className="optional"> (optional)</span>}
      </label>
      {control}
      {hint && !errors[k] && <span className="field-hint" id={`${id}-${k}-hint`}>{hint}</span>}
      {errors[k] && <span className="field-error" id={`${id}-${k}-err`} role="alert">{errors[k]}</span>}
    </div>
  )

  const describedBy = (k, hint) =>
    errors[k] ? `${id}-${k}-err` : hint ? `${id}-${k}-hint` : undefined

  return (
    <form className="contact-form" onSubmit={onSubmit} onInput={onFirstInput} noValidate aria-busy={busy}>
      <div className="form-row">
        {field('name', 'Your name', (
          <input id={`${id}-name`} ref={(el) => (fields.current.name = el)} name="name" type="text" autoComplete="name" maxLength={LIMITS.name} value={values.name} onChange={set('name')} aria-invalid={!!errors.name} aria-describedby={describedBy('name')} required />
        ))}
        {field('email', 'Work email', (
          <input id={`${id}-email`} ref={(el) => (fields.current.email = el)} name="email" type="email" inputMode="email" autoComplete="email" maxLength={LIMITS.email} value={values.email} onChange={set('email')} aria-invalid={!!errors.email} aria-describedby={describedBy('email')} required />
        ))}
      </div>

      {field('interest', 'Area of interest', (
        <select id={`${id}-interest`} name="interest" value={values.interest} onChange={set('interest')}>
          {INTERESTS.map((o) => <option key={o}>{o}</option>)}
        </select>
      ))}

      {field('message', 'Brief description', (
        <textarea id={`${id}-message`} ref={(el) => (fields.current.message = el)} name="message" rows="5" maxLength={LIMITS.message} value={values.message} onChange={set('message')} aria-invalid={!!errors.message} aria-describedby={describedBy('message', 'hint')} required />
      ), { hint: 'What happens today, which tools are involved, and what a good outcome would look like.' })}

      <div className="form-row">
        {field('budget', 'Budget range', (
          <select id={`${id}-budget`} name="budget" value={values.budget} onChange={set('budget')}>
            {BUDGETS.map((o) => <option key={o}>{o}</option>)}
          </select>
        ), { optional: true })}
        {field('timeline', 'Timeline', (
          <select id={`${id}-timeline`} name="timeline" value={values.timeline} onChange={set('timeline')}>
            {TIMELINES.map((o) => <option key={o}>{o}</option>)}
          </select>
        ), { optional: true })}
      </div>

      {/* honeypot: hidden from people, filled by bots, checked by Web3Forms */}
      <div className="honeypot" aria-hidden="true">
        <label htmlFor={`${id}-botcheck`}>Leave this field empty</label>
        <input id={`${id}-botcheck`} name="botcheck" type="text" tabIndex={-1} autoComplete="off" value={values.botcheck} onChange={set('botcheck')} />
      </div>

      {status === 'error' && (
        <div className="form-status error" role="alert" tabIndex={-1} ref={statusRef}>
          {serverError} Your message is still here. Try again, or email us directly at{' '}
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
        </div>
      )}

      <div className="btn-row">
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? <><span className="spinner" aria-hidden="true" /> Sending…</> : <>Send message <span aria-hidden="true">→</span></>}
        </button>
        {(values.name || values.message) && !busy && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              clearDraft()
              attempted.current = false
              setErrors({})
              setValues((v) => ({ ...v, name: '', email: '', message: '', budget: BUDGETS[0], timeline: TIMELINES[0] }))
            }}
          >
            Clear
          </button>
        )}
      </div>
      <p className="form-note">
        Sent to our inbox via Web3Forms. We use what you enter only to reply to you. Your draft
        stays in this tab until you send or clear it. See the{' '}
        <a href="/privacy" target="_blank" rel="noopener">privacy policy (opens in a new tab)</a>.
      </p>
    </form>
  )
}

async function defaultSubmit(values) {
  const body = new FormData()
  body.append('access_key', ACCESS_KEY)
  body.append('subject', `New enquiry from ${values.name} — ${values.interest}`)
  body.append('from_name', 'forgequbit.co.uk contact form')
  for (const k of ['name', 'email', 'interest', 'message', 'budget', 'timeline', 'botcheck']) body.append(k, values[k])

  let res
  let data = null
  const ctl = new AbortController()
  const t = setTimeout(() => ctl.abort(), TIMEOUT_MS)
  try {
    res = await fetch(ENDPOINT, { method: 'POST', body, headers: { Accept: 'application/json' }, signal: ctl.signal })
    try { data = await res.json() } catch (err) { if (err?.name === 'AbortError') throw err }
  } catch (e) {
    const timedOut = e?.name === 'AbortError'
    const err = new Error(
      timedOut
        ? 'The form service did not respond within 15 seconds.'
        : 'We could not reach the form service. Check your connection and try again.'
    )
    err.code = timedOut ? 'timeout' : 'network'
    throw err
  } finally {
    clearTimeout(t)
  }
  const problem = interpretResponse(res.ok, data)
  if (problem) throw new Error(problem)
}

export default function Contact() {
  const [params] = useSearchParams()
  const preselect = params.has('interest') ? resolveInterest(params.get('interest')) : undefined

  return (
    <div className="page">
      <Seo title={TITLE} description={DESC} path="/contact" jsonLd={JSON_LD} image={ogFor('contact')} imageAlt="Contact ForgeQubit to discuss your project" />
      <div className="shell contact-grid">
        <div className="contact-intro">
          <Crumbs trail={[{ label: 'Contact', to: '/contact' }]} />
          <p className="eyebrow">Contact</p>
          <h1>Big idea?<br /><span className="em">Let’s talk.</span></h1>
          <p className="lede">
            Tell us what you have in mind. A few sentences is all it takes.
          </p>
          <p className="contact-alt">
            <a className="contact-email" href={`mailto:${EMAIL}`} data-track="contact-email">{EMAIL}</a>
            <a className="jump-to-form" href="#cf-name">Jump to the form ↓</a>
          </p>
        </div>
        <ContactForm preselect={preselect} />
        <div className="contact-steps">
          <div className="next-steps">
            <h2>What happens after you send it</h2>
            {STEPS.map((s, i) => (
              <div key={s.t}>
                <span className="n" aria-hidden="true">{i + 1}</span>
                <div>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
