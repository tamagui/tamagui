import { useGLTF } from '@react-three/drei'
// import type { Object3DNode } from '@react-three/fiber'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRouter } from 'next/router'
import { Suspense, useEffect, useRef } from 'react'
import { useMedia } from 'tamagui'

import { Stage } from './Stage'

const modelUrl = `${
  process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : `http://localhost:${process.env.NODE_ENV === 'production' ? '3333' : '8081'}`
}/takeout-compressed-2.glb`

let frameCount = 0

export default (props) => (
  <Canvas
    style={{
      width: 600,
      height: 600,
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
  const router = useRouter()
  const media = useMedia()

  useEffect(() => {
    function resetFrameCount() {
      frameCount = 0
    }
    router.events.on('routeChangeComplete', resetFrameCount)
    return () => router.events.off('routeChangeComplete', resetFrameCount)
  }, [])

  const { nodes, materials } = useGLTF(modelUrl) as any

  useFrame((state, delta) => {
    if (!ref.current) return

    const entryEffectFrames = 120
    const justStarting = frameCount < entryEffectFrames
    const entryEffectPercentComplete = frameCount / entryEffectFrames
    const rotateSpeed = justStarting ? 6 * (1 - entryEffectPercentComplete) + 0.02 : 0.02

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
      <Stage scale={1} adjustCamera={1.6} preset="portrait" intensity={1}>
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
