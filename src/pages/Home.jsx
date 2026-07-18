import { useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, Scroll, Preload } from '@react-three/drei'
import Experience, { SECTIONS } from '../Experience.jsx'
import { EMAIL, useReveal } from '../chrome.jsx'
import { Seo } from '../seo.jsx'

const SERVICES = [
  {
    num: '01',
    cat: 'Conversational Infrastructure',
    title: <>WhatsApp <em>Automation</em></>,
    body: 'Two billion people live inside WhatsApp. We forge intelligent pipelines that live there with them — qualifying leads, closing sales, resolving support and remembering every conversation, around the clock.',
    tags: ['Lead Qualification', 'AI Sales Flows', 'Support Desks', 'Broadcast Engines', 'CRM Sync'],
    interest: 'WhatsApp Automation',
    align: 'right',
  },
  {
    num: '02',
    cat: 'Audio Intelligence',
    title: <>Voice <em>Agents</em></>,
    body: 'Agents that pick up the phone. Sub-second latency, natural interruption handling, and a voice tuned to your brand — booking appointments, screening calls and running outbound campaigns while you sleep.',
    tags: ['Inbound Reception', 'Outbound Campaigns', 'Appointment Booking', 'IVR Replacement', 'Call Analytics'],
    interest: 'Voice Agents',
    align: 'left',
  },
  {
    num: '03',
    cat: 'Embodied Presence',
    title: <>Avatar <em>Agents</em></>,
    body: 'A face for your intelligence. Photoreal and stylised avatars that speak, emote and hold eye contact — greeting visitors, training teams and presenting products with human warmth at machine scale.',
    tags: ['Digital Receptionists', 'Video Concierges', 'Training Personas', 'Lip-Sync Engines', 'Brand Characters'],
    interest: 'Avatar Agents',
    align: 'right',
  },
  {
    num: '04',
    cat: 'Bespoke Cognition',
    title: <>Custom <em>Agents</em></>,
    body: 'When off-the-shelf thinks off-the-shelf. We design agents around your exact workflows — multi-step reasoning, tool use, retrieval over your private knowledge — orchestrated swarms that run your operations.',
    tags: ['Agentic Workflows', 'RAG Pipelines', 'Tool Orchestration', 'Multi-Agent Swarms', 'Fine-Tuning'],
    interest: 'Custom Agents',
    align: 'left',
  },
  {
    num: '05',
    cat: 'Product Engineering',
    title: <>AI-Powered <em>SaaS</em></>,
    body: 'From napkin sketch to paying subscribers. We architect, design and ship full SaaS platforms with intelligence in their core — billing, auth, analytics and an AI engine your competitors can’t copy-paste.',
    tags: ['MVP in Weeks', 'Product Design', 'Scalable Backends', 'Usage Billing', 'AI-Native UX'],
    interest: 'AI-Powered SaaS',
    align: 'right',
  },
  {
    num: '06',
    cat: 'Decentralised Intelligence',
    title: <>AI <em>×</em> Blockchain</>,
    body: 'Where autonomous intelligence meets trustless rails. On-chain agents, AI-driven protocols, intelligent contract auditing and tokenised products — engineered for chains that never sleep.',
    tags: ['On-Chain Agents', 'Smart Contract AI', 'DeFi Automation', 'Token Analytics', 'Web3 Products'],
    interest: 'AI × Blockchain',
    align: 'left',
  },
]

/* NOTE: this tree renders inside drei's <Scroll html>, across a renderer
   boundary — router context is not available here, so navigation comes
   in as a prop and links are plain anchors. */
