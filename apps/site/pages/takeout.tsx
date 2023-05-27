import { getStripeProductId } from '@lib/products'
import { withSupabase } from '@lib/withSupabase'
import { Stage, useGLTF } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { ThemeTint, ThemeTintAlt } from '@tamagui/logo'
import { CheckCircle, Moon, Star } from '@tamagui/lucide-icons'
import { ContainerXL } from 'components/Container'
import { getDefaultLayout } from 'components/layouts/DefaultLayout'
import { useUser } from 'hooks/useUser'
import { NextSeo } from 'next-seo'
import Head from 'next/head'
import Image from 'next/image'
import { Suspense, useRef, useState } from 'react'
import StickyBox from 'react-sticky-box'
import { ButtonLink } from 'studio/Link'
import {
  H1,
  H2,
  Paragraph,
  Separator,
  Spacer,
  Stack,
  XStack,
  YStack,
  styled,
} from 'tamagui'

import { LoadGlusp, LoadMunro } from '../components/LoadFont'

const heroHeight = 850

export default function TakeoutPage() {
  return (
    <>
      <NextSeo title="Tamagui Takeout" description="Tamagui Takeout" />

      <Head>
        <LoadGlusp />
        <LoadMunro />
      </Head>

      <YStack
        pos="absolute"
        fullscreen
        b="auto"
        zi={-2}
        pe="none"
        ai="center"
        jc="center"
        ov="hidden"
      >
        <TAKEOUT
          className="font-outlined theme-shadow masked3"
          fontSize={150 * 5}
          lineHeight={110 * 5}
          color="#000"
          o={0.085}
        />
      </YStack>

      <YStack>
        <ContainerXL>
          <YStack h={0} mah={0}>
            <YStack
              y={heroHeight / 2 - 340}
              ai="center"
              jc="center"
              $sm={{
                scale: 0.4,
              }}
              $md={{
                scale: 0.6,
              }}
              $lg={{
                scale: 0.8,
              }}
            >
              <Paragraph
                className="mix-blend"
                color="$color"
                size="$1"
                fontSize={13}
                ls={40}
                fontFamily="$glusp"
              >
                Tamagui
              </Paragraph>

              <TAKEOUT />

              <ThemeTint>
                <TAKEOUT
                  pos="absolute"
                  t={52}
                  className="theme-shadow masked mix-blend-dodge"
                  color="$color10"
                  o={0.1}
                />

                <TAKEOUT
                  className="clip-slice mix-blend"
                  pos="absolute"
                  t={44}
                  color="$color7"
                  scale={1.04}
                  o={0.45}
                />

                <ThemeTintAlt>
                  <TAKEOUT
                    className="clip-slice mix-blend animate-fade2"
                    pos="absolute"
                    t={44}
                    color="$color7"
                    scale={1.04}
                    o={0.45}
                  />
                </ThemeTintAlt>

                <ThemeTint>
                  <TAKEOUT
                    className="clip-slice mix-blend-dodge animate-fade2"
                    pos="absolute"
                    t={44}
                    color="$color7"
                    scale={1.04}
                    o={0.45}
                  />
                </ThemeTint>

                <TAKEOUT
                  pos="absolute"
                  t={52}
                  className="theme-shadow mix-blend masked2"
                  zi={1}
                  color="transparent"
                />
              </ThemeTint>

              <Paragraph
                className="mix-blend"
                color="$color"
                size="$1"
                fontSize={13}
                mt={-10}
                ls={40}
                fontFamily="$glusp"
              >
                Presents
              </Paragraph>

              <XStack my="$10" gap={110} f={1} jc="space-between" className="mix-blend">
                <IconFrame>
                  <Image
                    className="pixelate"
                    src="/retro-icons/computers-devices-electronics-keyboard-wireless-14.svg"
                    alt="Icon"
                    width={24}
                    height={24}
                  />
                </IconFrame>

                <IconFrame>
                  <Image
                    className="pixelate"
                    src="/retro-icons/coding-apps-websites-browser-bugs-2-58.svg"
                    alt="Icon"
                    width={24}
                    height={24}
                  />
                </IconFrame>

                <IconFrame>
                  <Image
                    className="pixelate"
                    src="/retro-icons/coding-apps-websites-database-60.svg"
                    alt="Icon"
                    width={24}
                    height={24}
                  />
                </IconFrame>

                <IconFrame>
                  <Image
                    className="pixelate"
                    src="/retro-icons/design-color-bucket-brush-63.svg"
                    alt="Icon"
                    width={24}
                    height={24}
                  />
                </IconFrame>

                <IconFrame>
                  <Image
                    className="pixelate"
                    src="/retro-icons/design-color-palette-sample-26.svg"
                    alt="Icon"
                    width={24}
                    height={24}
                  />
                </IconFrame>
              </XStack>

              <YStack
                pos="absolute"
                fullscreen
                className="animated"
                zi={2}
                pe="none"
                ai="center"
                jc="center"
                scale={1.15}
              >
                <TAKEOUT className="bg-dot-grid clip-text" />
              </YStack>

              <YStack
                pos="absolute"
                fullscreen
                zi={-1}
                pe="none"
                ai="center"
                jc="center"
                x={-10}
                y={-70}
                o={0.65}
              >
                <TAKEOUT color="$background" className="" />
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

              <Canvas
                style={{
                  width: 550,
                  height: 550,
                  // backgroundColor: 'red',
                  position: 'absolute',
                  top: 300,
                  right: '-10%',
                  zIndex: -1,
                }}
                gl={{ preserveDrawingBuffer: true }}
                shadows
                dpr={[1, 1]}
                camera={{ position: [0, 0, 150], fov: 10 }}
              >
                <Suspense fallback={null}>
                  {/* <ambientLight intensity={0.9} /> */}
                  <Stage
                    shadows="accumulative"
                    scale={0.5}
                    adjustCamera={1}
                    intensity={1}
                  >
                    <TakeoutBox3D />
                  </Stage>
                </Suspense>
              </Canvas>
            </YStack>
          </YStack>

          <YStack t={heroHeight - 800} l={-100} pos="absolute" b={0} zi={-1}>
            <Separator o={0.75} vertical h={2000} pos="absolute" l={0.5} />
            <Separator o={0.75} vertical h={2000} pos="absolute" r={0} />

            <YStack t={750} px="$6">
              <Separator o={0.75} w={3000} pos="absolute" t={0.5} l={-1000} />
              <Separator o={0.75} w={3000} pos="absolute" b={0} l={-1000} />

              <H2 my="$4" ta="right" fontFamily="$munro">
                Jan
                <br />
                01
              </H2>

              <H2
                t={-100}
                pos="absolute"
                fontFamily="$munro"
                tt="uppercase"
                x={-20}
                scale={0.5}
                rotate="-90deg"
                o={0.5}
                ls={10}
              >
                Release
              </H2>
            </YStack>
          </YStack>

          <XStack mt={heroHeight + 70} space="$10">
            <XStack f={1} p="$8" mt={20}>
              {/* <YStack
                className="mix-blend"
                fullscreen
                bw={1}
                boc="$color"
                bc="$background"
                o={0.24}
              /> */}

              <YStack f={1} space="$6">
                <MunroP mt={-100} mb={-20} fontSize={30}>
                  Jumpstart your startup with an all-in-one web + mobile repo.
                </MunroP>

                <ThemeTint>
                  <H2 size="$13" color="$color10">
                    From idea to shipped in less time than ever.
                  </H2>
                </ThemeTint>

                <XStack space="$4">
                  <img src="/heart.svg" style={{ width: 24, height: 24 }} />
                  <img src="/heart.svg" style={{ width: 24, height: 24 }} />
                  <img src="/heart.svg" style={{ width: 24, height: 24 }} />
                  <img src="/heart.svg" style={{ width: 24, height: 24 }} />
                  <img src="/heart.svg" style={{ width: 24, height: 24 }} />
                </XStack>

                <Paragraph size="$9" fow="400">
                  We can't promise the 🌕 or the ✨ - success is up to you - but if you
                  want a cheat code to shipping a stunning web + mobile app fast, you've
                  found it.
                </Paragraph>

                <Paragraph size="$8" fow="400">
                  Takeout 🥡 is a bootstrap we've set up that delivers on years of effort
                  putting together a stack that gives you nearly a whole startup in a box
                  on day one. And of course it's powered by Tamagui, the best frontend UI
                  system around.
                </Paragraph>

                <Paragraph size="$8" fow="400">
                  Within 5 minutes you'll be deploying your app on the web to Vercel (with
                  easy configuration of other providers), as well as production-ready
                  builds for iOS and Android via Expo EAS.
                </Paragraph>

                <YStack tag="ul" space="$3" zi={2}>
                  <Point>Complete typed design system</Point>
                  <Point>20 icon packs</Point>
                  <Point>3 theme packs (2 all new: Pastel + Neon)</Point>
                  <Point>6 new font packs</Point>
                  <Point>Github template with PR bot for updates</Point>
                  <Point>Github template with PR bot for updates</Point>
                </YStack>

                <YStack marginTop={-300} marginBottom={-500} x={400} zi={-1}>
                  <Image
                    alt="iPhone screenshot of Tamagui"
                    src="/iphone.png"
                    width={863}
                    height={928}
                  />
                </YStack>

                <Separator my="$8" mx="$8" />

                <Paragraph size="$9" fow="400">
                  Speedrun from 0-to-💯 with Tamagui Takeout 🥡
                </Paragraph>

                <Paragraph size="$8" fow="400">
                  It's not just about getting your app shipped fast. We're thinking long
                  term.
                </Paragraph>

                <Paragraph size="$8" fow="400">
                  We've designed the repo to be well isolated to work alongside the Github
                  bot we install when you set it up that will send over a PR whenever we
                  make updates to the template.{' '}
                  <Paragraph fontSize="inherit" color="$yellow10">
                    That means no more being left behind as we ship improvements
                    constantly to your codebase
                  </Paragraph>
                  .
                </Paragraph>

                <Paragraph size="$8" fow="400">
                  It's why we've set up the pricing the way we have - lifetime rights to
                  the code with a year of updates. One-time pricing wouldn't incentivize
                  us to keep innovating. And we want to make the Takeout stack the best
                  stack that's ever existed.
                </Paragraph>

                <Paragraph size="$8" fow="400">
                  We have a Roadmap that we've set up to keep delivering value. And we'd
                  love your feedback.
                </Paragraph>

                <YStack tag="ul" space="$3">
                  <Point>Complete typed design system</Point>
                  <Point>20 icon packs</Point>
                  <Point>3 theme packs (2 all new: Pastel + Neon)</Point>
                  <Point>6 new font packs</Point>
                  <Point>Github template with PR bot for updates</Point>
                  <Point>Github template with PR bot for updates</Point>
                </YStack>

                <XStack my="$8" gap="$4" f={1} jc="space-around">
                  <Image
                    className="pixelate"
                    src="/retro-icons/coding-app-website-ui-62.svg"
                    alt="Icon"
                    width={48}
                    height={48}
                  />

                  <Image
                    className="pixelate"
                    src="/retro-icons/coding-apps-websites-browser-bugs-2-58.svg"
                    alt="Icon"
                    width={48}
                    height={48}
                  />

                  <Image
                    className="pixelate"
                    src="/retro-icons/coding-apps-websites-database-60.svg"
                    alt="Icon"
                    width={48}
                    height={48}
                  />

                  <Image
                    className="pixelate"
                    src="/retro-icons/design-color-bucket-brush-63.svg"
                    alt="Icon"
                    width={48}
                    height={48}
                  />

                  <Image
                    className="pixelate"
                    src="/retro-icons/design-color-palette-sample-26.svg"
                    alt="Icon"
                    width={48}
                    height={48}
                  />
                </XStack>

                <MunroP size="$11">It's all you need.</MunroP>

                <MunroP size="$11">A reference design for a high quality app.</MunroP>

                <XStack>
                  <img src="/heart.svg" style={{ width: 24, height: 24 }} />
                  <img src="/heart.svg" style={{ width: 24, height: 24 }} />
                  <img src="/heart.svg" style={{ width: 24, height: 24 }} />
                  <img src="/heart.svg" style={{ width: 24, height: 24 }} />
                  <img src="/heart.svg" style={{ width: 24, height: 24 }} />
                </XStack>

                <MunroP size="$10" color="$yellow10">
                  We hope you enjoy it.
                </MunroP>

                <MunroP size="$3" o={0.3}>
                  These statements have not been approved by the FDA. Talk to your doctor
                  about Tamagui Takeout. Side effects may include spending way too much
                  time tweaking color palettes when you should be just shipping your damn
                  app.
                </MunroP>
              </YStack>
            </XStack>

            <YStack mt={200} w={3} mih={500} h="100%" />

            <YStack pos="absolute" t={0} r={-500} zi={-1} rotate="120deg" o={0.1} zi={-2}>
              <Image
                alt="mandala"
                width={1800}
                height={1800}
                src="/takeout/noun-abstract-geometric-app-icon-947191.svg"
              />
            </YStack>

            <YStack mt={-220} mr={-90}>
              <StarterCard />
            </YStack>
          </XStack>

          <Spacer size="$10" />
        </ContainerXL>
      </YStack>
    </>
  )
}

