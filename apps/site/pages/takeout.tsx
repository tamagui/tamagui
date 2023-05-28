import { getStripeProductId } from '@lib/products'
import { withSupabase } from '@lib/withSupabase'
import { useGLTF } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { LogoIcon, ThemeTint, ThemeTintAlt } from '@tamagui/logo'
import { CheckCircle, Newspaper, X } from '@tamagui/lucide-icons'
import { useClientValue } from '@tamagui/use-did-finish-ssr'
import { Store, createUseStore } from '@tamagui/use-store'
import { ContainerXL } from 'components/Container'
import { getDefaultLayout } from 'components/layouts/DefaultLayout'
import { useUser } from 'hooks/useUser'
import { NextSeo } from 'next-seo'
import Head from 'next/head'
import Image from 'next/image'
import { Suspense, useEffect, useRef, useState } from 'react'
import { ButtonLink } from 'studio/Link'
import {
  AnimatePresence,
  Button,
  Dialog,
  H1,
  H2,
  Paragraph,
  ScrollView,
  Separator,
  Sheet,
  Spacer,
  Stack,
  TabLayout,
  Tabs,
  TabsTabProps,
  Theme,
  Unspaced,
  XStack,
  YStack,
  YStackProps,
  isClient,
  styled,
} from 'tamagui'
import { LinearGradient } from 'tamagui/linear-gradient'

import { LoadGlusp, LoadMunro } from '../components/LoadFont'
import { Stage } from '../components/Stage'

const heroHeight = 850

