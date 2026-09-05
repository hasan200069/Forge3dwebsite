import { Link } from 'react-router-dom'
import { SOLUTIONS, VOICE, CAPABILITIES, FAQS, contactHref } from '../data.js'
import { Crumbs, Footer, Faq, CtaBand } from '../chrome.jsx'
import { Seo, SITE_URL, orgRef, graph, webPageLd, breadcrumbLd } from '../seo.jsx'
import { ICONS, IconTile } from '../icons.jsx'

const TITLE = 'Solutions: AI Reception, Automation & AI Products | ForgeQubit'
const DESC =
  'Three things we build end to end: voice and WhatsApp agents for reception, workflow automation and integrations, and custom AI products.'

const JSON_LD = graph(
  webPageLd({ path: '/services', title: TITLE, description: DESC, type: 'CollectionPage' }),
  breadcrumbLd([{ label: 'Solutions', path: '/services' }]),
  {
    '@type': 'ItemList',
    name: 'ForgeQubit solutions',
    itemListElement: [...SOLUTIONS, VOICE].map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Service',
        '@id': `${SITE_URL}${s.path}#service`,
        name: s.name,
        description: s.short,
        url: `${SITE_URL}${s.path}`,
        provider: orgRef,
        areaServed: ['GB', 'US', 'EU'],
      },
    })),
  },
  {
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/services#faq`,
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
)

export default function Services() {
  return (
    <div className="page">
      <Seo title={TITLE} description={DESC} path="/services" jsonLd={JSON_LD} />

      <header className="shell page-hero split">
        <div className="page-hero-copy">
          <Crumbs trail={[{ label: 'Solutions', to: '/services' }]} />
          <p className="eyebrow">Solutions</p>
          <h1>Three things we build, and two we add <span className="em">when they fit.</span></h1>
          <p className="lede">
            Each solution below is delivered as a working, integrated system with a written scope,
            weekly demos and a proper handover. Pick the one closest to your problem; the discovery
            call sorts out the rest.
          </p>
        </div>
        <nav className="chooser" aria-label="Choose a solution">
          {SOLUTIONS.map((s) => {
            const Icon = ICONS[s.slug]
            return (
              <a key={s.slug} className="chooser-item" href={`#svc-${s.slug}`}>
                <IconTile icon={Icon} />
                <span>
                  <b>{s.name}</b>
                  <small>{s.tagline}</small>
                </span>
              </a>
            )
          })}
          <a className="chooser-item" href="#svc-voice">
            <IconTile icon={ICONS['voice-agents']} />
            <span>
              <b>{VOICE.name}</b>
              <small>Just the phone line, done properly</small>
            </span>
          </a>
        </nav>
      </header>

      <section className="section tight" aria-label="Primary solutions">
        <div className="shell svc-overview">
          {SOLUTIONS.map((s) => (
            <article key={s.slug} className="svc-row" id={`svc-${s.slug}`} aria-labelledby={`svc-${s.slug}-h`}>
              <div className="svc-row-id">
                <IconTile icon={ICONS[s.slug]} size="lg" />
                <span className="num">{s.num}</span>
              </div>
              <div>
                <h2 id={`svc-${s.slug}-h`}>{s.name}</h2>
                <p>{s.short}</p>
                <Link className="link-cta" to={s.path}>Read the full page <span aria-hidden="true">→</span></Link>
              </div>
              <ul className="list">
                {s.includes.slice(0, 4).map((i) => <li key={i}>{i}</li>)}
              </ul>
            </article>
          ))}

          <article className="svc-row" id="svc-voice" aria-labelledby="svc-voice-h">
            <div className="svc-row-id">
              <IconTile icon={ICONS['voice-agents']} size="lg" />
              <span className="num">01a</span>
            </div>
            <div>
              <h2 id="svc-voice-h">{VOICE.name}</h2>
              <p>{VOICE.short} Part of AI Reception, with its own page for teams whose problem is the phone line specifically.</p>
              <Link className="link-cta" to={VOICE.path}>Read about voice agents <span aria-hidden="true">→</span></Link>
            </div>
            <ul className="list">
              {VOICE.handles.slice(0, 4).map((i) => <li key={i}>{i}</li>)}
            </ul>
          </article>
        </div>
      </section>

      <section className="section alt tight" id="capabilities" aria-labelledby="cap-h">
        <div className="shell">
          <div className="section-head">
            <p className="eyebrow">Specialist capabilities</p>
            <h2 id="cap-h">Avatars and blockchain, for the projects that need them.</h2>
            <p className="lede">
              These are not front-page offers. They are capabilities we bring into a project when
              the brief calls for them, scoped and priced in the same way.
            </p>
          </div>
          <div className="capabilities" style={{ marginTop: 0 }}>
            {CAPABILITIES.map((c) => (
              <div key={c.id} className="capability" id={c.id}>
                <IconTile icon={ICONS[c.id]} />
                <div>
                  <h3>{c.name}</h3>
                  <p>{c.short}</p>
                  <Link className="link-cta" to={contactHref(c.interest)}>Ask about {c.name.toLowerCase()} <span aria-hidden="true">→</span></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="faq-h">
        <div className="shell faq-grid">
          <div>
            <p className="eyebrow">Questions</p>
            <h2 id="faq-h">Before you get in touch.</h2>
            <p className="lede" style={{ marginTop: 14 }}>
              Costs, timelines, integrations, handoff, ownership and support. Each solution page
              has questions specific to that kind of work.
            </p>
          </div>
          <Faq items={FAQS} />
        </div>
      </section>

      <CtaBand
        title="Not sure which one fits?"
        body="Describe the situation in a few sentences. We will tell you which solution applies, or that none does, before anyone talks about price."
        secondary={{ to: '/case-studies', label: 'See worked examples' }}
      />
      <Footer />
    </div>
  )
}
