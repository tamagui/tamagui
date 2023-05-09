import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContainerXL } from 'components/Container'
import { getDefaultLayout } from 'components/layouts/DefaultLayout'
import { useRef, useState } from 'react'
import { H1, Paragraph, YStack } from 'tamagui'

import { LoadGlusp } from '../components/LoadFont'

export default function TakeoutPage() {
  return (
    <>
      <TitleAndMetaTags title="Tamagui Takeout" description="Tamagui Takeout" />

      <LoadGlusp />

      <YStack>
        <ContainerXL>
          <YStack mih={800} ai="center" jc="center">
            <Paragraph size="$1" fontFamily="$glusp">
              Tamagui
            </Paragraph>
            <TAKEOUT />
            <Paragraph size="$1" fontFamily="$glusp">
              Presents
            </Paragraph>
            <YStack pos="absolute" t="40%" l={-500} o={0.1} zi={-1}>
              <TAKEOUT fontSize={150 * 4} lineHeight={150 * 4} />
            </YStack>

            <Canvas>
              <ambientLight />
              <pointLight position={[10, 10, 10]} />
              <Box position={[-1.2, 0, 0]} />
              <Box position={[1.2, 0, 0]} />
            </Canvas>
          </YStack>
        </ContainerXL>
      </YStack>
    </>
  )
}

const TAKEOUT = (props) => (
  <H1
    className="font-outlined"
    color="$backgroundStrong"
    fontFamily="$glusp"
    fontSize={150}
    lineHeight={150}
    mt={20}
    {...props}
  >
    Takeout
  </H1>
)

function Box(props) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    ref.current!.rotation.x += delta
  })
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

TakeoutPage.getLayout = getDefaultLayout
