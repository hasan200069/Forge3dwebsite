/* ————————————————————————————————————————
   Motion primitives.

   Rules, in order of importance:
   · the prerendered HTML is complete and visible. Every effect here is
     added on top of it after hydration, and the CSS that hides anything
     is scoped to `html.js` (set in main.jsx) with a timed safety net,
     so no browser can be left looking at a blank block
   · only transform, opacity and filter are animated
   · everything switches off under prefers-reduced-motion, including
     while the page is open
   · pointer effects (magnetic, tilt, spotlight) run only on fine
     pointers; touch devices get the layout and the entrances
   ———————————————————————————————————————— */

import { Children, Fragment, cloneElement, isValidElement, useEffect, useRef, useState } from 'react'

const REDUCE = '(prefers-reduced-motion: reduce)'
const FINE = '(pointer: fine)'

const canUseDOM = typeof window !== 'undefined'
const reduced = () => canUseDOM && window.matchMedia(REDUCE).matches
const fine = () => canUseDOM && window.matchMedia(FINE).matches

/* live reduced-motion flag, so a preference change mid-visit stops loops */
export function useReducedMotion() {
  const [r, setR] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(REDUCE)
    const apply = () => setR(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])
  return r
}

/* ———— scroll reveals ————
   One IntersectionObserver for the whole page. An element is revealed
   once and then left alone; observing stops as soon as it is in. */

let observer = null
const pending = new Set()

function getObserver() {
  if (observer || !canUseDOM || !('IntersectionObserver' in window)) return observer
  observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        e.target.classList.add('in')
        observer.unobserve(e.target)
        pending.delete(e.target)
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  )
  return observer
}

function observe(el) {
  const io = getObserver()
  if (!io) {
    el.classList.add('in')
    return () => {}
  }
  pending.add(el)
  io.observe(el)
  return () => {
    io.unobserve(el)
    pending.delete(el)
  }
}

/* <Reveal as="section" delay={120}>…</Reveal>
   Renders the element with data-reveal; CSS does the rest. */