const Point = (props: { children: any }) => {
  return (
    <XStack tag="li" ai="center" space ml="$4">
      <YStack mt={-5.5}>
        <CheckCircle color="$green10" />
      </YStack>
      <Paragraph size="$8">{props.children}</Paragraph>
    </XStack>
  )
}

const IconFrame = styled(Stack, {
  borderRadius: 1000,
  p: '$6',
  bc: 'rgba(255, 255, 255, 0.025)',
})

const StarterCard = () => {
  const { subscriptions } = useUser()
  const productId = getStripeProductId('universal-starter')
  const subscription = subscriptions?.find(
    (sub) => sub.plan?.product === productId && sub.status === 'active'
  )
  return (
    <StickyBox>
      <ThemeTint>
        <TakeoutCardFrame
          className="blur-medium"
          zi={1000}
          maw={340}
          als="center"
          space="$2"
          shadowRadius={30}
          shadowOffset={{ height: 20, width: 0 }}
          shadowColor="#000"
          x={-100}
          y={100}
        >
          <YStack zi={-1} fullscreen bc="$backgroundStrong" o={0.8} />

          <Paragraph fontFamily="$munro" size="$3" theme="alt2">
            Drop 0001
          </Paragraph>

          <Paragraph fontFamily="$munro" size="$10">
            Universal App Starter
          </Paragraph>

          <YStack>
            <Row
              title="Template"
              description="Uses an official Github Template with a built-in bot to send PRs whenever the template updates."
              after="XX"
            />

            <Row
              title="Monorepo"
              description="More complete monorepo with Next.js deploy and Expo EAS configured."
              after="XX"
            />
            <Row title="Something" description="Description" after="XX" />
            <Row title="Something" description="Description" after="XX" />
            <Row title="Something" description="Description" after="XX" />
            <Row title="Something" description="Description" after="XX" />
            <Row title="Something" description="Description" after="XX" />
          </YStack>

          <Spacer f={1} />

          <ButtonLink
            href={
              subscription
                ? `/account/subscriptions#${subscription.id}`
                : `api/checkout?${new URLSearchParams({
                    product_id: productId,
                  }).toString()}`
            }
            fontFamily="$munro"
            themeInverse
            fontSize="$8"
          >
            {subscription ? 'View Subscription' : 'Buy now'}
          </ButtonLink>
        </TakeoutCardFrame>
      </ThemeTint>
    </StickyBox>
  )
}

