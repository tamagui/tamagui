import { useGLTF } from '@react-three/drei'
// import type { Object3DNode } from '@react-three/fiber'
import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useRef } from 'react'
import { useMedia } from 'tamagui'

import { Stage } from './Stage'

// this isnt server rendered so can use window.location.origin
const origin =
  typeof window === 'undefined'
    ? process.env.NODE_ENV === 'production'
      ? 'https://tamagui.dev'
      : 'https://localhost:5005'
    : window.location.origin

const modelUrl = `${origin}/takeout-compressed-2.glb`

let frameCount = 0

export default (props) => (
  <Canvas
    style={{
      width: 300,
      height: 300,
      ...props.style,
    }}
    gl={{ preserveDrawingBuffer: true }}
    dpr={[1, 1]}
  >
    <Suspense fallback={null}>
      <TakeoutBox3D {...props} />
    </Suspense>
  </Canvas>
)

function TakeoutBox3D(props) {
  // const ref = useRef<Object3DNode<any, any>>()
  const ref = useRef<any>()
  const media = useMedia()

  const { nodes, materials } = useGLTF(modelUrl) as any

  useFrame((state, delta) => {
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
    // ref.current!.rotation.x += delta * 0.1
  })

  if (media.sm) {
    return null
  }

  return (
    <>
      <Stage
        shadows="accumulative"
        scale={1}
        adjustCamera={1.6}
        preset="portrait"
        intensity={1.5}
      >
        <group ref={ref} dispose={null} {...props}>
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
      </Stage>
    </>
  )
}