export default function TakeoutPage() {
  const store = useTakeoutStore()
  const enable3d = useClientValue(
    isClient && !window.location.search?.includes('disable-3d')
  )
  const disableMotion =
    useClientValue(
      isClient &&
        (window.matchMedia(`(prefers-reduced-motion: reduce)`)?.matches ||
          window.location.search?.includes('disable-motion'))
    ) || store.showPurchase

  return (
    <>
      <NextSeo
        title="🥡 Tamagui Takeout"
        description="Tamagui Takeout React Native Bootstrap Starter Kit"
      />

      <Head>
        <LoadGlusp />
        <LoadMunro />
      </Head>

      <PurchaseModal />

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
          className={`font-outlined theme-shadow` + (disableMotion ? '' : ' masked3')}
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
              className="ease-in ms300 all"
              $xxs={{
                scale: 0.3,
              }}
              $xs={{
                scale: 0.35,
              }}
              $sm={{
                scale: 0.5,
              }}
              $md={{
                scale: 0.6,
              }}
              $lg={{
                scale: 0.8,
              }}
            >
              <Paragraph
                color="$color"
                size="$1"
                fontSize={14}
                ls={105}
                fontFamily="$glusp"
                pe="none"
                h={40}
                userSelect="none"
              >
                Tamagui
              </Paragraph>

              <TAKEOUT />

              {!disableMotion && (
                <ThemeTint>
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

                  <TAKEOUT
                    className="clip-slice mix-blend-dodge animate-fade2"
                    pos="absolute"
                    t={44}
                    color="$color7"
                    scale={1.04}
                    o={0.45}
                  />

                  <TAKEOUT
                    pos="absolute"
                    t={45}
                    className="theme-shadow mix-blend masked2"
                    zi={1}
                    color="transparent"
                  />
                </ThemeTint>
              )}

              <XStack my="$5" gap={125} f={1} jc="space-between" className="mix-blend">
                <IconFrame>
                  <Image
                    className="pixelate"
                    src="/retro-icons/coding-apps-websites-module-21.svg"
                    alt="Icon"
                    width={18}
                    height={18}
                  />
                </IconFrame>

                <IconFrame>
                  <Image
                    className="pixelate"
                    src="/retro-icons/coding-apps-websites-browser-bugs-2-58.svg"
                    alt="Icon"
                    width={18}
                    height={18}
                  />
                </IconFrame>

                <IconFrame>
                  <Image
                    className="pixelate"
                    src="/retro-icons/coding-apps-websites-database-60.svg"
                    alt="Icon"
                    width={18}
                    height={18}
                  />
                </IconFrame>

                <IconFrame>
                  <Image
                    className="pixelate"
                    src="/retro-icons/design-color-bucket-brush-63.svg"
                    alt="Icon"
                    width={18}
                    height={18}
                  />
                </IconFrame>

                <IconFrame>
                  <Image
                    className="pixelate"
                    src="/retro-icons/design-color-palette-sample-26.svg"
                    alt="Icon"
                    width={18}
                    height={18}
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

              <YStack
                position="absolute"
                top={360}
                r="-10%"
                $sm={{ r: '-40%' }}
                $md={{ r: '-30%' }}
                $lg={{ r: '-20%' }}
                zIndex={-1}
              >
                {enable3d && (
                  <Canvas
                    style={{
                      width: 620,
                      height: 620,
                    }}
                    gl={{ preserveDrawingBuffer: true }}
                    shadows
                    dpr={[1, 1]}
                    // camera={{ position: [0, 0, 150], fov: 10 }}
                  >
                    <Suspense fallback={null}>
                      {/* <ambientLight intensity={0.9} /> */}
                      <Stage
                        shadows="accumulative"
                        scale={1}
                        adjustCamera={1}
                        intensity={1}
                      >
                        <TakeoutBox3D />
                      </Stage>
                    </Suspense>
                  </Canvas>
                )}
              </YStack>
            </YStack>
          </YStack>

          <YStack t={heroHeight - 1000} l={-100} pos="absolute" b={0} zi={-3}>
            <Separator o={0.75} vertical h={4100} pos="absolute" l={0.5} />
            <Separator o={0.75} vertical h={4100} pos="absolute" r={0} />

            <YStack t={750} px="$6">
              <Separator o={0.75} w={3000} pos="absolute" t={0.5} l={-1000} />
              <Separator o={0.75} w={3000} pos="absolute" b={0} l={-1000} />

              <YStack mb="$6" space="$4">
                <H2 ta="right" fontFamily="$munro">
                  x
                </H2>
                <LogoIcon />
              </YStack>

              <H2
                t={-100}
                pos="absolute"
                fontFamily="$munro"
                tt="uppercase"
                x={-50}
                scale={0.5}
                rotate="-90deg"
                o={0.25}
                ls={10}
                w={3000}
              >
                A new take on bootstrap · A new take on bootstrap · A new take on
                bootstrap · A new take on bootstrap
              </H2>
            </YStack>
          </YStack>

          <XStack mt={heroHeight + 70} space="$10">
            <XStack f={1} p="$8" mt={20}>
              <YStack mt={-500} ml={20} mr={-20}>
                <StarterCard />
              </YStack>
              {/* <YStack
                className="mix-blend"
                fullscreen
                bw={1}
                boc="$color"
                bc="$background"
                o={0.24}
              /> */}

              <YStack f={1} space="$6">
                <MunroP className="mix-blend" mt={-180} mb={-20} size="$8">
                  Jumpstart your startup
                </MunroP>

                <ThemeTint>
                  <H2
                    className="clip-text mix-blend"
                    size="$13"
                    color="$color10"
                    style={{
                      // @ts-ignore
                      backgroundImage: `-webkit-linear-gradient(var(--color9), var(--yellow9))`,
                    }}
                  >
                    From idea to shipped in less time than ever.
                  </H2>
                </ThemeTint>

                <XStack space="$6" spaceDirection="horizontal">
                  <img src="/heart.svg" style={{ width: 24, height: 24 }} />
                  <img src="/heart.svg" style={{ width: 24, height: 24 }} />
                  <img src="/heart.svg" style={{ width: 24, height: 24 }} />
                  <img src="/heart.svg" style={{ width: 24, height: 24 }} />
                  <img src="/heart.svg" style={{ width: 24, height: 24 }} />
                </XStack>

                <Paragraph size="$9" fow="400">
                  We can't promise the 🌕 or the ✨ (success is up to you) but if you want
                  a cheat code to shipping a stunning web & native mobile app fast, you've
                  found it.
                </Paragraph>

                <Paragraph size="$8" fow="400">
                  Takeout 🥡 is a novel bootstrap that delivers on years of effort putting
                  together a stack that gives you nearly a whole startup in a box on day
                  one. And of course it's powered by Tamagui, the best frontend UI system
                  around.
                </Paragraph>

                <Paragraph size="$8" fow="400">
                  Within an hour you'll be deploying your app on the web to Vercel (with
                  easy configuration of other providers), as well as production-ready
                  builds for iOS and Android via Expo EAS.
                </Paragraph>

                <YStack tag="ul" space="$3" zi={2} mt="$8">
                  <Point>React (Web and Native) Monorepo</Point>
                  <Point>SSR, RSC, all the acronyms</Point>
                  <Point>Complete typed design system</Point>
                  <Point>20 icon packs</Point>
                  <Point>2 all new theme suites: Pastel & Neon</Point>
                  <Point>35 custom fonts</Point>
                  <Point>Github template with PR bot for updates</Point>
                  <Point>Fully tested CI/CD: unit, integration, web and native</Point>
                  <Point>Deploys to web and builds to app stores</Point>
                </YStack>

                <YStack marginTop={-450} marginBottom={-500} x={400} zi={-1}>
                  <Image
                    alt="iPhone screenshot of Tamagui"
                    src="/iphone.png"
                    width={863}
                    height={928}
                  />
                </YStack>

                <Separator className="mix-blend" boc="#fff" o={0.25} my="$8" mx="$8" />

                <YStack p="$6" className="blur-medium" space="$6" elevation="$4">
                  <YStack zi={-1} fullscreen bc="$color" o={0.1} />

                  <Paragraph size="$8" fow="800">
                    Speedrun from 0-to-💯 with Tamagui Takeout 🥡
                  </Paragraph>

                  <Paragraph size="$8" fow="400">
                    It's not just about shipping fast. It's the long run.
                  </Paragraph>

                  <Paragraph size="$8" fow="400">
                    The template repo is designed with pluggable features that are
                    well-isolated. Then we install a Github bot that sends a PR whenever
                    we make an update.
                  </Paragraph>

                  <Paragraph size="$8" fow="400" color="$yellow10">
                    That means you get constant improvements to your codebase.
                  </Paragraph>

                  <Paragraph size="$8" fow="400">
                    It's why we've set up pricing the way we have: lifetime rights, one
                    year of updates. Forever pricing wouldn't incentivize us to keep
                    innovating, and we want to make the Takeout stack the best stack,
                    period.
                  </Paragraph>

                  <Paragraph size="$8" fow="400">
                    We're working on bringing many nice new features that you can pick and
                    choose from:
                  </Paragraph>

                  <YStack tag="ul" space="$3">
                    <Point upcoming>Simple state management system</Point>
                    <Point upcoming>Reanimated integration</Point>
                    <Point upcoming>Layout animations</Point>
                    <Point upcoming>Entire Google font library</Point>
                    <Point upcoming>Maestro native integration testing</Point>
                    <Point upcoming>Notifications</Point>
                  </YStack>
                </YStack>

                <XStack my="$8" gap="$4" f={1} jc="space-around">
                  <Image
                    className="pixelate"
                    src="/retro-icons/coding-app-website-ui-62.svg"
                    alt="Icon"
                    width={28}
                    height={28}
                  />

                  <Image
                    className="pixelate"
                    src="/retro-icons/coding-apps-websites-browser-bugs-2-58.svg"
                    alt="Icon"
                    width={28}
                    height={28}
                  />

                  <Image
                    className="pixelate"
                    src="/retro-icons/coding-apps-websites-database-60.svg"
                    alt="Icon"
                    width={28}
                    height={28}
                  />

                  <Image
                    className="pixelate"
                    src="/retro-icons/design-color-bucket-brush-63.svg"
                    alt="Icon"
                    width={28}
                    height={28}
                  />

                  <Image
                    className="pixelate"
                    src="/retro-icons/design-color-palette-sample-26.svg"
                    alt="Icon"
                    width={28}
                    height={28}
                  />
                </XStack>

                <MunroP size="$10">
                  A reference design for a building a truly high quality app that keeps
                  improving.
                </MunroP>

                <XStack space="$6" spaceDirection="horizontal">
                  <img src="/heart.svg" style={{ width: 24, height: 24 }} />
                  <img src="/heart.svg" style={{ width: 24, height: 24 }} />
                  <img src="/heart.svg" style={{ width: 24, height: 24 }} />
                  <img src="/heart.svg" style={{ width: 24, height: 24 }} />
                  <img src="/heart.svg" style={{ width: 24, height: 24 }} />
                </XStack>

                <MunroP size="$10" color="$yellow10">
                  We hope you enjoy.
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

            <YStack pos="absolute" t={0} r={-500} rotate="120deg" o={0.06} zi={-2}>
              <Image
                alt="mandala"
                width={1800}
                height={1800}
                src="/takeout/geometric.svg"
              />
            </YStack>
          </XStack>

          <Spacer size="$10" />
        </ContainerXL>
      </YStack>
    </>
  )
}

