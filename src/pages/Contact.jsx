import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SERVICES } from '../data.js'
import { Crumbs, EMAIL, Footer, useReveal } from '../chrome.jsx'
import { Seo, SITE_URL, orgRef, graph, webPageLd, breadcrumbLd } from '../seo.jsx'

const TITLE = 'Contact ForgeQubit — Start Your AI Project'
const DESC =
  'Tell us the raw idea — WhatsApp automation, a voice agent, a custom AI build or a full SaaS. We reply within 24 hours with a fixed-scope plan.'

const JSON_LD = graph(
  webPageLd({ path: '/contact', title: TITLE, description: DESC, type: 'ContactPage' }),
  breadcrumbLd([{ label: 'Contact', path: '/contact' }]),
  {
    '@type': 'ContactPoint',
    '@id': `${SITE_URL}/contact#point`,
    email: EMAIL,
    contactType: 'sales',
    availableLanguage: 'English',
    areaServed: ['GB', 'US', 'EU'],
    parentOrganization: orgRef,
  }
)

const INTERESTS = [...SERVICES.map((s) => s.interest), 'Something Else']

const STEPS = [
  { n: '01', t: 'The Spark', d: 'Tell us the raw idea. We reply within 24 hours with the questions that matter.' },
  { n: '02', t: 'The Blueprint', d: 'A scoped proposal in days, not weeks — fixed outcomes, honest timelines, no mystery invoices.' },
  { n: '03', t: 'The Forging', d: 'Weekly demos of the real thing. Your first working prototype lands before onboarding paperwork would.' },
]

const ACCESS_KEY = 'b32d30de-6cc7-406d-b5fe-7f84bd709bd3'

function ContactForm({ preselect }) {
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const select = useRef(null)

  /* The prerendered /contact file has no query string, so its markup
     always carries the first option. Assign the real one after mount so
     a ?interest= link lands on the right choice. */
  useEffect(() => {
    if (select.current) select.current.value = preselect
  }, [preselect, sent])

  const onSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError(null)

    const body = new FormData(e.currentTarget)
    body.append('access_key', ACCESS_KEY)
    body.append('subject', `New project inquiry from ${body.get('name')}`)

    try {
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body })
      if (!res.ok) throw new Error(String(res.status))
      setSent(true)
    } catch {
      setError('That didn’t send. Try again, or email us directly at ' + EMAIL + '.')
    } finally {
      setBusy(false)
    }
  }

  if (sent) {
    return (
      <div className="contact-form form-sent rise">
        <span className="form-sent-spark" aria-hidden="true" />
        <h3>The spark is struck.</h3>
        <p>Your message is in our inbox. We’ll reply within 24 hours.</p>
        <p className="form-note">
          Need to add something? Write to us at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </p>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setSent(false)}>
          Send another <span>→</span>
        </button>
      </div>
    )
  }

  return (
    <form className="contact-form rise d2" onSubmit={onSubmit}>
      <div className="form-row">
        <label className="field">
          <span>Your name</span>
          <input name="name" type="text" autoComplete="name" placeholder="Jane Smith" required />
        </label>
        <label className="field">
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" placeholder="jane@company.com" required />
        </label>
      </div>
      <label className="field">
        <span>What shall we forge?</span>
        <select name="interest" ref={select} defaultValue={preselect}>
          {INTERESTS.map((o) => <option key={o}>{o}</option>)}
        </select>
      </label>
      <label className="field">
        <span>The raw idea</span>
        <textarea name="message" rows="5" placeholder="Tell us what keeps you up at night…" required />
      </label>
      <button type="submit" className="btn btn-primary form-submit" disabled={busy}>
        {busy ? 'Sending…' : 'Ignite the Project'} <span>→</span>
      </button>
      {error && <p className="form-error" role="alert">{error}</p>}
      <p className="form-note">Or write to us directly at {EMAIL}</p>
    </form>
  )
}

export default function Contact() {
  const ref = useReveal()
  const [params] = useSearchParams()
  const fromLink = params.get('interest')
  const preselect = INTERESTS.includes(fromLink) ? fromLink : INTERESTS[0]

  return (
    <div className="page" ref={ref}>
      <Seo title={TITLE} description={DESC} path="/contact" jsonLd={JSON_LD} />
      <div className="page-inner">
        <div className="contact-grid">
          <div className="contact-left">
            <Crumbs trail={[{ label: 'Contact', to: '/contact' }]} />
            <p className="page-kicker rise">Final Chamber</p>
            <h1 className="page-title rise d1">The forge <span className="ember-text">is lit.</span></h1>
            <p className="page-sub rise d2">Bring us the raw idea. Leave with the weapon.</p>
            <a className="contact-email rise d2" href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <div className="steps rise d3">
              {STEPS.map((s) => (
                <div key={s.n} className="step">
                  <span className="step-num">{s.n}</span>
                  <div>
                    <h3>{s.t}</h3>
                    <p>{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <ContactForm key={preselect} preselect={preselect} />
        </div>
      </div>
      <Footer />
    </div>
  )
}
