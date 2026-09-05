import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { LogoMark, WordmarkText } from './logo.jsx'
import { SOLUTIONS, VOICE } from './data.js'

export const EMAIL = 'info@forgequbit.com'

export const NAV = [
  { to: '/services', label: 'Solutions', note: '01' },
  { to: '/case-studies', label: 'Work', note: '02' },
  { to: '/about', label: 'About', note: '03' },
  { to: '/blog', label: 'Blog', note: '04' },
  { to: '/contact', label: 'Contact', note: '05' },
]

const isActive = ({ isActive }) => (isActive ? 'active' : undefined)
const sheetLink = ({ isActive }) => `sheet-link ${isActive ? 'active' : ''}`

/* ———————————————————— nav ———————————————————— */

export function Nav() {
  const [open, setOpen] = useState(false)
  const [stuck, setStuck] = useState(false)
  const { pathname } = useLocation()
  const toggle = useRef(null)
  const sheet = useRef(null)
  const wasOpen = useRef(false)

  useEffect(() => setOpen(false), [pathname])

  /* move focus into the menu when it opens and back to the button when
     it closes, so keyboard and screen-reader users are never stranded */
  useEffect(() => {
    if (open) {
      sheet.current?.querySelector('a')?.focus()
    } else if (wasOpen.current) {
      toggle.current?.focus()
    }
    wasOpen.current = open
  }, [open])

  useEffect(() => {
    let ticking = false
    const read = () => {
      ticking = false
      setStuck(window.scrollY > 12)
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

  /* While the menu is open: the page behind it is inert (no focus, no
     clicks, hidden from assistive tech), scrolling is locked, Escape
     closes, and Tab wraps between the toggle button and the sheet so
     focus can never land on obscured content. */
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const main = document.getElementById('main')
    if (main) main.inert = true

    const focusables = () => [
      toggle.current,
      ...(sheet.current?.querySelectorAll('a[href], button:not([disabled])') ?? []),
    ].filter(Boolean)

    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        return
      }
      if (e.key !== 'Tab') return
      const list = focusables()
      const first = list[0]
      const last = list[list.length - 1]
      const active = document.activeElement
      if (e.shiftKey && (active === first || !list.includes(active))) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && (active === last || !list.includes(active))) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      if (main) main.inert = false
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <nav className={`nav ${stuck || open ? 'stuck' : ''}`} aria-label="Primary">
        <Link className="wordmark" to="/" aria-label="ForgeQubit home">
          <LogoMark size={32} />
          <WordmarkText />
        </Link>

        <div className="nav-links">
          {NAV.slice(0, -1).map((l) => (
            <NavLink key={l.to} to={l.to} className={isActive} end={l.to === '/services' ? false : undefined}>
              {l.label}
            </NavLink>
          ))}
          <Link className="btn btn-primary btn-sm" to="/contact" data-track="nav-cta">Discuss your project</Link>
        </div>

        <button
          type="button"
          ref={toggle}
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
      <div className={`nav-sheet ${open ? 'open' : ''}`} id="nav-sheet" ref={sheet} inert={!open}>
        {NAV.map((l) => (
          <span key={l.to} style={{ display: 'contents' }}>
            <NavLink to={l.to} className={sheetLink} end={l.to === '/services'}>
              {l.label}
              <span>{l.note}</span>
            </NavLink>
            {l.to === '/services' && (
              <div className="nav-sheet-sub">
                {SOLUTIONS.map((s) => (
                  <NavLink key={s.slug} to={s.path} className={isActive}>{s.name}</NavLink>
                ))}
                <NavLink to={VOICE.path} className={isActive}>{VOICE.name}</NavLink>
              </div>
            )}
          </span>
        ))}
        <div className="nav-sheet-foot">
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <Link className="btn btn-primary" to="/contact" data-track="menu-cta">Discuss your project <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </>
  )
}

