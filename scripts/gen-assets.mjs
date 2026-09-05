/* Build-time asset generator — no image dependencies.

   Rasterises the ForgeQubit mark from signed-distance functions and
   encodes PNGs with node's zlib, producing:

     public/favicon.svg          vector mark
     public/icon-192.png         PWA icon
     public/icon-512.png         PWA icon (maskable-safe padding)
     public/apple-touch-icon.png 180×180
     public/og.png               1200×630 social card

   Run via `npm run assets`. Output is committed, so a normal build
   never pays for it. */

import { writeFileSync, mkdirSync } from 'node:fs'
import { deflateSync } from 'node:zlib'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const PUB = join(ROOT, 'public')
mkdirSync(PUB, { recursive: true })

/* ————————————————————————— png encoding ————————————————————————— */

const CRC_TABLE = (() => {
  const t = new Int32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c
  }
  return t
})()

const crc32 = (buf) => {
  let c = -1
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ -1) >>> 0
}

const chunk = (type, data) => {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

/* rgba8 pixels -> png buffer (filter type 0 on every scanline) */
function encodePng(w, h, rgba) {
  const stride = w * 4
  const raw = Buffer.alloc((stride + 1) * h)
  for (let y = 0; y < h; y++) {
    raw[y * (stride + 1)] = 0
    rgba.copy ? rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride)
              : Buffer.from(rgba.buffer, y * stride, stride).copy(raw, y * (stride + 1) + 1)
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0)
  ihdr.writeUInt32BE(h, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // colour type: truecolour + alpha
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

/* ————————————————————————— canvas ————————————————————————— */

const hex = (s) => [
  parseInt(s.slice(1, 3), 16) / 255,
  parseInt(s.slice(3, 5), 16) / 255,
  parseInt(s.slice(5, 7), 16) / 255,
]

const mix = (a, b, t) => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
]

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)

function createCanvas(w, h) {
  return { w, h, px: new Float32Array(w * h * 3), a: new Float32Array(w * h) }
}

/* paint every pixel from a function of (x, y) — used for backgrounds */
function paint(c, fn) {
  for (let y = 0; y < c.h; y++) {
    for (let x = 0; x < c.w; x++) {
      const r = fn(x + 0.5, y + 0.5)
      if (!r) continue
      const i = y * c.w + x
      c.px[i * 3] = r[0]
      c.px[i * 3 + 1] = r[1]
      c.px[i * 3 + 2] = r[2]
      c.a[i] = 1
    }
  }
}

/* composite a shape: `sdf` returns signed distance in px (negative = inside),
   `color` returns [r,g,b] for a point. 3×3 supersampled coverage. */
function draw(c, { sdf, color, bbox, alpha = 1, additive = false }) {
  const x0 = Math.max(0, Math.floor(bbox[0]))
  const y0 = Math.max(0, Math.floor(bbox[1]))
  const x1 = Math.min(c.w, Math.ceil(bbox[2]))
  const y1 = Math.min(c.h, Math.ceil(bbox[3]))
  const S = 3
  const off = []
  for (let j = 0; j < S; j++) for (let i = 0; i < S; i++) off.push([(i + 0.5) / S, (j + 0.5) / S])

  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      // cheap reject: if the centre is far outside, no sub-sample can be in
      const dc = sdf(x + 0.5, y + 0.5)
      if (dc > 1.5) continue

      let cov = 0
      if (dc < -1.5) cov = 1
      else {
        for (let k = 0; k < off.length; k++) {
          if (sdf(x + off[k][0], y + off[k][1]) <= 0) cov++
        }
        cov /= off.length
      }
      if (cov <= 0) continue

      const col = color(x + 0.5, y + 0.5)
      const i = y * c.w + x
      const t = cov * alpha
      if (additive) {
        c.px[i * 3] += col[0] * t
        c.px[i * 3 + 1] += col[1] * t
        c.px[i * 3 + 2] += col[2] * t
      } else {
        c.px[i * 3] = c.px[i * 3] * (1 - t) + col[0] * t
        c.px[i * 3 + 1] = c.px[i * 3 + 1] * (1 - t) + col[1] * t
        c.px[i * 3 + 2] = c.px[i * 3 + 2] * (1 - t) + col[2] * t
      }
      c.a[i] = c.a[i] + t * (1 - c.a[i])
    }
  }
}

