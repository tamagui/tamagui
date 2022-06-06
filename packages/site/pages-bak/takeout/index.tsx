// import '@takeout/font-noto-emoji/css/400.css'
// import '@tamagui/font-inter/css/200.css'
// import '@tamagui/font-inter/css/900.css'

import { HeaderIndependent } from '@components/Header'
import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import { SliderDemo, SwitchDemo } from '@tamagui/demos'
import { useRef, useState } from 'react'
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
  Spacer,
  Spinner,
  Square,
  Theme,
  ThemeName,
  XStack,
  YStack,
  useIsomorphicLayoutEffect,
} from 'tamagui'

import { useTint } from '../../components/ColorToggleButton'
import { ContainerLarge } from '../../components/Container'
import { FormsDemo, StacksDemo } from '../../components/demos'
import { FlatBubbleCard } from '../../components/FlatBubbleCard'
import { HoverGlow, useBoundedCursor } from '../../components/HoverGlow'
import { MediaPlayer } from '../../components/MediaPlayer'
import { useTheme } from '../../components/NextTheme'
import { NotoIcon } from '../../components/NotoIcon'
import { TamaCard } from '../../components/TamaCard'
import { useForwardToDashboard } from '../../hooks/useForwardToDashboard'
import { getUserLayout } from '../../lib/getUserLayout'

export default function TakeoutPage() {
  const { resolvedTheme } = useTheme()
  const [themeName, setThemeName] = useState<ThemeName>(resolvedTheme as any)
  const { tint, setTint } = useTint()
  const containerRef = useRef(null)

  // if logged in already go to dashboard
  useForwardToDashboard()

  useIsomorphicLayoutEffect(() => {
    setTint('pink')
    return () => {
      setTint(tint)
    }
  }, [])

  useIsomorphicLayoutEffect(() => {
    setThemeName(resolvedTheme as any)
  }, [resolvedTheme])

  return (
    <Theme name={themeName}>
      <TitleAndMetaTags title="Tamagui TAKEOUT" description="What's up with Tamagui." />

      {/* TODO bug backgroundStrong on dark in light / not variabl */}
      {/*  bc={themeName === 'dark' ? '$backgroundStrong' : '#f0f0f0'} */}
      <YStack>
        <HeaderIndependent />
        <Spacer size="$7" />

        <ContainerLarge pos="relative">
          <HoverGlow
            resist={50}
            size={750}
            strategy="blur"
            blurPct={100}
            color={themeName === 'light' ? '#fff' : 'var(--pink10)'}
            opacity={themeName === 'light' ? 0.75 : 0.125}
            background="var(--backgroundStrong)"
            parentRef={containerRef}
          />
          <YStack
            ref={containerRef}
            space="$2"
            ai="center"
            scale={0.4}
            $gtXs={{ scale: 0.4 }}
            $gtSm={{ scale: 0.6 }}
            $gtMd={{ scale: 0.75 }}
            $gtLg={{ scale: 0.9 }}
          >
            <YStack py="$11" pos="relative">
              <TakeoutHero parentRef={containerRef} />
            </YStack>
          </YStack>

          <YStack zi={100}>
            <Spacer size="$9.5" />

            <Paragraph
              ta="center"
              maxWidth={700}
              als="center"
              size="$9"
              fow="200"
              theme="alt3"
              fontWeight="300"
            >
              Screens, themes, colors & components.
              <br />
              Plus a whole system for building apps.
            </Paragraph>

            <Spacer size="$8" />
            {/* 
            <H2 size="$8" ta="center" fontFamily="$silkscreen">
              Pro
            </H2>

            <Spacer size="$6" /> */}

            <XStack flexWrap="wrap" justifyContent="space-between" mb="$-4">
              <TamaCard icon="💻" title="Monorepo">
                A large monorepo with complete design system, auth screen, and much more.
              </TamaCard>
              <TamaCard icon="🎨" title="Colors">
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
              <TamaCard icon="🍆" title="Icons">
                3 new icon packs that fully support sizing, themes, and tree shaking.
              </TamaCard>
            </XStack>

            <Spacer size="$8" />

            <Separator mx="$10" />

            <Spacer size="$8" />

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
            <Separator mx="$10" />
            <Spacer size="$8" />

            <FlatBubbleCard ov="hidden" className="text-glow-hover all ease-in ms300" hoverable>
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
                    <NotoIcon ta="center" miw={90} mb={50} size="$8" key={icon}>
                      {icon}
                    </NotoIcon>
                  )
                })}
              </XStack>

              <Spacer size="$6" />
            </FlatBubbleCard>

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
        </ContainerLarge>
      </YStack>
    </Theme>
  )
}

TakeoutPage.getLayout = getUserLayout

const TakeoutHero = ({ parentRef }: { parentRef: any }) => {
  const { x, y, width, height, bounds, position } = useBoundedCursor({
    parentRef,
    resist: 50,
    size: 0,
  })

  return (
    <>
      <H1
        color="$color"
        fos={240}
        lh={200}
        fow="900"
        fontFamily="$inter"
        letsp={-19}
        x={25 / 2}
        pos="relative"
        zIndex={5}
        y={height}
      >
        TAKEOUT
      </H1>
      <FloatingItemsBelow />
      <FloatingItemsAbove />
    </>
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
        x={-(250 / 2)}
        height={250}
        ai="center"
        jc="center"
      >
        <Paragraph fontSize={250}>🥡</Paragraph>
      </YStack>

      <Circle size="$8" theme="teal">
        <Spinner size="large" color="$teal10" o={0.2} />
      </Circle>

      <YStack pos="absolute" t={0} l="50%" x={100} scale={0.8}>
        <Card themeInverse py="$5">
          <SwitchDemo />
        </Card>
      </YStack>

      {/* BOTTOM */}
      <YStack pos="absolute" b={20} r={-100} scale={0.75}>
        <MediaPlayer />
      </YStack>

      <YStack pos="absolute" b={80} l={0} x={-150} scale={1}>
        <Card elevation="$2" p="$6">
          <StacksDemo />
        </Card>
      </YStack>

      <YStack pos="absolute" b={-60} l={120}>
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
        scale={0.5}
        right={-100}
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
            src={require('@tamagui/demos/public/camera.jpg').default.src}
          />
        </Card.Background>
      </Card>

      <SwitchDemo />

      <YStack zi={100} pos="absolute" b={-20} r={120} scale={0.5}>
        <Card padded>
          <SliderDemo />
        </Card>
      </YStack>

      <Circle o={0.5} pos="absolute" l={200} t={100} size={175} bc="$colorMid" />
      <Square o={0.5} rotate="45deg" pos="absolute" r={200} b={100} size={175} bc="$colorMid" />
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