const modelUrl = `${
  process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : `http://localhost:5005`
}/takeout.gltf`
useGLTF.preload(modelUrl)

function TakeoutBox3D(props) {
  const ref = useRef<any>()
  const { nodes, materials } = useGLTF(modelUrl) as any

  useFrame((state, delta) => {
    // ref.current!.rotation.z += delta * 0.1
    ref.current!.rotation.y += delta * 0.1
    // ref.current!.rotation.x += delta * 0.1
  })

  return (
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
  )
  // return (
  //   <group ref={ref} dispose={null}>
  //     <mesh
  //       castShadow
  //       receiveShadow
  //       geometry={nodes.handle.geometry}
  //       material={materials.Material}
  //       position={[-0.26, 0.08, 0.06]}
  //       scale={5}
  //     />
  //     <mesh
  //       castShadow
  //       receiveShadow
  //       geometry={nodes.pack.geometry}
  //       material={materials.Chinese_Takeout_Box_chinese}
  //       position={[0.13, 0.01, 0.23]}
  //       rotation={[-Math.PI, 0, -Math.PI]}
  //       scale={5}
  //     />
  //   </group>
  // )
}

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

const Row = (props: { title: any; description: any; after: any }) => {
  return (
    <XStack bbw={1} boc="$borderColor">
      <YStack f={1} py="$2">
        <MunroP size="$8">{props.title}</MunroP>
        <Paragraph size="$4" theme="alt2">
          {props.description}
        </Paragraph>
      </YStack>

      <MunroP>{props.after}</MunroP>
    </XStack>
  )
}

const TakeoutCardFrame = styled(YStack, {
  boc: '$color3',
  bw: 0.25,
  p: '$6',
  // br: '$4',
  ov: 'hidden',
})

const TAKEOUT = ({ fontSize = 290, lineHeight = 255, ...props }) => (
  <H1
    className="mix-blend font-outlined"
    userSelect="none"
    color="$backgroundStrong"
    fontFamily="$glusp"
    fontSize={fontSize}
    lineHeight={lineHeight}
    mt={40}
    ta="center"
    {...props}
  >
    Take
    <br />
    out
  </H1>
)

TakeoutPage.getLayout = (page, pageProps) =>
  withSupabase(getDefaultLayout(page, pageProps), pageProps)

const MunroP = styled(Paragraph, {
  className: 'pixelate',
  fontFamily: '$munro',
})
