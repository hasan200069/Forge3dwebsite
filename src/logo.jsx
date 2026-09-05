import { useId } from 'react'

/* ————————————————————————————————————————
   FORGEQUBIT · the mark

   An open ring with a tail: a Q. The ring is broken at the top right and
   a bright pulse sits in the opening — an answer leaving the loop, work
   moving forward. On hover the pulse travels once around the ring.

   Geometry (48×48 viewBox):
     ring   centre (23, 23), radius 14.5, stroke 3.6
            circumference 2π·14.5 ≈ 91.1; gap ≈ 15.5 centred at 315°
     pulse  a 6-unit dash centred in the gap, same radius
     tail   (27.5, 27.5) → (39.5, 39.5), crossing the bowl at 45°, so it
            reads as a Q and not as a magnifying glass

   SVG circles start at 3 o'clock and run clockwise on screen, so a
   dash-offset of −(position along the path) places the dash start.
   ———————————————————————————————————————— */

const C = 91.1
const GAP = 15.5
const DASH = C - GAP
/* dash starts just after the gap (at 345.6°) and runs clockwise */
const RING_OFFSET = -((315 + (GAP / C) * 180) / 360) * C
/* the 6-unit pulse is centred at 315° */
const PULSE_OFFSET = -((315 / 360) * C - 3)

export function LogoMark({ size = 28, className = '', title }) {
  /* each instance needs its own gradient ids: duplicated ids across
     inlined SVGs make later copies inherit the first one's stops */
  const uid = useId().replace(/:/g, '')
  const g = `g${uid}`

  return (
    <svg
      className={`logo-mark ${className}`}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <defs>
        <linearGradient id={g} x1="8" y1="8" x2="42" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#7DF0FF" />
          <stop offset="0.55" stopColor="#22D3EE" />
          <stop offset="1" stopColor="#0E7490" />
        </linearGradient>
      </defs>

      {/* the loop */}
      <circle
        className="logo-ring"
        cx="23"
        cy="23"
        r="14.5"
        stroke={`url(#${g})`}
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeDasharray={`${DASH} ${GAP}`}
        strokeDashoffset={RING_OFFSET}
      />

      {/* the tail that makes it a Q */}
      <path d="M27.5 27.5 L39.5 39.5" stroke={`url(#${g})`} strokeWidth="3.6" strokeLinecap="round" />

      {/* the pulse in the opening */}
      <circle
        className="logo-pulse"
        cx="23"
        cy="23"
        r="14.5"
        stroke="#B5F5FF"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeDasharray={`6 ${C - 6}`}
        strokeDashoffset={PULSE_OFFSET}
      />
    </svg>
  )
}

/* the horizontal lockup used in the nav and footer */
export function WordmarkText() {
  return (
    <span className="wordmark-text">
      Forge<span className="wordmark-accent">Qubit</span>
    </span>
  )
}

export function Wordmark({ size = 28, className = '' }) {
  return (
    <span className={`wordmark ${className}`}>
      <LogoMark size={size} />
      <WordmarkText />
    </span>
  )
}
