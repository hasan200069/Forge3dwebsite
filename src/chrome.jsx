import { useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'

export const EMAIL = 'info@forgequbit.com'

/* fixed nav shared by every page */
export function Nav() {
  return (
    <nav className="nav">
      <Link className="wordmark" to="/">
        <span className="spark" />
        FORGE<span className="qubit">QUBIT</span>
      </Link>
      <div className="nav-links">
        <NavLink to="/case-studies" className={({ isActive }) => (isActive ? 'active' : '')}>Work</NavLink>
        <NavLink to="/blog" className={({ isActive }) => (isActive ? 'active' : '')}>Blog</NavLink>
        <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active' : '')}>Contact</NavLink>
        <Link className="nav-cta" to="/contact">Start a Project</Link>
      </div>
    </nav>
  )
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <Link className="wordmark small" to="/">
          <span className="spark" />
          FORGE<span className="qubit">QUBIT</span>
        </Link>
        <div className="footer-links">
          <Link to="/case-studies">Work</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/contact">Contact</Link>
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </div>
        <div className="footer-meta">
          <span>ForgeQubit © 2026</span>
          <span>Forged Worldwide</span>
        </div>
      </div>
    </footer>
  )
}

/* custom molten cursor */
export function Cursor() {
  const dot = useRef()
  const ring = useRef()
  useEffect(() => {
    const pos = { x: -100, y: -100 }
    const ringPos = { x: -100, y: -100 }
    let raf
    let last = performance.now()
    const move = (e) => {
      pos.x = e.clientX
      pos.y = e.clientY
      // `translate` (not `transform`) so the CSS scale transition never
      // interpolates position — the dot tracks the pointer 1:1
      dot.current.style.translate = `${pos.x}px ${pos.y}px`
      const hoverable = e.target.closest('a, button, .hoverable, li, input, select, textarea')
      dot.current.classList.toggle('hovering', !!hoverable)
    }
    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const k = 1 - Math.exp(-11 * dt) // framerate-independent smoothing
      ringPos.x += (pos.x - ringPos.x) * k
      ringPos.y += (pos.y - ringPos.y) * k
      ring.current.style.translate = `${ringPos.x}px ${ringPos.y}px`
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
      <div className="cursor" ref={dot} style={{ translate: '-100px -100px' }} />
      <div className="cursor-ring" ref={ring} style={{ translate: '-100px -100px' }} />
    </>
  )
}

/* observe .reveal children of the returned ref and toggle .visible */
export function useReveal() {
  const ref = useRef()
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle('visible', e.isIntersecting)),
      { threshold: 0.2 }
    )
    ref.current.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return ref
}
