/* ————————————————————————————————————————
   Conversion events, sent through the Vercel Analytics that is already
   on the site. See ANALYTICS.md for the event model and how to read it.

   Rules:
   · never send names, email addresses, message text or anything typed
     into the form — only the option chosen from a fixed list
   · one event per user action; an accepted submission is a different
     event from a form start, and a booking click would be different
     again from a confirmed booking
   · failures here must never affect the page, so every call is guarded
   ———————————————————————————————————————— */

let trackFn = null

/* Loaded lazily so the analytics module is not on the critical path and
   the site keeps working if it is blocked. */
async function tracker() {
  if (trackFn) return trackFn
  try {
    const mod = await import('@vercel/analytics')
    trackFn = typeof mod.track === 'function' ? mod.track : () => {}
  } catch {
    trackFn = () => {}
  }
  return trackFn
}

export function track(name, props = {}) {
  if (typeof window === 'undefined') return
  tracker().then((fn) => {
    try {
      fn(name, props)
    } catch {
      /* analytics must never break the page */
    }
  })
}

/* Click delegation for anything carrying data-track="<id>". Keeps the
   pages free of tracking code: a CTA declares its id and nothing else. */
export function startClickTracking() {
  const onClick = (e) => {
    const el = e.target instanceof Element ? e.target.closest('[data-track]') : null
    if (!el) return
    const id = el.getAttribute('data-track')
    const href = el.getAttribute('href') || ''
    const kind = href.startsWith('mailto:') ? 'email' : href.startsWith('tel:') ? 'phone' : 'link'
    track('cta_click', { id, kind, page: window.location.pathname })
  }
  document.addEventListener('click', onClick, { passive: true })
  return () => document.removeEventListener('click', onClick)
}
