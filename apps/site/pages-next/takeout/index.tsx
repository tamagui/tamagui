// much nicer waves:
// https://codepen.io/bsehovac/pen/LQVzxJ

// import '@takeout/font-noto-emoji/css/300.css'

import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import { createNotoFont } from '@takeout/font-noto-emoji'
import { SwitchDemo } from '@tamagui/demos'
import { useThemeSetting } from '@tamagui/next-theme'
import Head from 'next/head'
import {
  Button,
  Card,
  Circle,
  H1,
  H2,
  H3,
  Image,
  Paragraph,
  Separator,
  Slider,
  Spacer,
  Spinner,
  Theme,
  XStack,
  YStack,
  insertFont,
  useComposedRefs,
  useIsomorphicLayoutEffect,
} from 'tamagui'

import { ContainerXL } from '../../components/Container'
import { FormsDemo, StacksDemo } from '../../components/demos'
import { FlatBubbleCard } from '../../components/FlatBubbleCard'
import { useHoverGlow } from '../../components/HoverGlow'
import { MediaPlayer } from '../../components/MediaPlayer'
import { NotoIcon } from '../../components/NotoIcon'
import { TamaCard } from '../../components/TamaCard'
import { useTint } from '../../components/useTint'
import { getUserLayout } from '../../lib/getUserLayout'

// lazy load this on page load
insertFont('noto', createNotoFont())

export default function TakeoutPage() {
  const { resolvedTheme: themeName } = useThemeSetting()
  const { tint, setTint } = useTint()

  // if logged in already go to dashboard
  // useForwardToDashboard()

  useIsomorphicLayoutEffect(() => {
    setTint('pink')
    return () => {
      setTint(tint)
    }
  }, [])

  return (
    <Theme name={themeName as any}>
      <TitleAndMetaTags title="Tamagui TAKEOUT" description="What's up with Tamagui." />

      <Head>
        <link href="/fonts/inter-takeout.css" rel="stylesheet" />
      </Head>

      <YStack>
        <YStack
          o={0.45}
          pos="absolute"
          fullscreen
          rotateX="-180deg"
          y={500}
          scaleY={2}
          rotate="20deg"
        >
          <YStack fullscreen pe="none" zIndex={100} className="themes-fader" />
          <Ribbon id="pink" color="var(--blue4)" />
        </YStack>
        <YStack
          o={0.45}
          pos="absolute"
          fullscreen
          rotateX="-180deg"
          y={800}
          scaleY={2}
          rotate="20deg"
        >
          <YStack fullscreen pe="none" zIndex={100} className="themes-fader" />
          <Ribbon id="green" color="var(--green4)" />
        </YStack>

        <ContainerXL mt="$-5">
          <Hero />

          <YStack zi={100}>
            {/* @ts-ignore */}
            {/* <YStack mt={-500} w="100%" h={500} style={{ backdropFilter: 'blur(100px)' }}></YStack> */}

            <YStack pt="$16" />

            <XStack flexWrap="wrap">
              <FlatBubbleCard>
                <H2 size="$9" ta="center" fontFamily="$silkscreen">
                  Colors
                </H2>
              </FlatBubbleCard>

              <FlatBubbleCard feature>
                <H2 size="$9" ta="center" fontFamily="$silkscreen">
                  Theme Studio
                </H2>
              </FlatBubbleCard>

              <FlatBubbleCard feature>
                <H2 size="$9" ta="center" fontFamily="$silkscreen">
                  Theme Studio
                </H2>
              </FlatBubbleCard>

              <FlatBubbleCard>
                <H2 size="$9" ta="center" fontFamily="$silkscreen">
                  Colors
                </H2>
              </FlatBubbleCard>
            </XStack>

            <Spacer size="$8" />
            <Spacer size="$8" />

            <>
              <H2 size="$8" ta="center" fontFamily="$silkscreen">
                3 icon packs
              </H2>
              <Spacer size="$4" />
              <H3 size="$6" ta="center" fow="200">
                Works on native + web
              </H3>

              <Spacer size="$8" />

              <XStack
                className="text-glow"
                flexWrap="wrap"
                minWidth="150%"
                ai="center"
                jc="space-between"
                als="center"
                mah={375}
                ov="hidden"
                py="$4"
              >
                {demoIcons.map((icon) => {
                  return (
                    <NotoIcon ta="center" miw={90} mb={50} size="$16" key={icon}>
                      {icon}
                    </NotoIcon>
                  )
                })}
              </XStack>

              <Spacer size="$6" />
            </>

            <Spacer size="$6" />
            <Separator mx="$10" />
            <Spacer size="$8" />

            <H2 size="$8" ta="center" fontFamily="$silkscreen">
              Enterprise
            </H2>

            <Spacer size="$6" />
            {/* 
            <XStack flexWrap="wrap" justifyContent="space-between" mb="$-4">
              <TamaCard icon={<NotoIcon size="$7">💬</NotoIcon>} title="Private Support">
                Access to a private Slack channel with support SLA.
              </TamaCard>
              <TamaCard icon={<NotoIcon size="$7">🛠</NotoIcon>} title="Canary Releases">
                Access to early releases of Tamagui and Takeout builds.
              </TamaCard>
              <TamaCard icon={<NotoIcon size="$7">🗳</NotoIcon>} title="Roadmap">
                Access to vote, suggest and comment on roadmap items.
              </TamaCard>
            </XStack> */}

            <Spacer size="$8" />

            <XStack>
              <YStack>
                <Paragraph>ok</Paragraph>
              </YStack>
            </XStack>
          </YStack>
        </ContainerXL>
      </YStack>
    </Theme>
  )
}

