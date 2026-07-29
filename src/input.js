/* ————————————————————————————————————————
   Native input state, deliberately outside React.

   The page scrolls natively — no hijacking, no transformed wrapper —
   and everything that reacts to scroll or the pointer (the camera rig,
   the progress bar, the HUD, the cursor) reads these plain numbers
   inside its own animation frame. Nothing here triggers a render, so
   scrolling stays on the compositor even while WebGL is busy.
   ———————————————————————————————————————— */

export const scroll = {
  y: 0, // window.scrollY
  progress: 0, // 0→1 across the whole document
  journey: 0, // 0→1 across the 3D journey section only
  vh: 0,
}

/* normalised to -1…1, origin at viewport centre, y up (three.js convention) */
export const pointer = { x: 0, y: 0 }

let journeyEl = null
let journeyRange = 1
let docRange = 1
let ticking = false

function measure() {
  scroll.vh = window.innerHeight
  docRange = Math.max(1, document.documentElement.scrollHeight - scroll.vh)
  journeyRange = journeyEl ? Math.max(1, journeyEl.offsetHeight - scroll.vh) : docRange
}

function read() {
  ticking = false
  scroll.y = window.scrollY
  scroll.progress = Math.min(1, Math.max(0, scroll.y / docRange))
  scroll.journey = Math.min(1, Math.max(0, scroll.y / journeyRange))
}

function onScroll() {
  // coalesce bursts of scroll events into one read per frame
  if (ticking) return
  ticking = true
  requestAnimationFrame(read)
}

function onPointerMove(e) {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1
  pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
}

/* Call once, from the app root. Returns a teardown. */
export function startInputTracking() {
  measure()
  read()

  const onResize = () => {
    measure()
    read()
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize, { passive: true })
  window.addEventListener('pointermove', onPointerMove, { passive: true })

  /* content that loads late (fonts, the 3D chunk) changes the document
     height without firing resize — watch the element instead */
  const ro = new ResizeObserver(onResize)
  ro.observe(document.documentElement)

  return () => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onResize)
    window.removeEventListener('pointermove', onPointerMove)
    ro.disconnect()
  }
}

/* The 3D journey is only part of the home document; the camera maps to
   that range rather than to total page height. */
export function registerJourney(el) {
  journeyEl = el
  measure()
  read()
  return () => {
    if (journeyEl === el) journeyEl = null
    measure()
  }
}
