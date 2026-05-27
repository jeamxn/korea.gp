import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  Environment,
  useGLTF,
  ContactShadows,
  Float,
  OrbitControls,
  Html,
  useProgress,
  AccumulativeShadows,
  RandomizedLight,
} from '@react-three/drei'
import type { Group } from 'three'
import { TEAMS } from '../data/teams'

// Preload all team GLBs aggressively so switching is instant after first load
TEAMS.forEach((t) => useGLTF.preload(t.glb))

function Car({
  url,
  scale,
  y,
  autoRotate,
  speed,
}: {
  url: string
  scale: number
  y: number
  autoRotate: boolean
  speed: number
}) {
  const group = useRef<Group>(null)
  const { scene } = useGLTF(url)

  useFrame((_, dt) => {
    if (group.current && autoRotate) {
      group.current.rotation.y += dt * speed
    }
  })

  // Clone to allow independent material tweaks across multiple cars later
  return (
    <group ref={group} dispose={null}>
      <primitive object={scene} scale={scale} position={[0, y, 0]} />
    </group>
  )
}

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="font-mono text-[10px] tracking-[0.3em] text-white/60">
        LOADING <span className="text-[#CD2E3A]">{Math.round(progress)}%</span>
      </div>
    </Html>
  )
}

export default function CarScene({
  teamId,
  autoRotate = true,
  speed = 0.25,
  enableControls = true,
  rimColor,
  onLoaded,
}: {
  teamId: string
  autoRotate?: boolean
  speed?: number
  enableControls?: boolean
  rimColor: string
  onLoaded?: () => void
}) {
  const team = TEAMS.find((t) => t.id === teamId) ?? TEAMS[0]

  useEffect(() => {
    // Notify loaded shortly after mount (Suspense resolves)
    const t = setTimeout(() => onLoaded?.(), 350)
    return () => clearTimeout(t)
  }, [teamId, onLoaded])

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [3.8, 1.2, 5.0], fov: 32 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.2} />
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
        angle={0.5}
        penumbra={1}
        intensity={90}
        color={rimColor}
      />
      <spotLight
        position={[0, 2, -6]}
        angle={0.7}
        penumbra={1}
        intensity={40}
        color="#3a6df0"
      />

      <Suspense fallback={<Loader />}>
        <Float speed={1.0} rotationIntensity={0} floatIntensity={0.18}>
          <Car
            url={team.glb}
            scale={team.baseScale}
            y={team.baseY}
            autoRotate={autoRotate}
            speed={speed}
          />
        </Float>

        <AccumulativeShadows
          temporal
          frames={60}
          alphaTest={0.85}
          opacity={0.85}
          scale={12}
          position={[0, -0.55, 0]}
        >
          <RandomizedLight amount={6} radius={6} intensity={1.4} ambient={0.55} position={[6, 8, 4]} />
        </AccumulativeShadows>

        <ContactShadows
          position={[0, -0.55, 0]}
          opacity={0.55}
          scale={10}
          blur={2.2}
          far={3}
          color="#000000"
        />

        <Environment preset="city" environmentIntensity={0.55} />
      </Suspense>

      {enableControls && (
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2.6}
          maxPolarAngle={Math.PI / 2.05}
          rotateSpeed={0.6}
        />
      )}
    </Canvas>
  )
}