TakeoutPage.getLayout = getUserLayout

const Hero = () => {
  const { resolvedTheme: themeName } = useThemeSetting()

  const glow = useHoverGlow({
    resist: 40,
    size: 900,
    strategy: 'blur',
    blurPct: 100,
    color: themeName === 'light' ? '#fff' : 'var(--pink10)',
    opacity: 0.33,
    background: 'transparent',
  })

  const glint = useHoverGlow({
    // debug: true,
    resist: 56,
    size: 500,
    strategy: 'blur',
    blurPct: 100,
    color: 'var(--purple10)',
    offset: {
      x: 200,
      y: -200,
    },
    opacity: 0.33,
    background: 'transparent',
    inverse: true,
  })

  const belowGlow = useHoverGlow({
    resist: 40,
    // debug: true,
    size: 500,
    strategy: 'blur',
    blurPct: 200,
    color: 'var(--blue10)',
    opacity: 0.25,
    offset: {
      // y: 300,
    },
  })

  const parentRef = useComposedRefs(glow.parentRef, glint.parentRef)

  return (
    <YStack
      ai="center"
      scale={0.4}
      $gtXs={{ scale: 0.5, py: '$2' }}
      $gtSm={{ scale: 0.7, py: '$4' }}
      $gtMd={{ scale: 0.9, py: '$6' }}
      $gtLg={{ scale: 1, py: '$8' }}
      pos="relative"
      ref={parentRef as any}
    >
      <YStack>
        {glow.element}
        {glint.element}
        <YStack ai="center" py={220} pos="relative">
          <H1
            color="$color"
            cursor="default"
            fos={320}
            lh={200}
            fow="900"
            fontFamily="$inter"
            ls={-24}
            pos="relative"
            zIndex={5}
          >
            takeout
          </H1>

          <Spacer size="$12" />

          <XStack maw={790} space="$8" separator={<Separator vertical />}>
            <YStack jc="center" space>
              <Button fontWeight="800" borderColor="$borderColor" bc="$backgroundStrong">
                Demos
              </Button>
              <Button fontWeight="800" borderColor="$borderColor" chromeless>
                Documentation
              </Button>
            </YStack>
            <H2 als="center" fontFamily="$body" size="$9" fow="200" theme="alt2">
              Hundreds of meticulously designed components and screens that take you from 0 to 100,
              real quick.
            </H2>
          </XStack>

          {/* <FloatingItemsBelow />
          <FloatingItemsAbove /> */}
        </YStack>

        <XStack
          mx="$8"
          pos="relative"
          zi={1000000000}
          flexWrap="wrap"
          justifyContent="space-between"
          ref={belowGlow.parentRef as any}
        >
          {belowGlow.element}
          <TamaCard icon="🧑‍💻" title="Monorepo">
            A large monorepo with complete design system, auth screen, and much more.
          </TamaCard>
          <TamaCard icon="🐠" title="Colors">
            2 new color schemes - Contrast and Pastel - that tree-shake.
          </TamaCard>
          <TamaCard icon="🖼" title="Themes">
            4 new themes that completely change the look and feel of your app, easy to fork.
          </TamaCard>
          <TamaCard icon="📱" title="Screens">
            20 pre-built screens covering common use cases from e-commerce and social, to forms.
          </TamaCard>
          <TamaCard icon="📦" title="Components">
            Autocomplete. Menu. More on the way, with upgrades within your yearly period.
          </TamaCard>
          <TamaCard icon="🛠" title="Icons">
            3 new icon packs that fully support sizing, themes, and tree shaking.
          </TamaCard>
        </XStack>
      </YStack>
    </YStack>
  )
}