export function Reveal({ as: Tag = 'div', delay = 0, children, style, ...rest }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced()) {
      el.classList.add('in')
      return
    }
    return observe(el)
  }, [])
  return (
    <Tag ref={ref} data-reveal="" style={{ ...style, '--d': `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  )
}

/* Marks every direct child of the wrapped element for a staggered
   reveal. Use for grids: <Stagger step={90}><div className="solutions">…</div></Stagger> */
export function Stagger({ step = 90, from = 0, children }) {
  const child = Children.only(children)
  const ref = useRef(null)
  /* the child may carry its own ref (a spotlight group, say); keep both */
  const setRef = (node) => {
    ref.current = node
    const own = child.props.ref
    if (typeof own === 'function') own(node)
    else if (own) own.current = node
  }
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const kids = [...root.children]
    kids.forEach((k, i) => {
      k.setAttribute('data-reveal', '')
      k.style.setProperty('--d', `${from + i * step}ms`)
    })
    if (reduced()) {
      kids.forEach((k) => k.classList.add('in'))
      return
    }
    const offs = kids.map(observe)
    return () => offs.forEach((off) => off())
  }, [step, from])
  return isValidElement(child) ? cloneElement(child, { ref: setRef }) : child
}

/* ———— word-by-word headline ————
   Splits a string into words, each wrapped so it can rise from behind a
   clip. Deterministic, so the server and client agree. `offset` shifts
   the stagger index when the headline has several runs (plain then em). */
export function Words({ text, offset = 0, className = '' }) {
  const words = text.trim().split(/\s+/)
  return words.map((w, i) => (
    <Fragment key={i}>
      <span className={`w ${className}`} style={{ '--i': offset + i }}>
        <i>{w}</i>
      </span>
      {i < words.length - 1 ? ' ' : ''}
    </Fragment>
  ))
}

/* ———— magnetic buttons ————
   The element leans toward a fine pointer within `radius` px and springs
   back when it leaves. Transform only; the hit area never moves. */
export function Magnetic({ children, strength = 0.28, radius = 90 }) {
  const child = Children.only(children)
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !fine() || reduced()) return
    let raf = 0
    let tx = 0
    let ty = 0
    const paint = () => {
      raf = 0
      el.style.setProperty('--mx', `${tx}px`)
      el.style.setProperty('--my', `${ty}px`)
    }
    const move = (e) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      const d = Math.hypot(dx, dy)
      const pull = Math.max(0, 1 - d / (radius + Math.max(r.width, r.height) / 2))
      tx = dx * strength * pull
      ty = dy * strength * pull
      if (!raf) raf = requestAnimationFrame(paint)
    }
    const leave = () => {
      tx = 0
      ty = 0
      if (!raf) raf = requestAnimationFrame(paint)
    }
    el.classList.add('magnetic')
    el.addEventListener('pointermove', move, { passive: true })
    el.addEventListener('pointerleave', leave, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [strength, radius])
  return isValidElement(child) ? cloneElement(child, { ref }) : child
}

/* ———— 3D tilt ————
   Writes --rx/--ry/--gx/--gy on the element; CSS applies the perspective
   transform and a glare that follows the pointer. */
export function Tilt({ children, max = 7, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !fine() || reduced()) return
    let raf = 0
    let rx = 0
    let ry = 0
    let gx = 50
    let gy = 50
    const paint = () => {
      raf = 0
      el.style.setProperty('--rx', `${rx}deg`)
      el.style.setProperty('--ry', `${ry}deg`)
      el.style.setProperty('--gx', `${gx}%`)
      el.style.setProperty('--gy', `${gy}%`)
    }
    const move = (e) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      ry = (px - 0.5) * max * 2
      rx = (0.5 - py) * max * 2
      gx = px * 100
      gy = py * 100
      if (!raf) raf = requestAnimationFrame(paint)
    }
    const enter = () => el.classList.add('tilting')
    const leave = () => {
      el.classList.remove('tilting')
      rx = 0
      ry = 0
      if (!raf) raf = requestAnimationFrame(paint)
    }
    el.addEventListener('pointerenter', enter, { passive: true })
    el.addEventListener('pointermove', move, { passive: true })
    el.addEventListener('pointerleave', leave, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointerenter', enter)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [max])
  return (
    <div ref={ref} className={`tilt ${className}`}>
      {children}
      <i className="tilt-glare" aria-hidden="true" />
    </div>
  )
}

/* ———— pointer spotlight on a group of cards ————
   One listener on the container writes --px/--py (in px, relative to
   each card) so the CSS radial highlight follows the pointer. */
export function useSpotlightGroup(selector = '[data-spot]') {
  const ref = useRef(null)
  useEffect(() => {
    const root = ref.current
    if (!root || !fine() || reduced()) return
    const move = (e) => {
      for (const card of root.querySelectorAll(selector)) {
        const r = card.getBoundingClientRect()
        card.style.setProperty('--px', `${e.clientX - r.left}px`)
        card.style.setProperty('--py', `${e.clientY - r.top}px`)
      }
    }
    root.addEventListener('pointermove', move, { passive: true })
    return () => root.removeEventListener('pointermove', move)
  }, [selector])
  return ref
}

/* ———— the hero field ————
   A slow network of points, joined where they are near, with the
   occasional signal travelling along an edge. Drawn on a canvas that
   stops when off screen, in a hidden tab, or under reduced motion
   (which gets one still frame). Pixel ratio is capped at 1.5 and the
   point count scales with area, so a phone draws a fraction of what a
   large monitor does. */
export function HeroField() {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const mq = window.matchMedia(REDUCE)
    let running = false
    let visible = true
    let raf = 0
    let w = 0
    let h = 0
    let dpr = 1
    let pts = []
    let signals = []
    const pointer = { x: -9999, y: -9999, on: false }
    const LINK = 150

    const seed = () => {
      const n = Math.round(Math.min(110, Math.max(28, (w * h) / 16000)))
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: 1 + Math.random() * 1.6,
        p: Math.random() * Math.PI * 2,
      }))
      signals = []
    }

    /* Resizing keeps the field: points are scaled into the new box and
       the count is topped up or trimmed, so a phone's address bar coming
       and going never re-rolls the scene. */
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      const nw = Math.max(1, Math.round(r.width))
      const nh = Math.max(1, Math.round(r.height))
      if (nw === w && nh === h) return
      dpr = Math.min(1.5, window.devicePixelRatio || 1)
      canvas.width = Math.round(nw * dpr)
      canvas.height = Math.round(nh * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (!pts.length) {
        w = nw
        h = nh
        seed()
      } else {
        const sx = nw / w
        const sy = nh / h
        for (const p of pts) {
          p.x *= sx
          p.y *= sy
        }
        w = nw
        h = nh
        const n = Math.round(Math.min(110, Math.max(28, (w * h) / 16000)))
        while (pts.length > n) pts.pop()
        while (pts.length < n) {
          pts.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18, r: 1 + Math.random() * 1.6, p: Math.random() * Math.PI * 2 })
        }
        signals = signals.filter((s) => pts.includes(s.a) && pts.includes(s.b))
      }
      if (!running) draw(0, true)
    }
    let resizeRaf = 0
    const onResize = () => {
      cancelAnimationFrame(resizeRaf)
      resizeRaf = requestAnimationFrame(resize)
    }

    let last = 0
    const draw = (t, still = false) => {
      const dt = still ? 0 : Math.min(40, t - last || 16)
      last = t
      ctx.clearRect(0, 0, w, h)

      /* move */
      if (!still) {
        for (const p of pts) {
          p.x += p.vx * dt * 0.06
          p.y += p.vy * dt * 0.06
          p.p += dt * 0.0012
          if (pointer.on) {
            const dx = pointer.x - p.x
            const dy = pointer.y - p.y
            const d2 = dx * dx + dy * dy
            if (d2 < 220 * 220 && d2 > 1) {
              const f = (1 - Math.sqrt(d2) / 220) * 0.012
              p.vx += dx * f * 0.02
              p.vy += dy * f * 0.02
            }
          }
          /* keep them slow */
          const sp = Math.hypot(p.vx, p.vy)
          if (sp > 0.32) {
            p.vx *= 0.32 / sp
            p.vy *= 0.32 / sp
          }
          if (p.x < -20) p.x = w + 20
          if (p.x > w + 20) p.x = -20
          if (p.y < -20) p.y = h + 20
          if (p.y > h + 20) p.y = -20
        }
      }

      /* edges */
      ctx.lineWidth = 1
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i]
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d = Math.hypot(dx, dy)
          if (d > LINK) continue
          const k = 1 - d / LINK
          ctx.strokeStyle = `rgba(125, 240, 255, ${(0.05 + k * 0.16).toFixed(3)})`
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
          /* occasionally send a signal along a fresh edge */
          if (!still && signals.length < 6 && Math.random() < 0.0009 * dt) {
            signals.push({ a, b, t: 0, v: 0.0007 + Math.random() * 0.0006 })
          }
        }
      }

      /* points */
      for (const p of pts) {
        const tw = 0.55 + 0.45 * Math.sin(p.p)
        ctx.fillStyle = `rgba(178, 246, 255, ${(0.35 + tw * 0.45).toFixed(3)})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }

      /* signals */
      for (const s of signals) {
        s.t += s.v * dt
        const x = s.a.x + (s.b.x - s.a.x) * s.t
        const y = s.a.y + (s.b.y - s.a.y) * s.t
        const g = ctx.createRadialGradient(x, y, 0, x, y, 9)
        g.addColorStop(0, 'rgba(255,255,255,0.95)')
        g.addColorStop(0.35, 'rgba(125,240,255,0.7)')
        g.addColorStop(1, 'rgba(125,240,255,0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(x, y, 9, 0, Math.PI * 2)
        ctx.fill()
      }
      signals = signals.filter((s) => s.t < 1)

      if (running) raf = requestAnimationFrame(draw)
    }

    const start = () => {
      if (running || mq.matches || !visible || document.hidden) return
      running = true
      last = performance.now()
      raf = requestAnimationFrame(draw)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    const onMotion = () => {
      if (mq.matches) {
        stop()
        draw(0, true)
      } else start()
    }
    const onVis = () => (document.hidden ? stop() : start())
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      visible ? start() : stop()
    })
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect()
      pointer.x = e.clientX - r.left
      pointer.y = e.clientY - r.top
      pointer.on = true
    }
    const onLeave = () => {
      pointer.on = false
    }
    const host = canvas.parentElement || canvas

    resize()
    io.observe(canvas)
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVis)
    mq.addEventListener('change', onMotion)
    if (fine()) {
      host.addEventListener('pointermove', onMove, { passive: true })
      host.addEventListener('pointerleave', onLeave, { passive: true })
    }
    start()

    return () => {
      stop()
      io.disconnect()
      cancelAnimationFrame(resizeRaf)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVis)
      mq.removeEventListener('change', onMotion)
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
    }
  }, [])
  return <canvas ref={ref} className="hero-field" aria-hidden="true" />
}