function toRgba(c) {
  const out = Buffer.alloc(c.w * c.h * 4)
  for (let i = 0; i < c.w * c.h; i++) {
    // sRGB-ish encode of the linear-blended values we accumulated
    out[i * 4] = Math.round(clamp01(c.px[i * 3]) * 255)
    out[i * 4 + 1] = Math.round(clamp01(c.px[i * 3 + 1]) * 255)
    out[i * 4 + 2] = Math.round(clamp01(c.px[i * 3 + 2]) * 255)
    out[i * 4 + 3] = Math.round(clamp01(c.a[i]) * 255)
  }
  return out
}

/* ————————————————————————— sdf primitives ————————————————————————— */

const sdSegment = (px, py, ax, ay, bx, by) => {
  const pax = px - ax
  const pay = py - ay
  const bax = bx - ax
  const bay = by - ay
  const h = clamp01((pax * bax + pay * bay) / (bax * bax + bay * bay))
  const dx = pax - bax * h
  const dy = pay - bay * h
  return Math.hypot(dx, dy)
}

/* exact signed distance to a closed polygon (Inigo Quilez's formulation) */
function sdPolygon(px, py, v) {
  const n = v.length
  let d = (px - v[0][0]) ** 2 + (py - v[0][1]) ** 2
  let s = 1
  for (let i = 0, j = n - 1; i < n; j = i, i++) {
    const ex = v[j][0] - v[i][0]
    const ey = v[j][1] - v[i][1]
    const wx = px - v[i][0]
    const wy = py - v[i][1]
    const h = clamp01((wx * ex + wy * ey) / (ex * ex + ey * ey))
    const bx = wx - ex * h
    const by = wy - ey * h
    d = Math.min(d, bx * bx + by * by)
    const c1 = py >= v[i][1]
    const c2 = py < v[j][1]
    const c3 = ex * wy > ey * wx
    if ((c1 && c2 && c3) || (!c1 && !c2 && !c3)) s = -s
  }
  return s * Math.sqrt(d)
}

const sdRoundRect = (px, py, cx, cy, hw, hh, r) => {
  const qx = Math.abs(px - cx) - (hw - r)
  const qy = Math.abs(py - cy) - (hh - r)
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r
}

const bboxOf = (pts, pad) => [
  Math.min(...pts.map((p) => p[0])) - pad,
  Math.min(...pts.map((p) => p[1])) - pad,
  Math.max(...pts.map((p) => p[0])) + pad,
  Math.max(...pts.map((p) => p[1])) + pad,
]

/* ————————————————————————— palette ————————————————————————— */

const C = {
  bg: hex('#050D14'),
  bgLift: hex('#0E2230'),
  cyan: hex('#22D3EE'),
  cyanBright: hex('#7DF0FF'),
  cyanPale: hex('#7DF0FF'),
  cyanDeep: hex('#0E7490'),
  teal: hex('#2DD4BF'),
  pulse: hex('#B5F5FF'),
  ink: hex('#F2FAFD'),
  inkDim: hex('#B4CAD4'),
}

/* linear gradient colour function between two points */
const lin = (ax, ay, bx, by, stops) => (x, y) => {
  const bax = bx - ax
  const bay = by - ay
  const t = clamp01(((x - ax) * bax + (y - ay) * bay) / (bax * bax + bay * bay))
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i][0] || i === stops.length - 1) {
      const [t0, c0] = stops[i - 1]
      const [t1, c1] = stops[i]
      return mix(c0, c1, clamp01((t - t0) / (t1 - t0 || 1)))
    }
  }
  return stops[0][1]
}

const flat = (c) => () => c

/* ————————————————————————— the mark ————————————————————————— */

/* draws the 48×48 mark into `c`, scaled by `s` and translated to (ox, oy)

   An open ring with a tail (a Q) and a bright pulse sitting in the
   opening. Same geometry as src/logo.jsx:
     ring   centre (23, 23), r 14.5, stroke 3.6, gap 61.2° centred at 315°
     pulse  23.7° arc centred at 315°
     tail   (27.5, 27.5) → (39.5, 39.5), crossing the bowl */