const Ribbon = ({ id, color }: { id: string; color: string }) => {
  return (
    <svg width="100%" height="400px" fill="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <linearGradient id={id} x1="0%" y1="24%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="transparent" />
        <stop offset="50%" stopColor={color} />
        <stop offset="60%" stopColor="transparent" />
      </linearGradient>
      <path
        fill={`url(#${id})`}
        d="
          M0 67
          C 273,183
            822,-40
            1920.00,106 
          
          V 359 
          H 0 
          V 67
          Z"
      >
        <animate
          repeatCount="indefinite"
          fill={`url(#${id})`}
          attributeName="d"
          dur="35s"
          attributeType="XML"
          values="
            M0 77 
            C 473,283
              822,-40
              1920,116 
            
            V 359 
            H 0 
            V 67 
            Z; 

            M0 77 
            C 473,-40
              1222,283
              1920,136 
            
            V 359 
            H 0 
            V 67 
            Z; 

            M0 77 
            C 973,260
              1722,-53
              1920,120 
            
            V 359 
            H 0 
            V 67 
            Z; 

            M0 77 
            C 473,283
              822,-40
              1920,116 
            
            V 359 
            H 0 
            V 67 
            Z
            "
        ></animate>
      </path>
    </svg>
  )
}

const FloatingItemsAbove = () => {
  return (
    <YStack fullscreen zIndex={10} pe="none">
      <YStack
        zi={100}
        pos="absolute"
        t="50%"
        l="50%"
        y={60}
        x={-(290 / 2)}
        height={290}
        ai="center"
        jc="center"
      >
        {/* <Paragraph fontSize={290}>🥡</Paragraph> */}
      </YStack>

      <Circle zi={100} size="$5" theme="purple">
        <Spinner size="small" color="$purple10" o={0.2} />
      </Circle>

      {/* BOTTOM */}
      <YStack pos="absolute" b={50} r={100} scale={0.75}>
        <MediaPlayer />
      </YStack>

      <YStack pos="absolute" b={80} y={100} x={150} scale={0.8}>
        <Card elevation="$2" p="$6">
          <StacksDemo />
        </Card>
      </YStack>

      <YStack scale={0.5} pos="absolute" b={160} l={120}>
        <Card>
          <FormsDemo />
        </Card>
      </YStack>
    </YStack>
  )
}

const FloatingItemsBelow = () => {
  return (
    <YStack fullscreen zIndex={0} pe="none">
      <Card
        pos="absolute"
        top={-20}
        right={40}
        scale={0.8}
        w={200}
        h={300}
        zi={100}
        theme="dark"
        elevate
        size="$4"
      >
        <Card.Header padded>
          <H2>Sony A7IV</H2>
          <Paragraph theme="alt2">Now available</Paragraph>
        </Card.Header>
        <Card.Footer padded>
          <XStack f={1} />
          <Button br="$10">Purchase</Button>
        </Card.Footer>
        <Card.Background>
          <Image
            width={300}
            height={500}
            resizeMode="cover"
            src=""
            // src={require('@tamagui/demos/photo/camera').default.src}
          />
        </Card.Background>
      </Card>

      <YStack pos="absolute" t="2%" l={12} zi={0} scale={0.75}>
        <Card py="$8">
          <SwitchDemo />
        </Card>
      </YStack>

      <YStack zi={100} pos="absolute" b={180} r={120} scale={0.5}>
        <Card padded>
          <Slider defaultValue={[50]} max={100} step={1}>
            <Slider.Track>
              <Slider.TrackActive />
            </Slider.Track>
            <Slider.Thumb bordered circular elevate index={0} />
          </Slider>
        </Card>
      </YStack>

      {/* <Circle o={0.5} pos="absolute" l={200} t="50%" size={175} bc="$colorMid" />
      <Square o={0.5} rotate="45deg" pos="absolute" r={200} b="50%" size={175} bc="$colorMid" /> */}
    </YStack>
  )
}

const demoIcons = [
  '🛠',
  '📍',
  '✂️',
  '📆',
  '🖇',
  '📁',
  '📄',
  '📃',
  '💬',
  '⬆',
  '↗',
  '➡',
  '↘',
  '⬇',
  '↔',
  '↩',
  '↕',
  '🔄',
  '⏸',
  '▶',
  '⏩',
  '⏩',
  '📶',
  '➕',
  '✖',
  '➖',
  '➗',
  '❓',
  '❗',
  '💲',
  '⭕',
  '✅',
  '❌',
  '💤',
  '🕐',
  '🌙',
  '🔥',
  '✨',
  '🏆',
  '🎲',
  '🎨',
  '🔔',
  '🔕',
  '🎧',
  '🎤',
  '📱',
  '🔋',
  '🪫',
  '💻',
  '🖱',
  '🎬',
  '🎹',
  '📹',
  '🔍',
  '💡',
  '🏷',
  '💵',
  '💳',
  '📥',
  '📤',
  '📫',
  '✏',
  '🗑',
  '🔒',
  '🔓',
  '🧹',
  '🛒',
  '🚫',
  '🥹',
  '🥲',
  '😍',
  '👍',
  '👎',
  '👀',
  '🍩',
  '🍪',
  '🆒',
  '🆕',
  '🔴',
  '🟥',
  '🔶',
]
