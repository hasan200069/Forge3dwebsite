import { Link } from 'react-router-dom'
import { Footer, useReveal } from '../chrome.jsx'
import { Seo, SITE_URL } from '../seo.jsx'

const VALUES = [
  {
    t: 'Ship, then polish',
    d: 'A working prototype in your hands beats a perfect plan in a deck. We put real software in front of you every single week.',
  },
  {
    t: 'Numbers or it didn’t happen',
    d: 'Every engagement is measured against the metric that matters to you — leads qualified, calls resolved, weeks to launch. We publish the results.',
  },
  {
    t: 'Your data stays yours',
    d: 'Model-agnostic builds, deployable on your infrastructure, with your IP delivered under your ownership at handover. No lock-in by design.',
  },
  {
    t: 'Humans in the loop',
    d: 'The best agents know their limits. Everything we forge escalates gracefully to your team — with full context, never a cold transcript.',
  },
]

const PROCESS = [
  { n: '01', t: 'The Spark', d: 'A short discovery call. We ask the questions a top engineer would, and tell you honestly if AI is the wrong tool for your problem.' },
  { n: '02', t: 'The Blueprint', d: 'A fixed-scope proposal in days — defined outcomes, honest timelines, transparent pricing. You know the cost before we start.' },
  { n: '03', t: 'The Forging', d: 'Weekly demos of the real system. Your first working prototype lands before most agencies finish onboarding paperwork.' },
  { n: '04', t: 'The Quenching', d: 'Production hardening, evaluation harnesses, monitoring and handover. What leaves the forge keeps working after we leave.' },
]

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About ForgeQubit',
  url: `${SITE_URL}/about`,
  mainEntity: { '@id': `${SITE_URL}/#organization` },
}

export default function About() {
  const ref = useReveal()
  return (
    <div className="page" ref={ref}>
      <Seo
        title="About ForgeQubit — The AI Agency That Ships Working Agents"
        description="ForgeQubit is an AI agency built by engineers, not account managers. Learn how we forge WhatsApp agents, voice agents and AI products — weekly demos, fixed scope, measurable results."
        path="/about"
        jsonLd={JSON_LD}
      />
      <div className="page-inner">
        <header className="page-hero">
          <div className="page-kicker rise">The Forge Itself</div>
          <h1 className="page-title rise d1">Built by <span className="molten-text">builders.</span></h1>
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

        <section className="section-block">
          <div className="page-kicker reveal">What We Believe</div>
          <h2 className="section-title reveal">The four <span className="molten-text">laws.</span></h2>
          <div className="value-grid">
            {VALUES.map((v, i) => (
              <div key={v.t} className={`value-card reveal d${(i % 2) + 1}`}>
                <h3>{v.t}</h3>
                <p>{v.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section-block">
          <div className="page-kicker reveal">How We Work</div>
          <h2 className="section-title reveal">From ore <span className="molten-text">to weapon.</span></h2>
          <div className="steps about-steps reveal d1">
            {PROCESS.map((s) => (
              <div key={s.n} className="step">
                <span className="step-num">{s.n}</span>
                <div>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="page-cta reveal">
          <h2>See what leaves <span className="molten-text">the fire.</span></h2>
          <div className="finale-actions">
            <Link className="outro-cta hoverable" to="/case-studies">See the Work <span>→</span></Link>
            <Link className="ghost-cta hoverable" to="/contact">Start a Project <span>→</span></Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