function Overlay({ navigate }) {
  const ref = useReveal()
  const go = (path) => (e) => {
    e.preventDefault()
    navigate(path)
  }
  return (
    <div className="overlay" ref={ref}>
      {/* 00 · hero */}
      <section className="panel center">
        <div className="hero-inner">
          <div className="hero-eyebrow">AI Agency — Est. in the Fire</div>
          <h1 className="hero-title">
            <span className="row"><span>We Forge</span></span>
            <span className="row"><span className="molten-text">Intelligence</span></span>
          </h1>
          <p className="hero-sub">Scroll down into the forge — six crafts, one obsession: agents that work while the world sleeps.</p>
          <div className="hero-actions">
            <a className="outro-cta hoverable" href="/contact" onClick={go('/contact')}>
              Start a Project <span>→</span>
            </a>
            <a className="ghost-cta hoverable" href="/case-studies" onClick={go('/case-studies')}>
              See the Work <span>→</span>
            </a>
          </div>
        </div>
        <div className="scroll-hint">
          <span>Descend</span>
          <span className="drip" />
        </div>
      </section>

      {/* 01 · manifesto */}
      <section className="panel center">
        <p className="manifesto reveal">
          <span className="manifesto-tag">The Manifesto</span>
          Every great product begins as <span className="molten-text">raw ore</span> — an idea, unshaped.
          We heat it with research, strike it with engineering, and quench it in production.
          What leaves our forge is not software. <span className="molten-text">It is leverage.</span>
        </p>
      </section>

      {/* 02–07 · services */}
      {SERVICES.map((s) => (
        <section key={s.num} className={`panel ${s.align}`}>
          <div className="service-card">
            <div className="service-index reveal">
              <span className="num">{s.num}</span>
              <span className="rule" />
              <span className="cat">{s.cat}</span>
            </div>
            <h2 className="service-title reveal d1">{s.title}</h2>
            <p className="service-body reveal d2">{s.body}</p>
            <ul className="service-tags reveal d3">
              {s.tags.map((t) => <li key={t}>{t}</li>)}
            </ul>
            <a
              className="service-cta reveal d3 hoverable"
              href={`/contact?interest=${encodeURIComponent(s.interest)}`}
              onClick={go(`/contact?interest=${encodeURIComponent(s.interest)}`)}
            >
              Forge this with us <span>→</span>
            </a>
          </div>
        </section>
      ))}

      {/* 08 · finale — the forge gate */}
      <section className="panel center">
        <div className="finale-inner">
          <div className="outro-kicker reveal">Final Chamber</div>
          <h2 className="outro-title reveal d1">
            Step through <span className="molten-text">the gate.</span>
          </h2>
          <p className="outro-serif reveal d2">Bring us the raw idea. Leave with the weapon.</p>
          <div className="finale-actions reveal d3">
            <a className="outro-cta hoverable" href="/contact" onClick={go('/contact')}>
              Start a Project <span>→</span>
            </a>
            <a className="ghost-cta hoverable" href="/case-studies" onClick={go('/case-studies')}>
              See the Work <span>→</span>
            </a>
          </div>
          <div className="outro-meta reveal d3">
            <span>ForgeQubit © 2026</span>
            <a className="hoverable" href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <span>Forged Worldwide</span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="home">
      <Seo
        title="ForgeQubit — AI Agency for WhatsApp, Voice & Custom AI Agents"
        description="ForgeQubit is a UK-registered AI agency serving Europe and the USA — shipping WhatsApp automation, voice agents, avatar agents, custom AI agents, AI-powered SaaS and AI × blockchain products."
        path="/"
      />

      {/* fixed chrome specific to the journey */}
      <div className="progress-track"><div className="progress-fill" id="progress-fill" /></div>
      <div className="hud">
        <span className="current" id="hud-current">01</span>
        <span className="total">/ {String(SECTIONS).padStart(2, '0')}</span>
      </div>
      <div className="hud-label">An Immersive Descent</div>

      {/* antialias off: the EffectComposer's multisampled buffer already
          handles AA — running canvas MSAA on top of it just costs frames */}
      <Canvas
        dpr={[1, 1.6]}
        camera={{ position: [0, 0, 13], fov: 42 }}
        gl={{ antialias: false, powerPreference: 'high-performance', stencil: false }}
      >
        <ScrollControls pages={SECTIONS} damping={0.32} maxSpeed={2}>
          <Experience />
          <Scroll html>
            <Overlay navigate={navigate} />
          </Scroll>
        </ScrollControls>
        {/* compile every station's shaders up front so nothing hitches
            the first time it scrolls into view */}
        <Preload all />
      </Canvas>
    </div>
  )
}