function drawMark(c, ox, oy, s) {
  const P = (x, y) => [ox + x * s, oy + y * s]
  const [cx, cy] = P(23, 23)
  const r = 14.5 * s
  const half = 1.8 * s

  const deg = (x, y) => ((Math.atan2(y - cy, x - cx) * 180) / Math.PI + 360) % 360
  const between = (a, lo, hi) => (lo <= hi ? a >= lo && a <= hi : a >= lo || a <= hi)
  const endpoint = (a) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)]

  /* stroke of an arc from a0 clockwise to a1 with round caps */
  const sdArc = (a0, a1) => {
    const [e0x, e0y] = endpoint(a0)
    const [e1x, e1y] = endpoint(a1)
    return (x, y) => {
      if (between(deg(x, y), a0, a1)) return Math.abs(Math.hypot(x - cx, y - cy) - r) - half
      return Math.min(Math.hypot(x - e0x, y - e0y), Math.hypot(x - e1x, y - e1y)) - half
    }
  }

  const g = lin(...P(8, 8), ...P(42, 42), [[0, C.cyanPale], [0.55, C.cyan], [1, C.cyanDeep]])
  const bbox = [cx - r - half - 2, cy - r - half - 2, cx + r + half + 2, cy + r + half + 2]

  // the loop: gap from 284.4° to 345.6°
  draw(c, { sdf: sdArc(345.6, 284.4), color: g, bbox })

  // the tail
  const [tax, tay] = P(27.5, 27.5)
  const [tbx, tby] = P(39.5, 39.5)
  draw(c, {
    sdf: (x, y) => sdSegment(x, y, tax, tay, tbx, tby) - half,
    color: g,
    bbox: bboxOf([[tax, tay], [tbx, tby]], half + 2),
  })

  // the pulse, centred in the opening
  draw(c, { sdf: sdArc(303.1, 326.9), color: flat(C.pulse), bbox })
}

/* ————————————————————————— stroke typeface ————————————————————————— */

/* A geometric single-stroke capital face, drawn on a unit box:
   x 0→1 across the glyph, y 0 (cap height) → 1 (baseline).
   Segments only — rendered with round caps, so weight is a parameter. */
