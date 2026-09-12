import { Link } from 'react-router-dom'
import { Crumbs, Footer, Faq, CtaBand } from '../chrome.jsx'
import { Seo, SITE_URL, ogFor, graph, webPageLd, breadcrumbLd, orgRef } from '../seo.jsx'
import { AREA_SERVED, MARKETS, INTERNATIONAL_FAQS } from '../markets.js'

const TITLE = 'AI Agency for UK, USA, Europe & Middle East | ForgeQubit'
const DESC = 'AI agents, workflow automation and custom AI development for UK, US, European and Middle Eastern businesses. A UK-registered studio delivering remotely.'
const JSON_LD = graph(
  webPageLd({ path: '/international', title: TITLE, description: DESC }),
  breadcrumbLd([{ label: 'International clients', path: '/international' }]),
  { '@type': 'Service', '@id': `${SITE_URL}/international#service`, name: 'International AI development and automation', description: DESC, provider: orgRef, areaServed: AREA_SERVED, url: `${SITE_URL}/international` },
  { '@type': 'FAQPage', '@id': `${SITE_URL}/international#questions`, mainEntity: INTERNATIONAL_FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }
)

export default function International() {
  return <div className="page international-page">
    <Seo title={TITLE} description={DESC} path="/international" image={ogFor('international')} imageAlt="ForgeQubit AI development for the UK, USA, Europe and Middle East" jsonLd={JSON_LD} />
    <header className="shell page-hero">
      <Crumbs trail={[{ label: 'International clients' }]} />
      <p className="eyebrow">UK-registered. Working internationally.</p>
      <h1>Your AI partner.<br />Across borders.</h1>
      <p className="lede">AI agents, workflow automation and custom software for businesses in the UK, USA, Europe and the Middle East.</p>
      <div className="btn-row"><Link className="btn btn-primary" to="/contact">Discuss your project</Link><Link className="studio-text-link" to="/case-studies">Explore worked examples</Link></div>
    </header>
    <section className="section alt" aria-labelledby="markets-heading"><div className="shell">
      <div className="section-head"><h2 id="markets-heading">Built around your market.</h2><p className="lede">Remote delivery. Local requirements defined together.</p></div>
      <div className="market-grid">{MARKETS.map(m => <article key={m.id} id={m.id} className="market-card"><p className="eyebrow">{m.name}</p><h3>{m.intro}</h3><p>{m.body}</p><Link className="studio-text-link" to={m.to}>{m.link}</Link></article>)}</div>
    </div></section>
    <section className="section"><div className="shell international-process"><div><h2>Distance is part<br />of the plan.</h2><p className="lede">A clear brief and a shared definition of done keep a remote project moving.</p></div><ol><li><h3>Start with your setup</h3><p>Share your country, time zone, systems, customer languages and the outcome you need.</p></li><li><h3>Agree the working rhythm</h3><p>Set meeting windows, demo checkpoints and an owner for decisions before development begins.</p></li><li><h3>Launch with a handover</h3><p>Test real scenarios, document the system and agree who handles support after launch.</p></li></ol></div></section>
    <section className="section alt"><div className="shell faq-grid"><div><p className="eyebrow">Working together</p><h2>Before we begin.</h2></div><Faq id="international-faq" items={INTERNATIONAL_FAQS} /></div></section>
    <CtaBand title="Where are you building from?" body="Tell us your location, your tools and what you want to improve. We will help define the next step." />
    <Footer />
  </div>
}
