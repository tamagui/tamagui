import { getStripeProductId } from '@lib/products'
import { stripe } from '@lib/stripe'
import { withSupabase } from '@lib/withSupabase'
import { Stage, useGLTF } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Moon, Star } from '@tamagui/lucide-icons'
import { ButtonLink } from 'studio/Link'
import { ContainerXL } from 'components/Container'
import { getDefaultLayout } from 'components/layouts/DefaultLayout'
import { useUser } from 'hooks/useUser'
import { NextSeo } from 'next-seo'
import localFont from 'next/font/local'
import Head from 'next/head'
import Image from 'next/image'
import { Suspense, useRef, useState } from 'react'
import StickyBox from 'react-sticky-box'
import {
  Button,
  H1,
  H2,
  Paragraph,
  Separator,
  Spacer,
  XStack,
  YStack,
  styled,
} from 'tamagui'

import { LoadGlusp, LoadMunro } from '../components/LoadFont'

const gluspFont = localFont({
  src: './glusp.woff2',
  display: 'swap',
  variable: '--font-glusp',
})

console.log('gluspFont', gluspFont)

const heroHeight = 850

export default function TakeoutPage() {
  return (
    <>
      <NextSeo title="Tamagui Takeout" description="Tamagui Takeout" />

      {/* <Head>
        <LoadGlusp />
        <LoadMunro />
      </Head> */}

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
          className="font-outlined mix-blend"
          fontSize={150 * 5}
          lineHeight={110 * 5}
          color="#000"
          o={0.25}
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
                fontSize={16}
                ls={40}
                fontFamily="$glusp"
              >
                Tamagui
              </Paragraph>

              <TAKEOUT
                pos="absolute"
                t={52}
                className="yellow-shadow masked"
                color="$color10"
                o={0.2}
              />

              <TAKEOUT />

              <TAKEOUT className="clip-slice mix-blend" pos="absolute" t={44} color="$yellow10" />

              <TAKEOUT
                pos="absolute"
                t={52}
                className="yellow-shadow mix-blend masked2"
                zi={1}
                color="transparent"
              />

              <Paragraph
                className="mix-blend"
                color="$color"
                size="$1"
                fontSize={16}
                mt={-10}
                ls={40}
                fontFamily="$glusp"
              >
                Presents
              </Paragraph>

              <XStack my="$10" gap="$14" f={1} jc="space-between" className="mix-blend">
                <Image
                  className="pixelate"
                  src="/retro-icons/computers-devices-electronics-keyboard-wireless-14.svg"
                  alt="Icon"
                  width={32}
                  height={32}
                />

                <Image
                  className="pixelate"
                  src="/retro-icons/coding-apps-websites-browser-bugs-2-58.svg"
                  alt="Icon"
                  width={32}
                  height={32}
                />

                <Image
                  className="pixelate"
                  src="/retro-icons/coding-apps-websites-database-60.svg"
                  alt="Icon"
                  width={32}
                  height={32}
                />

                <Image
                  className="pixelate"
                  src="/retro-icons/design-color-bucket-brush-63.svg"
                  alt="Icon"
                  width={32}
                  height={32}
                />

                <Image
                  className="pixelate"
                  src="/retro-icons/design-color-palette-sample-26.svg"
                  alt="Icon"
                  width={32}
                  height={32}
                />
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
                y={-40}
                o={0.75}
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
              <YStack
                className="mix-blend"
                fullscreen
                bw={1}
                boc="$color"
                bc="$background"
                o={0.24}
              />

              <YStack f={1} space="$8">
                <MunroP size="$12">The starter kit, reborn.</MunroP>

                <XStack space="$4" my={-20}>
                  <img src="/heart.svg" style={{ width: 24, height: 24 }} />
                  <img src="/heart.svg" style={{ width: 24, height: 24 }} />
                  <img src="/heart.svg" style={{ width: 24, height: 24 }} />
                  <img src="/heart.svg" style={{ width: 24, height: 24 }} />
                  <img src="/heart.svg" style={{ width: 24, height: 24 }} />
                </XStack>

                <MunroP size="$10" color="$yellow10">
                  We're rethinking bootstrapping from the ground up. Here's how.
                </MunroP>

                <Paragraph size="$8" fow="400">
                  We're not going to promise the <Moon /> or the <Star />
                  <Star />
                  <Star />s just yet, but we can say we think you've found something
                  special that will give your startup the best, and fastest, chance of
                  success.
                </Paragraph>

                <Paragraph size="$8" fow="400">
                  Tamagui Takeout 🥡 is our take on a starter kit that Thinks Different.
                  Yea, so it gives you everything you need to hit the ground running.
                  Yawn. Yea, it's a a Universal app in a monorepo with Supabase and auth
                  and fonts and splash screens and yada yada.
                </Paragraph>

                <Paragraph size="$8" fow="400">
                  But we're also thinking long term.
                </Paragraph>

                <Paragraph size="$8" fow="400">
                  We've designed the repo to be well isolated so over time you can upgrade
                  it without as much pain as other starters. And with the Tamagui design
                  system powering it, you'll be able to customize every aspect of it
                  without worrying about having to fork components or touch internals.
                </Paragraph>

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

                <MunroP size="$11">
                  It's all you need. A reference design for a high quality app.
                </MunroP>

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

            <YStack pos="absolute" t={0} r={-500} zi={-1} rotate="120deg" o={0.1}>
              <Image
                alt="mandala"
                width={1800}
                height={1800}
                src="/takeout/noun-abstract-geometric-app-icon-947191.svg"
              />
            </YStack>

            <YStack mt={-160} mr={-90}>
              <StarterCard />
            </YStack>
          </XStack>

          <Spacer size="$10" />
        </ContainerXL>
      </YStack>
    </>
  )
}

const StarterCard = () => {
  const { subscriptions } = useUser()
  const productId = getStripeProductId('universal-starter')
  const subscription = subscriptions?.find(
    (sub) => sub.plan?.product === productId && sub.status === 'active'
  )
  return (
    <StickyBox>
      <TakeoutCardFrame
        className="blur-medium"
        zi={1000}
        maw={340}
        als="center"
        space="$2"
        shadowRadius={300}
        shadowColor="#000"
        x={-100}
        y={100}
      >
        <YStack zi={-1} fullscreen bc="$backgroundStrong" o={0.9} />

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
  fontFamily: '$munro',
})
