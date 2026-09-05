import { Link } from 'react-router-dom'
import { SOLUTIONS, VOICE, contactHref } from '../data.js'
import { Crumbs, Footer, Faq, CtaBand } from '../chrome.jsx'
import { Seo, SITE_URL, orgRef, graph, webPageLd, breadcrumbLd } from '../seo.jsx'
import { Transcript, Workflow } from '../visuals.jsx'

const SECTIONS = [
  ['who', 'Who it helps'],
  ['problems', 'Problems it addresses'],
  ['includes', 'What the engagement includes'],
  ['example', 'A concrete example'],
  ['integrations', 'Integrations'],
  ['delivery', 'Delivery and cost drivers'],
  ['support', 'Ongoing support'],
  ['faq', 'Questions'],
]

const META = {
  'ai-reception': {
    title: 'AI Reception & Lead Handling — Voice and WhatsApp Agents | ForgeQubit',
    description:
      'Voice and WhatsApp agents that answer enquiries in seconds, qualify prospects, book appointments into your calendar and hand off to your team. Built on the official WhatsApp Business Platform and your phone number.',
  },
  'workflow-automation': {
    title: 'Workflow Automation & Integrations — Connect CRMs, Calendars and Support Tools | ForgeQubit',
    description:
      'Connected workflows across CRMs, accounting, helpdesks and internal tools, with language-model steps only where judgement is needed and a person approving anything uncertain.',
  },
  'custom-ai-products': {
    title: 'Custom AI Product Development — AI Applications, Agents and SaaS | ForgeQubit',
    description:
      'Product design and full-stack engineering for AI applications, agent systems and SaaS products, built with evaluation from day one. You own the code, prompts, data and infrastructure.',
  },
}

function Example({ solution }) {
  const ex = solution.example
  return (
    <div className="example">
      <header>
        <h3>{ex.title}</h3>
        <span className="label-illustrative">Illustrative</span>
      </header>
      {ex.flow ? (
        <Workflow flow={ex.flow} note={ex.note} />
      ) : ex.steps[0].who === 'Scope' ? (
        <>
          <ol className="scope-steps">
            {ex.steps.map((s) => (
              <li key={s.who}><b>{s.who}</b><span>{s.text}</span></li>
            ))}
          </ol>
          <p className="transcript-note">{ex.note}</p>
        </>
      ) : (
        <Transcript steps={ex.steps} note={ex.note} compact />
      )}
    </div>
  )
}

export default function ServicePage({ solution: s }) {
  const meta = META[s.slug]
  const others = [...SOLUTIONS.filter((o) => o.slug !== s.slug), ...(s.slug === 'ai-reception' ? [VOICE] : [])]

  const jsonLd = graph(
    webPageLd({ path: s.path, title: meta.title, description: meta.description }),
    breadcrumbLd([
      { label: 'Solutions', path: '/services' },
      { label: s.name, path: s.path },
    ]),
    {
      '@type': 'Service',
      '@id': `${SITE_URL}${s.path}#service`,
      name: s.name,
      description: s.short,
      serviceType: s.name,
      provider: orgRef,
      areaServed: ['GB', 'US', 'EU'],
      url: `${SITE_URL}${s.path}`,
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE_URL}${s.path}#faq`,
      mainEntity: s.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    }
  )

  return (
    <div className="page">
      <Seo title={meta.title} description={meta.description} path={s.path} jsonLd={jsonLd} />

      <header className="shell page-hero">
        <Crumbs trail={[{ label: 'Solutions', to: '/services' }, { label: s.name }]} />
        <p className="eyebrow">Solution {s.num}</p>
        <h1>{s.name}</h1>
        <p className="lede">{s.short}</p>
        <div className="btn-row">
          <Link className="btn btn-primary" to={contactHref(s.interest)} data-track={`service-hero-${s.slug}`}>Discuss your project <span aria-hidden="true">→</span></Link>
          <a className="btn btn-secondary" href="#example">See the example</a>
        </div>
      </header>

      <div className="shell svc-layout" style={{ paddingTop: 12 }}>
        <nav className="svc-nav" aria-label="On this page">
          {SECTIONS.map(([id, label]) => (
            <a key={id} href={`#${id}`}>{label}</a>
          ))}
        </nav>

        <div>
          <section className="svc-section" id="who" aria-labelledby="who-h">
            <h2 id="who-h">Who it helps</h2>
            <ul className="list">
              {s.who.map((w) => <li key={w}>{w}</li>)}
            </ul>
          </section>

          <section className="svc-section" id="problems" aria-labelledby="problems-h">
            <h2 id="problems-h">Problems it addresses</h2>
            <p>{s.problem}</p>
            <ul className="list" style={{ marginTop: 16 }}>
              {s.problems.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </section>

          <section className="svc-section" id="includes" aria-labelledby="includes-h">
            <h2 id="includes-h">What the engagement includes</h2>
            <p>{s.build}</p>
            <ul className="list check" style={{ marginTop: 16 }}>
              {s.includes.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </section>

          <section className="svc-section" id="example" aria-labelledby="example-h">
            <h2 id="example-h">A concrete example</h2>
            <p style={{ marginBottom: 18 }}>{s.outcome}</p>
            <Example solution={s} />
          </section>

          <section className="svc-section" id="integrations" aria-labelledby="int-h">
            <h2 id="int-h">Supported integrations</h2>
            <p style={{ marginBottom: 16 }}>
              Anything with an API is a candidate. These are the ones we work with most; if your
              tool is not listed, ask, and we will confirm before you commit.
            </p>
            <ul className="pill-list">
              {s.integrations.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </section>

          <section className="svc-section" id="delivery" aria-labelledby="delivery-h">
            <h2 id="delivery-h">Delivery expectations and cost drivers</h2>
            <p>{s.delivery.expectation}</p>
            <div className="kv" style={{ marginTop: 18 }}>
              <div>
                <h3>What drives the price</h3>
                <ul className="list">
                  {s.delivery.drivers.map((d) => <li key={d}>{d}</li>)}
                </ul>
              </div>
              <div>
                <h3>Ongoing costs after launch</h3>
                <p>{s.delivery.running}</p>
              </div>
            </div>
          </section>

          <section className="svc-section" id="support" aria-labelledby="support-h">
            <h2 id="support-h">Ongoing support</h2>
            <p>{s.support}</p>
          </section>

          <section className="svc-section" id="faq" aria-labelledby="faq-h">
            <h2 id="faq-h">Questions about {s.shortName}</h2>
            <Faq items={s.faqs} id={`faq-${s.slug}`} />
          </section>

          <section className="svc-section" aria-labelledby="related-h">
            <h2 id="related-h">Related</h2>
            <div className="grid-2">
              {others.map((o) => (
                <Link key={o.slug} className="card" to={o.path}>
                  <h3>{o.name}</h3>
                  <p>{o.short}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>

      <CtaBand
        title={`Talk to us about ${s.shortName}.`}
        interest={s.interest}
        secondary={{ to: '/services', label: 'All solutions' }}
      />
      <Footer />
    </div>
  )
}
