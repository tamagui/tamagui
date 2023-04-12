// much nicer waves:
// https://codepen.io/bsehovac/pen/LQVzxJ

// import '@takeout/font-noto-emoji/css/300.css'

import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
// import { createNotoFont } from '@takeout/font-noto-emoji'
import { SwitchDemo } from '@tamagui/demos'
import { useThemeSetting } from '@tamagui/next-theme'
import { ContainerXL } from 'components/Container'
import { InputsDemo, StacksDemo } from 'components/demos'
import { FlatBubbleCard } from 'components/FlatBubbleCard'
import { useHoverGlow } from 'components/HoverGlow'
import { MediaPlayer } from 'components/MediaPlayer'
import { NotoIcon } from 'components/NotoIcon'
import { TamaCard } from 'components/TamaCard'
import { getUserLayout } from 'lib/getUserLayout'
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
} from 'tamagui'

// lazy load this on page load
// insertFont('noto', createNotoFont())

export default function TakeoutPage() {
  const { resolvedTheme: themeName } = useThemeSetting()!
  // const { tint, setTintIndex } = useTint()

  // if logged in already go to dashboard
  // useForwardToDashboard()

  // useIsomorphicLayoutEffect(() => {
  //   setTintIndex('pink')
  //   return () => {
  //     setTintIndex(tint)
  //   }
  // }, [])

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
        </YStack>
        <YStack
          o={0.45}
          pos="absolute"
          fullscreen
          rotateX="-180deg"
          y={800}
          rotate="20deg"
        >
          <YStack fullscreen pe="none" zIndex={100} className="themes-fader" />
          <Ribbon id="green" color="var(--green4)" />
        </YStack>

        <ContainerXL mt="$-5">
          <Hero />
        </ContainerXL>
      </YStack>
    </Theme>
  )
}

TakeoutPage.getLayout = getUserLayout

const Hero = () => {
  const { resolvedTheme: themeName } = useThemeSetting()!
  const isLight = themeName === 'light'

  const glow = useHoverGlow({
    resist: 40,
    size: 900,
    strategy: 'blur',
    blurPct: 100,
    color: themeName === 'light' ? '#fff' : 'var(--pink10)',
    opacity: isLight ? 0.25 : 0.05,
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
    opacity: isLight ? 0.25 : 0.05,
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
        <YStack ai="center" py={220} pb={150} pos="relative">
          <H1
            color="$color"
            cursor="default"
            fos={320}
            lh={300}
            fow="900"
            fontFamily="$inter"
            ls={-8}
            pos="relative"
            zIndex={5}
            className="fade-text"
          >
            Studio
          </H1>

          <Spacer size="$12" />

          <XStack maw={790} space="$8" separator={<Separator vertical />}>
            <YStack jc="center" space>
              <Button
                size="$6"
                fontWeight="800"
                borderColor="$borderColor"
                bc="$backgroundStrong"
              >
                Sponsor for access
              </Button>
            </YStack>
            <H2 als="center" fontFamily="$body" size="$9" fow="200" theme="alt1">
              Preview your design system, themes, fonts and components.
            </H2>
          </XStack>
        </YStack>

        <XStack
          mx="$8"
          px="$8"
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
            4 new themes that completely change the look and feel of your app, easy to
            fork.
          </TamaCard>
          <TamaCard icon="📱" title="Screens">
            20 pre-built screens covering common use cases from e-commerce and social, to
            forms.
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
    <svg
      width="100%"
      height="400px"
      fill="none"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
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
