import { AREA_SERVED } from '../markets.js'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { SOLUTIONS, VOICE, contactHref } from '../data.js'
import { Crumbs, Footer, Faq, CtaBand } from '../chrome.jsx'
import { Seo, SITE_URL, ogFor, orgRef, graph, webPageLd, breadcrumbLd } from '../seo.jsx'
import { Transcript, Workflow } from '../visuals.jsx'
import { ICONS, IconTile } from '../icons.jsx'

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
    title: 'AI Receptionist & Lead Handling: Voice & WhatsApp Agents | ForgeQubit',
    description:
      'Voice and WhatsApp agents that answer enquiries in seconds, qualify prospects, book into your calendar and hand off to your team. Built on your number.',
  },
  'workflow-automation': {
    title: 'Workflow Automation & Integration Services | ForgeQubit',
    description:
      'Connected workflows across CRMs, accounting, helpdesks and internal tools. AI only where judgement is needed, with a person approving anything uncertain.',
  },
  'custom-ai-products': {
    title: 'Custom AI Product Development: Apps, Agents & SaaS | ForgeQubit',
    description:
      'Design and engineering for AI applications, agent systems and SaaS, with evaluation built in from day one. You own the code, prompts, data and infrastructure.',
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

/* which section is in view — drives aria-current on the in-page nav
   without ever moving keyboard focus */
function useCurrentSection(ids) {
  const [current, setCurrent] = useState(ids[0])
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean)
    const ratios = new Map()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) ratios.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0)
        let best = null
        let bestRatio = 0
        for (const el of els) {
          const r = ratios.get(el.id) || 0
          if (r > bestRatio) { best = el.id; bestRatio = r }
        }
        if (best) setCurrent(best)
      },
      { rootMargin: '-25% 0px -55% 0px', threshold: [0, 0.2, 0.5, 1] }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ids])
  return current
}

const HEADLINES = {
  'ai-reception': 'Every enquiry. Taken care of.',
  'workflow-automation': 'Give your team their time back.',
  'custom-ai-products': 'From your idea to everyday use.',
}

const SECTION_IDS = SECTIONS.map(([id]) => id)

export default function ServicePage({ solution: s }) {
  const meta = META[s.slug]
  const current = useCurrentSection(SECTION_IDS)
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
      areaServed: AREA_SERVED,
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
      <Seo title={meta.title} description={meta.description} path={s.path} jsonLd={jsonLd} image={ogFor(s.slug)} imageAlt={`ForgeQubit: ${s.name}`} />

      <header className="shell page-hero split">
        <div className="page-hero-copy">
          <Crumbs trail={[{ label: 'Solutions', to: '/services' }, { label: s.name }]} />
          <p className="eyebrow"><IconTile icon={ICONS[s.slug]} size="sm" /> {s.name}</p>
          <h1>{HEADLINES[s.slug]}</h1>
          <p className="lede">{s.short}</p>
          <div className="btn-row">
            <Link className="btn btn-primary" to={contactHref(s.interest)} data-track={`service-hero-${s.slug}`}>Discuss your project <span aria-hidden="true">→</span></Link>
            <a className="btn btn-secondary" href="#example">See the example</a>
          </div>
        </div>
        <aside className="glance" aria-label="At a glance">
          <div className="glance-head">
            <IconTile icon={ICONS[s.slug]} size="lg" />
            <div>
              <b>At a glance</b>
              <small>{s.tagline}</small>
            </div>
          </div>
          <dl>
            <div>
              <dt>Built for</dt>
              <dd>{s.who[0]}</dd>
            </div>
            <div>
              <dt>Connects to</dt>
              <dd>
                <ul className="pill-list compact">
                  {s.integrations.slice(0, 4).map((i) => <li key={i}>{i.split(' (')[0]}</li>)}
                </ul>
              </dd>
            </div>
            <div>
              <dt>First demo</dt>
              <dd>{s.delivery.expectation.split('. ')[0]}.</dd>
            </div>
            <div>
              <dt>You own</dt>
              <dd>Code, prompts, workflows and every third-party account, set up in your name.</dd>
            </div>
          </dl>
        </aside>
      </header>

      <div className="shell svc-layout" style={{ paddingTop: 12 }}>
        <details className="svc-nav-mobile">
          <summary>On this page</summary>
          <nav aria-label="On this page">
            {SECTIONS.map(([id, label]) => (
              <a key={id} href={`#${id}`} aria-current={current === id ? 'location' : undefined}>{label}</a>
            ))}
          </nav>
        </details>
        <nav className="svc-nav" aria-label="On this page">
          {SECTIONS.map(([id, label]) => (
            <a key={id} href={`#${id}`} aria-current={current === id ? 'location' : undefined}>{label}</a>
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
