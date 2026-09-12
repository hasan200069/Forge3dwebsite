// FQ monogram: matching bands, shared rhythm and open negative space.
export const BRAND = { oxblood: '#70283F', rose: '#D990A1', porcelain: '#FAF8F9', ink: '#281E23' }
export const MARK_F = [[3,7],[24,7],[24,14],[10,14],[10,21],[20,21],[20,28],[10,28],[10,41],[3,41]]
export const F_CHANNEL = [[6,37],[6,10],[20,10],[20,11.5],[7.5,11.5],[7.5,24],[17,24],[17,25.5],[7.5,25.5],[7.5,37]]
export const Q_CHANNEL_OUTER = [[29.5,10],[36.5,10],[42,15.5],[42,30.5],[36.5,36],[29.5,36],[24,30.5],[24,15.5]]
export const Q_CHANNEL_INNER = [[30,11.5],[36,11.5],[40.5,16],[40.5,30],[36,34.5],[30,34.5],[25.5,30],[25.5,16]]
export const MARK_OUTER = [[29,7],[37,7],[45,15],[45,31],[37,39],[29,39],[21,31],[21,15]]
export const MARK_INNER = [[30,14],[36,14],[38,16],[38,30],[36,32],[30,32],[28,30],[28,16]]
export const MARK_TAIL = [[32,26],[39,26],[47,39],[41,43],[32,29]]
export const polygonPath = (points) => `M${points.map(p => p.join(' ')).join('L')}Z`
export const F_PATH = polygonPath(MARK_F) + polygonPath(F_CHANNEL)
export const MARK_PATH = polygonPath(MARK_OUTER) + polygonPath(MARK_INNER) + polygonPath(Q_CHANNEL_OUTER) + polygonPath(Q_CHANNEL_INNER)
export const TAIL_PATH = polygonPath(MARK_TAIL)
export function logoSvg({ mono = false } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="${BRAND.oxblood}" fill-rule="evenodd" d="${F_PATH}"/><path fill="${mono ? BRAND.oxblood : BRAND.rose}" fill-rule="evenodd" d="${MARK_PATH}"/><path fill="${mono ? BRAND.oxblood : BRAND.rose}" d="${TAIL_PATH}"/></svg>`
}
