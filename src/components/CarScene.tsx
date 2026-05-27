import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, useGLTF, ContactShadows, Float } from '@react-three/drei'
import type { Group } from 'three'

const CAR_URL =
  'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/models/gltf/ferrari.glb'

function Car() {
  const group = useRef<Group>(null)
  const { scene } = useGLTF(CAR_URL)

  useFrame((_, dt) => {
    if (group.current) {
      group.current.rotation.y += dt * 0.25
    }
  })

  return (
    <group ref={group} dispose={null}>
      <primitive object={scene} scale={1.6} position={[0, -0.55, 0]} />
    </group>
  )
}
useGLTF.preload(CAR_URL)

export default function CarScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.8]}
      camera={{ position: [3.6, 1.2, 4.8], fov: 35 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.25} />
      <spotLight
        position={[6, 8, 4]}
        angle={0.4}
        penumbra={1}
        intensity={120}
        castShadow
        color="#ffffff"
      />
      <spotLight
        position={[-6, 4, -4]}
        angle={0.5}
        penumbra={1}
        intensity={60}
        color="#CD2E3A"
      />
      <spotLight
        position={[0, 2, -6]}
        angle={0.6}
        penumbra={1}
        intensity={30}
        color="#3a6df0"
      />

      <Suspense fallback={null}>
        <Float speed={1.2} rotationIntensity={0} floatIntensity={0.25}>
          <Car />
        </Float>

        <ContactShadows
          position={[0, -0.56, 0]}
          opacity={0.7}
          scale={10}
          blur={2.4}
          far={3}
          color="#000000"
        />

        <Environment preset="city" environmentIntensity={0.6} />
      </Suspense>
    </Canvas>
  )
}
