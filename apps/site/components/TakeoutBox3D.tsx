import { useGLTF } from '@react-three/drei'
import { Canvas, Object3DNode, useFrame } from '@react-three/fiber'
import { useRouter } from 'next/router'
import { Suspense, useEffect, useRef } from 'react'
import { useMedia } from 'tamagui'

import { Stage } from '../components/Stage'

const modelUrl = `${
  process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : `http://localhost:${process.env.NODE_ENV === 'production' ? '3333' : '5005'}`
}/takeout.glb`

let frameCount = 0

export default (props) => (
  <Canvas
    style={{
      width: 715,
      height: 715,
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
  const ref = useRef<Object3DNode<any, any>>()
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

    const isSlow = frameCount > 40

    // ref.current!.rotation.z += delta * 0.1
    ref.current.rotation.y += delta * (isSlow ? 0.1 : 0.8)

    // effect to spin faster on first entering
    if (frameCount <= 40) {
      frameCount++
    }
    // ref.current!.rotation.x += delta * 0.1
  })

  if (media.sm) {
    return null
  }

  return (
    <>
      <Stage scale={1} adjustCamera={1.55} preset="portrait" intensity={2}>
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
