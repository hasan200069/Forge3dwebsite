import { Link } from 'react-router-dom'
import { CASES } from '../data.js'
import { Footer, useReveal } from '../chrome.jsx'

export default function CaseStudies() {
  const ref = useReveal()
  return (
    <div className="page" ref={ref}>
      <div className="page-inner">
        <header className="page-hero">
          <div className="page-kicker rise">Selected Work</div>
          <h1 className="page-title rise d1">Forged <span className="molten-text">&amp; shipped.</span></h1>
          <p className="page-sub rise d2">
            Every engagement leaves the forge as a working system with numbers attached.
            A few recent pieces, still glowing.
          </p>
        </header>

        <div className="cs-stats rise d3">
          {CASES.map((c) => (
            <div key={c.slug} className="cs-stat hoverable">
              <span className="v molten-text">{c.metric}</span>
              <span className="l">{c.metricLabel} · {c.client}</span>
            </div>
          ))}
        </div>

        <div className="cs-list">
          {CASES.map((c, i) => (
            <article key={c.slug} className={`cs-card reveal ${i % 2 ? 'flip' : ''}`}>
              <span className="cs-watermark" aria-hidden="true">{c.num}</span>
              <div className="cs-side">
                <div className="cs-meta">
                  <span className="cs-num">{c.num}</span>
                  <span className="cs-field">{c.field}</span>
                </div>
                <div className="cs-metric molten-text">{c.metric}</div>
                <div className="cs-metric-label">{c.metricLabel}</div>
                <h2 className="cs-client">{c.client}</h2>
                <ul className="service-tags cs-tags">
                  {c.stack.map((t) => <li key={t}>{t}</li>)}
                </ul>
                <Link
                  className="service-cta hoverable"
                  to={`/contact?interest=${encodeURIComponent(c.field)}`}
                >
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
          <h2>Yours could be <span className="molten-text">next.</span></h2>
          <Link className="outro-cta hoverable" to="/contact">Start a Project <span>→</span></Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}
