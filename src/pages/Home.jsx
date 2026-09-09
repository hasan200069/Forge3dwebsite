import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { SOLUTIONS, PROCESS, FAQS } from '../data.js'
import { EMAIL, Footer, Faq, CtaBand } from '../chrome.jsx'
import { Seo, SITE_URL, SITE_NAME, ORG_ID, orgRef, graph, webPageLd } from '../seo.jsx'
import { EnquiryFlow, Workflow, ToolStrip } from '../visuals.jsx'
import { ICONS, IconTile } from '../icons.jsx'
import { HeroField, Magnetic, Reveal, Stagger, Tilt, Words, useSpotlightGroup } from '../motion.jsx'

const TITLE = 'ForgeQubit | AI Receptionist, WhatsApp & Voice Agents, Automation (UK)'
const DESC =
  'Voice and WhatsApp agents that answer customers, automations that connect your tools, and custom AI products. UK-registered, serving the UK, Europe and the US.'

/* ———————————————————— structured data ———————————————————— */

const JSON_LD = graph(
  {
    '@type': ['Organization', 'ProfessionalService'],
    '@id': ORG_ID,
    name: SITE_NAME,
    legalName: 'ForgeQubit',
    url: `${SITE_URL}/`,
    email: EMAIL,
    slogan: 'AI systems that answer customers and move work forward.',
    description:
      'UK-registered studio building voice and WhatsApp agents for reception and lead handling, workflow automation and integrations, and custom AI products for clients in the United Kingdom, Europe and the United States.',
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
    knowsAbout: SOLUTIONS.map((s) => s.name),
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
      itemListElement: SOLUTIONS.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.name, description: s.short, url: SITE_URL + s.path },
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
  webPageLd({ path: '/', title: TITLE, description: DESC }),
  {
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/#faq`,
    mainEntity: [0, 1, 2, 4, 5].map((i) => ({
      '@type': 'Question',
      name: FAQS[i].q,
      acceptedAnswer: { '@type': 'Answer', text: FAQS[i].a },
    })),
  }
)

/* the five buying questions, drawn from the full list */
const HOME_FAQS = [0, 1, 2, 4, 5].map((i) => FAQS[i])

const workflow = SOLUTIONS[1]

/* ———————————————————— page ———————————————————— */

/* A soft light that follows a fine pointer across the hero. Written to
   CSS variables directly, so nothing re-renders; off for touch and for
   reduced motion. */
