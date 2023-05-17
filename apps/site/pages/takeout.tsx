import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContainerXL } from 'components/Container'
import { getDefaultLayout } from 'components/layouts/DefaultLayout'
import { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import StickyBox from 'react-sticky-box'
import { H1, H2, Paragraph, XStack, YStack, styled } from 'tamagui'

import { CodeInline } from '../components/Code'
import { LoadGlusp, LoadMunro } from '../components/LoadFont'

export default function TakeoutPage() {
  return (
    <>
      <TitleAndMetaTags title="Tamagui Takeout" description="Tamagui Takeout" />

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
              mt={-10}
              ls={5}
              fontFamily="$glusp"
            >
              Presents
            </Paragraph>

            <YStack pos="absolute" fullscreen zi={2} pe="none" ai="center" jc="center">
              <TAKEOUT className="bg-dot-grid clip-text" />
            </YStack>

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
                o={0.07}
              />
            </YStack>

            <Canvas
              style={{
                width: '150%',
                height: '150%',
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

          <YStack marginTop={-100}>
            <XStack space="$10">
              <XStack f={1} pt={100}>
                <YStack px="$6">
                  <H2 mt={20} ta="right" fontFamily="$munro">
                    Jan
                    <br />
                    01
                  </H2>
                </YStack>

                <YStack f={1} space="$8">
                  <MunroP size="$13">The starter kit, reborn</MunroP>

                  <XStack>
                    <img src="/heart.svg" style={{ width: 24, height: 24 }} />
                    <img src="/heart.svg" style={{ width: 24, height: 24 }} />
                    <img src="/heart.svg" style={{ width: 24, height: 24 }} />
                    <img src="/heart.svg" style={{ width: 24, height: 24 }} />
                    <img src="/heart.svg" style={{ width: 24, height: 24 }} />
                  </XStack>

                  <MunroP size="$10" color="$yellow10">
                    A bootstrap made to last.
                  </MunroP>
                  <MunroP size="$9">
                    The included&nbsp;
                    <CodeInline fontFamily="$munro">tamagui upgrade</CodeInline> command
                    keeps your repo in sync with the starter repo with carefully designed
                    separation of engine and functionality, and a custom diff-merge tool.
                    Avoid painful long-term divergence and manually copy-pasting updates.
                    <br />
                    <br />
                    Besides, it sets you up with the ideal Tamagui stack, already the most
                    productive UI system in existence.
                  </MunroP>
                </YStack>
              </XStack>

              <YStack mt={200} w={3} mih={500} h="100%" bc="$color" />

              <YStack>
                <StickyBox>
                  <TakeoutCardFrame
                    zi={1000}
                    maw={340}
                    als="center"
                    h={600}
                    space="$2"
                    shadowRadius={100}
                    shadowColor="#000"
                    x={-100}
                  >
                    <Paragraph fontFamily="$munro" size="$8" theme="alt2">
                      Drop 0001
                    </Paragraph>

                    <Paragraph fontFamily="$munro" size="$10">
                      Universal App Starter
                    </Paragraph>
                  </TakeoutCardFrame>
                </StickyBox>
              </YStack>
            </XStack>
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
    fontSize={280}
    lineHeight={215}
    mt={40}
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

const MunroP = styled(Paragraph, {
  fontFamily: '$munro',
})
