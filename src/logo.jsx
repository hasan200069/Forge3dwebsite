import { F_PATH, MARK_PATH, TAIL_PATH } from './brand.js'

/** FQ ligature: two interlocking letters on a shared geometric grid. */
export function LogoMark({ size = 28, className = '', title }) {
  return (
    <svg className={`logo-mark ${className}`} width={size} height={size} viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg" role={title ? 'img' : undefined}
      aria-label={title} aria-hidden={title ? undefined : true} focusable="false">
      <path className="brand-body" fillRule="evenodd" d={F_PATH} />
      <path className="brand-detail" fillRule="evenodd" d={MARK_PATH} />
      <path className="brand-detail" d={TAIL_PATH} />
    </svg>
  )
}

export function WordmarkText() {
  return <span className="wordmark-text">Forge<span className="wordmark-accent">Qubit</span></span>
}

export function Wordmark({ size = 28, className = '' }) {
  return <span className={`wordmark ${className}`}><LogoMark size={size} /><WordmarkText /></span>
}
