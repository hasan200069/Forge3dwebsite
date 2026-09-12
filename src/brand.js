// Angular FQ from the approved reference. Every principal stroke is 7 units.
export const BRAND = { oxblood: '#70283F', rose: '#D990A1', porcelain: '#FAF8F9', ink: '#281E23' }
export const STROKE_WIDTH = 7
export const MARK_F = [[3,3],[39,3],[32,10],[10,10],[10,20],[13,18],[25,18],[18,25],[10,25],[10,33],[3,40]]
export const MARK_Q = [[43,3.5],[43,38.5],[39.5,42],[6,42],[13,35],[36,35],[36,10.5]]

// A diagonal must be measured perpendicular to its edges, not vertically.
// The same width as the F crossbar gives an offset of 7 / (2 * sqrt(2)).
const offset = STROKE_WIDTH / (2 * Math.SQRT2)
export const MARK_TAIL = [
  [23 + offset, 25 - offset],
  [41 + offset, 43 - offset],
  [41 - offset, 43 + offset],
  [23 - offset, 25 + offset],
]
export const polygonPath = (points) => `M${points.map(p => p.join(' ')).join('L')}Z`
export const F_PATH = polygonPath(MARK_F)
export const MARK_PATH = polygonPath(MARK_Q)
export const TAIL_PATH = polygonPath(MARK_TAIL)
export function logoSvg({ mono = false } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="${BRAND.oxblood}" d="${F_PATH}"/><path fill="${mono ? BRAND.oxblood : BRAND.rose}" d="${MARK_PATH}"/><path fill="${mono ? BRAND.oxblood : BRAND.rose}" d="${TAIL_PATH}"/></svg>`
}
