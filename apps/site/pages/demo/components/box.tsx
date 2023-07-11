import { useGLTF } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
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
}/takeout.gltf`

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

const easing = BezierEasing(0.02, 0.02, 0, 0.15)

function TakeoutBox3D(props) {
  const ref = useRef<any>()
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
    const bezierValue = easing(1 - (frameCount > 100 ? 1 : frameCount / 100))
    ref.current!.rotation.y += delta * 15 * bezierValue

    frameCount++
  })

  return (
    <>
      <Stage
        shadows="accumulative"
        scale={1}
        adjustCamera={1.55}
        preset="portrait"
        intensity={2}
      >
        <group ref={ref} dispose={null} {...props}>
          <mesh
            geometry={nodes.pack.geometry}
            material={materials.Chinese_Takeout_Box_chinese}
            position={[0.13, 0.01, 0.23]}
            rotation={[-Math.PI, 0, -Math.PI]}
            scale={0.1}
          />
          <mesh
            geometry={nodes.handle.geometry}
            material={materials.Material}
            position={[-0.26, 0.08, 0.06]}
            scale={0.1}
          />
        </group>
      </Stage>
    </>
  )
}
