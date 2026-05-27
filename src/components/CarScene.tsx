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
} from '@react-three/drei'
import type { Group } from 'three'
import { TEAMS } from '../data/teams'

TEAMS.forEach((t) => useGLTF.preload(t.glb))

function Car({
  url,
  scale,
  y,
  autoRotate,
  baseSpeed,
  boostRef,
  parallaxRef,
}: {
  url: string
  scale: number
  y: number
  autoRotate: boolean
  baseSpeed: number
  boostRef: React.MutableRefObject<number>
  parallaxRef: React.MutableRefObject<{ x: number; y: number }>
}) {
  const group = useRef<Group>(null)
  const inner = useRef<Group>(null)
  const { scene } = useGLTF(url)

  useFrame((_, dt) => {
    if (!group.current || !inner.current) return

    // Boost decay
    boostRef.current = Math.max(0, boostRef.current - dt * 2.0)
    const speed = baseSpeed + boostRef.current * 4

    if (autoRotate) {
      group.current.rotation.y += dt * speed
    }

    // Parallax tilt — eases toward mouse
    const tx = parallaxRef.current.x
    const ty = parallaxRef.current.y
    inner.current.rotation.z += (tx * 0.06 - inner.current.rotation.z) * Math.min(1, dt * 4)
    inner.current.rotation.x += (-ty * 0.05 - inner.current.rotation.x) * Math.min(1, dt * 4)
    inner.current.position.y += (ty * 0.05 - inner.current.position.y) * Math.min(1, dt * 4)
  })

  return (
    <group ref={group} dispose={null}>
      <group ref={inner}>
        <primitive object={scene} scale={scale} position={[0, y, 0]} />
      </group>
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
  boostRef,
  parallaxRef,
  onLoaded,
}: {
  teamId: string
  autoRotate?: boolean
  speed?: number
  enableControls?: boolean
  rimColor: string
  boostRef: React.MutableRefObject<number>
  parallaxRef: React.MutableRefObject<{ x: number; y: number }>
  onLoaded?: () => void
}) {
  const team = TEAMS.find((t) => t.id === teamId) ?? TEAMS[0]

  useEffect(() => {
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
      <ambientLight intensity={0.22} />
      <spotLight
        position={[6, 9, 4]}
        angle={0.4}
        penumbra={1}
        intensity={200}
        castShadow
        color="#ffffff"
        shadow-mapSize={[1024, 1024]}
      />
      <spotLight
        position={[-6, 4, -4]}
        angle={0.55}
        penumbra={1}
        intensity={120}
        color={rimColor}
      />
      <spotLight
        position={[0, 2, -6]}
        angle={0.7}
        penumbra={1}
        intensity={45}
        color="#3a6df0"
      />

      <Suspense fallback={<Loader />}>
        <Float speed={1.0} rotationIntensity={0} floatIntensity={0.18}>
          <Car
            url={team.glb}
            scale={team.baseScale}
            y={team.baseY}
            autoRotate={autoRotate}
            baseSpeed={speed}
            boostRef={boostRef}
            parallaxRef={parallaxRef}
          />
        </Float>

        <ContactShadows
          position={[0, -0.55, 0]}
          opacity={0.7}
          scale={10}
          blur={2.2}
          far={3}
          color="#000000"
        />

        <Environment preset="city" environmentIntensity={0.6} />
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