const GLYPHS = {
  A: [[0, 1, 0.5, 0], [0.5, 0, 1, 1], [0.17, 0.64, 0.83, 0.64]],
  B: [[0, 0, 0, 1], [0, 0, 0.7, 0], [0.7, 0, 0.95, 0.24], [0.95, 0.24, 0.7, 0.5], [0.7, 0.5, 0, 0.5], [0.7, 0.5, 0.98, 0.75], [0.98, 0.75, 0.7, 1], [0.7, 1, 0, 1]],
  C: [[1, 0.22, 0.72, 0], [0.72, 0, 0.28, 0], [0.28, 0, 0, 0.28], [0, 0.28, 0, 0.72], [0, 0.72, 0.28, 1], [0.28, 1, 0.72, 1], [0.72, 1, 1, 0.78]],
  D: [[0, 0, 0, 1], [0, 0, 0.58, 0], [0.58, 0, 1, 0.36], [1, 0.36, 1, 0.64], [1, 0.64, 0.58, 1], [0.58, 1, 0, 1]],
  E: [[1, 0, 0, 0], [0, 0, 0, 1], [0, 1, 1, 1], [0, 0.5, 0.8, 0.5]],
  F: [[1, 0, 0, 0], [0, 0, 0, 1], [0, 0.5, 0.78, 0.5]],
  G: [[1, 0.22, 0.72, 0], [0.72, 0, 0.28, 0], [0.28, 0, 0, 0.28], [0, 0.28, 0, 0.72], [0, 0.72, 0.28, 1], [0.28, 1, 0.72, 1], [0.72, 1, 1, 0.76], [1, 0.76, 1, 0.54], [1, 0.54, 0.56, 0.54]],
  H: [[0, 0, 0, 1], [1, 0, 1, 1], [0, 0.52, 1, 0.52]],
  I: [[0.5, 0, 0.5, 1]],
  J: [[1, 0, 1, 0.72], [1, 0.72, 0.72, 1], [0.72, 1, 0.3, 1], [0.3, 1, 0.02, 0.76]],
  K: [[0, 0, 0, 1], [1, 0, 0.06, 0.58], [0.3, 0.42, 1, 1]],
  L: [[0, 0, 0, 1], [0, 1, 0.95, 1]],
  M: [[0, 1, 0, 0], [0, 0, 0.5, 0.62], [0.5, 0.62, 1, 0], [1, 0, 1, 1]],
  N: [[0, 1, 0, 0], [0, 0, 1, 1], [1, 1, 1, 0]],
  O: [[0, 0.28, 0.28, 0], [0.28, 0, 0.72, 0], [0.72, 0, 1, 0.28], [1, 0.28, 1, 0.72], [1, 0.72, 0.72, 1], [0.72, 1, 0.28, 1], [0.28, 1, 0, 0.72], [0, 0.72, 0, 0.28]],
  P: [[0, 1, 0, 0], [0, 0, 0.7, 0], [0.7, 0, 1, 0.28], [1, 0.28, 0.7, 0.56], [0.7, 0.56, 0, 0.56]],
  Q: [[0, 0.28, 0.28, 0], [0.28, 0, 0.72, 0], [0.72, 0, 1, 0.28], [1, 0.28, 1, 0.72], [1, 0.72, 0.72, 1], [0.72, 1, 0.28, 1], [0.28, 1, 0, 0.72], [0, 0.72, 0, 0.28], [0.62, 0.68, 1.06, 1.1]],
  R: [[0, 1, 0, 0], [0, 0, 0.7, 0], [0.7, 0, 1, 0.28], [1, 0.28, 0.7, 0.56], [0.7, 0.56, 0, 0.56], [0.48, 0.56, 1, 1]],
  S: [[1, 0.2, 0.74, 0], [0.74, 0, 0.26, 0], [0.26, 0, 0, 0.24], [0, 0.24, 0.26, 0.47], [0.26, 0.47, 0.74, 0.53], [0.74, 0.53, 1, 0.76], [1, 0.76, 0.74, 1], [0.74, 1, 0.26, 1], [0.26, 1, 0, 0.8]],
  T: [[0, 0, 1, 0], [0.5, 0, 0.5, 1]],
  U: [[0, 0, 0, 0.72], [0, 0.72, 0.28, 1], [0.28, 1, 0.72, 1], [0.72, 1, 1, 0.72], [1, 0.72, 1, 0]],
  V: [[0, 0, 0.5, 1], [0.5, 1, 1, 0]],
  W: [[0, 0, 0.22, 1], [0.22, 1, 0.5, 0.34], [0.5, 0.34, 0.78, 1], [0.78, 1, 1, 0]],
  X: [[0, 0, 1, 1], [1, 0, 0, 1]],
  Y: [[0, 0, 0.5, 0.52], [1, 0, 0.5, 0.52], [0.5, 0.52, 0.5, 1]],
  Z: [[0, 0, 1, 0], [1, 0, 0, 1], [0, 1, 1, 1]],
  0: [[0, 0.28, 0.28, 0], [0.28, 0, 0.72, 0], [0.72, 0, 1, 0.28], [1, 0.28, 1, 0.72], [1, 0.72, 0.72, 1], [0.72, 1, 0.28, 1], [0.28, 1, 0, 0.72], [0, 0.72, 0, 0.28], [0.15, 0.85, 0.85, 0.15]],
  1: [[0.2, 0.2, 0.55, 0], [0.55, 0, 0.55, 1], [0.2, 1, 0.9, 1]],
  2: [[0, 0.24, 0.28, 0], [0.28, 0, 0.72, 0], [0.72, 0, 1, 0.26], [1, 0.26, 0, 1], [0, 1, 1, 1]],
  3: [[0, 0.16, 0.3, 0], [0.3, 0, 0.72, 0], [0.72, 0, 1, 0.25], [1, 0.25, 0.66, 0.5], [0.66, 0.5, 1, 0.75], [1, 0.75, 0.72, 1], [0.72, 1, 0.3, 1], [0.3, 1, 0, 0.84]],
  4: [[0.75, 0, 0, 0.7], [0, 0.7, 1, 0.7], [0.75, 0.36, 0.75, 1]],
  5: [[1, 0, 0.1, 0], [0.1, 0, 0, 0.45], [0, 0.45, 0.66, 0.42], [0.66, 0.42, 1, 0.7], [1, 0.7, 0.7, 1], [0.7, 1, 0.24, 1], [0.24, 1, 0, 0.86]],
  6: [[0.9, 0.06, 0.3, 0], [0.3, 0, 0, 0.4], [0, 0.4, 0, 0.76], [0, 0.76, 0.3, 1], [0.3, 1, 0.7, 1], [0.7, 1, 1, 0.74], [1, 0.74, 0.7, 0.48], [0.7, 0.48, 0.1, 0.5]],
  7: [[0, 0, 1, 0], [1, 0, 0.32, 1]],
  8: [[0.28, 0.48, 0, 0.24], [0, 0.24, 0.28, 0], [0.28, 0, 0.72, 0], [0.72, 0, 1, 0.24], [1, 0.24, 0.72, 0.48], [0.72, 0.48, 1, 0.74], [1, 0.74, 0.72, 1], [0.72, 1, 0.28, 1], [0.28, 1, 0, 0.74], [0, 0.74, 0.28, 0.48], [0.28, 0.48, 0.72, 0.48]],
  9: [[0.1, 0.94, 0.7, 1], [0.7, 1, 1, 0.6], [1, 0.6, 1, 0.24], [1, 0.24, 0.7, 0], [0.7, 0, 0.3, 0], [0.3, 0, 0, 0.26], [0, 0.26, 0.3, 0.52], [0.3, 0.52, 0.9, 0.5]],
  '.': [[0.5, 0.97, 0.5, 1]],
  ',': [[0.5, 0.95, 0.32, 1.14]],
  '·': [[0.5, 0.5, 0.5, 0.53]],
  '×': [[0.16, 0.32, 0.84, 0.78], [0.84, 0.32, 0.16, 0.78]],
  '—': [[0, 0.55, 1, 0.55]],
  '-': [[0.14, 0.55, 0.86, 0.55]],
  '/': [[0.9, 0, 0.1, 1]],
  "'": [[0.5, 0, 0.42, 0.24]],
  '&': [[1, 1, 0.18, 0.14], [0.18, 0.14, 0.42, 0], [0.42, 0, 0.62, 0.2], [0.62, 0.2, 0, 0.72], [0, 0.72, 0.22, 1], [0.22, 1, 0.62, 0.84], [0.62, 0.84, 0.96, 0.5]],
}

