import * as THREE from 'three'
import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RoundedBox, Edges } from '@react-three/drei'
import { scroll, pointer } from './input.js'

export const STATIONS_COUNT = 9

/* ————————————————————————————————————————
   THE ROUTE — one winding road through the dark forge.
   The camera travels along it; stations sit beside it.

   Glow is done with additive sprites rather than a bloom pass: the
   old EffectComposer cost three full-screen passes every frame and
   ~90 kB of JS, and this reads almost identically in motion.
   ———————————————————————————————————————— */

const U_END = 0.93 // camera never quite reaches the end of the curve
const AHEAD = 0.05 // stations sit this far ahead of the camera's arrival point

const curve = new THREE.CatmullRomCurve3(
  Array.from({ length: 12 }, (_, k) =>
    new THREE.Vector3(Math.sin(k * 0.9) * 6.5, Math.sin(k * 0.55) * 2.0, -k * 13)
  ),
  false,
  'catmullrom',
  0.5
)

// which side of the road each station sits on (+1 right, -1 left)
const SIDES = [0.35, 0, -1, 1, -1, 1, -1, 1, 0.12]
const Y_OFF = [0, -4.5, 0, 0, 0, 0, 0, 0, 0]

const STATIONS = SIDES.map((side, i) => {
  const u = Math.min((i / (STATIONS_COUNT - 1)) * U_END + AHEAD, 0.995)
  const base = curve.getPointAt(u)
  const tangent = curve.getTangentAt(u)
  const right = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 1, 0)).normalize()
  const pos = base.clone().addScaledVector(right, side * 3.3)
  pos.y += Y_OFF[i]
  const camAnchor = curve.getPointAt((i / (STATIONS_COUNT - 1)) * U_END)
  camAnchor.y += 0.4
  return { pos, camAnchor }
})

const easeOut = (t) => 1 - Math.pow(1 - t, 3)
const clamp01 = (v) => Math.min(1, Math.max(0, v))

/* ember-black palette — heat without the neon */
const BG = '#07040A'
const HOT = '#ffd5a0'
const CHAR = '#241610'
const LINE = '#5c3320'
const DIM = '#6e5540'
const MOLTEN = '#e2560f'
const LAVA = '#8f2606'
const GOLD = '#d3913d'
const VIOLET = '#5c2e7a'

/* obsidian — dark glassy metal with a faint inner heat */
const Obsidian = (props) => (
  <meshStandardMaterial
    color="#251811"
    roughness={0.32}
    metalness={0.55}
    emissive="#180a05"
    emissiveIntensity={0.3}
    {...props}
  />
)

const Molten = (props) => (
  <meshStandardMaterial
    color={MOLTEN}
    roughness={0.32}
    emissive={LAVA}
    emissiveIntensity={0.75}
    {...props}
  />
)

/* ———————————————————— the glow sprite ———————————————————— */

let glowTexture = null
function getGlowTexture() {
  if (glowTexture) return glowTexture
  const S = 128
  const cv = document.createElement('canvas')
  cv.width = cv.height = S
  const ctx = cv.getContext('2d')
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2)
  // a tight hot core with a long, soft falloff — reads like bloom
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.12, 'rgba(255,255,255,0.62)')
  g.addColorStop(0.35, 'rgba(255,255,255,0.19)')
  g.addColorStop(0.7, 'rgba(255,255,255,0.04)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, S, S)
  glowTexture = new THREE.CanvasTexture(cv)
  glowTexture.needsUpdate = true
  return glowTexture
}

function Glow({ size = 2, color = MOLTEN, opacity = 0.5, ...rest }) {
  const map = useMemo(getGlowTexture, [])
  return (
    <sprite scale={[size, size, 1]} {...rest}>
      <spriteMaterial
        map={map}
        color={color}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        depthTest={false}
        toneMapped={false}
      />
    </sprite>
  )
}

/* ———————————————————— station shell ———————————————————— */

