import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { SOLUTIONS, PROCESS, FAQS, VOICE } from '../data.js'
import { EMAIL, Footer, Faq } from '../chrome.jsx'
import { Seo, SITE_URL, SITE_NAME, ORG_ID, orgRef, graph, webPageLd } from '../seo.jsx'
import { EnquiryFlow, Workflow, ToolStrip } from '../visuals.jsx'
import { PhoneFrame, ProductWindow, ScopeIcon, DemoIcon, PersonIcon, KeyIcon } from '../mocks.jsx'
import { ICONS, IconTile } from '../icons.jsx'
import { HeroField, Magnetic, Reveal, Stagger, Tilt, Words } from '../motion.jsx'

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

const [reception, workflow, products] = SOLUTIONS

/* four things every engagement includes, as tiles: a short name and one line */
const PRACTICES = [
  { icon: ScopeIcon, t: 'Written scope and price', d: 'Before any invoice. Ongoing costs estimated too.' },
  { icon: DemoIcon, t: 'A working demo every week', d: 'Tested against real examples you supply.' },
  { icon: PersonIcon, t: 'A person in the loop', d: 'Every agent hands off. Every uncertain step gets an approver.' },
  { icon: KeyIcon, t: 'You own everything', d: 'Accounts in your name. Code in your repositories.' },
]

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

/* Apple-style link pair under a headline */
function TileLinks({ to, learn = 'Learn more', interest, track }) {
  const contact = interest ? `/contact?interest=${encodeURIComponent(interest)}` : '/contact'
  return (
    <div className="tile-links">
      <Link to={to} data-track={`${track}-learn`}>{learn} <span aria-hidden="true">›</span></Link>
      <Link to={contact} data-track={`${track}-contact`}>Discuss it <span aria-hidden="true">›</span></Link>
    </div>
  )
}