/* advance widths as a fraction of cap height — a condensed geometric face */
const WIDTH = { I: 0.16, M: 0.92, W: 0.96, '·': 0.3, '.': 0.24, ',': 0.24, "'": 0.2, '—': 0.8, '-': 0.46, ' ': 0.3 }
const widthOf = (ch) => WIDTH[ch] ?? 0.72

/* measure a string in ems (cap-height units) */
function measure(text, tracking) {
  let w = 0
  for (const ch of text) w += widthOf(ch) + tracking
  return w - tracking
}

/* largest cap height at which `text` still fits `maxWidth` */
const fit = (text, maxWidth, tracking, cap) => Math.min(cap, maxWidth / measure(text, tracking))

/* draw `text` with cap-height `size` px, left baseline-top at (x, y) */
function drawText(c, text, x, y, size, { weight = 0.08, tracking = 0.16, color }) {
  let cx = x
  const half = (weight * size) / 2
  for (const ch of text) {
    const g = GLYPHS[ch.toUpperCase()]
    // glyph outlines are unit-width: x scales by the glyph's own advance,
    // y by the cap height, so a narrow 'I' stays narrow instead of overlapping
    const w = widthOf(ch) * size
    if (g) {
      for (const [ax, ay, bx, by] of g) {
        const p = [cx + ax * w, y + ay * size, cx + bx * w, y + by * size]
        draw(c, {
          sdf: (px, py) => sdSegment(px, py, p[0], p[1], p[2], p[3]) - half,
          color,
          bbox: bboxOf([[p[0], p[1]], [p[2], p[3]]], half + 2),
        })
      }
    }
    cx += w + tracking * size
  }
  return cx - tracking * size
}

/* ————————————————————————— outputs ————————————————————————— */

/* --- favicon.svg --- */
const FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <defs>
    <linearGradient id="g" x1="8" y1="8" x2="42" y2="42" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#7DF0FF"/><stop offset=".55" stop-color="#22D3EE"/><stop offset="1" stop-color="#0E7490"/>
    </linearGradient>
  </defs>
  <circle cx="23" cy="23" r="14.5" stroke="url(#g)" stroke-width="3.6" stroke-linecap="round" stroke-dasharray="75.6 15.5" stroke-dashoffset="-87.46"/>
  <path d="M27.5 27.5 L39.5 39.5" stroke="url(#g)" stroke-width="3.6" stroke-linecap="round"/>
  <circle cx="23" cy="23" r="14.5" stroke="#B5F5FF" stroke-width="3.6" stroke-linecap="round" stroke-dasharray="6 85.1" stroke-dashoffset="-76.71"/>
