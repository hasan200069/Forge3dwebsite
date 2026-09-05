import { Link } from 'react-router-dom'
import { DEMOS, SOLUTIONS, contactHref } from '../data.js'
import { Crumbs, Footer, CtaBand } from '../chrome.jsx'
import { Seo, SITE_URL, graph, webPageLd, breadcrumbLd } from '../seo.jsx'
import { Transcript, Workflow, CallSample } from '../visuals.jsx'

const TITLE = 'Work: Worked Examples of AI Reception & Automation | ForgeQubit'
const DESC =
  'Three worked examples of how we scope, build and measure AI reception, voice agent and automation projects. Clearly labelled illustrations, not client case studies.'

const JSON_LD = graph(
  webPageLd({ path: '/case-studies', title: TITLE, description: DESC, type: 'CollectionPage' }),
  breadcrumbLd([{ label: 'Work', path: '/case-studies' }]),
  {
    '@type': 'ItemList',
    '@id': `${SITE_URL}/case-studies#list`,
    name: 'Worked examples',
    itemListElement: DEMOS.map((d, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: d.title,
      url: `${SITE_URL}/case-studies#${d.slug}`,
    })),
  }
)

function Visual({ demo }) {
  const s = SOLUTIONS.find((x) => x.slug === demo.solution)
  if (demo.visual === 'chat') return <Transcript steps={s.example.steps} note={s.example.note} />
  if (demo.visual === 'flow') return <Workflow flow={s.example.flow} note={s.example.note} />
  return <CallSample />
}

export default function Work() {
  return (
    <div className="page">
      <Seo title={TITLE} description={DESC} path="/case-studies" jsonLd={JSON_LD} />

      <header className="shell page-hero">
        <Crumbs trail={[{ label: 'Work', to: '/case-studies' }]} />
        <p className="eyebrow">Work</p>
        <h1>Worked examples of how a project <span className="em">is scoped and measured.</span></h1>
        <p className="lede">
          Each example below shows the context, the scope we would agree, the system as it would
          behave, and the metrics we would define before launch, including the baseline and the
          measurement period.
        </p>
        <div className="evidence-note" style={{ marginTop: 26 }}>
          <strong>About evidence on this page</strong>
          <span>
            These are illustrations, not client case studies. We publish client results only with
            written permission, a stated baseline, a measurement period and a metric definition.
            Until those are published here, treat every figure you see elsewhere about our work as
            unverified and ask us for references on a call.
          </span>
        </div>
      </header>

      <section className="section tight" aria-label="Worked examples">
        <div className="shell">
          {DEMOS.map((d) => (
            <article key={d.slug} id={d.slug} className="demo" aria-labelledby={`demo-${d.slug}`}>
              <div>
                <header>
                  <div className="meta">
                    <b>{d.num}</b>
                    <span>{d.field}</span>
                    <span className="label-illustrative">Illustrative</span>
                  </div>
                  <h2 id={`demo-${d.slug}`}>{d.title}</h2>
                  <p className="context">{d.context}</p>
                </header>
                <div className="demo-blocks">
                  <div>
                    <h3>Scope</h3>
                    <ul className="list check">
                      {d.scope.map((s) => <li key={s}>{s}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h3>How it would be measured</h3>
                    <ul className="list">
                      {d.measures.map((m) => <li key={m}>{m}</li>)}
                    </ul>
                  </div>
                  <div>
                    <Link className="link-cta" to={contactHref(d.field === 'Voice Agents' ? 'Voice Agent' : d.field)}>
                      Discuss a project like this <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="demo-visual">
                <Visual demo={d} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <CtaBand
        title="Have something similar in mind?"
        body="Tell us the situation and which of these it resembles. We will come back with the questions we would need answered to scope it."
        secondary={{ to: '/services', label: 'All solutions' }}
      />
      <Footer />
    </div>
  )
}