const Point = (props: { children: any; upcoming?: boolean }) => {
  return (
    <ThemeTint>
      <XStack tag="li" ai="center" space ml="$4">
        <YStack>
          {props.upcoming ? (
            <Newspaper color="$color10" />
          ) : (
            <CheckCircle color="$color10" />
          )}
        </YStack>
        <Paragraph size="$8">{props.children}</Paragraph>
      </XStack>
    </ThemeTint>
  )
}

const IconFrame = styled(Stack, {
  borderRadius: 1000,
  p: '$4',
  bc: 'rgba(255, 255, 255, 0.035)',
})

class TakeoutStore extends Store {
  showPurchase = false
}

const useTakeoutStore = createUseStore(TakeoutStore)

const PurchaseModal = () => {
  const productId = getStripeProductId('universal-starter')
  const store = useTakeoutStore()

  return (
    <Dialog
      modal
      open={store.showPurchase}
      disableRemoveScroll
      onOpenChange={(val) => {
        store.showPurchase = val
      }}
    >
      <Dialog.Adapt when="sm" platform="touch">
        <Sheet zIndex={200000} modal dismissOnSnapToBottom>
          <Sheet.Frame padding="$4" space>
            <Dialog.Adapt.Contents />
          </Sheet.Frame>
          <Sheet.Overlay />
        </Sheet>
      </Dialog.Adapt>

      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.75}
          className="blur-medium"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Dialog.Content
          bordered
          elevate
          key="content"
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ opacity: 0, scale: 0.975 }}
          exitStyle={{ opacity: 0, scale: 0.975 }}
          space
          w="90%"
          h="90%"
        >
          <YStack display="none">
            <Dialog.Title>Purchase</Dialog.Title>
            <Dialog.Description>Purchase Tamagui Takeout.</Dialog.Description>
          </YStack>

          <PurchaseSelectTeam />

          <ButtonLink
            href={`api/checkout?${new URLSearchParams({
              product_id: productId,
            }).toString()}`}
          >
            Purchase
          </ButtonLink>

          <YStack alignItems="flex-end" marginTop="$2">
            <Dialog.Close displayWhenAdapted asChild>
              <Button theme="alt1" aria-label="Close">
                Save changes
              </Button>
            </Dialog.Close>
          </YStack>

          <Unspaced>
            <Dialog.Close asChild>
              <Button
                position="absolute"
                top="$3"
                right="$3"
                size="$2"
                circular
                icon={X}
              />
            </Dialog.Close>
          </Unspaced>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}

