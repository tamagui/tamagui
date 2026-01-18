import { Stage, useGLTF } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useRef } from 'react'

// this isnt server rendered so can use window.location.origin
const origin =
  typeof window === 'undefined'
    ? process.env.NODE_ENV === 'production'
      ? 'https://tamagui.dev'
      : 'https://localhost:5005'
    : window.location.origin

const modelUrl = `${origin}/takeout-compressed-2.glb`

let frameCount = 0

export default function TakeoutBox3DCanvas(props: any) {
  return (
    <Canvas
      style={{
        width: 400,
        height: 400,
        ...props.style,
      }}
      gl={{ preserveDrawingBuffer: true }}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 4], fov: 45 }}
      shadows
    >
      <Suspense fallback={null}>
        <Stage intensity={0.6} environment="city" shadows={false} adjustCamera={false}>
          <TakeoutBox3D {...props} />
        </Stage>
      </Suspense>
    </Canvas>
  )
}

function TakeoutBox3D(props: any) {
  const ref = useRef<any>(null)

  const { nodes, materials } = useGLTF(modelUrl) as any

  useFrame((_state, delta) => {
    if (!ref.current) return

    const entryEffectFrames = 130
    const justStarting = frameCount < entryEffectFrames
    const entryEffectPercentComplete = Math.min(1, frameCount / entryEffectFrames)
    const rotateSpeed = justStarting ? 6 * (1 - entryEffectPercentComplete) + 0.01 : 0.04

    ref.current.rotation.y += delta * rotateSpeed

    // effect to spin faster on first entering
    if (frameCount <= entryEffectFrames) {
      frameCount++
    }
  })

  return (
    <group ref={ref} dispose={null} scale={0.14} {...props}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.pack.geometry}
        material={materials['Chinese_Takeout_Box_chinese.002']}
        rotation={[0, 1.571, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.handle.geometry}
        material={materials['Chinese_Takeout_Box_chinese.002']}
        rotation={[0, 1.571, 0]}
      />
    </group>
  )
}
