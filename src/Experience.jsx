import * as THREE from 'three'
import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll, RoundedBox, Edges } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'

const SECTIONS = 9

/* ————————————————————————————————————————
   THE ROUTE — one winding road through the dark forge.
   The camera travels along it; stations sit beside it.
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
  const u = Math.min((i / (SECTIONS - 1)) * U_END + AHEAD, 0.995)
  const base = curve.getPointAt(u)
  const tangent = curve.getTangentAt(u)
  const right = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 1, 0)).normalize()
  const pos = base.clone().addScaledVector(right, side * 3.3)
  pos.y += Y_OFF[i]
  const camAnchor = curve.getPointAt((i / (SECTIONS - 1)) * U_END)
  camAnchor.y += 0.4
  return { pos, camAnchor }
})

const easeOut = (t) => 1 - Math.pow(1 - t, 3)
const clamp01 = (v) => Math.min(1, Math.max(0, v))

/* ember-black palette — heat without the neon */
const BG = '#080302'
const HOT = '#eec084' // warm white-hot, muted
const CHAR = '#241610' // charred surfaces
const LINE = '#54301a' // ember lines
const DIM = '#6e5540' // dim metal nodes
const MOLTEN = '#cf4514'
const LAVA = '#992200'
const GOLD = '#d3913d'

/* obsidian replaces porcelain — dark glassy metal with a faint inner heat */
const Obsidian = (props) => (
  <meshStandardMaterial
    color="#251811"
    roughness={0.32}
    metalness={0.55}
    emissive="#160804"
    emissiveIntensity={0.3}
    {...props}
  />
)

const Molten = (props) => (
  <meshStandardMaterial
    color={MOLTEN}
    roughness={0.32}
    emissive={LAVA}
    emissiveIntensity={0.7}
    {...props}
  />
)

function Station({ index, face = false, spin = 0, children }) {
  const outer = useRef()
  const inner = useRef()
  const scroll = useScroll()
  const { pos, camAnchor } = STATIONS[index]
  useFrame((state, delta) => {
    const cur = scroll.offset * (SECTIONS - 1)
    const near = easeOut(clamp01(1.8 - Math.abs(cur - index)))
    const target = 0.8 + 0.2 * near
    const s = THREE.MathUtils.damp(outer.current.scale.x, target, 4.5, delta)
    outer.current.scale.setScalar(s)
    if (spin) inner.current.rotation.y += delta * spin
    inner.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.55 + index * 1.9) * 0.12
  })
  return (
    <group
      ref={outer}
      position={pos}
      onUpdate={(g) => { if (face) g.lookAt(camAnchor) }}
    >
      {/* each station radiates its own gentle heat */}
      <pointLight color={MOLTEN} intensity={16} distance={8.5} decay={1.9} position={[0, 0.6, 1.6]} />
      <group ref={inner}>{children}</group>
    </group>
  )
}

/* ———————————————————— the road itself — a vein of lava ———————————————————— */

