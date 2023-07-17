import { useGLTF } from '@react-three/drei'
import { Canvas, Object3DNode, useFrame } from '@react-three/fiber'
import BezierEasing from 'bezier-easing'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { Suspense, useEffect, useRef } from 'react'

import { Stage } from '../../../components/Stage'

export default function DemoComponentsPage(props) {
  return (
    <div style={{ backgroundColor: '#04F404' }}>
      <Box />
    </div>
  )
}

const modelUrl = `${
  process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : `http://localhost:${process.env.NODE_ENV === 'production' ? '3333' : '5005'}`
}/takeout.glb`

let frameCount = 2
const Box = dynamic(() => Promise.resolve(BoxComponent), { ssr: false })

const BoxComponent = (props) => (
  <Canvas
    style={{
      width: 730,
      height: 730,
    }}
    gl={{ preserveDrawingBuffer: true }}
    shadows
    dpr={[1, 1]}
  >
    <Suspense fallback={null}>
      <TakeoutBox3D {...props} />
    </Suspense>
  </Canvas>
)

const easing = BezierEasing(0.18, 0.12, 0.25, 1)

const frames = 30

function TakeoutBox3D(props) {
  const ref = useRef<Object3DNode<any, any>>()
  const router = useRouter()

  useEffect(() => {
    function resetFrameCount() {
      frameCount = 0
    }
    router.events.on('routeChangeComplete', resetFrameCount)
    return () => router.events.off('routeChangeComplete', resetFrameCount)
  }, [])

  const { nodes, materials } = useGLTF(modelUrl) as any

  useFrame((state, delta) => {
    const bezierValue = easing(frameCount > frames * 3 ? 0 : frameCount / frames)
    ref.current!.rotation.y += delta * 15 * bezierValue

    frameCount++
  })

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