function Station({ index, face = false, spin = 0, glow = 5, children }) {
  const outer = useRef()
  const inner = useRef()
  const { pos, camAnchor } = STATIONS[index]
  useFrame((state, delta) => {
    const cur = scroll.journey * (STATIONS_COUNT - 1)
    const near = easeOut(clamp01(1.8 - Math.abs(cur - index)))
    const target = 0.8 + 0.2 * near
    const s = THREE.MathUtils.damp(outer.current.scale.x, target, 4.5, delta)
    outer.current.scale.setScalar(s)
    if (spin) inner.current.rotation.y += delta * spin
    inner.current.position.y = Math.sin(state.clock.elapsedTime * 0.55 + index * 1.9) * 0.12
  })
  return (
    <group ref={outer} position={pos} onUpdate={(g) => { if (face) g.lookAt(camAnchor) }}>
      <pointLight color={MOLTEN} intensity={16} distance={8.5} decay={1.9} position={[0, 0.6, 1.6]} />
      <Glow size={glow} color={LAVA} opacity={0.42} position={[0, 0, -0.6]} />
      <group ref={inner}>{children}</group>
    </group>
  )
}

/* ———————————————————— the road itself — a vein of lava ———————————————————— */

function Road({ quality }) {
  const core = useMemo(() => new THREE.TubeGeometry(curve, quality.roadSegments, 0.03, 6), [quality])
  const glow = useMemo(() => new THREE.TubeGeometry(curve, 120, 0.11, 6), [])
  const pulses = useRef([])
  const defs = useMemo(() => {
    const rng = mulberry(5)
    return Array.from({ length: quality.pulses }, () => ({ speed: 0.008 + rng() * 0.014, phase: rng() }))
  }, [quality])
  const tmp = useMemo(() => new THREE.Vector3(), [])
  useFrame((state) => {
    const t = state.clock.elapsedTime
    for (let i = 0; i < defs.length; i++) {
      const m = pulses.current[i]
      if (!m) continue
      curve.getPointAt((t * defs[i].speed + defs[i].phase) % 1, tmp)
      m.position.copy(tmp)
    }
  })
  return (
    <group>
      <mesh geometry={core}>
        <meshBasicMaterial color="#e2560f" toneMapped={false} />
      </mesh>
      <mesh geometry={glow}>
        <meshBasicMaterial
          color={LAVA}
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {defs.map((_, i) => (
        <group key={i} ref={(el) => (pulses.current[i] = el)}>
          <Glow size={0.9} color="#ff9a4a" opacity={0.85} />
        </group>
      ))}
    </group>
  )
}

/* ———————————————————— embers drifting through the forge ———————————————————— */

function Embers({ quality }) {
  const points = useRef()
  const { positions, seeds, N } = useMemo(() => {
    const rng = mulberry(99)
    const N = quality.embers
    const positions = new Float32Array(N * 3)
    // flat typed arrays rather than objects — this loop runs every frame
    const seeds = new Float32Array(N * 5)
    for (let i = 0; i < N; i++) {
      const p = curve.getPointAt(rng())
      seeds[i * 5] = p.x + (rng() - 0.5) * 14 // x
      seeds[i * 5 + 1] = p.y - 4 + rng() * 9 // y
      seeds[i * 5 + 2] = p.z + (rng() - 0.5) * 14 // z
      seeds[i * 5 + 3] = 0.22 + rng() * 0.5 // rise speed
      seeds[i * 5 + 4] = rng() * Math.PI * 2 // sway phase
      positions[i * 3] = seeds[i * 5]
      positions[i * 3 + 1] = seeds[i * 5 + 1]
      positions[i * 3 + 2] = seeds[i * 5 + 2]
    }
    return { positions, seeds, N }
  }, [quality])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const arr = points.current.geometry.attributes.position.array
    for (let i = 0; i < N; i++) {
      const b = i * 5
      let y = seeds[b + 1] + seeds[b + 3] * delta
      if (y > seeds[b + 2] * 0.02 + 7) y -= 12 // recycle from below
      seeds[b + 1] = y
      const sway = seeds[b + 4]
      arr[i * 3] = seeds[b] + Math.sin(t * 0.8 + sway) * 0.28
      arr[i * 3 + 1] = y
      arr[i * 3 + 2] = seeds[b + 2] + Math.cos(t * 0.6 + sway) * 0.17
    }
    points.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#ff8a3a"
        size={0.07}
        sizeAttenuation
        transparent
        opacity={0.72}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  )
}