function Road() {
  const core = useMemo(() => new THREE.TubeGeometry(curve, 260, 0.03, 8), [])
  const glow = useMemo(() => new THREE.TubeGeometry(curve, 180, 0.11, 8), [])
  const pulses = useRef([])
  const defs = useMemo(() => {
    const rng = mulberry(5)
    return Array.from({ length: 8 }, () => ({ speed: 0.008 + rng() * 0.014, phase: rng() }))
  }, [])
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    defs.forEach((d, i) => {
      const m = pulses.current[i]
      if (!m) return
      const u = (t * d.speed + d.phase) % 1
      m.position.copy(curve.getPointAt(u))
    })
  })
  return (
    <group>
      {/* molten core */}
      <mesh geometry={core}>
        <meshBasicMaterial color="#c14a12" toneMapped={false} />
      </mesh>
      {/* soft heat halo around the vein */}
      <mesh geometry={glow}>
        <meshBasicMaterial
          color={LAVA}
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* sparks racing along the vein */}
      {defs.map((_, i) => (
        <mesh key={i} ref={(el) => (pulses.current[i] = el)}>
          <sphereGeometry args={[0.055, 10, 10]} />
          <meshBasicMaterial color={HOT} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

/* ———————————————————— embers drifting through the whole forge ———————————————————— */

function Embers() {
  const points = useRef()
  const { positions, seeds, N } = useMemo(() => {
    const rng = mulberry(99)
    const N = 320
    const positions = new Float32Array(N * 3)
    const seeds = Array.from({ length: N }, () => {
      const p = curve.getPointAt(rng())
      return {
        x: p.x + (rng() - 0.5) * 14,
        y: p.y - 4 + rng() * 9,
        z: p.z + (rng() - 0.5) * 14,
        speed: 0.22 + rng() * 0.5,
        sway: rng() * Math.PI * 2,
        swayAmp: 0.15 + rng() * 0.35,
      }
    })
    seeds.forEach((s, i) => {
      positions[i * 3] = s.x
      positions[i * 3 + 1] = s.y
      positions[i * 3 + 2] = s.z
    })
    return { positions, seeds, N }
  }, [])
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    const arr = points.current.geometry.attributes.position.array
    for (let i = 0; i < N; i++) {
      const s = seeds[i]
      s.y += s.speed * delta
      if (s.y > s.z * 0.02 + 7) s.y -= 12 // recycle from below
      arr[i * 3] = s.x + Math.sin(t * 0.8 + s.sway) * s.swayAmp
      arr[i * 3 + 1] = s.y
      arr[i * 3 + 2] = s.z + Math.cos(t * 0.6 + s.sway) * s.swayAmp * 0.6
    }
    points.current.geometry.attributes.position.needsUpdate = true
    points.current.material.opacity = 0.6 + Math.sin(t * 2.1) * 0.12
  })
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#d9691f"
        size={0.065}
        sizeAttenuation
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
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
    heart.current.scale.setScalar(1 + 0.12 * Math.sin(state.clock.getElapsedTime() * 2.2))
  })
  return (
    <group>
      <group ref={shell}>
        {nodes.map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.045, 10, 10]} />
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
      {/* the molten heart */}
      <mesh ref={heart}>
        <sphereGeometry args={[0.22, 20, 20]} />
        <meshBasicMaterial color="#d94f14" toneMapped={false} />
      </mesh>
    </group>
  )
}

/* ———————————————————— 01 · the terrain map ———————————————————— */

function TerrainMap() {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(34, 38, 38, 42)
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
      <meshBasicMaterial color="#6e2f12" wireframe transparent opacity={0.32} />
    </mesh>
  )
}

/* ———————————————————— 02 · whatsapp: the conversation ———————————————————— */

