import { NextSeo } from 'next-seo'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContainerXL } from 'components/Container'
import { getDefaultLayout } from 'components/layouts/DefaultLayout'
import { useRef, useState } from 'react'
import { H1, Paragraph, YStack, styled } from 'tamagui'

import { LoadGlusp, LoadMunro } from '../components/LoadFont'

export default function TakeoutPage() {
  return (
    <>
      <NextSeo title="Tamagui Takeout" description="Tamagui Takeout" />

      <LoadGlusp />
      <LoadMunro />

      <YStack>
        <ContainerXL>
          <YStack mih={800} ai="center" jc="center">
            <Paragraph
              className="mix-blend"
              color="$color"
              size="$1"
              fontSize={20}
              ls={5}
              fontFamily="$glusp"
            >
              Tamagui
            </Paragraph>

            <TAKEOUT />

            <Paragraph
              className="mix-blend"
              color="$color"
              size="$1"
              fontSize={20}
              ls={5}
              fontFamily="$glusp"
            >
              Presents
            </Paragraph>
            {/* 
            <YStack
              scale={2}
              pos="absolute"
              fullscreen
              zi={-1}
              pe="none"
              ai="center"
              jc="center"
            >
              <TAKEOUT className="" color="$background" />
            </YStack>
             */}
            <YStack pos="absolute" fullscreen zi={-2} pe="none" ai="center" jc="center">
              <TAKEOUT
                className="font-outlined mix-blend"
                fontSize={150 * 4}
                lineHeight={110 * 4}
                color="#000"
                o={0.1}
              />
            </YStack>

            <Canvas
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: -1,
              }}
            >
              <ambientLight />
              <pointLight position={[10, 10, 10]} />
              <Box position={[0, 0, 0]} />
            </Canvas>
          </YStack>

          <YStack>
            <TakeoutCardFrame
              maw={340}
              als="center"
              h={600}
              space="$2"
              shadowRadius={100}
              shadowColor="#000"
            >
              <Paragraph fontFamily="$munro" size="$8" theme="alt2">
                Drop 0001
              </Paragraph>

              <Paragraph fontFamily="$munro" size="$10">
                Universal App Starter
              </Paragraph>
            </TakeoutCardFrame>
          </YStack>
        </ContainerXL>
      </YStack>
    </>
  )
}

const TakeoutCardFrame = styled(YStack, {
  boc: '$color',
  bw: 1,
  bc: '$backgroundStrong',
  p: '$4',
})

const TAKEOUT = (props) => (
  <H1
    className="mix-blend font-outlined"
    color="$backgroundStrong"
    fontFamily="$glusp"
    fontSize={200}
    lineHeight={150}
    mt={20}
    ta="center"
    {...props}
  >
    Take
    <br />
    out
  </H1>
)

function Box(props) {
  const ref = useRef<any>()
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)

  useFrame((state, delta) => {
    ref.current!.rotation.z += delta * 0.1
    ref.current!.rotation.y += delta * 0.1
    ref.current!.rotation.x += delta * 0.1
  })

  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 3.5 : 3}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'white'} />
    </mesh>
  )
}

TakeoutPage.getLayout = getDefaultLayout