export default function Home() {
  const hero = useSpotlight()

  return (
    <div className="home apple">
      <Seo title={TITLE} description={DESC} path="/" jsonLd={JSON_LD} />

      {/* ———— hero: one line, one demonstration ———— */}
      <section className="hero hero-full hero-stacked" aria-labelledby="hero-h" ref={hero}>
        <div className="hero-scene" aria-hidden="true">
          <div className="hero-aurora"><i /><i /><i /></div>
          <div className="hero-floor"><i /></div>
          <HeroField />
          <div className="hero-vignette" />
        </div>

        <div className="shell hero-stack">
          <div className="hero-copy">
            <p className="eyebrow pill">
              <i className="dot" aria-hidden="true" />
              ForgeQubit
            </p>
            <h1 id="hero-h" className="hero-title">
              <Words text="Answers customers." />{' '}
              <span className="em"><Words text="Moves work forward." offset={2} /></span>
            </h1>
            <p className="hero-sub">Voice and WhatsApp agents, automation, and custom AI products.</p>
            <div className="btn-row hero-actions">
              <Magnetic>
                <Link className="btn btn-primary btn-lg" to="/contact" data-track="hero-primary">
                  Discuss your project <span aria-hidden="true">→</span>
                </Link>
              </Magnetic>
              <Link className="link-cta" to="/services" data-track="hero-secondary">
                Explore solutions <span aria-hidden="true">›</span>
              </Link>
            </div>
          </div>

          <div className="hero-visual">
            <Tilt max={4}>
              <EnquiryFlow autoplay />
            </Tilt>
          </div>
        </div>

        <a className="scroll-cue" href="#reception" aria-label="Scroll to the solutions">
          <span>Scroll</span>
          <i aria-hidden="true" />
        </a>
      </section>

      {/* ———— tools ribbon ———— */}
      <section className="section tight strip-section" aria-labelledby="tools-h">
        <div className="shell">
          <Reveal as="h2" id="tools-h" className="ribbon-title">Works with the tools you already run.</Reveal>
        </div>
        <ToolStrip />
      </section>

      {/* ———— tile 1: reception on a phone ———— */}
      <section className="tile" id="reception" aria-labelledby="t1-h">
        <div className="shell tile-inner">
          <Reveal className="tile-copy">
            <IconTile icon={ICONS[reception.slug]} />
            <h2 id="t1-h">{reception.shortName}</h2>
            <p className="tile-sub">{reception.tagline}</p>
            <TileLinks to={reception.path} interest={reception.interest} track="tile-reception" />
          </Reveal>
          <Reveal delay={150} className="tile-visual">
            <PhoneFrame
              title="Mill Lane Lettings"
              subtitle="WhatsApp Business · replies in seconds"
              steps={reception.example.steps}
              note={reception.example.note}
            />
          </Reveal>
        </div>
      </section>

      {/* ———— tile 2: automation you can steer ———— */}
      <section className="tile alt" id="automation" aria-labelledby="t2-h">
        <div className="shell tile-inner">
          <Reveal className="tile-copy">
            <IconTile icon={ICONS[workflow.slug]} />
            <h2 id="t2-h">{workflow.shortName}</h2>
            <p className="tile-sub">{workflow.tagline}</p>
            <TileLinks to={workflow.path} interest={workflow.interest} track="tile-workflow" />
          </Reveal>
          <Reveal delay={150} className="tile-visual wide">
            <Workflow flow={workflow.example.flow} note="Illustrative. Uncertain cases go to a person, never guessed. Play it and make the decision yourself." />
          </Reveal>
        </div>
      </section>

      {/* ———— tile 3: a product, in a window ———— */}
      <section className="tile" id="products" aria-labelledby="t3-h">
        <div className="shell tile-inner">
          <Reveal className="tile-copy">
            <IconTile icon={ICONS[products.slug]} />
            <h2 id="t3-h">{products.shortName}</h2>
            <p className="tile-sub">{products.tagline}</p>
            <TileLinks to={products.path} interest={products.interest} track="tile-products" />
          </Reveal>
          <Reveal delay={150} className="tile-visual wide">
            <ProductWindow note={products.example.note} />
          </Reveal>
        </div>
      </section>

      {/* ———— two-up: voice, and the specialist capabilities ———— */}
      <section className="section tight" aria-label="More">
        <div className="shell two-up">
          <Reveal as={Link} to={VOICE.path} className="mini-tile" data-track="tile-voice">
            <IconTile icon={ICONS['voice-agents']} />
            <h2>Voice agents</h2>
            <p>Just the phone line, done properly.</p>
            <span className="tile-links"><span>Learn more <i aria-hidden="true">›</i></span></span>
            <div className="wave" aria-hidden="true">
              {Array.from({ length: 28 }, (_, i) => <i key={i} style={{ '--i': i }} />)}
            </div>
          </Reveal>
          <Reveal as={Link} to="/services#capabilities" className="mini-tile" delay={120} data-track="tile-capabilities">
            <IconTile icon={ICONS.avatars} />
            <h2>Avatars &amp; blockchain</h2>
            <p>Brought in when a project calls for them.</p>
            <span className="tile-links"><span>Learn more <i aria-hidden="true">›</i></span></span>
            <div className="orbits" aria-hidden="true"><i /><i /><i /></div>
          </Reveal>
        </div>
      </section>

      {/* ———— practices: four tiles, one line each ———— */}
      <section className="section" aria-labelledby="practices-h">
        <div className="shell">
          <Reveal className="centered-head">
            <h2 id="practices-h">In writing. <span className="em">Every time.</span></h2>
            <p className="tile-sub">Published case studies arrive with client permission. Until then, this is what you can hold us to.</p>
          </Reveal>
          <Stagger step={100}>
            <div className="practice-grid">
              {PRACTICES.map((p) => (
                <div key={p.t} className="practice">
                  <IconTile icon={p.icon} />
                  <h3>{p.t}</h3>
                  <p>{p.d}</p>
                </div>
              ))}
            </div>
          </Stagger>
          <Reveal as="div" className="centered-links" delay={200}>
            <Link to="/case-studies">Worked examples <span aria-hidden="true">›</span></Link>
            <Link to="/about">How we work <span aria-hidden="true">›</span></Link>
          </Reveal>
        </div>
      </section>

      {/* ———— process: four words, one line each ———— */}
      <section className="section alt" aria-labelledby="process-h">
        <div className="shell">
          <Reveal className="centered-head">
            <h2 id="process-h">Four stages. <span className="em">Something to see at each.</span></h2>
          </Reveal>
          <Stagger step={110}>
            <ol className="stages" aria-label="Delivery stages">
              {PROCESS.map((s) => (
                <li key={s.n}>
                  <span className="stage-n" aria-hidden="true">{s.n}</span>
                  <h3>{s.t}</h3>
                  <p>{s.out}</p>
                </li>
              ))}
            </ol>
          </Stagger>
          <Reveal as="p" className="centered-links" delay={200}>
            <Link to="/about#process">What happens at each stage <span aria-hidden="true">›</span></Link>
          </Reveal>
        </div>
      </section>

      {/* ———— questions ———— */}
      <section className="section" aria-labelledby="faq-h">
        <div className="shell narrow-col">
          <Reveal className="centered-head">
            <h2 id="faq-h">Questions.</h2>
          </Reveal>
          <Reveal delay={100}>
            <Faq items={HOME_FAQS} />
          </Reveal>
          <Reveal as="p" className="centered-links" delay={160}>
            <Link to="/services#faq">All questions <span aria-hidden="true">›</span></Link>
          </Reveal>
        </div>
      </section>

      {/* ———— the ask ———— */}
      <section className="section closing" aria-labelledby="cta-h">
        <div className="shell">
          <Reveal className="closing-inner">
            <span className="cta-light" aria-hidden="true" />
            <h2 id="cta-h">Let’s talk.</h2>
            <p className="tile-sub">A few sentences about what your team is dealing with is enough.</p>
            <div className="btn-row">
              <Magnetic>
                <Link className="btn btn-primary btn-lg" to="/contact" data-track="cta-band">Discuss your project <span aria-hidden="true">→</span></Link>
              </Magnetic>
              <a className="link-cta" href={`mailto:${EMAIL}`} data-track="cta-band-email">{EMAIL}</a>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  )
}