const StarterCard = () => {
  const { subscriptions } = useUser()
  const productId = getStripeProductId('universal-starter')
  const [ref, setRef] = useState<any>()
  const subscription = subscriptions?.find(
    (sub) => sub.plan?.product === productId && sub.status === 'active'
  )
  const store = useTakeoutStore()

  useEffect(() => {
    if (!ref) return
    if (isClient) {
      // @ts-ignore
      import('../lib/sticksy').then(({ Sticksy }) => {
        new Sticksy(ref as any)
      })
    }
  }, [ref])

  return (
    <div ref={setRef}>
      <ThemeTint>
        <TakeoutCardFrame
          className="blur-medium"
          zi={1000}
          maw={340}
          als="center"
          shadowRadius={30}
          shadowOffset={{ height: 20, width: 0 }}
          shadowColor="#000"
          x={-100}
          y={100}
          mah="calc(min(95vh, 800px))"
        >
          <YStack zi={-1} fullscreen bc="$backgroundStrong" o={0.8} />

          <LinearGradient
            pos="absolute"
            b={0}
            l={0}
            r={0}
            h={100}
            colors={['$backgroundTransparent', 'rgba(0,0,0,1)']}
            zi={100}
          />

          <YStack pos="absolute" b="$4" l="$4" r="$4" zi={100}>
            <Theme name="pink">
              <ButtonLink
                href={subscription ? `/account/subscriptions#${subscription.id}` : ''}
                onPress={() => {
                  store.showPurchase = true
                }}
                size="$6"
                fontSize="$8"
                fontWeight="800"
                backgroundColor="$color9"
                borderWidth={2}
                borderColor="$color10"
                hoverStyle={{
                  backgroundColor: '$color10',
                }}
                pressStyle={{
                  backgroundColor: '$color7',
                }}
              >
                {subscription ? 'View Subscription' : 'Purchase - $350'}
              </ButtonLink>
            </Theme>
          </YStack>

          <ScrollView showsVerticalScrollIndicator={false}>
            <YStack space="$2" p="$6">
              <Paragraph fontFamily="$munro" size="$3" theme="alt2">
                Drop 0001
              </Paragraph>

              <Paragraph fontFamily="$munro" size="$10">
                Universal App Starter
              </Paragraph>

              <YStack>
                <Row
                  title="Template"
                  description="Complete Github Template with a built-in bot to send PRs with updates."
                  after="01"
                />

                <Row
                  title="Monorepo"
                  description="Complete with Next.js, Vercel deploy, Expo Native and Web, and EAS."
                  after="01"
                />

                <Row
                  title="Screens"
                  description="Tab bar, Stack view, Onboarding, Auth, Profile, Edit Profile, Account, Settings, Feed and more."
                  after="08"
                />

                <Row
                  title="Icons"
                  description="A whopping ~100k icons in total across 30 different packs, tree-shakeable, from icones.js.org."
                  after="30"
                />

                <Row
                  title="Fonts"
                  description="Three new fonts join the party, with more being added each month."
                  after="03"
                />

                <Row
                  title="Themes"
                  description="Two all new theme suites join Tamagui - Pastel and Neon - that bring a more muted or more bright feel to your app."
                  after="03"
                />

                <Row
                  title="CI / CD"
                  description="Lint, fix, tests, and deploys - all set up from day 1."
                  after="05"
                />

                <Row
                  title="Native"
                  description="Tamagui native components like Sheet and Toast pre-configured, saving you setup and build."
                  after="03"
                />
              </YStack>

              <Spacer f={1} minHeight={80} />
            </YStack>
          </ScrollView>
        </TakeoutCardFrame>
      </ThemeTint>
    </div>
  )
}

