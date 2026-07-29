import { Link } from 'react-router-dom'
import { SERVICES, FAQS } from '../data.js'
import { Crumbs, Footer, useReveal } from '../chrome.jsx'
import { Seo, SITE_URL, orgRef, graph, webPageLd, breadcrumbLd } from '../seo.jsx'

const TITLE = 'AI Services — WhatsApp Automation, Voice Agents & AI SaaS | ForgeQubit'
const DESC =
  'Six crafts, one obsession: WhatsApp automation, voice agents, avatar agents, custom AI agents, AI-powered SaaS and AI × blockchain — designed, built and shipped by ForgeQubit.'

const JSON_LD = graph(
  webPageLd({ path: '/services', title: TITLE, description: DESC, type: 'CollectionPage' }),
  breadcrumbLd([{ label: 'Services', path: '/services' }]),
  {
    '@type': 'ItemList',
    name: 'ForgeQubit AI Services',
    itemListElement: SERVICES.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Service',
        '@id': `${SITE_URL}/services#${s.interest.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        name: s.title,
        description: s.long,
        serviceType: s.title,
        category: s.cat,
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
  const ref = useReveal()
  return (
    <div className="page" ref={ref}>
      <Seo title={TITLE} description={DESC} path="/services" jsonLd={JSON_LD} />
      <div className="page-inner">
        <header className="page-hero">
          <Crumbs trail={[{ label: 'Services', to: '/services' }]} />
          <p className="page-kicker rise">Six Crafts</p>
          <h1 className="page-title rise d1">What we <span className="ember-text">forge.</span></h1>
          <p className="page-sub rise d2">
            Every service below leaves as a working system, not a slide deck —
            integrated with your tools, measured against your numbers.
          </p>
        </header>

        <div className="grid-2">
          {SERVICES.map((s) => (
            <article key={s.num} className="card svc-card reveal">
              <div className="service-index">
                <span className="num">{s.num}</span>
                <span className="rule" />
                <span className="cat">{s.cat}</span>
              </div>
              <h2 className="svc-title">{s.title}</h2>
              <p className="svc-body">{s.long}</p>
              <ul className="tag-row">
                {s.tags.map((t) => <li key={t}>{t}</li>)}
              </ul>
              <Link className="link-cta" to={`/contact?interest=${encodeURIComponent(s.interest)}`}>
                Forge this with us <span>→</span>
              </Link>
            </article>
          ))}
        </div>

        <section className="section-block reveal" aria-labelledby="faq-h">
          <p className="page-kicker">Questions, Answered</p>
          <h2 className="section-title" id="faq-h">Before you <span className="ember-text">ask.</span></h2>
          <div className="faq-list">
            {FAQS.map((f) => (
              <details key={f.q} className="faq">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="page-cta reveal">
          <h2>Pick a craft. <span className="ember-text">Or bring a new one.</span></h2>
          <div className="btn-row">
            <Link className="btn btn-primary" to="/contact">Start a Project <span>→</span></Link>
            <Link className="btn btn-ghost" to="/case-studies">See the Work <span>→</span></Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