function useSpotlight() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const move = (e) => {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${e.clientX - r.left}px`)
      el.style.setProperty('--my', `${e.clientY - r.top}px`)
      el.style.setProperty('--spot', '1')
    }
    const leave = () => el.style.setProperty('--spot', '0')
    el.addEventListener('pointermove', move, { passive: true })
    el.addEventListener('pointerleave', leave, { passive: true })
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [])
  return ref
}

export default function Home() {
  const hero = useSpotlight()
  const solutionsRef = useSpotlightGroup('.solution')
  const stepsRef = useSpotlightGroup('.step')

  return (
    <div className="home">
      <Seo title={TITLE} description={DESC} path="/" jsonLd={JSON_LD} />

      {/* ———— 1. the full-page hero: promise and demonstration ———— */}
      <section className="hero hero-full" aria-labelledby="hero-h" ref={hero}>
        <div className="hero-scene" aria-hidden="true">
          <div className="hero-aurora"><i /><i /><i /></div>
          <div className="hero-floor"><i /></div>
          <HeroField />
          <div className="hero-vignette" />
        </div>

        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="eyebrow pill">
              <i className="dot" aria-hidden="true" />
              Voice · WhatsApp · Automation · AI products
            </p>
            <h1 id="hero-h" className="hero-title">
              <Words text="AI systems that answer customers and" />
              <span className="em"><Words text="move work forward." offset={6} /></span>
            </h1>
            <p className="lede">
              ForgeQubit builds voice and WhatsApp agents that answer enquiries and book
              appointments, connects the tools your team already uses, and develops custom AI
              products when off-the-shelf software is not enough.
            </p>
            <div className="btn-row hero-actions">
              <Magnetic>
                <Link className="btn btn-primary btn-lg" to="/contact" data-track="hero-primary">
                  Discuss your project <span aria-hidden="true">→</span>
                </Link>
              </Magnetic>
              <Magnetic strength={0.18}>
                <Link className="btn btn-secondary btn-lg" to="/services" data-track="hero-secondary">
                  Explore our solutions
                </Link>
              </Magnetic>
            </div>
            <ul className="hero-strip chips" aria-label="How we work">
              <li>Fixed-scope proposals</li>
              <li>Weekly working demos</li>
              <li>You own the code and accounts</li>
            </ul>
          </div>

          <div className="hero-visual">
            <Tilt max={6}>
              <EnquiryFlow autoplay />
            </Tilt>
            <div className="hero-orbit" aria-hidden="true">
              <span className="orbit-chip a">Calendar updated</span>
              <span className="orbit-chip b">CRM contact created</span>
              <span className="orbit-chip c">Handoff on request</span>
            </div>
          </div>
        </div>

        <a className="scroll-cue" href="#solutions" aria-label="Scroll to the solutions">
          <span>Scroll</span>
          <i aria-hidden="true" />
        </a>
      </section>

      <section className="section tight strip-section" aria-labelledby="tools-h">
        <div className="shell">
          <Reveal as="h2" id="tools-h" className="eyebrow plain">Connects to the tools you already run</Reveal>
        </div>
        <ToolStrip />
      </section>

      {/* ———— 2. three solutions, short ———— */}
      <section className="section" id="solutions" aria-labelledby="solutions-h">
        <div className="shell">
          <div className="section-head split">
            <Reveal>
              <p className="eyebrow">Solutions</p>
              <h2 id="solutions-h">Which one is <span className="em">your</span> problem?</h2>
            </Reveal>
            <Reveal as="p" className="lede" delay={120}>
              Service businesses usually start with reception. Operations teams add automation.
              Founders and product teams come for the third.
            </Reveal>
          </div>

          <Stagger step={110}>
            <div className="solutions" ref={solutionsRef}>
              {SOLUTIONS.map((s) => (
                <article key={s.slug} className="solution" aria-labelledby={`sol-${s.slug}`}>
                  <span className="solution-watermark" aria-hidden="true">{s.num}</span>
                  <div className="solution-id">
                    <IconTile icon={ICONS[s.slug]} />
                    <span className="num">{s.num}</span>
                  </div>
                  <h3 id={`sol-${s.slug}`}>{s.name}</h3>
                  <p className="solution-problem">{s.problem}</p>
                  <p className="solution-build">{s.short}</p>
                  <Link className="link-cta stretch" to={s.path} data-track={`solution-${s.slug}`}>
                    How {s.shortName} works <span aria-hidden="true">→</span>
                  </Link>
                </article>
              ))}
            </div>
          </Stagger>
          <Reveal as="p" className="muted small" style={{ marginTop: 18 }} delay={200}>
            Also available when a project needs them: <Link to="/services#capabilities">avatar agents and AI × blockchain engineering</Link>.
          </Reveal>
        </div>
      </section>

      {/* ———— 3. strongest available evidence ———— */}
      <section className="section alt" aria-labelledby="proof-h">
        <div className="shell approach">
          <Reveal>
            <p className="eyebrow">What you can check</p>
            <h2 id="proof-h">Practices you can hold us to, <span className="em">not promises.</span></h2>
            <p className="lede" style={{ marginTop: 14 }}>
              Published case studies are coming with client permission. Until then, every
              engagement includes these, in writing.
            </p>
            <ul className="list check big" style={{ marginTop: 22 }}>
              <li><strong>A written scope and price</strong> before any invoice, with an estimate of ongoing third-party costs.</li>
              <li><strong>A working demo every week</strong>, tested against real examples you supply.</li>
              <li><strong>A defined route to a person</strong> for every agent, and an approver for every uncertain automation step.</li>
              <li><strong>Handover you can live with</strong>: accounts in your name, code in your repositories, documentation for changes.</li>
            </ul>
            <div className="btn-row" style={{ marginTop: 24 }}>
              <Link className="btn btn-secondary" to="/case-studies">See worked examples</Link>
              <Link className="link-cta" to="/about">How we work <span aria-hidden="true">→</span></Link>
            </div>
          </Reveal>
          <Reveal delay={150} className="approach-visual">
            <p className="eyebrow" style={{ marginBottom: 12 }}>Try the approval step</p>
            <Workflow flow={workflow.example.flow} note="Illustrative automation. Uncertain cases go to a person, never guessed. Play it and make the decision yourself." />
          </Reveal>
        </div>
      </section>

      {/* ———— 4. compact delivery process ———— */}
      <section className="section" aria-labelledby="process-h">
        <div className="shell">
          <div className="section-head split">
            <Reveal>
              <p className="eyebrow">How a project runs</p>
              <h2 id="process-h">Four stages, each with <span className="em">something you can see.</span></h2>
            </Reveal>
            <Reveal as="p" className="lede" delay={120}>
              If discovery shows AI is the wrong tool for your problem, we say so and stop there.{' '}
              <Link to="/about#process">Responsibilities at each stage →</Link>
            </Reveal>
          </div>
          <Stagger step={120}>
            <ol className="process compact timeline" aria-label="Delivery stages" ref={stepsRef}>
              {PROCESS.map((s) => (
                <li key={s.n} className="step">
                  <span className="n">{s.n}</span>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                  <p className="step-out"><b>You get:</b> {s.out}</p>
                </li>
              ))}
            </ol>
          </Stagger>
        </div>
      </section>

      {/* ———— 5. essential buying questions ———— */}
      <section className="section alt" aria-labelledby="faq-h">
        <div className="shell faq-grid">
          <Reveal>
            <p className="eyebrow">Before you enquire</p>
            <h2 id="faq-h">Cost, time, integrations, ownership, <span className="em">and what happens when it fails.</span></h2>
            <div className="btn-row" style={{ marginTop: 22 }}>
              <Link className="btn btn-secondary" to="/services#faq">All questions</Link>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <Faq items={HOME_FAQS} />
          </Reveal>
        </div>
      </section>

      {/* ———— 6. enquiry ———— */}
      <CtaBand
        title="Tell us what your team is dealing with."
        body="A few sentences is enough. A person replies by email to arrange a short call, then you get a written scope and price. Nothing starts until you sign."
        secondary={{ to: `mailto:${EMAIL}`, label: EMAIL }}
      />

      <Footer />
    </div>
  )
}