/* ———————————————————— 00 · hero: the network core ———————————————————— */

function NetworkCore() {
  const shell = useRef()
  const heart = useRef()
  const { nodes, lineGeo } = useMemo(() => {
    const pts = []
    const N = 42
    const R = 2.0
    for (let i = 0; i < N; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / N)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      pts.push(new THREE.Vector3(
        R * Math.sin(phi) * Math.cos(theta),
        R * Math.cos(phi),
        R * Math.sin(phi) * Math.sin(theta)
      ))
    }
    const segs = []
    for (let i = 0; i < pts.length; i++)
      for (let j = i + 1; j < pts.length; j++)
        if (pts[i].distanceTo(pts[j]) < 1.1) segs.push(pts[i], pts[j])
    return { nodes: pts, lineGeo: new THREE.BufferGeometry().setFromPoints(segs) }
  }, [])
  useFrame((state, delta) => {
    shell.current.rotation.y += delta * 0.08
    shell.current.rotation.x += delta * 0.02
    heart.current.scale.setScalar(1 + 0.12 * Math.sin(state.clock.elapsedTime * 2.2))
  })
  return (
    <group>
      <group ref={shell}>
        {nodes.map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshBasicMaterial color={i % 9 === 0 ? MOLTEN : DIM} />
          </mesh>
        ))}
        <lineSegments geometry={lineGeo}>
          <lineBasicMaterial color={LINE} transparent opacity={0.55} />
        </lineSegments>
        <mesh>
          <icosahedronGeometry args={[1.15, 1]} />
          <meshBasicMaterial color={CHAR} wireframe transparent opacity={0.7} />
        </mesh>
      </group>
      <mesh ref={heart}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshBasicMaterial color="#ff7a2a" toneMapped={false} />
      </mesh>
      <Glow size={2.6} color="#ff7a2a" opacity={0.75} />
    </group>
  )
}

/* ———————————————————— 01 · the terrain map ———————————————————— */

function TerrainMap() {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(34, 38, 34, 38)
    const p = g.attributes.position
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i)
      const y = p.getY(i)
      p.setZ(i, Math.sin(x * 0.32) * Math.cos(y * 0.27) * 1.3 + Math.sin(x * 0.85 + y * 0.55) * 0.4)
    }
    g.computeVertexNormals()
    return g
  }, [])
  return (
    <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]}>
      <meshBasicMaterial color="#8a3a14" wireframe transparent opacity={0.3} />
    </mesh>
  )
}

/* ———————————————————— 02 · whatsapp: the conversation ———————————————————— */

const BUBBLES = [
  { w: 2.2, x: -0.55, y: 1.35, mine: false },
  { w: 1.5, x: 0.75, y: 0.55, mine: true },
  { w: 2.4, x: -0.45, y: -0.25, mine: false },
  { w: 1.1, x: 0.85, y: -1.05, mine: true, typing: true },
]