function ChatBubbles() {
  const refs = useRef([])
  const dots = useRef([])
  const bubbles = [
    { w: 2.2, x: -0.55, y: 1.35, mine: false },
    { w: 1.5, x: 0.75, y: 0.55, mine: true },
    { w: 2.4, x: -0.45, y: -0.25, mine: false },
    { w: 1.1, x: 0.85, y: -1.05, mine: true, typing: true },
  ]
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    refs.current.forEach((b, i) => {
      if (b) b.position.y = bubbles[i].y + Math.sin(t * 1.1 + i * 1.4) * 0.05
    })
    dots.current.forEach((d, i) => {
      if (d) d.position.y = Math.abs(Math.sin(t * 3.4 - i * 0.45)) * 0.09
    })
  })
  return (
    <group>
      {bubbles.map((b, i) => (
        <group key={i} ref={(el) => (refs.current[i] = el)} position={[b.x, b.y, i * 0.06]}>
          <RoundedBox args={[b.w, 0.58, 0.2]} radius={0.09} smoothness={4}>
            {b.mine ? <Molten /> : <Obsidian />}
          </RoundedBox>
          {/* text lines on received bubbles */}
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
          {/* typing dots on the last agent reply */}
          {b.typing && (
            <group position={[0, -0.03, 0.13]}>
              {[-1, 0, 1].map((k, j) => (
                <mesh key={k} position={[k * 0.16, 0, 0]} ref={(el) => (dots.current[j] = el)}>
                  <sphereGeometry args={[0.045, 10, 10]} />
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
    const t = state.clock.getElapsedTime()
    bars.current.forEach((b, i) => {
      if (!b) return
      const env = Math.exp(-Math.pow((i - COUNT / 2) / 9, 2))
      const h = 0.18 + Math.abs(Math.sin(t * 1.9 + i * 0.65) * Math.sin(t * 0.7 + i * 1.3)) * 2.2 * env
      b.scale.y = h
    })
  })
  return (
    <group>
      {Array.from({ length: COUNT }, (_, i) => (
        <mesh key={i} position={[(i - COUNT / 2) * 0.22, 0, 0]} ref={(el) => (bars.current[i] = el)}>
          <cylinderGeometry args={[0.055, 0.055, 1, 10]} />
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
    const t = state.clock.getElapsedTime()
    scanner.current.position.y = Math.sin(t * 0.8) * 1.45
    const u = (scanner.current.position.y + 1.55) / 3.1
    const r = 0.26 + 0.82 * Math.sin(Math.PI * Math.pow(clamp01(u), 0.72))
    scanner.current.scale.setScalar(r + 0.12)
  })
  return (
    <group>
      {profile.map((p, i) => (
        <mesh key={i} position={[0, p.y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[p.r, 0.016, 8, 80]} />
          {i % 5 === 0
            ? <meshStandardMaterial color={CHAR} roughness={0.3} metalness={0.5} emissive={LAVA} emissiveIntensity={0.25} />
            : <Obsidian />}
        </mesh>
      ))}
      {/* scan ring sweeping the head */}
      <mesh ref={scanner} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.022, 8, 80]} />
        <meshBasicMaterial color="#c94f14" toneMapped={false} />
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
    const t = state.clock.getElapsedTime()
    pulses.current.forEach((m, i) => {
      if (!m) return
      const target = nodePos[(i * 2 + 1) % nodePos.length]
      const f = (t * (0.3 + i * 0.07) + i * 0.31) % 1
      m.position.copy(target).multiplyScalar(f)
    })
  })
  return (
    <group>
      <RoundedBox args={[0.6, 0.6, 0.6]} radius={0.08} smoothness={4}>
        <Obsidian roughness={0.25} />
        <Edges color={MOLTEN} />
      </RoundedBox>
      {nodePos.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.13, 14, 14]} />
          {i % 4 === 0
            ? <meshStandardMaterial color={GOLD} roughness={0.3} emissive="#8a4a10" emissiveIntensity={0.6} />
            : <Obsidian />}
        </mesh>
      ))}
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color={LINE} transparent opacity={0.7} />
      </lineSegments>
      {Array.from({ length: 4 }, (_, i) => (
        <mesh key={i} ref={(el) => (pulses.current[i] = el)}>
          <sphereGeometry args={[0.055, 10, 10]} />
          <meshBasicMaterial color={HOT} toneMapped={false} />
        </mesh>
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
    const t = state.clock.getElapsedTime()
    cardA.current.position.y = 0.55 + Math.sin(t * 1.2) * 0.08
    cardB.current.position.y = -0.75 + Math.sin(t * 1.4 + 2) * 0.08
    chart.current.forEach((b, i) => {
      if (b) b.scale.y = 0.5 + Math.abs(Math.sin(t * 0.9 + i * 1.1)) * 0.9
    })
  })
  return (
    <group>
      {/* main app window */}
      <RoundedBox args={[3.3, 2.15, 0.12]} radius={0.08} smoothness={4}>
        <Obsidian roughness={0.2} />
      </RoundedBox>
      {/* header bar + traffic light dot */}
      <mesh position={[0, 0.88, 0.075]}>
        <boxGeometry args={[3.0, 0.14, 0.01]} />
        <meshBasicMaterial color={CHAR} />
      </mesh>
      <mesh position={[-1.36, 0.88, 0.08]}>
        <sphereGeometry args={[0.04, 10, 10]} />
        <meshBasicMaterial color={MOLTEN} />
      </mesh>
      {/* sidebar */}
      <mesh position={[-1.28, -0.12, 0.075]}>
        <boxGeometry args={[0.5, 1.55, 0.01]} />
        <meshBasicMaterial color="#180e08" />
      </mesh>
      {/* animated chart bars */}
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={i} position={[-0.55 + i * 0.34, -0.45, 0.09]} ref={(el) => (chart.current[i] = el)}>
          <boxGeometry args={[0.18, 0.8, 0.02]} />
          <meshBasicMaterial color={i === 3 ? MOLTEN : LINE} />
        </mesh>
      ))}
      {/* floating satellite cards */}
      <group ref={cardA} position={[2.0, 0.55, 0.55]}>
        <RoundedBox args={[1.15, 0.75, 0.08]} radius={0.06} smoothness={4}>
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
        <RoundedBox args={[0.95, 0.95, 0.08]} radius={0.06} smoothness={4}>
          <Obsidian />
        </RoundedBox>
        <mesh position={[0, 0, 0.05]} rotation={[0, 0, 0.5]}>
          <torusGeometry args={[0.24, 0.05, 8, 40, 4.2]} />
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
    cubes.current.forEach((c, i) => {
      if (!c) return
      c.rotation.x += delta * (0.15 + i * 0.05)
      c.rotation.y += delta * 0.2
    })
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
          {i === 2
            ? <Molten emissiveIntensity={0.6} />
            : <Obsidian roughness={0.22} metalness={0.6} />}
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
    const t = state.clock.getElapsedTime()
    ring.current.rotation.z += delta * 0.12
    disc.current.material.opacity = 0.14 + Math.sin(t * 1.4) * 0.05
    sparks.current.forEach((s, i) => {
      if (!s) return
      const a = t * (0.25 + (i % 3) * 0.04) + i * ((Math.PI * 2) / 14)
      s.position.set(Math.cos(a) * 1.66, Math.sin(a) * 1.66, Math.sin(t * 1.2 + i) * 0.08)
    })
  })
  return (
    <group>
      {/* the gate — molten ring the whole journey leads to */}
      <mesh ref={ring}>
        <torusGeometry args={[1.6, 0.08, 16, 90]} />
        <Molten emissiveIntensity={0.55} />
      </mesh>
      <mesh>
        <torusGeometry args={[1.8, 0.018, 8, 90]} />
        <meshBasicMaterial color={LINE} />
      </mesh>
      {/* heat shimmer filling the portal */}
      <mesh ref={disc}>
        <circleGeometry args={[1.5, 48]} />
        <meshBasicMaterial
          color={LAVA}
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* sparks orbiting the rim */}
      {Array.from({ length: 14 }, (_, i) => (
        <mesh key={i} ref={(el) => (sparks.current[i] = el)}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshBasicMaterial color={HOT} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

/* ———————————————————— camera rig + dom sync ———————————————————— */

function Rig() {
  const scroll = useScroll()
  const look = useRef(new THREE.Vector3(0, 0, -10))
  const roll = useRef(0)
  const lamp = useRef()
  const dom = useRef({ fill: null, hud: null })
  useEffect(() => {
    dom.current.fill = document.getElementById('progress-fill')
    dom.current.hud = document.getElementById('hud-current')
  }, [])
  useFrame((state, delta) => {
    const u = clamp01(scroll.offset) * U_END
    const p = curve.getPointAt(u)
    p.y += 0.4
    state.camera.position.copy(p)

    const targetLook = curve.getPointAt(Math.min(u + 0.05, 1))
    targetLook.x += state.pointer.x * 0.9
    targetLook.y += state.pointer.y * 0.5
    look.current.x = THREE.MathUtils.damp(look.current.x, targetLook.x, 3, delta)
    look.current.y = THREE.MathUtils.damp(look.current.y, targetLook.y, 3, delta)
    look.current.z = THREE.MathUtils.damp(look.current.z, targetLook.z, 3, delta)
    state.camera.lookAt(look.current)

    // subtle banking into the bends + against the pointer
    const tangent = curve.getTangentAt(u)
    roll.current = THREE.MathUtils.damp(roll.current, -tangent.x * 0.1 - state.pointer.x * 0.03, 2.5, delta)
    state.camera.rotateZ(roll.current)

    // torch light travelling with the camera
    if (lamp.current) lamp.current.position.set(p.x, p.y + 1.2, p.z)

    const { fill, hud } = dom.current
    if (fill) fill.style.transform = `scaleX(${scroll.offset})`
    if (hud) {
      const label = String(Math.round(scroll.offset * (SECTIONS - 1)) + 1).padStart(2, '0')
      if (hud.textContent !== label) hud.textContent = label
    }
  })
  return <pointLight ref={lamp} color="#d67a3d" intensity={55} distance={26} decay={1.7} />
}

export default function Experience() {
  return (
    <>
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 12, 34]} />

      <ambientLight intensity={0.45} color="#38221a" />
      <directionalLight position={[5, 8, 6]} intensity={0.8} color="#e8a066" />
      <directionalLight position={[-6, -3, -4]} intensity={0.35} color="#4a2a66" />

      <Road />
      <Embers />
      <Rig />

      <Station index={0} spin={0}><NetworkCore /></Station>
      <Station index={1}><TerrainMap /></Station>
      <Station index={2} face><ChatBubbles /></Station>
      <Station index={3} face><Waveform /></Station>
      <Station index={4} spin={0.25}><AvatarHead /></Station>
      <Station index={5} spin={0.18}><AgentGraph /></Station>
      <Station index={6} face><ProductDashboard /></Station>
      <Station index={7} face><BlockChain /></Station>
      <Station index={8} face><ForgeGate /></Station>

      <EffectComposer multisampling={2}>
        <Bloom intensity={0.45} luminanceThreshold={0.5} luminanceSmoothing={0.5} mipmapBlur radius={0.65} />
        <Vignette eskil={false} offset={0.22} darkness={0.8} />
      </EffectComposer>
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
