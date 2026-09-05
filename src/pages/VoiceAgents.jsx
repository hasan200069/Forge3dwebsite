import { Link } from 'react-router-dom'
import { VOICE, SOLUTIONS, contactHref } from '../data.js'
import { Crumbs, Footer, Faq, CtaBand } from '../chrome.jsx'
import { Seo, SITE_URL, orgRef, graph, webPageLd, breadcrumbLd } from '../seo.jsx'
import { CallSample } from '../visuals.jsx'

const TITLE = 'Voice Agents — AI Phone Answering, Bookings and Call Handoff | ForgeQubit'
const DESC =
  'Voice agents that answer your phone on the first ring, book and reschedule appointments, answer common questions and transfer to your team with context. Works with your existing number.'

const JSON_LD = graph(
  webPageLd({ path: VOICE.path, title: TITLE, description: DESC }),
  breadcrumbLd([
    { label: 'Solutions', path: '/services' },
    { label: VOICE.name, path: VOICE.path },
  ]),
  {
    '@type': 'Service',
    '@id': `${SITE_URL}${VOICE.path}#service`,
    name: VOICE.name,
    description: VOICE.short,
    serviceType: 'AI voice agent development',
    provider: orgRef,
    areaServed: ['GB', 'US', 'EU'],
    url: `${SITE_URL}${VOICE.path}`,
  },
  {
    '@type': 'FAQPage',
    '@id': `${SITE_URL}${VOICE.path}#faq`,
    mainEntity: VOICE.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
)

const reception = SOLUTIONS[0]

export default function VoiceAgents() {
  return (
    <div className="page">
      <Seo title={TITLE} description={DESC} path={VOICE.path} jsonLd={JSON_LD} />

      <header className="shell page-hero">
        <Crumbs trail={[{ label: 'Solutions', to: '/services' }, { label: VOICE.name }]} />
        <p className="eyebrow">Part of AI Reception & Lead Handling</p>
        <h1>Voice agents that answer the phone, <span className="em">and know when to pass it on.</span></h1>
        <p className="lede">{VOICE.short}</p>
        <div className="btn-row">
          <Link className="btn btn-primary" to={contactHref(VOICE.interest)} data-track="service-hero-voice-agents">Discuss your project <span aria-hidden="true">→</span></Link>
          <Link className="btn btn-secondary" to={reception.path}>See the full reception solution</Link>
        </div>
      </header>

      <section className="section tight" aria-labelledby="who-h">
        <div className="shell feature">
          <div>
            <h2 id="who-h">Who it helps</h2>
            <ul className="list" style={{ marginTop: 16 }}>
              {VOICE.who.map((w) => <li key={w}>{w}</li>)}
            </ul>

            <h2 style={{ marginTop: 36 }}>What the agent handles</h2>
            <ul className="list check" style={{ marginTop: 16 }}>
              {VOICE.handles.map((h) => <li key={h}>{h}</li>)}
            </ul>

            <h2 style={{ marginTop: 36 }}>What it hands to a person</h2>
            <ul className="list" style={{ marginTop: 16 }}>
              {VOICE.handsOff.map((h) => <li key={h}>{h}</li>)}
            </ul>
            <p className="muted" style={{ marginTop: 14 }}>
              Handoff is a live transfer with a spoken summary, a callback request, or a ticket to
              your team, depending on what you decide during scoping.
            </p>
          </div>
          <CallSample />
        </div>
      </section>

      <section className="section alt tight" aria-labelledby="int-h">
        <div className="shell">
          <div className="section-head split">
            <div>
              <p className="eyebrow">Integrations</p>
              <h2 id="int-h">Your number, your calendar, your CRM.</h2>
            </div>
            <p className="lede">
              Existing numbers can usually be forwarded or ported. Bookings land in the system your
              team already uses, and every call ends with a summary where you want it.
            </p>
          </div>
          <ul className="pill-list">
            {VOICE.integrations.map((i) => <li key={i}>{i}</li>)}
          </ul>

          <div className="grid-3" style={{ marginTop: 32 }}>
            <div className="card">
              <span className="num">Delivery</span>
              <h3>How a voice project runs</h3>
              <p>Discovery of call types and volumes, a fixed-scope proposal, a test number you can call within the first fortnight of the build, then a monitored go-live.</p>
            </div>
            <div className="card">
              <span className="num">Cost drivers</span>
              <h3>What sets the price</h3>
              <p>Number of call types in scope, the booking or practice system involved, languages, and any recording or identity-check requirements.</p>
            </div>
            <div className="card">
              <span className="num">Running costs</span>
              <h3>What you pay after launch</h3>
              <p>Per-minute telephony plus speech and language-model usage, billed by the providers to accounts in your name. Estimated from your current call volume.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="faq-h">
        <div className="shell faq-grid">
          <div>
            <p className="eyebrow">Questions</p>
            <h2 id="faq-h">About voice agents.</h2>
            <p className="lede" style={{ marginTop: 14 }}>
              For pricing, ownership and support questions that apply to every project, see the
              <Link to="/services#faq"> general questions</Link>.
            </p>
          </div>
          <Faq items={VOICE.faqs} id="faq-voice" />
        </div>
      </section>

      <CtaBand
        title="Tell us about your phone line."
        body="How many calls a day, what they are mostly about, and which system bookings need to land in. That is enough for a first conversation."
        interest={VOICE.interest}
        secondary={{ to: reception.path, label: 'AI Reception & Lead Handling' }}
      />
      <Footer />
    </div>
  )
}