/* ———————————————————— footer ———————————————————— */

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="site-footer-inner">
          <div className="footer-brand">
            <Link className="wordmark small" to="/" aria-label="ForgeQubit home">
              <LogoMark size={28} />
              <WordmarkText />
            </Link>
            <p>
              ForgeQubit builds voice and WhatsApp agents, connects business tools, and
              develops custom AI products. UK-registered, working with clients in the UK,
              Europe and the United States.
            </p>
            <a className="link-cta" href={`mailto:${EMAIL}`} data-track="footer-email">{EMAIL} <span aria-hidden="true">→</span></a>
          </div>

          <div className="footer-cols">
            <div className="footer-col">
              <h3>Solutions</h3>
              <ul>
                {SOLUTIONS.map((s) => (
                  <li key={s.slug}><Link to={s.path}>{s.name}</Link></li>
                ))}
                <li><Link to={VOICE.path}>{VOICE.name}</Link></li>
                <li><Link to="/services#capabilities">Avatars &amp; blockchain</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h3>Company</h3>
              <ul>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/case-studies">Work</Link></li>
                <li><Link to="/blog">Blog</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h3>Legal</h3>
              <ul>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-base">
          <span>© {new Date().getFullYear()} ForgeQubit. Registered in the United Kingdom.</span>
          <span>United Kingdom · Europe · United States</span>
        </div>
      </div>
    </footer>
  )
}

/* ———————————————————— scroll reveals ———————————————————— */

const REVEAL = [
  '.section-head', '.card', '.solution', '.capability', '.step', '.approach-item',
  '.feature > *', '.approach > .team-note', '.faq-grid > *', '.cta-band', '.demo',
  '.svc-row', '.svc-section', '.about-grid > *', '.contact-grid > *', '.post-body > section',
  '.strip',
].join(', ')

/* Adds .reveal to content blocks as they appear in the DOM and .in when
   they scroll into view. Elements already on screen are marked .in in
   the same pass, so the first paint never hides anything; without
   JavaScript nothing is touched at all. */
export function useReveal(dep) {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const main = document.getElementById('main')
    if (!main) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          e.target.classList.add('in')
          io.unobserve(e.target)
          pending.delete(e.target)
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0 }
    )

    const pending = new Set()

    /* belt and braces: on scroll, anything pending that is on screen is
       revealed immediately, so a fast flick can never leave a block
       hidden if an observer notification is late */
    let ticking = false
    const sweep = () => {
      ticking = false
      const vh = window.innerHeight
      for (const el of pending) {
        const r = el.getBoundingClientRect()
        if (r.top < vh * 0.96 && r.bottom > 0) {
          el.classList.add('in')
          io.unobserve(el)
          pending.delete(el)
        }
      }
    }
    const onScroll = () => {
      if (ticking || pending.size === 0) return
      ticking = true
      requestAnimationFrame(sweep)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    const scan = () => {
      const els = main.querySelectorAll(REVEAL)
      const vh = window.innerHeight
      let stagger = 0
      let lastParent = null
      els.forEach((el) => {
        if (el.classList.contains('reveal') || el.closest('.hero')) return
        // siblings stagger; a new parent resets the count
        stagger = el.parentElement === lastParent ? Math.min(stagger + 1, 5) : 0
        lastParent = el.parentElement
        el.style.setProperty('--i', stagger)
        el.classList.add('reveal')
        const r = el.getBoundingClientRect()
        if (r.top < vh && r.bottom > 0) el.classList.add('in')
        else {
          pending.add(el)
          io.observe(el)
        }
      })
    }

    scan()
    const mo = new MutationObserver(scan)
    mo.observe(main, { childList: true, subtree: true })
    return () => {
      mo.disconnect()
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [dep])
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

/* ———————————————————— shared blocks ———————————————————— */

export function Faq({ items, id = 'faq' }) {
  return (
    <div className="faq-list" id={id}>
      {items.map((f) => (
        <details key={f.q} className="faq">
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  )
}

export function CtaBand({
  eyebrow = 'Next step',
  title,
  body = 'Tell us what you are dealing with. We reply by email to arrange a short call, then send a written scope and price before any work starts.',
  interest,
  secondary,
}) {
  const to = interest ? `/contact?interest=${encodeURIComponent(interest)}` : '/contact'
  return (
    <section className="section tight" aria-labelledby="cta-h">
      <div className="shell">
        <div className="cta-band">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 id="cta-h">{title}</h2>
            <p>{body}</p>
          </div>
          <div className="btn-row">
            <Link className="btn btn-primary" to={to} data-track="cta-band">Discuss your project <span aria-hidden="true">→</span></Link>
            {secondary && (secondary.to.startsWith('mailto:')
              ? <a className="btn btn-secondary" href={secondary.to} data-track="cta-band-email">{secondary.label}</a>
              : <Link className="btn btn-secondary" to={secondary.to}>{secondary.label}</Link>)}
          </div>
        </div>
      </div>
    </section>
  )
}