function ChatBubbles() {
  const refs = useRef([])
  const dots = useRef([])
  useFrame((state) => {
    const t = state.clock.elapsedTime
    for (let i = 0; i < refs.current.length; i++) {
      const b = refs.current[i]
      if (b) b.position.y = BUBBLES[i].y + Math.sin(t * 1.1 + i * 1.4) * 0.05
    }
    for (let i = 0; i < dots.current.length; i++) {
      const d = dots.current[i]
      if (d) d.position.y = Math.abs(Math.sin(t * 3.4 - i * 0.45)) * 0.09
    }
  })
  return (
    <group>
      {BUBBLES.map((b, i) => (
        <group key={i} ref={(el) => (refs.current[i] = el)} position={[b.x, b.y, i * 0.06]}>
          <RoundedBox args={[b.w, 0.58, 0.2]} radius={0.09} smoothness={3}>
            {b.mine ? <Molten /> : <Obsidian />}
          </RoundedBox>
          {!b.mine && (
            <>
              <mesh position={[-b.w * 0.12, 0.07, 0.11]}>
                <boxGeometry args={[b.w * 0.62, 0.05, 0.01]} />
                <meshBasicMaterial color={LINE} />
              </mesh>
              <mesh position={[-b.w * 0.22, -0.08, 0.11]}>
                <boxGeometry args={[b.w * 0.42, 0.05, 0.01]} />
                <meshBasicMaterial color={LINE} />
              </mesh>
            </>
          )}
          {b.typing && (
            <group position={[0, -0.03, 0.13]}>
              {[-1, 0, 1].map((k, j) => (
                <mesh key={k} position={[k * 0.16, 0, 0]} ref={(el) => (dots.current[j] = el)}>
                  <sphereGeometry args={[0.045, 8, 8]} />
                  <meshBasicMaterial color={HOT} toneMapped={false} />
                </mesh>
              ))}
            </group>
          )}
        </group>
      ))}
    </group>
  )
}

/* ———————————————————— 03 · voice: the waveform ———————————————————— */

function Waveform() {
  const bars = useRef([])
  const COUNT = 25
  useFrame((state) => {
    const t = state.clock.elapsedTime
    for (let i = 0; i < COUNT; i++) {
      const b = bars.current[i]
      if (!b) continue
      const env = Math.exp(-Math.pow((i - COUNT / 2) / 9, 2))
      b.scale.y = 0.18 + Math.abs(Math.sin(t * 1.9 + i * 0.65) * Math.sin(t * 0.7 + i * 1.3)) * 2.2 * env
    }
  })
  return (
    <group>
      {Array.from({ length: COUNT }, (_, i) => (
        <mesh key={i} position={[(i - COUNT / 2) * 0.22, 0, 0]} ref={(el) => (bars.current[i] = el)}>
          <cylinderGeometry args={[0.055, 0.055, 1, 8]} />
          {Math.abs(i - Math.floor(COUNT / 2)) < 3 ? <Molten /> : <Obsidian />}
        </mesh>
      ))}
    </group>
  )
}

/* ———————————————————— 04 · avatar: the digital head ———————————————————— */

function AvatarHead() {
  const scanner = useRef()
  const profile = useMemo(() => {
    const COUNT = 22
    return Array.from({ length: COUNT }, (_, i) => {
      const u = i / (COUNT - 1)
      return { y: -1.55 + u * 3.1, r: 0.26 + 0.82 * Math.sin(Math.PI * Math.pow(u, 0.72)) }
    })
  }, [])
  useFrame((state) => {
    const t = state.clock.elapsedTime
    scanner.current.position.y = Math.sin(t * 0.8) * 1.45
    const u = (scanner.current.position.y + 1.55) / 3.1
    scanner.current.scale.setScalar(0.26 + 0.82 * Math.sin(Math.PI * Math.pow(clamp01(u), 0.72)) + 0.12)
  })
  return (
    <group>
      {profile.map((p, i) => (
        <mesh key={i} position={[0, p.y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[p.r, 0.016, 6, 48]} />
          {i % 5 === 0
            ? <meshStandardMaterial color={CHAR} roughness={0.3} metalness={0.5} emissive={LAVA} emissiveIntensity={0.3} />
            : <Obsidian />}
        </mesh>
      ))}
      <mesh ref={scanner} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.022, 6, 48]} />
        <meshBasicMaterial color="#ff7a2a" toneMapped={false} />
      </mesh>
    </group>
  )
}