const modelUrl = `${
  process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : `http://localhost:5005`
}/takeout.gltf`
useGLTF.preload(modelUrl)

let frameCount = 0

function TakeoutBox3D(props) {
  const ref = useRef<any>()
  const { nodes, materials } = useGLTF(modelUrl) as any

  useEffect(() => {}, [])

  useFrame((state, delta) => {
    const isSlow = frameCount > 40

    // ref.current!.rotation.z += delta * 0.1
    ref.current!.rotation.y += delta * (isSlow ? 0.1 : 2)

    // effect to spin faster on first entering
    if (frameCount <= 40) {
      frameCount++
    }
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
      <YStack f={1} py="$3" space="$1">
        <MunroP size="$7">{props.title}</MunroP>
        <Paragraph size="$3" lh={18} theme="alt2">
          {props.description}
        </Paragraph>
      </YStack>

      <MunroP my="$4">{props.after}</MunroP>
    </XStack>
  )
}

const TakeoutCardFrame = styled(YStack, {
  boc: '$color3',
  bw: 0.5,
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

const tabs = [
  { value: '1' },
  { value: '2' },
  { value: '4' },
  { value: '8' },
  { value: '16' },
  { value: '32' },
]

export const PurchaseSelectTeam = () => {
  const [tabRovingState, setTabRovingState] = useState<{
    /**
     * Layout of the Tab user might intend to select (hovering / focusing)
     */
    intentAt: TabLayout | null
    /**
     * Layout of the Tab user selected
     */
    activeAt: TabLayout | null
    /**
     * Used to get the direction of activation for animating the active indicator
     */
    prevActiveAt: TabLayout | null
  }>({
    activeAt: null,
    intentAt: null,
    prevActiveAt: null,
  })

  const [currentTab, setCurrentTab] = useState(tabs[0].value)
  const setIntentIndicator = (intentAt) =>
    setTabRovingState({ ...tabRovingState, intentAt })
  const setActiveIndicator = (activeAt) =>
    setTabRovingState({
      ...tabRovingState,
      prevActiveAt: tabRovingState.activeAt,
      activeAt,
    })
  const { activeAt, intentAt } = tabRovingState

  /**
   * -1: from left
   *  0: n/a
   *  1: from right
   */
  //   const direction = (() => {
  //     if (!activeAt || !prevActiveAt || activeAt.x === prevActiveAt.x) {
  //       return 0
  //     }
  //     return activeAt.x > prevActiveAt.x ? -1 : 1
  //   })()

  //   const enterVariant =
  //     direction === 1 ? 'isLeft' : direction === -1 ? 'isRight' : 'defaultFade'
  //   const exitVariant =
  //     direction === 1 ? 'isRight' : direction === -1 ? 'isLeft' : 'defaultFade'

  const handleOnInteraction: TabsTabProps['onInteraction'] = (type, layout) => {
    if (type === 'select') {
      setActiveIndicator(layout)
    } else {
      setIntentIndicator(layout)
    }
  }

  return (
    <Tabs
      value={currentTab}
      onValueChange={setCurrentTab}
      orientation="horizontal"
      size="$2"
      flexDirection="column"
      activationMode="manual"
      position="relative"
    >
      <YStack>
        <AnimatePresence>
          {intentAt && (
            <TabsRovingIndicator
              key="intent-indicator"
              width={intentAt.width}
              height={intentAt.height}
              x={intentAt.x}
              y={intentAt.y}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {activeAt && (
            <TabsRovingIndicator
              key="active-indicator"
              isActive
              width={activeAt.width}
              height={activeAt.height}
              x={activeAt.x}
              y={activeAt.y}
            />
          )}
        </AnimatePresence>

        <Tabs.List
          disablePassBorderRadius
          loop={false}
          aria-label="Manage your account"
          space="$2"
          backgroundColor="transparent"
        >
          {tabs.map(({ value }) => (
            <Tabs.Tab
              key={value}
              unstyled
              bc="transparent"
              px="$3"
              value={value}
              onInteraction={handleOnInteraction}
            >
              {value}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </YStack>
    </Tabs>
  )
}

const TabsRovingIndicator = ({
  isActive,
  ...props
}: { isActive?: boolean } & YStackProps) => {
  return (
    <YStack
      borderRadius="$2"
      position="absolute"
      backgroundColor="$color3"
      animation="quick"
      enterStyle={{
        opacity: 0,
      }}
      exitStyle={{
        opacity: 0,
      }}
      opacity={0.7}
      {...(isActive && {
        backgroundColor: '$color8',
        opacity: 0.6,
      })}
      {...props}
    />
  )
}
