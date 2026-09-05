import { Link } from 'react-router-dom'
import { SOLUTIONS, CAPABILITIES, PROCESS, ENGINEERING, FAQS, POSTS, contactHref } from '../data.js'
import { EMAIL, Footer, Faq, CtaBand } from '../chrome.jsx'
import { Seo, SITE_URL, SITE_NAME, ORG_ID, orgRef, graph, webPageLd } from '../seo.jsx'
import { EnquiryFlow, Transcript, Workflow, ToolStrip } from '../visuals.jsx'

const TITLE = 'ForgeQubit — AI Reception, Workflow Automation & Custom AI Products'
const DESC =
  'ForgeQubit builds voice and WhatsApp agents that answer customers, automations that connect your business tools, and custom AI products. UK-registered, working with clients in the UK, Europe and the US.'

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
  webPageLd({ path: '/', title: TITLE, description: DESC })
)

const featured = SOLUTIONS[0]
const invoice = SOLUTIONS[1]

/* ———————————————————— page ———————————————————— */

export default function Home() {
  return (
    <div className="home">
      <Seo title={TITLE} description={DESC} path="/" jsonLd={JSON_LD} />

      {/* ———— 1. hero ———— */}
      <section className="hero" aria-labelledby="hero-h">
        <div className="hero-aurora" aria-hidden="true"><i /><i /></div>
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Voice · WhatsApp · Automation · AI products</p>
            <h1 id="hero-h">
              AI systems that answer customers and <span className="em">move work forward.</span>
            </h1>
            <p className="lede">
              ForgeQubit builds voice and WhatsApp agents that answer enquiries and book appointments,
              connects the tools your team already uses, and develops custom AI products when
              off-the-shelf software is not enough.
            </p>
            <div className="btn-row">
              <Link className="btn btn-primary" to="/contact" data-track="hero-primary">Discuss your project <span aria-hidden="true">→</span></Link>
              <Link className="btn btn-secondary" to="/services" data-track="hero-secondary">Explore our solutions</Link>
            </div>
            <ul className="hero-strip" aria-label="How we work">
              <li>Fixed-scope proposals</li>
              <li>Weekly working demos</li>
              <li>You own the code and accounts</li>
              <li>UK-registered</li>
            </ul>
          </div>
          <EnquiryFlow />
        </div>
      </section>

      {/* ———— integrations strip ———— */}
      <section className="section tight" aria-labelledby="tools-h" style={{ paddingBlock: 'clamp(28px, 4vw, 44px)' }}>
        <div className="shell">
          <h2 id="tools-h" className="eyebrow plain" style={{ marginBottom: 14 }}>Connects to the tools you already run</h2>
        </div>
        <ToolStrip />
      </section>

      {/* ———— 2. evidence: delivery practices ———— */}
      <section className="section alt tight" aria-labelledby="proof-h">
        <div className="shell">
          <div className="section-head split">
            <div>
              <p className="eyebrow">What you can check</p>
              <h2 id="proof-h">Specific practices, <span className="em">not promises.</span></h2>
            </div>
            <p className="lede">
              We are building our public case studies with client permission. Until they are
              published, here is what every engagement includes and what you can hold us to.
            </p>
          </div>
          <div className="grid-3">
            <div className="card">
              <span className="num">01</span>
              <h3>A written scope before any invoice</h3>
              <p>Outcomes, integrations, price and an estimate of ongoing third-party costs, so you know what you are buying.</p>
            </div>
            <div className="card">
              <span className="num">02</span>
              <h3>A working demo every week</h3>
              <p>You see the real system on test numbers or staging, and you supply the real examples we test it against.</p>
            </div>
            <div className="card">
              <span className="num">03</span>
              <h3>Handover you can live with</h3>
              <p>Accounts in your name, code in your repositories, documentation for changes, and a defined route to a person when the AI stops.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ———— 3. three primary solutions ———— */}
      <section className="section" aria-labelledby="solutions-h">
        <div className="shell">
          <div className="section-head">
            <p className="eyebrow">Solutions</p>
            <h2 id="solutions-h">Three things we build, <span className="em">start to finish.</span></h2>
            <p className="lede">
              Most clients start with reception and lead handling. Operations teams usually add
              automation next. Founders and product teams come to us for the third.
            </p>
          </div>

          <div className="solutions">
            {SOLUTIONS.map((s) => (
              <article key={s.slug} className="solution" aria-labelledby={`sol-${s.slug}`}>
                <span className="num">{s.num}</span>
                <h3 id={`sol-${s.slug}`}>{s.name}</h3>
                <dl>
                  <div><dt>The problem</dt><dd>{s.problem}</dd></div>
                  <div><dt>What we build</dt><dd>{s.build}</dd></div>
                  <div><dt>Intended outcome</dt><dd>{s.outcome}</dd></div>
                </dl>
                {/* the whole card is clickable via the stretched link, but
                    the accessible name stays short */}
                <Link className="link-cta stretch" to={s.path} data-track={`solution-${s.slug}`}>
                  Explore {s.shortName} <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>

          <div className="capabilities" id="capabilities">
            {CAPABILITIES.map((c) => (
              <div key={c.id} className="capability">
                <span className="tag">Specialist</span>
                <div>
                  <h3>{c.name}</h3>
                  <p>{c.short}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ———— 4. featured demonstration ———— */}
      <section className="section alt" aria-labelledby="feature-h">
        <div className="shell">
          <div className="feature">
            <div>
              <span className="label-illustrative">Illustrative build, not client work</span>
              <h2 id="feature-h">Enquiry to booked viewing, with the CRM kept honest.</h2>
              <p className="lede">
                A worked example of what a reception project looks like for a lettings team: the
                scope we would agree, the conversation the agent holds, and the numbers we would
                measure. Every figure would come from your own systems, with the baseline recorded
                before launch.
              </p>
              <div className="feature-meta">
                <div>
                  <h3>Scope</h3>
                  <ul className="list">
                    <li>WhatsApp agent on the official Business Platform, fluent in current listings.</li>
                    <li>Qualifying questions and viewing bookings straight into negotiator calendars.</li>
                    <li>CRM record updated with intent and timeline; a person alerted for hot leads.</li>
                    <li>Handoff to a negotiator on request or when confidence is low.</li>
                  </ul>
                </div>
                <div>
                  <h3>What we would measure</h3>
                  <ul className="list">
                    <li>First response time, from customer message to first reply.</li>
                    <li>Enquiries qualified: a completed set of qualifying answers.</li>
                    <li>Viewings booked per week, before and after, over a matched period.</li>
                    <li>Handoff rate and the reasons, reviewed weekly with you.</li>
                  </ul>
                </div>
              </div>
              <div className="btn-row" style={{ marginTop: 26 }}>
                <Link className="btn btn-secondary" to="/case-studies">See more worked examples</Link>
                <Link className="link-cta" to={contactHref(featured.interest)} data-track="feature-enquiry">Discuss a reception project <span aria-hidden="true">→</span></Link>
              </div>
            </div>
            <Transcript steps={featured.example.steps} note={featured.example.note} />
          </div>
        </div>
      </section>

      {/* ———— 5. delivery process ———— */}
      <section className="section" aria-labelledby="process-h">
        <div className="shell">
          <div className="section-head split">
            <div>
              <p className="eyebrow">How a project runs</p>
              <h2 id="process-h">Four stages, with responsibilities <span className="em">written down.</span></h2>
            </div>
            <p className="lede">
              Each stage has a deliverable you can see. If discovery shows AI is the wrong tool for
              your problem, we say so and stop there.
            </p>
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
        </div>
      </section>

      {/* ———— 6. engineering approach and team ———— */}
      <section className="section alt" aria-labelledby="approach-h">
        <div className="shell approach">
          <div>
            <p className="eyebrow">Engineering approach</p>
            <h2 id="approach-h">Integrated, tested, monitored, <span className="em">handed over.</span></h2>
            <p className="lede" style={{ marginTop: 14 }}>
              Language models are one component. The work that makes a system dependable is the
              integration, the testing and the handoff rules around it.
            </p>
            <div className="team-note">
              <h3>Who you work with</h3>
              <p>
                ForgeQubit is an engineer-led studio. The people who scope your project are the
                people who build it, and you have a named engineer as your point of contact from the
                first call to handover.
              </p>
              <p>
                <Link to="/about">More about how we work →</Link>
              </p>
            </div>
          </div>
          <div>
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
            <div style={{ marginTop: 22 }}>
              <Workflow flow={invoice.example.flow} note="Illustrative automation with an approval step. Uncertain cases go to a person, never guessed." />
            </div>
          </div>
        </div>
      </section>

      {/* ———— 7. faqs ———— */}
      <section className="section" aria-labelledby="faq-h">
        <div className="shell faq-grid">
          <div>
            <p className="eyebrow">Questions</p>
            <h2 id="faq-h">Costs, timelines, integrations and <span className="em">what happens when it fails.</span></h2>
            <p className="lede" style={{ marginTop: 14 }}>
              Straight answers to the questions we are asked most. Anything else, ask on the call.
            </p>
            <div className="btn-row" style={{ marginTop: 22 }}>
              <Link className="btn btn-secondary" to="/services">All solutions</Link>
            </div>
          </div>
          <Faq items={FAQS} />
        </div>
      </section>

      {/* ———— writing ———— */}
      <section className="section alt tight" aria-labelledby="notes-h">
        <div className="shell">
          <div className="section-head split">
            <div>
              <p className="eyebrow">Writing</p>
              <h2 id="notes-h">Notes for operators.</h2>
            </div>
            <p className="lede">Practical writing on reception agents, automation and building AI products.</p>
          </div>
          <div className="blog-list">
            {POSTS.map((p) => (
              <Link key={p.slug} className="card post-card" to={`/blog/${p.slug}`}>
                <div className="post-meta">
                  <span className="post-tag">{p.tag}</span>
                  <span>{p.readTime}</span>
                </div>
                <h3>{p.title}</h3>
                <p>{p.excerpt}</p>
                <span className="post-more">Read the note →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ———— 8. final cta ———— */}
      <CtaBand
        title="Tell us what your team is dealing with."
        body="Send a short description of the enquiries, process or product you have in mind. We reply by email to arrange a call, then send a written scope and price. No commitment until you sign a proposal."
        secondary={{ to: `mailto:${EMAIL}`, label: EMAIL }}
      />

      <Footer />
    </div>
  )
}