/* ———————————————————— 05 · custom agents: the orchestration graph ———————————————————— */

function AgentGraph() {
  const pulses = useRef([])
  const { nodePos, lineGeo } = useMemo(() => {
    const rng = mulberry(17)
    const pts = Array.from({ length: 9 }, () => {
      const v = new THREE.Vector3(rng() - 0.5, rng() - 0.5, rng() - 0.5).normalize()
      return v.multiplyScalar(1.5 + rng() * 0.9)
    })
    const segs = []
    pts.forEach((p) => segs.push(new THREE.Vector3(0, 0, 0), p))
    return { nodePos: pts, lineGeo: new THREE.BufferGeometry().setFromPoints(segs) }
  }, [])
  useFrame((state) => {
    const t = state.clock.elapsedTime
    for (let i = 0; i < pulses.current.length; i++) {
      const m = pulses.current[i]
      if (!m) continue
      const target = nodePos[(i * 2 + 1) % nodePos.length]
      m.position.copy(target).multiplyScalar((t * (0.3 + i * 0.07) + i * 0.31) % 1)
    }
  })
  return (
    <group>
      <RoundedBox args={[0.6, 0.6, 0.6]} radius={0.08} smoothness={3}>
        <Obsidian roughness={0.25} />
        <Edges color={MOLTEN} />
      </RoundedBox>
      {nodePos.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.13, 12, 12]} />
          {i % 4 === 0
            ? <meshStandardMaterial color={GOLD} roughness={0.3} emissive="#8a4a10" emissiveIntensity={0.6} />
            : <Obsidian />}
        </mesh>
      ))}
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color={LINE} transparent opacity={0.7} />
      </lineSegments>
      {Array.from({ length: 4 }, (_, i) => (
        <group key={i} ref={(el) => (pulses.current[i] = el)}>
          <Glow size={0.55} color={HOT} opacity={0.9} />
        </group>
      ))}
    </group>
  )
}

/* ———————————————————— 06 · saas: the floating product ———————————————————— */

function ProductDashboard() {
  const cardA = useRef()
  const cardB = useRef()
  const chart = useRef([])
  useFrame((state) => {
    const t = state.clock.elapsedTime
    cardA.current.position.y = 0.55 + Math.sin(t * 1.2) * 0.08
    cardB.current.position.y = -0.75 + Math.sin(t * 1.4 + 2) * 0.08
    for (let i = 0; i < chart.current.length; i++) {
      const b = chart.current[i]
      if (b) b.scale.y = 0.5 + Math.abs(Math.sin(t * 0.9 + i * 1.1)) * 0.9
    }
  })
  return (
    <group>
      <RoundedBox args={[3.3, 2.15, 0.12]} radius={0.08} smoothness={3}>
        <Obsidian roughness={0.2} />
      </RoundedBox>
      <mesh position={[0, 0.88, 0.075]}>
        <boxGeometry args={[3.0, 0.14, 0.01]} />
        <meshBasicMaterial color={CHAR} />
      </mesh>
      <mesh position={[-1.36, 0.88, 0.08]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color={MOLTEN} />
      </mesh>
      <mesh position={[-1.28, -0.12, 0.075]}>
        <boxGeometry args={[0.5, 1.55, 0.01]} />
        <meshBasicMaterial color="#180e08" />
      </mesh>
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={i} position={[-0.55 + i * 0.34, -0.45, 0.09]} ref={(el) => (chart.current[i] = el)}>
          <boxGeometry args={[0.18, 0.8, 0.02]} />
          <meshBasicMaterial color={i === 3 ? MOLTEN : LINE} />
        </mesh>
      ))}
      <group ref={cardA} position={[2.0, 0.55, 0.55]}>
        <RoundedBox args={[1.15, 0.75, 0.08]} radius={0.06} smoothness={3}>
          <Obsidian />
        </RoundedBox>
        <mesh position={[0, 0.12, 0.05]}>
          <boxGeometry args={[0.8, 0.07, 0.01]} />
          <meshBasicMaterial color={MOLTEN} />
        </mesh>
        <mesh position={[-0.12, -0.12, 0.05]}>
          <boxGeometry args={[0.55, 0.06, 0.01]} />
          <meshBasicMaterial color={LINE} />
        </mesh>
      </group>
      <group ref={cardB} position={[-1.95, -0.75, 0.7]}>
        <RoundedBox args={[0.95, 0.95, 0.08]} radius={0.06} smoothness={3}>
          <Obsidian />
        </RoundedBox>
        <mesh position={[0, 0, 0.05]} rotation={[0, 0, 0.5]}>
          <torusGeometry args={[0.24, 0.05, 6, 32, 4.2]} />
          <meshBasicMaterial color={GOLD} />
        </mesh>
      </group>
    </group>
  )
}

