import { Link } from 'react-router-dom'
import { CASES } from '../data.js'
import { Crumbs, Footer, useReveal } from '../chrome.jsx'
import { Seo, SITE_URL, orgRef, graph, webPageLd, breadcrumbLd } from '../seo.jsx'

const TITLE = 'AI Case Studies — Measured Results | ForgeQubit'
const DESC =
  'Real numbers from real builds: 3.4× more qualified leads with WhatsApp automation, 82% of calls handled by a voice agent, an AI SaaS shipped in six weeks.'

const JSON_LD = graph(
  webPageLd({ path: '/case-studies', title: TITLE, description: DESC, type: 'CollectionPage' }),
  breadcrumbLd([{ label: 'Case Studies', path: '/case-studies' }]),
  {
    '@type': 'ItemList',
    '@id': `${SITE_URL}/case-studies#list`,
    itemListElement: CASES.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Article',
        headline: `${c.client} — ${c.metric} ${c.metricLabel}`,
        description: c.summary,
        about: c.field,
        author: orgRef,
        publisher: orgRef,
      },
    })),
  }
)

export default function CaseStudies() {
  const ref = useReveal()
  return (
    <div className="page" ref={ref}>
      <Seo title={TITLE} description={DESC} path="/case-studies" jsonLd={JSON_LD} />
      <div className="page-inner">
        <header className="page-hero">
          <Crumbs trail={[{ label: 'Case Studies', to: '/case-studies' }]} />
          <p className="page-kicker rise">Selected Work</p>
          <h1 className="page-title rise d1">Forged <span className="ember-text">&amp; shipped.</span></h1>
          <p className="page-sub rise d2">
            Every engagement leaves the forge as a working system with numbers attached.
            A few recent pieces, still glowing.
          </p>
        </header>

        <div className="metrics rise d3">
          {CASES.map((c) => (
            <div key={c.slug} className="card metric">
              <span className="v ember-text">{c.metric}</span>
              <span className="l">{c.metricLabel} · {c.client}</span>
            </div>
          ))}
        </div>

        <div className="cs-list section-block">
          {CASES.map((c, i) => (
            <article key={c.slug} className={`card cs-card reveal ${i % 2 ? 'flip' : ''}`}>
              <span className="cs-watermark" aria-hidden="true">{c.num}</span>
              <div className="cs-side">
                <div className="cs-meta">
                  <span className="cs-num">{c.num}</span>
                  <span className="cs-field">{c.field}</span>
                </div>
                <p className="cs-metric ember-text">{c.metric}</p>
                <p className="cs-metric-label">{c.metricLabel}</p>
                <h2 className="cs-client">{c.client}</h2>
                <ul className="tag-row">
                  {c.stack.map((t) => <li key={t}>{t}</li>)}
                </ul>
                <Link className="link-cta" to={`/contact?interest=${encodeURIComponent(c.field)}`}>
                  Forge something like this <span>→</span>
                </Link>
              </div>
              <div className="cs-body">
                <p className="cs-lede">{c.summary}</p>
                <div className="cs-block">
                  <h3>The Ore</h3>
                  <p>{c.challenge}</p>
                </div>
                <div className="cs-block">
                  <h3>The Forging</h3>
                  <p>{c.approach}</p>
                </div>
                <div className="cs-block">
                  <h3>What Left the Fire</h3>
                  <ul className="cs-results">
                    {c.results.map((r) => <li key={r}>{r}</li>)}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="page-cta reveal">
          <h2>Yours could be <span className="ember-text">next.</span></h2>
          <div className="btn-row">
            <Link className="btn btn-primary" to="/contact">Start a Project <span>→</span></Link>
            <Link className="btn btn-ghost" to="/services">Browse the Services <span>→</span></Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
