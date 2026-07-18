import { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, Scroll } from '@react-three/drei'
import Experience, { SECTIONS } from './Experience.jsx'

const SERVICES = [
  {
    num: '01',
    cat: 'Conversational Infrastructure',
    title: <>WhatsApp <em>Automation</em></>,
    body: 'Two billion people live inside WhatsApp. We forge intelligent pipelines that live there with them — qualifying leads, closing sales, resolving support and remembering every conversation, around the clock.',
    tags: ['Lead Qualification', 'AI Sales Flows', 'Support Desks', 'Broadcast Engines', 'CRM Sync'],
    align: 'right',
  },
  {
    num: '02',
    cat: 'Audio Intelligence',
    title: <>Voice <em>Agents</em></>,
    body: 'Agents that pick up the phone. Sub-second latency, natural interruption handling, and a voice tuned to your brand — booking appointments, screening calls and running outbound campaigns while you sleep.',
    tags: ['Inbound Reception', 'Outbound Campaigns', 'Appointment Booking', 'IVR Replacement', 'Call Analytics'],
    align: 'left',
  },
  {
    num: '03',
    cat: 'Embodied Presence',
    title: <>Avatar <em>Agents</em></>,
    body: 'A face for your intelligence. Photoreal and stylised avatars that speak, emote and hold eye contact — greeting visitors, training teams and presenting products with human warmth at machine scale.',
    tags: ['Digital Receptionists', 'Video Concierges', 'Training Personas', 'Lip-Sync Engines', 'Brand Characters'],
    align: 'right',
  },
  {
    num: '04',
    cat: 'Bespoke Cognition',
    title: <>Custom <em>Agents</em></>,
    body: 'When off-the-shelf thinks off-the-shelf. We design agents around your exact workflows — multi-step reasoning, tool use, retrieval over your private knowledge — orchestrated swarms that run your operations.',
    tags: ['Agentic Workflows', 'RAG Pipelines', 'Tool Orchestration', 'Multi-Agent Swarms', 'Fine-Tuning'],
    align: 'left',
  },
  {
    num: '05',
    cat: 'Product Engineering',
    title: <>AI-Powered <em>SaaS</em></>,
    body: 'From napkin sketch to paying subscribers. We architect, design and ship full SaaS platforms with intelligence in their core — billing, auth, analytics and an AI engine your competitors can’t copy-paste.',
    tags: ['MVP in Weeks', 'Product Design', 'Scalable Backends', 'Usage Billing', 'AI-Native UX'],
    align: 'right',
  },
  {
    num: '06',
    cat: 'Decentralised Intelligence',
    title: <>AI <em>×</em> Blockchain</>,
    body: 'Where autonomous intelligence meets trustless rails. On-chain agents, AI-driven protocols, intelligent contract auditing and tokenised products — engineered for chains that never sleep.',
    tags: ['On-Chain Agents', 'Smart Contract AI', 'DeFi Automation', 'Token Analytics', 'Web3 Products'],
    align: 'left',
  },
]

function Overlay() {
  const ref = useRef()
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle('visible', e.isIntersecting)),
      { threshold: 0.25 }
    )
    ref.current.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

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
          </div>
        </section>
      ))}

      {/* 08 · outro */}
      <section className="panel center">
        <div className="outro-inner">
          <div className="outro-kicker reveal">Final Chamber</div>
          <h2 className="outro-title reveal d1">
            The forge <span className="molten-text">is lit.</span>
          </h2>
          <p className="outro-serif reveal d2">Bring us the raw idea. Leave with the weapon.</p>
          <a className="outro-cta reveal d3 hoverable" href="mailto:hasankamal839@gmail.com">
            Start a Project <span>→</span>
          </a>
          <div className="outro-meta reveal d3">
            <span>ForgeQubit © 2026</span>
            <a className="hoverable" href="mailto:hasankamal839@gmail.com">hasankamal839@gmail.com</a>
            <span>Forged Worldwide</span>
          </div>
        </div>
      </section>
    </div>
  )
}

function Cursor() {
  const dot = useRef()
  const ring = useRef()
  useEffect(() => {
    const pos = { x: -100, y: -100 }
    const ringPos = { x: -100, y: -100 }
    let raf
    const move = (e) => {
      pos.x = e.clientX
      pos.y = e.clientY
      dot.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`
      const hoverable = e.target.closest('a, button, .hoverable, li')
      dot.current.classList.toggle('hovering', !!hoverable)
    }
    const tick = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.12
      ringPos.y += (pos.y - ringPos.y) * 0.12
      ring.current.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px)`
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('mousemove', move)
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(raf)
    }
  }, [])
  return (
    <>
      <div className="cursor" ref={dot} style={{ transform: 'translate(-100px,-100px)' }} />
      <div className="cursor-ring" ref={ring} style={{ transform: 'translate(-100px,-100px)' }} />
    </>
  )
}

export default function App() {
  return (
    <div className="app">
      {/* intro flash */}
      <div className="intro">
        <div className="intro-mark"><span>FORGE<span className="molten-text">QUBIT</span></span></div>
        <div className="intro-line" />
      </div>

      {/* fixed chrome */}
      <div className="progress-track"><div className="progress-fill" id="progress-fill" /></div>
      <nav className="nav">
        <a className="wordmark" href="#top">
          <span className="spark" />
          FORGE<span className="qubit">QUBIT</span>
        </a>
        <a className="nav-cta" href="mailto:hasankamal839@gmail.com">Start a Project</a>
      </nav>
      <div className="hud">
        <span className="current" id="hud-current">01</span>
        <span className="total">/ 0{SECTIONS}</span>
      </div>
      <div className="hud-label">An Immersive Descent</div>
      <div className="grain" />
      <Cursor />

      {/* the forge */}
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 13], fov: 42 }} gl={{ antialias: true }}>
        <ScrollControls pages={SECTIONS} damping={0.28}>
          <Experience />
          <Scroll html>
            <Overlay />
          </Scroll>
        </ScrollControls>
      </Canvas>
    </div>
  )
}
