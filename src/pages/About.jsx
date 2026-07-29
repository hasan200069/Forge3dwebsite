import { Link } from 'react-router-dom'
import { VALUES, PROCESS } from '../data.js'
import { Crumbs, Footer, useReveal } from '../chrome.jsx'
import { Seo, graph, webPageLd, breadcrumbLd } from '../seo.jsx'

const TITLE = 'About ForgeQubit — The AI Agency That Ships Working Agents'
const DESC =
  'ForgeQubit is an AI agency built by engineers, not account managers. Learn how we forge WhatsApp agents, voice agents and AI products — weekly demos, fixed scope, measurable results.'

const JSON_LD = graph(
  webPageLd({ path: '/about', title: TITLE, description: DESC, type: 'AboutPage' }),
  breadcrumbLd([{ label: 'About', path: '/about' }])
)

export default function About() {
  const ref = useReveal()
  return (
    <div className="page" ref={ref}>
      <Seo title={TITLE} description={DESC} path="/about" jsonLd={JSON_LD} />
      <div className="page-inner">
        <header className="page-hero">
          <Crumbs trail={[{ label: 'About', to: '/about' }]} />
          <p className="page-kicker rise">The Forge Itself</p>
          <h1 className="page-title rise d1">Built by <span className="ember-text">builders.</span></h1>
          <p className="page-sub rise d2">
            ForgeQubit exists because too many AI projects end as demos.
            Ours end as systems that answer the phone at 3&nbsp;a.m.
          </p>
        </header>

        <div className="about-body rise d3">
          <p>
            We are an AI agency run by engineers, not account managers. Since our first
            commission we have had one obsession: <strong>agents that work while the world
            sleeps</strong> — WhatsApp agents that qualify leads in eight seconds, voice agents
            that resolve four calls in five without a human, SaaS platforms that go from
            napkin sketch to paying users in six weeks.
          </p>
          <p>
            The name is the method. Every great product begins as raw ore — an idea,
            unshaped. We heat it with research, strike it with engineering, and quench it
            in production. What leaves our forge is not software for a slide. It is leverage
            you can measure on a dashboard.
          </p>
        </div>

        <section className="section-block" aria-labelledby="laws-h">
          <p className="page-kicker reveal">What We Believe</p>
          <h2 className="section-title reveal" id="laws-h">The four <span className="ember-text">laws.</span></h2>
          <div className="grid-2">
            {VALUES.map((v, i) => (
              <div key={v.t} className={`card value-card reveal d${(i % 2) + 1}`}>
                <h3>{v.t}</h3>
                <p>{v.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section-block" aria-labelledby="process-h">
          <p className="page-kicker reveal">How We Work</p>
          <h2 className="section-title reveal" id="process-h">From ore <span className="ember-text">to weapon.</span></h2>
          <div className="rail reveal d1">
            {PROCESS.map((s) => (
              <div key={s.n} className="rail-step">
                <span className="n">{s.n}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="page-cta reveal">
          <h2>See what leaves <span className="ember-text">the fire.</span></h2>
          <div className="btn-row">
            <Link className="btn btn-primary" to="/case-studies">See the Work <span>→</span></Link>
            <Link className="btn btn-ghost" to="/contact">Start a Project <span>→</span></Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
