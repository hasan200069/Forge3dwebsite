import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { LogoMark } from './logo.jsx'

export const EMAIL = 'info@forgequbit.com'

export const NAV = [
  { to: '/services', label: 'Services', note: '01' },
  { to: '/case-studies', label: 'Work', note: '02' },
  { to: '/blog', label: 'Blog', note: '03' },
  { to: '/about', label: 'About', note: '04' },
  { to: '/contact', label: 'Contact', note: '05' },
]

const isActive = ({ isActive }) => (isActive ? 'active' : undefined)

/* ———————————————————— nav ———————————————————— */

export function Nav() {
  const [open, setOpen] = useState(false)
  const [stuck, setStuck] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    let ticking = false
    const read = () => {
      ticking = false
      setStuck(window.scrollY > 24)
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(read)
    }
    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* lock the page behind the menu without the classic jump-to-top:
     position:fixed on body would reset scrollY, so just stop overflow */
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <nav className={`nav ${stuck ? 'stuck' : ''}`} aria-label="Primary">
        <Link className="wordmark" to="/" aria-label="ForgeQubit — home">
          <LogoMark size={30} />
          <span className="wordmark-text">
            FORGE<span className="wordmark-accent">QUBIT</span>
          </span>
        </Link>

        <div className="nav-links">
          {NAV.slice(0, -1).map((l) => (
            <NavLink key={l.to} to={l.to} className={isActive}>{l.label}</NavLink>
          ))}
          <Link className="nav-cta" to="/contact">Start a Project</Link>
        </div>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="nav-sheet"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* inert keeps the closed sheet out of the tab order and out of
          the accessibility tree without a display:none transition */}
      <div className={`nav-sheet ${open ? 'open' : ''}`} id="nav-sheet" inert={!open}>
        {NAV.map((l) => (
          <NavLink key={l.to} to={l.to} className={isActive}>
            {l.label}
            <span>{l.note}</span>
          </NavLink>
        ))}
        <div className="nav-sheet-foot">
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <Link className="btn btn-primary" to="/contact">Start a Project <span>→</span></Link>
        </div>
      </div>
    </>
  )
}

/* ———————————————————— footer ———————————————————— */

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-brand">
          <Link className="wordmark small" to="/">
            <LogoMark size={26} />
            <span className="wordmark-text">
              FORGE<span className="wordmark-accent">QUBIT</span>
            </span>
          </Link>
          <p>
            A UK-registered AI agency building WhatsApp automation, voice agents and
            AI-powered products for teams across the UK, Europe and the United States.
          </p>
          <a className="link-cta" href={`mailto:${EMAIL}`}>{EMAIL} <span>→</span></a>
        </div>

        <div className="footer-cols">
          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              <li><Link to="/services">WhatsApp Automation</Link></li>
              <li><Link to="/services">Voice Agents</Link></li>
              <li><Link to="/services">Avatar Agents</Link></li>
              <li><Link to="/services">Custom AI Agents</Link></li>
              <li><Link to="/services">AI-Powered SaaS</Link></li>
              <li><Link to="/services">AI × Blockchain</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/case-studies">Case Studies</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-base">
        <span>ForgeQubit © 2026 — Forged Worldwide</span>
        <span>United Kingdom · Europe · United States</span>
      </div>
    </footer>
  )
}

/* ———————————————————— cursor ———————————————————— */

/* Writes transforms straight to the DOM — no React state, so the tree
   never re-renders while the mouse moves. */
export function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || still) return

    document.documentElement.classList.add('has-custom-cursor')

    // both parts start parked off-screen, so there's nothing to reveal
    // and nothing to strand — they simply arrive with the first move
    const pos = { x: -100, y: -100 }
    const ringPos = { x: -100, y: -100 }
    let last = performance.now()
    let raf = 0

    /* Written on the event rather than on the next frame, so the dot
       stays locked to the real pointer 1:1.

       Note this sets the `translate` property, not `transform`: the
       composite order is translate × rotate × scale × transform, so a
       position written to `transform` lands inside the hover `scale`
       and gets multiplied by it. `translate` sits outside the scale. */
    const onMove = (e) => {
      pos.x = e.clientX
      pos.y = e.clientY
      if (dot.current) dot.current.style.translate = `${pos.x}px ${pos.y}px`
    }

    /* hover state comes from pointerover, not from a hit-test on every
       move — `closest()` per move was measurable on long pages */
    const HOT = 'a, button, summary, input, select, textarea, [data-hot]'
    const onOver = (e) => {
      const hot = !!(e.target instanceof Element && e.target.closest(HOT))
      dot.current?.classList.toggle('is-hot', hot)
      ring.current?.classList.toggle('is-hot', hot)
    }

    // only the ring is smoothed; the dot is exact
    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      // framerate-independent, so the trail is identical at 60 and 120 Hz
      const k = 1 - Math.exp(-13 * dt)
      ringPos.x += (pos.x - ringPos.x) * k
      ringPos.y += (pos.y - ringPos.y) * k
      if (ring.current) ring.current.style.translate = `${ringPos.x}px ${ringPos.y}px`
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })
    raf = requestAnimationFrame(tick)

    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div className="cursor" ref={dot} aria-hidden="true" style={{ translate: '-100px -100px' }} />
      <div className="cursor-ring" ref={ring} aria-hidden="true" style={{ translate: '-100px -100px' }} />
    </>
  )
}

/* ———————————————————— reveal ———————————————————— */

/* Observes .reveal descendants and adds .visible once — unlike the old
   toggle, elements don't re-animate when they scroll back into view,
   which was both distracting and extra compositor work. */
export function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const root = ref.current
    if (!root) return

    const targets = root.querySelectorAll('.reveal')
    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('visible'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          e.target.classList.add('visible')
          io.unobserve(e.target)
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
    )
    targets.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return ref
}

/* ———————————————————— breadcrumbs ———————————————————— */

export function Crumbs({ trail }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <Link to="/">Home</Link>
      {trail.map((c, i) => (
        <span key={c.label} style={{ display: 'contents' }}>
          <span className="sep" aria-hidden="true">/</span>
          {i === trail.length - 1 || !c.to
            ? <span aria-current="page">{c.label}</span>
            : <Link to={c.to}>{c.label}</Link>}
        </span>
      ))}
    </nav>
  )
}
