import { useId } from 'react'

/* ————————————————————————————————————————
   FORGEQUBIT · the mark

   A hexagonal cell with a Q tail, a caret above a bar. The geometry is
   unchanged from the original mark; only the colour has moved to the
   cyan identity. Reads as "Q" at a glance and still resolves at 16px.
   ———————————————————————————————————————— */

const HEX = 'M24 5 L39.59 14 L39.59 32 L24 41 L8.41 32 L8.41 14 Z'
const CARET = 'M24 13 L32 23 L27.6 23 L24 18.6 L20.4 23 L16 23 Z'

export function LogoMark({ size = 28, className = '', title }) {
  /* every instance needs its own gradient ids — duplicated ids across
     inlined SVGs make later copies inherit the first one's stops */
  const uid = useId().replace(/:/g, '')
  const ring = `r${uid}`
  const fill = `f${uid}`

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
          <stop offset="0" stopColor="#67E8F9" />
          <stop offset="0.5" stopColor="#22D3EE" />
          <stop offset="1" stopColor="#0891B2" />
        </linearGradient>
        <linearGradient id={fill} x1="16" y1="12" x2="34" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#A5F0FA" />
          <stop offset="0.5" stopColor="#22D3EE" />
          <stop offset="1" stopColor="#0891B2" />
        </linearGradient>
      </defs>

      {/* the cell */}
      <path d={HEX} stroke={`url(#${ring})`} strokeWidth="2.6" strokeLinejoin="round" />

      {/* the Q tail, breaking the lower-right edge */}
      <path d="M29 34.7 L38 44" stroke={`url(#${fill})`} strokeWidth="4.4" strokeLinecap="round" />

      {/* the caret */}
      <path d={CARET} fill={`url(#${fill})`} />

      {/* the bar */}
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
