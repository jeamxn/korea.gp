import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, useGLTF, ContactShadows, Float } from '@react-three/drei'
import type { Group } from 'three'
import { TEAMS } from '../data/teams'

TEAMS.forEach((t) => useGLTF.preload(t.glb))

function OrbitingCar({
  url,
  scale,
  y,
  radius,
  phase,
  speed,
}: {
  url: string
  scale: number
  y: number
  radius: number
  phase: number // 0..1 starting angle offset
  speed: number
}) {
  const group = useRef<Group>(null)
  const inner = useRef<Group>(null)
  const { scene } = useGLTF(url)

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime * speed + phase * Math.PI * 2
    if (group.current) {
      group.current.position.x = Math.sin(t) * radius
      group.current.position.z = Math.cos(t) * radius
      // Face direction of travel
      group.current.rotation.y = t + Math.PI / 2
    }
    if (inner.current) {
      // gentle bob
      inner.current.position.y = Math.sin(state.clock.elapsedTime * 1.4 + phase * 6) * 0.04
    }
    void dt
  })

  return (
    <group ref={group}>
      <group ref={inner}>
        <primitive object={scene} scale={scale} position={[0, y, 0]} />
      </group>
    </group>
  )
}

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
          <OrbitingCar
            url={TEAMS[0].glb}
            scale={TEAMS[0].baseScale}
            y={TEAMS[0].baseY}
            radius={3.4}
            phase={0}
            speed={0.35}
          />
          <OrbitingCar
            url={TEAMS[1].glb}
            scale={TEAMS[1].baseScale}
            y={TEAMS[1].baseY}
            radius={3.4}
            phase={0.5}
            speed={0.35}
          />
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