/* ———————————————————— 07 · blockchain: the linked ledger ———————————————————— */

function BlockChain() {
  const cubes = useRef([])
  const lineGeo = useMemo(() => {
    const pts = []
    for (let i = 0; i < 4; i++) {
      pts.push(new THREE.Vector3((i - 2) * 1.15, (i % 2 ? 0.28 : -0.28), 0))
      pts.push(new THREE.Vector3((i - 1) * 1.15, ((i + 1) % 2 ? 0.28 : -0.28), 0))
    }
    return new THREE.BufferGeometry().setFromPoints(pts)
  }, [])
  useFrame((state, delta) => {
    for (let i = 0; i < cubes.current.length; i++) {
      const c = cubes.current[i]
      if (!c) continue
      c.rotation.x += delta * (0.15 + i * 0.05)
      c.rotation.y += delta * 0.2
    }
  })
  return (
    <group>
      {Array.from({ length: 5 }, (_, i) => (
        <mesh
          key={i}
          position={[(i - 2) * 1.15, (i % 2 ? 0.28 : -0.28), 0]}
          ref={(el) => (cubes.current[i] = el)}
        >
          <boxGeometry args={[0.55, 0.55, 0.55]} />
          {i === 2 ? <Molten emissiveIntensity={0.6} /> : <Obsidian roughness={0.22} metalness={0.6} />}
          <Edges color={i === 2 ? GOLD : LINE} />
        </mesh>
      ))}
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color={LINE} />
      </lineSegments>
    </group>
  )
}

/* ———————————————————— 08 · finale: the forge gate ———————————————————— */

function ForgeGate() {
  const ring = useRef()
  const disc = useRef()
  const sparks = useRef([])
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    ring.current.rotation.z += delta * 0.12
    disc.current.material.opacity = 0.16 + Math.sin(t * 1.4) * 0.05
    for (let i = 0; i < sparks.current.length; i++) {
      const s = sparks.current[i]
      if (!s) continue
      const a = t * (0.25 + (i % 3) * 0.04) + i * ((Math.PI * 2) / 14)
      s.position.set(Math.cos(a) * 1.66, Math.sin(a) * 1.66, Math.sin(t * 1.2 + i) * 0.08)
    }
  })
  return (
    <group>
      <mesh ref={ring}>
        <torusGeometry args={[1.6, 0.08, 12, 64]} />
        <Molten emissiveIntensity={0.6} />
      </mesh>
      <mesh>
        <torusGeometry args={[1.8, 0.018, 6, 64]} />
        <meshBasicMaterial color={LINE} />
      </mesh>
      <mesh ref={disc}>
        <circleGeometry args={[1.5, 40]} />
        <meshBasicMaterial
          color={LAVA}
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {Array.from({ length: 14 }, (_, i) => (
        <group key={i} ref={(el) => (sparks.current[i] = el)}>
          <Glow size={0.5} color={HOT} opacity={0.8} />
        </group>
      ))}
      <Glow size={7} color={MOLTEN} opacity={0.5} position={[0, 0, -0.4]} />
    </group>
  )
}

/* ———————————————————— camera rig ———————————————————— */

