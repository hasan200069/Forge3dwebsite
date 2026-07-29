import { useId } from 'react'

/* ————————————————————————————————————————
   FORGEQUBIT · the mark

   A qubit cell (hexagon) with a Q tail, struck through by a
   forge caret above an anvil bar. Reads as "Q" at a glance and
   still resolves at 16px, where the hexagon + hot core carry it.
   ———————————————————————————————————————— */

/* geometry is fixed at a 48×48 viewBox — see the vertex table in the
   comment below so the shape can be re-derived rather than guessed at */
const HEX = 'M24 5 L39.59 14 L39.59 32 L24 41 L8.41 32 L8.41 14 Z'
const CARET = 'M24 13 L32 23 L27.6 23 L24 18.6 L20.4 23 L16 23 Z'

export function LogoMark({ size = 28, className = '', title }) {
  /* every instance needs its own gradient ids — duplicated ids across
     inlined SVGs make later copies inherit the first one's stops */
  const uid = useId().replace(/:/g, '')
  const ring = `r${uid}`
  const fill = `f${uid}`
  const glow = `g${uid}`

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
        <linearGradient id={ring} x1="8" y1="5" x2="40" y2="41" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F5811F" />
          <stop offset="0.45" stopColor="#C23A0B" />
          <stop offset="1" stopColor="#5C2E7A" />
        </linearGradient>
        <linearGradient id={fill} x1="16" y1="12" x2="34" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFD5A0" />
          <stop offset="0.5" stopColor="#F5811F" />
          <stop offset="1" stopColor="#E2560F" />
        </linearGradient>
        <radialGradient id={glow} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFD5A0" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFD5A0" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* heat bleeding out of the cell */}
      <circle cx="24" cy="23" r="19" fill={`url(#${glow})`} />

      {/* the qubit cell */}
      <path d={HEX} stroke={`url(#${ring})`} strokeWidth="2.6" strokeLinejoin="round" />

      {/* the Q tail, breaking the lower-right edge */}
      <path
        d="M29 34.7 L38 44"
        stroke={`url(#${fill})`}
        strokeWidth="4.4"
        strokeLinecap="round"
      />

      {/* the strike */}
      <path d={CARET} fill={`url(#${fill})`} />

      {/* the anvil */}
      <rect x="16" y="26.6" width="16" height="4" rx="2" fill={`url(#${fill})`} />
    </svg>
  )
}

/* the horizontal lockup used in the nav and footer */
export function Wordmark({ size = 28, className = '' }) {
  return (
    <span className={`wordmark ${className}`}>
      <LogoMark size={size} />
      <span className="wordmark-text">
        FORGE<span className="wordmark-accent">QUBIT</span>
      </span>
    </span>
  )
}

/*
  hexagon vertices — centre (24, 23), circumradius 18, pointy-top:
    90°  (24.00,  5.00)
    30°  (39.59, 14.00)
   330°  (39.59, 32.00)
   270°  (24.00, 41.00)
   210°  ( 8.41, 32.00)
   150°  ( 8.41, 14.00)
*/