</svg>
`
writeFileSync(join(PUB, 'favicon.svg'), FAVICON)

/* --- app icons --- */
function icon(size, { pad = 0.16, rounded = true } = {}) {
  const c = createCanvas(size, size)
  const r = rounded ? size * 0.22 : 0
  paint(c, (x, y) => {
    if (rounded && sdRoundRect(x, y, size / 2, size / 2, size / 2, size / 2, r) > 0) return null
    const t = clamp01((x + y) / (size * 2))
    return mix(C.bg, C.bgLift, t)
  })
  const s = (size * (1 - pad * 2)) / 48
  drawMark(c, size * pad, size * pad + size * 0.02, s)
  return encodePng(size, size, toRgba(c))
}

writeFileSync(join(PUB, 'icon-192.png'), icon(192))
writeFileSync(join(PUB, 'icon-512.png'), icon(512))
writeFileSync(join(PUB, 'apple-touch-icon.png'), icon(180, { pad: 0.2 }))

/* --- og:image --- */
function ogCard() {
  const W = 1200
  const H = 630
  const c = createCanvas(W, H)

  // base: deep sea lifting slightly, one pool of cyan light top-right
  paint(c, (x, y) => {
    const v = mix(C.bg, C.bgLift, clamp01(y / H) * 0.6)
    const d1 = Math.hypot(x - 1080, y - 60) / 720
    const g1 = Math.max(0, 1 - d1) ** 2.4
    return [
      v[0] + C.cyanDeep[0] * g1 * 0.22,
      v[1] + C.cyanDeep[1] * g1 * 0.22,
      v[2] + C.cyanDeep[2] * g1 * 0.22,
    ]
  })

  // top hairline in the signature gradient
  draw(c, {
    sdf: (x, y) => Math.abs(y - 3) - 3,
    color: lin(0, 0, W, 0, [[0, C.cyanBright], [0.5, C.cyan], [1, C.teal]]),
    bbox: [0, 0, W, 8],
  })

  drawMark(c, 96, 96, 2.5) // 48 * 2.5 = 120px mark

  const gText = lin(96, 250, 900, 340, [[0, C.cyanPale], [0.5, C.cyan], [1, C.teal]])
  const M = 96 // left margin
  const COL = W - M * 2 // usable column

  drawText(c, 'FORGEQUBIT', 250, 118, 42, { weight: 0.14, tracking: 0.16, color: gText })
  drawText(c, 'AI SYSTEMS FOR BUSINESS', 252, 178, 15, { weight: 0.15, tracking: 0.6, color: flat(C.inkDim) })

  // headline — two lines, sized together so they share one optical weight
  const l1 = 'AI SYSTEMS THAT ANSWER CUSTOMERS'
  const l2 = 'AND MOVE WORK FORWARD'
  const cap = Math.min(fit(l1, COL, 0.12, 62), fit(l2, COL, 0.12, 62))
  drawText(c, l1, M, 292, cap, { weight: 0.12, tracking: 0.12, color: flat(C.ink) })
  drawText(c, l2, M, 292 + cap * 1.55, cap, { weight: 0.12, tracking: 0.12, color: gText })

  // rule
  draw(c, {
    sdf: (x, y) => Math.abs(y - 508) - 1,
    color: lin(M, 0, 760, 0, [[0, C.cyan], [1, [0.06, 0.1, 0.13]]]),
    bbox: [M, 503, 800, 515],
  })

  const strip = 'AI RECEPTION · WORKFLOW AUTOMATION · CUSTOM AI PRODUCTS'
  drawText(c, strip, M, 546, fit(strip, COL, 0.3, 19), {
    weight: 0.14,
    tracking: 0.3,
    color: flat(C.inkDim),
  })

  return encodePng(W, H, toRgba(c))
}

writeFileSync(join(PUB, 'og.png'), ogCard())

console.log('generated favicon.svg, icon-192/512, apple-touch-icon, og.png')
