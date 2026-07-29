import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { SERVICES, PROCESS, CASES, POSTS } from '../data.js'
import { EMAIL, Footer, useReveal } from '../chrome.jsx'
import { Seo, SITE_URL, SITE_NAME, ORG_ID, orgRef, graph, webPageLd } from '../seo.jsx'
import { registerJourney, scroll } from '../input.js'

const Scene = lazy(() => import('../Scene.jsx'))

const PANELS = 9 // hero + manifesto + six services + gate

/* ————————————————————————————————————————
   The 3D layer is mounted only once the browser is idle. The document
   is fully interactive before three.js is even requested, and because
   the canvas is a fixed backdrop rather than a scroll container, it
   arriving late changes no layout.
   ———————————————————————————————————————— */
function useDeferredScene() {
  const [ready, setReady] = useState(false)
  const [tier, setTier] = useState('high')

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let cancelled = false
    const start = async () => {
      const { pickTier } = await import('../Scene.jsx')
      if (cancelled) return
      setTier(pickTier())
      setReady(true)
    }

    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(start, { timeout: 2200 })
      return () => { cancelled = true; cancelIdleCallback(id) }
    }
    const id = setTimeout(start, 400)
    return () => { cancelled = true; clearTimeout(id) }
  }, [])

  return { ready, tier }
}

/* Progress bar and station counter, driven from one rAF loop that writes
   straight to the DOM. Runs whether or not WebGL ever loads. */
function useJourneyChrome(journeyRef) {
  useEffect(() => {
    const el = journeyRef.current
    if (!el) return
    const unregister = registerJourney(el)

    const fill = document.getElementById('progress-fill')
    const cur = document.getElementById('hud-current')
    const hud = document.getElementById('hud')
    const label = document.getElementById('hud-label')

    let raf = 0
    let lastLabel = ''
    let lastGone = null

    const tick = () => {
      if (fill) fill.style.transform = `scaleX(${scroll.progress})`

      const n = String(Math.min(PANELS, Math.round(scroll.journey * (PANELS - 1)) + 1)).padStart(2, '0')
      if (n !== lastLabel && cur) {
        cur.textContent = n
        lastLabel = n
      }

      // the journey counter means nothing once you're past the gate
      const gone = scroll.journey >= 0.999
      if (gone !== lastGone) {
        hud?.classList.toggle('gone', gone)
        label?.classList.toggle('gone', gone)
        lastGone = gone
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      unregister()
    }
  }, [journeyRef])
}

/* ———————————————————— structured data ———————————————————— */

const JSON_LD = graph(
  {
    '@type': ['Organization', 'ProfessionalService'],
    '@id': ORG_ID,
    name: SITE_NAME,
    legalName: 'ForgeQubit',
    url: `${SITE_URL}/`,
    email: EMAIL,
    slogan: 'Agents that work while the world sleeps.',
    description:
      'UK-registered AI agency building WhatsApp automation, voice agents, avatar agents, custom AI agents, AI-powered SaaS platforms and AI × blockchain products for clients across the United Kingdom, Europe and the United States.',
    logo: {
      '@type': 'ImageObject',
      '@id': `${SITE_URL}/#logo`,
      url: `${SITE_URL}/icon-512.png`,
      width: 512,
      height: 512,
      caption: SITE_NAME,
    },
    image: { '@id': `${SITE_URL}/#logo` },
    address: { '@type': 'PostalAddress', addressCountry: 'GB' },
    areaServed: [
      { '@type': 'Country', name: 'United Kingdom' },
      { '@type': 'Country', name: 'United States' },
      { '@type': 'AdministrativeArea', name: 'Europe' },
    ],
    knowsAbout: SERVICES.map((s) => s.title),
    contactPoint: {
      '@type': 'ContactPoint',
      email: EMAIL,
      contactType: 'sales',
      availableLanguage: 'English',
      areaServed: ['GB', 'US', 'EU'],
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'AI development services',
      itemListElement: SERVICES.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.title, description: s.short },
      })),
    },
  },
  {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    inLanguage: 'en-GB',
    publisher: orgRef,
  },
  webPageLd({
    path: '/',
    title: 'ForgeQubit — AI Agency for WhatsApp, Voice & Custom AI Agents',
    description:
      'UK-registered AI agency shipping WhatsApp automation, voice agents, avatar agents, custom AI agents and AI-powered SaaS across the UK, Europe and the USA.',
  })
)

