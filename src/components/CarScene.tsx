import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, useGLTF, ContactShadows, Float } from '@react-three/drei'
import type { Group, Object3D } from 'three'
import { TEAMS } from '../data/teams'

TEAMS.forEach((t) => useGLTF.preload(t.glb))

function SpinningCar({
  url,
  scale,
  y,
  speed,
}: {
  url: string
  scale: number
  y: number
  speed: number
}) {
  const group = useRef<Group>(null)
  const inner = useRef<Group>(null)
  const wheels = useRef<Object3D[]>([])
  const { scene } = useGLTF(url)

  // Collect wheel nodes once per scene change
  useEffect(() => {
    const found: Object3D[] = []
    scene.traverse((o) => {
      const n = (o.name || '').toLowerCase()
      if (n.includes('tyre') || n.includes('tire') || n.includes('wheel')) {
        // Only keep top-level group nodes (avoid double-spinning child meshes)
        // Heuristic: name has no underscore-suffix like "_Formula"
        if (!n.includes('_formula') && !n.includes('object_')) {
          found.push(o)
        }
      }
    })
    wheels.current = found
  }, [scene])

  useFrame((state, dt) => {
    if (group.current) {
      group.current.rotation.y += dt * speed
    }
    if (inner.current) {
      inner.current.position.y = Math.sin(state.clock.elapsedTime * 1.4) * 0.04
    }
    // Spin wheels — wheel local X axis (cars rolling forward)
    const wheelSpeed = 8
    for (const w of wheels.current) {
      w.rotation.x += dt * wheelSpeed
    }
  })

  return (
    <group ref={group}>
      <group ref={inner}>
        <primitive object={scene} scale={scale} position={[0, y, 0]} />
      </group>
    </group>
  )
}

// Kept for future use — orbits the centre on a circle.
// function OrbitingCar({
//   url,
//   scale,
//   y,
//   radius,
//   phase,
//   speed,
// }: {
//   url: string
//   scale: number
//   y: number
//   radius: number
//   phase: number
//   speed: number
// }) {
//   const group = useRef<Group>(null)
//   const inner = useRef<Group>(null)
//   const { scene } = useGLTF(url)
//   useFrame((state) => {
//     const t = state.clock.elapsedTime * speed + phase * Math.PI * 2
//     if (group.current) {
//       group.current.position.x = Math.sin(t) * radius
//       group.current.position.z = Math.cos(t) * radius
//       group.current.rotation.y = t + Math.PI / 2
//     }
//     if (inner.current) {
//       inner.current.position.y = Math.sin(state.clock.elapsedTime * 1.4 + phase * 6) * 0.04
//     }
//   })
//   return (
//     <group ref={group}>
//       <group ref={inner}>
//         <primitive object={scene} scale={scale} position={[0, y, 0]} />
//       </group>
//     </group>
//   )
// }

export default function CarScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 1.8, 7.5], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.3} />
      <spotLight
        position={[6, 9, 4]}
        angle={0.4}
        penumbra={1}
        intensity={180}
        castShadow
        color="#ffffff"
        shadow-mapSize={[1024, 1024]}
      />
      <spotLight
        position={[-6, 4, -4]}
        angle={0.55}
        penumbra={1}
        intensity={100}
        color="#CD2E3A"
      />

      <Suspense fallback={null}>
        <Float speed={1.0} rotationIntensity={0} floatIntensity={0.1}>
          {/* Ferrari — spins in place at centre */}
          <SpinningCar
            url={TEAMS[0].glb}
            scale={TEAMS[0].baseScale}
            y={TEAMS[0].baseY}
            speed={0.35}
          />
          {/* Mercedes — disabled for now, keep for later */}
          {/* <SpinningCar
            url={TEAMS[1].glb}
            scale={TEAMS[1].baseScale}
            y={TEAMS[1].baseY}
            speed={0.35}
          /> */}
        </Float>

        <ContactShadows
          position={[0, -0.55, 0]}
          opacity={0.55}
          scale={14}
          blur={2.4}
          far={4}
          color="#000000"
        />

        <Environment preset="city" environmentIntensity={0.55} />
      </Suspense>
    </Canvas>
  )
}
