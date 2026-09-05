import { Link } from 'react-router-dom'
import { PROCESS, ENGINEERING, TEAM, COMPANY } from '../data.js'
import { Crumbs, EMAIL, Footer, CtaBand } from '../chrome.jsx'
import { Seo, graph, webPageLd, breadcrumbLd } from '../seo.jsx'

const TITLE = 'About ForgeQubit: An Engineer-Led AI Studio'
const DESC =
  'A UK-registered, engineer-led studio building voice and WhatsApp agents, workflow automation and custom AI products. How we work and what we commit to.'

const JSON_LD = graph(
  webPageLd({ path: '/about', title: TITLE, description: DESC, type: 'AboutPage' }),
  breadcrumbLd([{ label: 'About', path: '/about' }])
)

const COMMITMENTS = [
  {
    t: 'We tell you when AI is the wrong tool',
    d: 'Some problems are a process problem or a staffing problem. If discovery shows that, we say so and stop before a proposal.',
  },
  {
    t: 'Everything is measured against a definition you agreed',
    d: 'Before launch we write down the metric, the baseline and the measurement period. Results are reported against that, not against a headline.',
  },
  {
    t: 'Your accounts, your code, your data',
    d: 'Third-party services are set up in your name. Deliverables are assigned to you on payment. Nothing is designed to lock you in.',
  },
  {
    t: 'People stay in the loop',
    d: 'Every agent has limits and a route to a person. Automations send uncertain cases to a named approver rather than guessing.',
  },
]

export default function About() {
  return (
    <div className="page">
      <Seo title={TITLE} description={DESC} path="/about" jsonLd={JSON_LD} />

      <header className="shell page-hero split">
        <div className="page-hero-copy">
          <Crumbs trail={[{ label: 'About', to: '/about' }]} />
          <p className="eyebrow">About</p>
          <h1>An engineer-led studio for AI systems <span className="em">that have to keep working.</span></h1>
          <p className="lede">
            ForgeQubit exists because too many AI projects end as demos. We build reception agents,
            automations and products that are integrated with the tools you already use, tested
            against real scenarios, and handed over properly.
          </p>
        </div>
        <dl className="facts glance" aria-label="Company facts">
          <div><dt>Company</dt><dd>{COMPANY.legalName}, registered in the {COMPANY.registeredIn}</dd></div>
          {COMPANY.companyNumber && (
            <div>
              <dt>Company no.</dt>
              <dd>
                <a href={`https://find-and-update.company-information.service.gov.uk/company/${COMPANY.companyNumber}`} rel="noopener">
                  {COMPANY.companyNumber}
                </a>
              </dd>
            </div>
          )}
          {COMPANY.registeredOffice && <div><dt>Registered office</dt><dd>{COMPANY.registeredOffice}</dd></div>}
          {COMPANY.founded && <div><dt>Founded</dt><dd>{COMPANY.founded}</dd></div>}
          <div><dt>Works with</dt><dd>Service businesses, operations teams, founders and product teams</dd></div>
          <div><dt>Regions</dt><dd>United Kingdom, Europe, United States (remote)</dd></div>
          <div><dt>Contact</dt><dd><a href={`mailto:${EMAIL}`}>{EMAIL}</a></dd></div>
          <div><dt>Engagements</dt><dd>Fixed-scope proposals, weekly demos, deliverables assigned to you on payment</dd></div>
        </dl>
      </header>

      <section className="section tight" aria-labelledby="who-h">
        <div className="shell about-grid">
          <div className="about-body">
            <h2 id="who-h" style={{ marginBottom: 16 }}>Who you deal with</h2>
            <p>
              The engineers who scope your project are the ones who build it. From the first call
              to handover you have one named engineer as your point of contact, who is accountable
              for the scope, the weekly demos and the handover checklist.
            </p>
            <p>
              We are model-agnostic and platform-agnostic. Language models, telephony providers
              and workflow tools are chosen per project for quality, latency and cost, and set up
              in accounts you control.
            </p>
            <p>
              We are UK-registered and work remotely with clients in the United Kingdom, Europe and
              the United States, overlapping with both European and US business hours.
            </p>
          </div>
          <div className="glance">
            <div className="glance-head">
              <div>
                <b>What you can hold us to</b>
                <small>In every proposal, in writing</small>
              </div>
            </div>
            <ul className="list check">
              <li>A written scope and price before any invoice.</li>
              <li>A working demo every week, tested against your examples.</li>
              <li>A defined route to a person for every agent.</li>
              <li>Accounts, code and documentation handed over in your name.</li>
            </ul>
          </div>
        </div>
      </section>

      {TEAM.length > 0 && (
        <section className="section alt" aria-labelledby="team-h">
          <div className="shell">
            <div className="section-head">
              <p className="eyebrow">People</p>
              <h2 id="team-h">Who builds your system.</h2>
            </div>
            <div className="grid-3 team">
              {TEAM.map((p) => (
                <article key={p.name} className="card person">
                  {p.photo && <img src={p.photo} alt="" width="96" height="96" loading="lazy" />}
                  <h3>{p.name}</h3>
                  <p className="role">{p.role}</p>
                  {p.bio && <p>{p.bio}</p>}
                  {p.links?.length > 0 && (
                    <ul className="person-links">
                      {p.links.map((l) => (
                        <li key={l.href}><a href={l.href} rel="noopener">{l.label}</a></li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section alt" aria-labelledby="commit-h">
        <div className="shell">
          <div className="section-head">
            <p className="eyebrow">Commitments</p>
            <h2 id="commit-h">What we hold ourselves to.</h2>
          </div>
          <div className="grid-2">
            {COMMITMENTS.map((c, i) => (
              <div key={c.t} className="card">
                <span className="num">0{i + 1}</span>
                <h3>{c.t}</h3>
                <p>{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="eng-h">
        <div className="shell">
          <div className="section-head split">
            <div>
              <p className="eyebrow">Engineering approach</p>
              <h2 id="eng-h">How systems are integrated, tested, monitored and handed over.</h2>
            </div>
            <p className="lede">The unglamorous work is what makes an AI system dependable. It is written into every scope.</p>
          </div>
          <div className="approach-list">
            {ENGINEERING.map((e, i) => (
              <div key={e.t} className="approach-item">
                <span className="k" aria-hidden="true">0{i + 1}</span>
                <div>
                  <h3>{e.t}</h3>
                  <p>{e.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt" aria-labelledby="process-h" id="process">
        <div className="shell">
          <div className="section-head">
            <p className="eyebrow">How a project runs</p>
            <h2 id="process-h">Discover, scope, build, launch and support.</h2>
          </div>
          <ol className="process" aria-label="Delivery stages">
            {PROCESS.map((s) => (
              <li key={s.n} className="step">
                <span className="n">{s.n}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
                <dl>
                  <div><dt>You</dt><dd>{s.you}</dd></div>
                  <div><dt>We</dt><dd>{s.we}</dd></div>
                  <div><dt>Deliverable</dt><dd>{s.out}</dd></div>
                </dl>
              </li>
            ))}
          </ol>
          <p className="muted" style={{ marginTop: 22 }}>
            See <Link to="/case-studies">worked examples</Link> of how this plays out for reception,
            voice and automation projects.
          </p>
        </div>
      </section>

      <CtaBand
        title="Start with a short conversation."
        body="Describe the problem in a few sentences. We reply by email to set up a call, and if we are not the right fit we will say so."
        secondary={{ to: '/services', label: 'All solutions' }}
      />
      <Footer />
    </div>
  )
}