function Rig() {
  const look = useRef(new THREE.Vector3(0, 0, -10))
  const roll = useRef(0)
  const lamp = useRef()
  const u = useRef(0)
  const pos = useMemo(() => new THREE.Vector3(), [])
  const target = useMemo(() => new THREE.Vector3(), [])
  const tangent = useMemo(() => new THREE.Vector3(), [])

  useFrame((state, delta) => {
    /* Damping toward the scroll position is what makes this feel
       cinematic: the DOM moves instantly and natively, the camera
       glides after it. Frame-rate independent, so 120 Hz displays
       get the same motion as 60 Hz. */
    u.current = THREE.MathUtils.damp(u.current, clamp01(scroll.journey) * U_END, 6, delta)
    const uu = u.current

    curve.getPointAt(uu, pos)
    pos.y += 0.4
    state.camera.position.copy(pos)

    curve.getPointAt(Math.min(uu + 0.05, 1), target)
    target.x += pointer.x * 0.9
    target.y += pointer.y * 0.5
    look.current.x = THREE.MathUtils.damp(look.current.x, target.x, 3, delta)
    look.current.y = THREE.MathUtils.damp(look.current.y, target.y, 3, delta)
    look.current.z = THREE.MathUtils.damp(look.current.z, target.z, 3, delta)
    state.camera.lookAt(look.current)

    // subtle banking into the bends + against the pointer
    curve.getTangentAt(uu, tangent)
    roll.current = THREE.MathUtils.damp(roll.current, -tangent.x * 0.1 - pointer.x * 0.03, 2.5, delta)
    state.camera.rotateZ(roll.current)

    if (lamp.current) lamp.current.position.set(pos.x, pos.y + 1.2, pos.z)
  })

  return <pointLight ref={lamp} color="#e08a4d" intensity={55} distance={26} decay={1.7} />
}

/* Drops the renderer's pixel ratio if frames start costing too much —
   a cheap way to keep motion smooth on integrated GPUs. */
function AdaptiveResolution({ max }) {
  const setDpr = useThree((s) => s.setDpr)
  const acc = useRef({ t: 0, n: 0, level: max })
  useFrame((_, delta) => {
    const a = acc.current
    a.t += delta
    a.n++
    if (a.t < 1.2) return
    const fps = a.n / a.t
    a.t = 0
    a.n = 0
    if (fps < 45 && a.level > 1) {
      a.level = Math.max(1, a.level - 0.25)
      setDpr(a.level)
    } else if (fps > 58 && a.level < max) {
      a.level = Math.min(max, a.level + 0.25)
      setDpr(a.level)
    }
  })
  return null
}

export default function Experience({ quality }) {
  const { gl } = useThree()
  useEffect(() => () => { glowTexture?.dispose(); glowTexture = null }, [])
  useEffect(() => { gl.setClearColor(BG) }, [gl])

  return (
    <>
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 12, 34]} />

      <ambientLight intensity={0.5} color="#3a2030" />
      <directionalLight position={[5, 8, 6]} intensity={0.85} color="#f0a066" />
      <directionalLight position={[-6, -3, -4]} intensity={0.4} color={VIOLET} />

      <Road quality={quality} />
      <Embers quality={quality} />
      <Rig />
      {quality.adaptive && <AdaptiveResolution max={quality.dpr} />}

      <Station index={0}><NetworkCore /></Station>
      <Station index={1} glow={9}><TerrainMap /></Station>
      <Station index={2} face><ChatBubbles /></Station>
      <Station index={3} face><Waveform /></Station>
      <Station index={4} spin={0.25}><AvatarHead /></Station>
      <Station index={5} spin={0.18}><AgentGraph /></Station>
      <Station index={6} face glow={7}><ProductDashboard /></Station>
      <Station index={7} face><BlockChain /></Station>
      <Station index={8} face glow={8}><ForgeGate /></Station>
    </>
  )
}

/* deterministic prng so layouts are stable between reloads */
function mulberry(seed) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
