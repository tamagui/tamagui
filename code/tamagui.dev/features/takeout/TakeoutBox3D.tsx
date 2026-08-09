import { Center, useGLTF } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useEffect, useRef, useState } from 'react'

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
  const containerRef = useRef<HTMLDivElement | null>(null)
  // pause renders when offscreen or tab is hidden
  const [active, setActive] = useState(true)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let visibleOnScreen = true
    let tabVisible =
      typeof document !== 'undefined' ? document.visibilityState === 'visible' : true
    let windowFocused = typeof document !== 'undefined' ? document.hasFocus() : true

    const update = () => setActive(visibleOnScreen && tabVisible && windowFocused)

    const io = new IntersectionObserver(
      ([entry]) => {
        visibleOnScreen = entry.isIntersecting
        update()
      },
      { threshold: 0 }
    )
    io.observe(el)

    const onVis = () => {
      tabVisible = document.visibilityState === 'visible'
      update()
    }
    const onFocus = () => {
      windowFocused = true
      update()
    }
    const onBlur = () => {
      windowFocused = false
      update()
    }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('focus', onFocus)
    window.addEventListener('blur', onBlur)

    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('blur', onBlur)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        width: 400,
        height: 400,
        ...props.style,
      }}
    >
      <Canvas
        style={{ width: '100%', height: '100%' }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 4], fov: 45 }}
        frameloop={active ? 'always' : 'never'}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={3} />
          <directionalLight position={[5, 5, 5]} intensity={4} />
          <directionalLight position={[-5, 3, -5]} intensity={2} />
          {/* drei's Stage used to wrap children in <Center> (no scale) - keep that to match the original framing */}
          <Center>
            <TakeoutBox3D {...props} />
          </Center>
        </Suspense>
      </Canvas>
    </div>
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
        geometry={nodes.pack.geometry}
        material={materials['Chinese_Takeout_Box_chinese.002']}
        rotation={[0, 1.571, 0]}
      />
      <mesh
        geometry={nodes.handle.geometry}
        material={materials['Chinese_Takeout_Box_chinese.002']}
        rotation={[0, 1.571, 0]}
      />
    </group>
  )
}