/* ———————————————————— page ———————————————————— */

export default function Home() {
  const revealRef = useReveal()
  const journeyRef = useRef(null)
  const { ready, tier } = useDeferredScene()
  useJourneyChrome(journeyRef)

  return (
    <div className="home" ref={revealRef}>
      <Seo
        title="ForgeQubit — AI Agency for WhatsApp, Voice & Custom AI Agents"
        description="ForgeQubit is a UK-registered AI agency serving Europe and the USA — shipping WhatsApp automation, voice agents, avatar agents, custom AI agents, AI-powered SaaS and AI × blockchain products."
        path="/"
        jsonLd={JSON_LD}
      />

      <div className={`scene-layer ${ready ? 'lit' : ''}`} aria-hidden="true">
        {ready && (
          <Suspense fallback={null}>
            <Scene tier={tier} />
          </Suspense>
        )}
      </div>

      <div className="progress-track" aria-hidden="true">
        <div className="progress-fill" id="progress-fill" />
      </div>
      <div className="hud" id="hud" aria-hidden="true">
        <span className="current" id="hud-current">01</span>
        <span className="total">/ {String(PANELS).padStart(2, '0')}</span>
      </div>
      <div className="hud-label" id="hud-label" aria-hidden="true">An Immersive Descent</div>

      {/* ———— the descent ———— */}
      <div className="journey" ref={journeyRef}>
        <section className="panel center">
          <div className="hero-inner">
            <p className="eyebrow">AI Agency — Est. in the Fire</p>
            {/* the explicit space keeps the accessible name and the
                crawled text as "We Forge Intelligence" — the rows are
                separate blocks, so without it they concatenate */}
            <h1 className="hero-title">
              <span className="row"><span>We Forge</span></span>{' '}
              <span className="row"><span className="ember-text flow">Intelligence</span></span>
            </h1>
            <p className="hero-sub">
              Six crafts, one obsession: agents that work while the world sleeps.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" to="/contact">Start a Project <span>→</span></Link>
              <Link className="btn btn-ghost" to="/case-studies">See the Work <span>→</span></Link>
            </div>
            <ul className="hero-strip">
              <li>UK Registered</li>
              <li>Serving UK · EU · USA</li>
              <li>Fixed Scope, Weekly Demos</li>
            </ul>
          </div>
          <div className="scroll-hint" aria-hidden="true">
            <span>Descend</span>
            <span className="drip" />
          </div>
        </section>

        <section className="panel center">
          <p className="manifesto reveal">
            <span className="eyebrow" style={{ display: 'block', marginBottom: '3vh' }}>The Manifesto</span>
            Every great product begins as <span className="ember-text">raw ore</span> — an idea, unshaped.
            We heat it with research, strike it with engineering, and quench it in production.
            What leaves our forge is not software. <span className="ember-text">It is leverage.</span>
          </p>
        </section>

        {SERVICES.map((s, i) => (
          <section key={s.num} className={`panel ${i % 2 ? 'left' : 'right'}`}>
            <div className="panel-body">
              <div className="service-index reveal">
                <span className="num">{s.num}</span>
                <span className="rule" />
                <span className="cat">{s.cat}</span>
              </div>
              <h2 className="service-title reveal d1">
                {s.lead} <em>{s.accent}</em>{s.tail ? ` ${s.tail}` : ''}
              </h2>
              <p className="service-body reveal d2">{s.short}</p>
              <ul className="tag-row reveal d3">
                {s.tags.map((t) => <li key={t}>{t}</li>)}
              </ul>
              <Link
                className="link-cta reveal d3"
                to={`/contact?interest=${encodeURIComponent(s.interest)}`}
              >
                Forge this with us <span>→</span>
              </Link>
            </div>
          </section>
        ))}

        <section className="panel center">
          <div className="gate-inner">
            <p className="eyebrow reveal">Final Chamber</p>
            <h2 className="gate-title reveal d1">
              Step through <span className="ember-text flow">the gate.</span>
            </h2>
            <p className="gate-serif reveal d2">Bring us the raw idea. Leave with the weapon.</p>
            <div className="btn-row reveal d3">
              <Link className="btn btn-primary" to="/contact">Start a Project <span>→</span></Link>
              <Link className="btn btn-ghost" to="/case-studies">See the Work <span>→</span></Link>
            </div>
          </div>
        </section>
      </div>

      {/* ———— the ground floor ———— */}
      <div className="ground">
        <section className="ground-section shell" aria-labelledby="proof-h">
          <div className="section-head reveal">
            <p className="eyebrow eyebrow-mark">Measured, Not Claimed</p>
            <h2 id="proof-h">Numbers that left <span className="ember-text">the fire.</span></h2>
            <p>Every engagement is scored against the metric that matters to the client. These are the last three.</p>
          </div>
          <div className="metrics">
            {CASES.map((c, i) => (
              <Link key={c.slug} className={`card metric reveal d${i + 1}`} to="/case-studies">
                <span className="v ember-text">{c.metric}</span>
                <span className="l">{c.metricLabel}<br />{c.client} · {c.field}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="ground-section shell" aria-labelledby="process-h">
          <div className="section-head reveal">
            <p className="eyebrow eyebrow-mark">How We Work</p>
            <h2 id="process-h">From ore <span className="ember-text">to weapon.</span></h2>
            <p>Four stages, no mystery invoices, and a working demo in your hands every week from the first.</p>
          </div>
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

        <section className="ground-section shell" aria-labelledby="work-h">
          <div className="section-head reveal">
            <p className="eyebrow eyebrow-mark">Selected Work</p>
            <h2 id="work-h">Forged <span className="ember-text">&amp; shipped.</span></h2>
            <p>Three recent builds, still glowing — with the challenge, the approach and the result in full.</p>
          </div>
          <div className="grid-3">
            {CASES.map((c, i) => (
              <Link key={c.slug} className={`card post-card reveal d${i + 1}`} to="/case-studies">
                <div className="post-meta">
                  <span className="post-tag">{c.field}</span>
                  <span className="post-date">{c.metric}</span>
                </div>
                <h3 className="post-title">{c.client}</h3>
                <p className="post-excerpt">{c.summary}</p>
                <span className="post-more">Read the case study →</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="ground-section shell" aria-labelledby="notes-h">
          <div className="section-head reveal">
            <p className="eyebrow eyebrow-mark">From the Forge</p>
            <h2 id="notes-h">Notes in <span className="ember-text">the fire.</span></h2>
            <p>Practical writing on WhatsApp automation, voice agents and shipping AI products — for operators, not researchers.</p>
          </div>
          <div className="grid-3">
            {POSTS.map((p, i) => (
              <Link key={p.slug} className={`card post-card reveal d${i + 1}`} to={`/blog/${p.slug}`}>
                <div className="post-meta">
                  <span className="post-tag">{p.tag}</span>
                  <span className="post-date">{p.readTime}</span>
                </div>
                <h3 className="post-title">{p.title}</h3>
                <p className="post-excerpt">{p.excerpt}</p>
                <span className="post-more">Read the note →</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="ground-section shell">
          <div className="page-cta reveal">
            <p className="eyebrow">The Forge Is Lit</p>
            <h2>Bring us the raw idea.<br /><span className="ember-text">Leave with the weapon.</span></h2>
            <div className="btn-row">
              <Link className="btn btn-primary" to="/contact">Start a Project <span>→</span></Link>
              <a className="btn btn-ghost" href={`mailto:${EMAIL}`}>{EMAIL} <span>→</span></a>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}
