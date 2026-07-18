import { Link } from 'react-router-dom'
import { Footer, useReveal } from '../chrome.jsx'
import { Seo, SITE_URL } from '../seo.jsx'

const SERVICES = [
  {
    num: '01',
    cat: 'Conversational Infrastructure',
    title: 'WhatsApp Automation',
    body: 'Two billion people live inside WhatsApp — and they expect answers in seconds, not hours. We build intelligent WhatsApp agents on the official Business API that qualify leads, close sales, resolve support tickets and remember every conversation, twenty-four hours a day. Every message syncs to your CRM, every hot lead gets escalated, and nothing ever sits unanswered overnight.',
    deliverables: ['Lead Qualification', 'AI Sales Flows', 'Support Desks', 'Broadcast Engines', 'CRM Sync'],
  },
  {
    num: '02',
    cat: 'Audio Intelligence',
    title: 'Voice Agents',
    body: 'AI agents that pick up the phone. Sub-second latency, natural interruption handling, and a voice tuned to your brand — booking appointments, screening calls, replacing brittle IVR menus and running outbound campaigns while you sleep. Edge cases hand off to a human with a full transcript, so nobody ever repeats themselves.',
    deliverables: ['Inbound Reception', 'Outbound Campaigns', 'Appointment Booking', 'IVR Replacement', 'Call Analytics'],
  },
  {
    num: '03',
    cat: 'Embodied Presence',
    title: 'Avatar Agents',
    body: 'A face for your intelligence. Photoreal and stylised digital avatars that speak, emote and hold eye contact — greeting website visitors, onboarding customers, training teams and presenting products with human warmth at machine scale. Real-time lip-sync, brand-matched personas, and scripts that adapt to the person watching.',
    deliverables: ['Digital Receptionists', 'Video Concierges', 'Training Personas', 'Lip-Sync Engines', 'Brand Characters'],
  },
  {
    num: '04',
    cat: 'Bespoke Cognition',
    title: 'Custom AI Agents',
    body: 'When off-the-shelf thinks off-the-shelf. We design agents around your exact workflows: multi-step reasoning, tool use, retrieval over your private knowledge, and orchestrated multi-agent swarms that run entire operations. Built model-agnostic, deployed on your infrastructure or ours, with evaluation harnesses so you can trust what ships.',
    deliverables: ['Agentic Workflows', 'RAG Pipelines', 'Tool Orchestration', 'Multi-Agent Swarms', 'Fine-Tuning'],
  },
  {
    num: '05',
    cat: 'Product Engineering',
    title: 'AI-Powered SaaS',
    body: 'From napkin sketch to paying subscribers. We architect, design and ship complete SaaS platforms with intelligence at the core — authentication, usage-based billing, analytics and an AI engine your competitors cannot copy-paste. Product design sprints first, weekly demos throughout, an MVP in weeks rather than quarters.',
    deliverables: ['MVP in Weeks', 'Product Design', 'Scalable Backends', 'Usage Billing', 'AI-Native UX'],
  },
  {
    num: '06',
    cat: 'Decentralised Intelligence',
    title: 'AI × Blockchain',
    body: 'Where autonomous intelligence meets trustless rails. On-chain agents, AI-driven DeFi protocols, intelligent smart-contract auditing and tokenised products — engineered for chains that never sleep. We combine agentic AI with battle-tested web3 engineering so your protocol thinks as fast as it settles.',
    deliverables: ['On-Chain Agents', 'Smart Contract AI', 'DeFi Automation', 'Token Analytics', 'Web3 Products'],
  },
]

const FAQS = [
  {
    q: 'How fast can you ship an AI agent?',
    a: 'Most WhatsApp and voice agent deployments go live in two to four weeks. A full AI-powered SaaS platform typically ships its first working MVP in about six weeks, with weekly demos from week one.',
  },
  {
    q: 'Which AI models and platforms do you work with?',
    a: 'We are model-agnostic. We build on Claude, GPT-class models and open-weight models, choosing per use case for quality, latency and cost. Your data stays yours, and we can deploy on your cloud or ours.',
  },
  {
    q: 'Can your agents integrate with our existing CRM, calendar or phone system?',
    a: 'Yes. Integration is the core of every build: CRMs, calendars, EHRs, help desks, payment systems and existing telephony. Agents read from and write to the tools your team already uses.',
  },
  {
    q: 'Do your agents support languages other than English?',
    a: 'Yes. WhatsApp, voice and avatar agents can operate fluently in dozens of languages and switch language mid-conversation based on how the customer writes or speaks.',
  },
  {
    q: 'How is a project priced?',
    a: 'After a short discovery call we send a fixed-scope proposal with defined outcomes, honest timelines and no mystery invoices. You know the cost before we strike the first blow.',
  },
  {
    q: 'Who owns the intellectual property?',
    a: 'You do. Everything we forge for you — code, prompts, workflows, designs — is delivered under your ownership at handover.',
  },
]

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ItemList',
      name: 'ForgeQubit AI Services',
      itemListElement: SERVICES.map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Service',
          name: s.title,
          description: s.body,
          serviceType: s.title,
          provider: { '@id': `${SITE_URL}/#organization` },
        },
      })),
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
}

export default function Services() {
  const ref = useReveal()
  return (
    <div className="page" ref={ref}>
      <Seo
        title="AI Services — WhatsApp Automation, Voice Agents & AI SaaS | ForgeQubit"
        description="Six crafts, one obsession: WhatsApp automation, voice agents, avatar agents, custom AI agents, AI-powered SaaS and AI × blockchain — designed, built and shipped by ForgeQubit."
        path="/services"
        jsonLd={JSON_LD}
      />
      <div className="page-inner">
        <header className="page-hero">
          <div className="page-kicker rise">Six Crafts</div>
          <h1 className="page-title rise d1">What we <span className="molten-text">forge.</span></h1>
          <p className="page-sub rise d2">
            Every service below leaves as a working system, not a slide deck —
            integrated with your tools, measured against your numbers.
          </p>
        </header>

        <div className="svc-list">
          {SERVICES.map((s) => (
            <article key={s.num} className="svc-card reveal">
              <div className="service-index">
                <span className="num">{s.num}</span>
                <span className="rule" />
                <span className="cat">{s.cat}</span>
              </div>
              <h2 className="svc-title">{s.title}</h2>
              <p className="svc-body">{s.body}</p>
              <ul className="service-tags">
                {s.deliverables.map((t) => <li key={t}>{t}</li>)}
              </ul>
              <Link
                className="service-cta hoverable"
                to={`/contact?interest=${encodeURIComponent(s.title === 'Custom AI Agents' ? 'Custom Agents' : s.title)}`}
              >
                Forge this with us <span>→</span>
              </Link>
            </article>
          ))}
        </div>

        <section className="section-block reveal">
          <div className="page-kicker">Questions, Answered</div>
          <h2 className="section-title">Before you <span className="molten-text">ask.</span></h2>
          <div className="faq-list">
            {FAQS.map((f) => (
              <details key={f.q} className="faq hoverable">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="page-cta reveal">
          <h2>Pick a craft. <span className="molten-text">Or bring a new one.</span></h2>
          <Link className="outro-cta hoverable" to="/contact">Start a Project <span>→</span></Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}
