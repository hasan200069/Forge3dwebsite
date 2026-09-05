/* ————————————————————————————————————————
   Line icons for the solutions. Drawn on a 24-unit grid, stroked with
   currentColor so they take the gradient or ink of their tile.
   Decorative: every use sits next to the solution's name.
   ———————————————————————————————————————— */

const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: 'false',
}

/* a chat bubble with a phone handset: reception on both channels */
export const ReceptionIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h8A2.5 2.5 0 0 1 17 5.5v5a2.5 2.5 0 0 1-2.5 2.5H9l-4 3v-3A2.5 2.5 0 0 1 4 10.5z" />
    <path d="M14.5 14.5c.6 2.6 2.4 4.4 5 5l1.2-1.6a1 1 0 0 1 1.1-.35l1.6.55" />
    <path d="M8 7.5h6M8 10h3.5" />
  </svg>
)

/* three nodes joined, with a check on the last: a workflow with approval */
export const WorkflowIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="4" width="6" height="6" rx="1.5" />
    <rect x="15" y="4" width="6" height="6" rx="1.5" />
    <rect x="9" y="14" width="6" height="6" rx="1.5" />
    <path d="M9 7h6M6 10v2.5a1.5 1.5 0 0 0 1.5 1.5H9M18 10v2.5a1.5 1.5 0 0 1-1.5 1.5H15" />
    <path d="M10.6 17l1 1 2-2" />
  </svg>
)

/* an application window with a spark: a product with intelligence in it */
export const ProductIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2.5" />
    <path d="M3 9h18M6.5 6.5h.01M9.5 6.5h.01" />
    <path d="M12 12v5M9.5 14.5h5" />
  </svg>
)

/* a waveform: voice */
export const VoiceIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M3 12h1M6 9v6M9 6v12M12 9.5v5M15 4v16M18 8v8M21 11v2" />
  </svg>
)

/* a face outline: avatar */
export const AvatarIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="9" r="4" />
    <path d="M5 20a7 7 0 0 1 14 0" />
    <path d="M9.5 9.5c.3.4.9.6 1.2.6M13.3 9.5c.3.4.9.6 1.2.6" />
  </svg>
)

/* linked blocks: chain */
export const ChainIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="8" width="7" height="8" rx="2" />
    <rect x="14" y="8" width="7" height="8" rx="2" />
    <path d="M10 12h4" />
  </svg>
)

export const ICONS = {
  'ai-reception': ReceptionIcon,
  'workflow-automation': WorkflowIcon,
  'custom-ai-products': ProductIcon,
  'voice-agents': VoiceIcon,
  avatars: AvatarIcon,
  blockchain: ChainIcon,
}

/* the glass tile the icons sit in */
export function IconTile({ icon: Icon, size = 'md', className = '' }) {
  return (
    <span className={`icon-tile ${size} ${className}`} aria-hidden="true">
      <Icon />
    </span>
  )
}
