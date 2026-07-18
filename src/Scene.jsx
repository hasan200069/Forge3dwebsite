import { Canvas } from '@react-three/fiber'
import { ScrollControls, Scroll, Preload } from '@react-three/drei'
import Experience from './Experience.jsx'

export default function Scene({ children, sections }) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 13], fov: 42 }}
      gl={{ antialias: false, powerPreference: 'high-performance', stencil: false }}
    >
      <ScrollControls pages={sections} damping={0.32} maxSpeed={2}>
        <Experience />
        <Scroll html>
          {children}
        </Scroll>
      </ScrollControls>
      {/* compile every station's shaders up front so nothing hitches
          the first time it scrolls into view */}
      <Preload all />
    </Canvas>
  )
}
