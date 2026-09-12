import { Link } from 'react-router-dom'
import { useState } from 'react'
import { SOLUTIONS, FAQS } from '../data.js'
import { EMAIL, Footer, Faq } from '../chrome.jsx'
import { Seo, SITE_URL, SITE_NAME, ORG_ID, orgRef, graph, webPageLd } from '../seo.jsx'
import { EnquiryFlow, Workflow } from '../visuals.jsx'
import { Reveal } from '../motion.jsx'

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

const HOME_FAQS = [0, 1, 2, 4, 5].map((i) => FAQS[i])
const OFFERINGS = [
  { title: 'Every conversation. Covered.', label: 'AI reception', text: 'Voice and WhatsApp agents that answer, qualify and book.', kind: 'voice' },
  { title: 'Less busywork. More momentum.', label: 'Workflow automation', text: 'Connect your tools. Give your team their time back.', kind: 'automation' },
  { title: 'Your next big idea. Built.', label: 'Custom AI products', text: 'Purpose-built software, from first prototype to launch.', kind: 'product' },
]

function Sculpture() {
  return <div className="product-scene" aria-hidden="true">
    <div className="scene-window"><div className="scene-toolbar"><i /><i /><i /><span>ForgeQubit · Your business, connected</span></div><div className="scene-body"><span>Today, taken care of.</span><h3>Everything in its place.</h3><div className="scene-row"><i>✓</i><b>New enquiry received</b><span>WhatsApp</span></div><div className="scene-row"><i>✓</i><b>Appointment confirmed</b><span>Calendar</span></div><div className="scene-row"><i>✓</i><b>Customer details updated</b><span>CRM</span></div></div></div>
    <div className="scene-floating scene-call"><span>AI reception</span><h3>“How can I help?”</h3><div className="voice-bars">{Array.from({length:25},(_,i)=><i key={i} style={{'--height': `${15+Math.sin(i*1.8)**2*55}px`}} />)}</div></div>
    <div className="scene-floating scene-booking"><b>✓</b><div><strong>You’re booked in.</strong><small>Thursday, 10:30 am</small></div></div>
  </div>
}

export default function Home() {
  const [demo, setDemo] = useState('reception')
  return (
    <div className="home studio-home">
      <Seo title={TITLE} description={DESC} path="/" jsonLd={JSON_LD} />
      <section className="studio-hero" aria-labelledby="hero-h">
        <div className="shell studio-hero-inner">
          <div className="studio-kicker"><span className="availability-dot" /> ForgeQubit</div>
          <h1 id="hero-h">Your business.<br /><span>Working beautifully.</span></h1>
          <p>AI agents, automation and software.<br />Made to work for you.</p>
          <div className="btn-row"><Link className="btn btn-primary" to="/contact" data-track="hero-primary">Let’s build something <span aria-hidden="true">↗</span></Link><a className="studio-text-link" href="#solutions">Explore what we do <span aria-hidden="true">↓</span></a></div>
          <Sculpture />
          <div className="hero-bottom"><span>Designed around people. Engineered for real life.</span><a href="#solutions" aria-label="Explore solutions">Scroll to discover <span aria-hidden="true">↓</span></a></div>
        </div>
      </section>

      <section className="studio-tools" aria-label="Integrations"><div className="shell"><p>Fits right into your world.</p><div><span>WhatsApp</span><span>HubSpot</span><span>Google Calendar</span><span>Slack</span><span>Notion</span></div></div></section>

      <section className="section studio-services" id="solutions" aria-labelledby="solutions-h">
        <div className="shell">
          <Reveal className="studio-section-heading"><div><p className="eyebrow">What we do</p><h2 id="solutions-h">A better way<br /><span className="quiet">to get things done.</span></h2></div><Link className="studio-text-link" to="/services">All solutions ↗</Link></Reveal>
          <div className="studio-service-grid">{OFFERINGS.map((s, i) => <Reveal key={s.kind} delay={i * 80} className={`studio-service ${s.kind}`}>
            <div className="service-art" aria-hidden="true">{i === 0 ? <div className="voice-bars">{Array.from({ length: 31 }, (_, n) => <i key={n} style={{ '--height': `${18 + Math.sin(n * 1.8) ** 2 * (80 - Math.abs(15-n)*4)}px`, '--i': n }} />)}</div> : i === 1 ? <div className="auto-art"><span>↗</span><i /><b>✳</b><i /><span>✓</span></div> : <div className="product-art"><div><i /><i /><i /></div><span>Make room<br />for what’s next.</span><b>↗</b></div>}</div>
            <div className="studio-service-copy"><p className="eyebrow">{s.label}</p><h3>{s.title}</h3><p>{s.text}</p><Link to={SOLUTIONS[i].path} className="studio-card-link" aria-label={`Explore ${s.label}`}><span aria-hidden="true">↗</span></Link></div>
          </Reveal>)}</div>
        </div>
      </section>

      <section className="section studio-demo" aria-labelledby="demo-h"><div className="shell">
        <Reveal className="studio-section-heading"><div><p className="eyebrow">From possibility to practical</p><h2 id="demo-h">Less explaining.<br /><span className="quiet">More showing.</span></h2></div><p>Explore an illustrative system.<br />See what happens at every step.</p></Reveal>
        <div className="studio-demo-layout"><div className="studio-demo-copy"><div className="demo-tabs" role="group" aria-label="Choose a demonstration"><button type="button" aria-pressed={demo === 'reception'} onClick={() => setDemo('reception')}>AI reception</button><button type="button" aria-pressed={demo === 'automation'} onClick={() => setDemo('automation')}>Automation</button></div><h3>{demo === 'reception' ? 'From “hello” to booked.' : 'Work flows. You approve.'}</h3><p>{demo === 'reception' ? 'An enquiry comes in. Your agent handles the details. Your calendar gets the booking.' : 'An invoice arrives. The system checks it, routes it and asks a person when something needs a closer look.'}</p><Link className="studio-text-link" to="/case-studies">Explore the examples ↗</Link><span className="studio-demo-note">Illustrative demo · No live customer data</span></div><div className="studio-demo-screen" key={demo}>{demo === 'reception' ? <EnquiryFlow autoplay /> : <Workflow flow={SOLUTIONS[1].example.flow} note="Illustrative automation. You make the approval decision." />}</div></div>
      </div></section>

      <section className="section studio-principles" aria-labelledby="principles-h"><div className="shell"><Reveal><p className="eyebrow">Small studio. Close collaboration.</p><h2 id="principles-h">Great technology.<br /><span className="quiet">A very human process.</span></h2></Reveal><div className="studio-process">{[['01', 'Find the right problem.', 'A focused conversation. A clear scope and price.'], ['02', 'Build it together.', 'Weekly working demos. Your feedback, built in.'], ['03', 'Make it yours.', 'Your code. Your accounts. A proper handover.']].map(([n,t,d]) => <Reveal key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></Reveal>)}</div><Link className="studio-text-link" to="/about">Meet your build partner ↗</Link></div></section>

      <section className="section studio-faq" aria-labelledby="faq-h"><div className="shell faq-grid"><Reveal><p className="eyebrow">A few good questions</p><h2 id="faq-h">Let’s clear<br />things up.</h2></Reveal><Faq items={HOME_FAQS} /></div></section>
      <section className="studio-final"><div className="shell"><p className="eyebrow">Your next chapter</p><h2>What if<br /><span>we built it?</span></h2><Link className="btn btn-primary" to="/contact">Tell us your idea <span aria-hidden="true">↗</span></Link><a href={`mailto:${EMAIL}`}>{EMAIL}</a></div></section>
      <Footer />
    </div>
  )
}
