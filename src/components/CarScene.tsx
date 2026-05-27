import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  Environment,
  useGLTF,
  ContactShadows,
  Float,
  OrbitControls,
  Html,
  useProgress,
  MeshReflectorMaterial,
} from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Vector2 } from 'three'
import type { Group } from 'three'
import { TEAMS } from '../data/teams'

// Critical: preload only the first/active team's model.
// The rest are lazy-loaded during browser idle time (see scheduleIdlePreload below)
// so the initial paint isn't blocked by 4 unused 2-13MB GLBs.
useGLTF.preload(TEAMS[0].glb)

let _idleQueued = false
function scheduleIdlePreload() {
  if (_idleQueued || typeof window === 'undefined') return
  _idleQueued = true
  const run = () => {
    for (let i = 1; i < TEAMS.length; i++) {
      try {
        useGLTF.preload(TEAMS[i].glb)
      } catch {
        /* ignore */
      }
    }
  }
  const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback
  if (ric) ric(run, { timeout: 4000 })
  else setTimeout(run, 2500)
}

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
    boostRef.current = Math.max(0, boostRef.current - dt * 2.0)
    const speed = baseSpeed + boostRef.current * 4
    if (autoRotate) group.current.rotation.y += dt * speed

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

function IntroCamera({ enabled }: { enabled: boolean }) {
  const { camera } = useThree()
  const startRef = useRef<number | null>(null)
  const fromZ = 9.2
  const fromY = 2.4
  const toZ = 5.0
  const toY = 1.2
  useFrame(() => {
    if (!enabled) return
    if (startRef.current == null) startRef.current = performance.now()
    const elapsed = (performance.now() - startRef.current) / 1500
    const t = Math.min(1, elapsed)
    // ease-out cubic
    const e = 1 - Math.pow(1 - t, 3)
    camera.position.z = fromZ + (toZ - fromZ) * e
    camera.position.y = fromY + (toY - fromY) * e
    camera.lookAt(0, 0, 0)
  })
  return null
}

function Floor({ color }: { color: string }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.55, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <MeshReflectorMaterial
        blur={[400, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={1.4}
        depthScale={1.1}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#0a0a0a"
        metalness={0.6}
        roughness={0.85}
        mirror={0.7}
        reflectorOffset={0.02}
      />
      {/* tinted accent ring */}
      <meshBasicMaterial attach="material" color={color} transparent opacity={0.0} />
    </mesh>
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
  reducedMotion = false,
  lowPower = false,
  onLoaded,
  onProgress,
}: {
  teamId: string
  autoRotate?: boolean
  speed?: number
  enableControls?: boolean
  rimColor: string
  boostRef: React.MutableRefObject<number>
  parallaxRef: React.MutableRefObject<{ x: number; y: number }>
  reducedMotion?: boolean
  lowPower?: boolean
  onLoaded?: () => void
  onProgress?: (pct: number) => void
}) {
  const team = TEAMS.find((t) => t.id === teamId) ?? TEAMS[0]
  const { progress, active } = useProgress()

  // Report progress upstream so the main overlay can show a real percentage
  useEffect(() => {
    onProgress?.(progress)
  }, [progress, onProgress])

  useEffect(() => {
    // Fire onLoaded only once the asset pipeline is idle and we've reached 100.
    if (progress >= 100 && !active) {
      const t = setTimeout(() => onLoaded?.(), 200)
      return () => clearTimeout(t)
    }
  }, [progress, active, teamId, onLoaded])

  // Once the first car is ready, prefetch the rest in idle time.
  useEffect(() => {
    scheduleIdlePreload()
  }, [])

  const heavy = !reducedMotion && !lowPower

  return (
    <Canvas
      shadows={heavy}
      dpr={lowPower ? [1, 1.25] : [1, 2]}
      camera={{ position: [3.8, 2.4, 9.2], fov: 32 }}
      gl={{ antialias: !lowPower, alpha: true, powerPreference: lowPower ? 'low-power' : 'high-performance' }}
      style={{ background: 'transparent' }}
    >
      <IntroCamera enabled={!reducedMotion} />
      <ambientLight intensity={0.22} />
      <spotLight
        position={[6, 9, 4]}
        angle={0.4}
        penumbra={1}
        intensity={220}
        castShadow={heavy}
        color="#ffffff"
        shadow-mapSize={[lowPower ? 512 : 1024, lowPower ? 512 : 1024]}
      />
      <spotLight
        position={[-6, 4, -4]}
        angle={0.55}
        penumbra={1}
        intensity={140}
        color={rimColor}
      />
      <spotLight
        position={[0, 2, -6]}
        angle={0.7}
        penumbra={1}
        intensity={55}
        color="#3a6df0"
      />

      <Suspense fallback={<Loader />}>
        <Float speed={reducedMotion ? 0 : 1.0} rotationIntensity={0} floatIntensity={reducedMotion ? 0 : 0.18}>
          <Car
            url={team.glb}
            scale={team.baseScale}
            y={team.baseY}
            autoRotate={autoRotate && !reducedMotion}
            baseSpeed={speed}
            boostRef={boostRef}
            parallaxRef={parallaxRef}
          />
        </Float>

        {lowPower ? null : <Floor color={rimColor} />}

        <ContactShadows
          position={[0, -0.549, 0]}
          opacity={0.55}
          scale={10}
          blur={lowPower ? 1.4 : 2.2}
          far={3}
          color="#000000"
          resolution={lowPower ? 256 : 512}
        />

        <Environment preset="city" environmentIntensity={0.55} />
      </Suspense>

      {heavy && (
        <EffectComposer>
          <Bloom luminanceThreshold={0.45} luminanceSmoothing={0.4} intensity={0.55} mipmapBlur />
          <ChromaticAberration
            offset={new Vector2(0.0008, 0.0012)}
            blendFunction={BlendFunction.NORMAL}
            radialModulation={false}
            modulationOffset={0}
          />
          <Vignette eskil={false} offset={0.2} darkness={0.7} />
        </EffectComposer>
      )}

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