/* ———— scroll progress as a CSS variable on <html> ————
   Used by the nav hairline where CSS scroll timelines are unsupported. */
export function useScrollProgress() {
  useEffect(() => {
    if (CSS.supports?.('animation-timeline: scroll()')) return
    let raf = 0
    const read = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0
      document.documentElement.style.setProperty('--scroll', p.toFixed(4))
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(read)
    }
    read()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', on)
      window.removeEventListener('resize', on)
    }
  }, [])
}

/* ———— inertia scrolling ————
   Wheel input on a fine pointer is eased toward its target instead of
   jumping, which is what makes a page feel continuous. The real scroll
   position is what moves (window.scrollTo), so scroll timelines,
   observers, sticky elements and anchors all keep working. Off for
   touch, for reduced motion, while the menu locks the page, and when
   the pointer is over something that scrolls on its own. Keyboard,
   scrollbar and anchor scrolling stay native. */
export function useSmoothScroll({ lerp = 0.11, max = 1.6 } = {}) {
  useEffect(() => {
    if (!fine()) return
    const mq = window.matchMedia(REDUCE)
    let target = window.scrollY
    let current = target
    let raf = 0
    let last = 0

    const limit = () => document.documentElement.scrollHeight - window.innerHeight

    const innerScrolls = (start, dy) => {
      for (let el = start; el && el !== document.body && el !== document.documentElement; el = el.parentElement) {
        const cs = getComputedStyle(el)
        if (!/(auto|scroll)/.test(cs.overflowY)) continue
        if (el.scrollHeight <= el.clientHeight + 1) continue
        if (dy > 0 && el.scrollTop + el.clientHeight < el.scrollHeight - 1) return true
        if (dy < 0 && el.scrollTop > 0) return true
      }
      return false
    }

    const tick = (t) => {
      const dt = Math.min(48, t - last || 16)
      last = t
      const k = 1 - Math.pow(1 - lerp, dt / 16.7)
      current += (target - current) * k
      if (Math.abs(target - current) < 0.5) {
        current = target
        window.scrollTo({ top: current, behavior: 'instant' })
        raf = 0
        return
      }
      window.scrollTo({ top: current, behavior: 'instant' })
      raf = requestAnimationFrame(tick)
    }

    const onWheel = (e) => {
      if (mq.matches || e.ctrlKey || e.defaultPrevented) return
      if (document.body.style.overflow === 'hidden') return
      let dy = e.deltaY
      if (e.deltaMode === 1) dy *= 16
      else if (e.deltaMode === 2) dy *= window.innerHeight
      if (!dy || innerScrolls(e.target, dy)) return
      e.preventDefault()
      if (!raf) {
        current = window.scrollY
        target = current
      }
      dy = Math.max(-window.innerHeight * max, Math.min(window.innerHeight * max, dy))
      target = Math.max(0, Math.min(limit(), target + dy))
      if (!raf) {
        last = performance.now()
        raf = requestAnimationFrame(tick)
      }
    }

    /* anything else that scrolls (keys, scrollbar, anchors, the router)
       takes over: drop our target and follow */
    const onScroll = () => {
      if (raf) return
      target = current = window.scrollY
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
      target = current = window.scrollY
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('keydown', stop, { passive: true })
    window.addEventListener('pointerdown', stop, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('keydown', stop)
      window.removeEventListener('pointerdown', stop)
    }
  }, [lerp, max])
}
