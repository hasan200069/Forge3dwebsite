import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import Experience from './Experience.jsx'

/* Two quality tiers. The low tier is for coarse-pointer devices and
   machines that report few cores — fewer particles, a smaller pixel
   ratio, and no adaptive-resolution probe (which itself costs a frame
   counter and a renderer resize when it trips). */
const TIERS = {
  high: { dpr: 1.5, embers: 260, pulses: 8, roadSegments: 240, adaptive: true },
  low: { dpr: 1.1, embers: 90, pulses: 4, roadSegments: 130, adaptive: false },
}

export function pickTier() {
  if (typeof window === 'undefined') return 'low'
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const thin = (navigator.hardwareConcurrency || 8) <= 4
  return coarse || thin ? 'low' : 'high'
}

export default function Scene({ tier = 'high' }) {
  const quality = TIERS[tier] ?? TIERS.high
  return (
    <Canvas
      dpr={[1, quality.dpr]}
      camera={{ position: [0, 0, 13], fov: 42 }}
      /* nothing in the scene is interactive, so r3f's event system is
         pure overhead — the pointer parallax reads window events instead */
      events={false}
      gl={{
        antialias: false,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
        alpha: false,
      }}
    >
      <Experience quality={quality} />
      {/* compile every station's shaders up front so nothing hitches
          the first time it scrolls into view */}
      <Preload all />
    </Canvas>
  )
}
