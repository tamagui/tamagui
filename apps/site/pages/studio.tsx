import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import { ThemeTint } from '@tamagui/logo'
import { useThemeSetting } from '@tamagui/next-theme'
import { ContainerXL } from 'components/Container'
import { DivProps, HoverGlowProps, useHoverGlow } from 'components/HoverGlow'
import { getDefaultLayout } from 'components/layouts/DefaultLayout'
// import { TamaCard } from 'components/TamaCard'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import {
  Button,
  EnsureFlexed,
  H1,
  H2,
  HeadingProps,
  Separator,
  Spacer,
  Theme,
  XStack,
  YStack,
  useComposedRefs,
} from 'tamagui'

import { Features } from '../components/Features'
import { NextLink } from '../components/NextLink'

export default function StudioSplashPage() {
  return (
    <>
      <TitleAndMetaTags title="Tamagui Studio" description="Tamagui Studio" />

      <Head>
        <link href="/fonts/inter-takeout.css" rel="stylesheet" />
      </Head>

      <YStack fullscreen o={0.05} className="bg-grid" />
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
          o={0.25}
          pos="absolute"
          fullscreen
          scaleX="200%"
          rotateX="-180deg"
          y={800}
          rotate="20deg"
        >
          <YStack fullscreen pe="none" zIndex={100} className="themes-fader" />
          <Ribbon id="green" color="var(--green4)" />
        </YStack>

        <ContainerXL mt="$-5">
          <Hero />

          <XStack ov="hidden" maw="100%">
            <YStack p="$8" maw="50%">
              <EnsureFlexed />
              <Features
                size="$5"
                items={[
                  `Preview your complete design system.`,
                  `Reloads your real tamagui.config.ts in realtime.`,
                  `Visualize media queries, tokens and more.`,
                  `View and edit color palettes with accessibility grades.`,
                ]}
              />
            </YStack>
            <YStack p="$8" maw="50%">
              <EnsureFlexed />
              <Features
                size="$5"
                items={[
                  `View and edit animations across every driver.`,
                  `Visualize themes on your components across every pseudo state.`,
                  `(Coming soon) Edit themes in your app in realtime.`,
                  `(Coming soon) Sync your tokens and components with Figma.`,
                ]}
              />
            </YStack>
          </XStack>
        </ContainerXL>
      </YStack>
    </>
  )
}

StudioSplashPage.getLayout = getDefaultLayout

type LetterConf = {
  letter: string
  glow: HoverGlowProps
  props: HeadingProps
  underlayStyle?: DivProps['style']
}

const lettersConf: LetterConf[] = [
  {
    letter: 'S',
    props: {
      rotate: '-20deg',
      fontSize: 380,
      theme: 'red',
    },
    glow: {
      resist: 98,
      inverse: true,
      offset: {
        x: -120,
        y: 0,
      },
      style: {
        transition: `all ease-out 1000ms`,
      },
    },
    underlayStyle: {
      // marginBottom: -10,
      transform: `scale(1) translateY(30%) translateX(-20%)`,
    },
  },

  {
    letter: 't',
    props: {
      rotate: '20deg',
      zIndex: 20,
      fontSize: 320,
      theme: 'yellow',
    },
    glow: {
      resist: 94,
      offset: {
        x: 70,
        y: 0,
      },
      style: {
        transition: `all ease-out 1000ms`,
      },
    },
    underlayStyle: {
      transform: `scale(0.5) translateY(-20%)`,
      opacity: 0.1,
      borderRadius: 60,
    },
  },

  {
    letter: 'U',
    props: {
      rotate: '-5deg',
      fontSize: 420,
      theme: 'green',
    },
    glow: {
      resist: 96,
      offset: {
        x: 170,
        y: 0,
      },
      style: {
        transition: `all ease-out 1000ms`,
      },
    },
    underlayStyle: {
      transform: `scale(1.25) translateY(50%) translateX(-10%)`,
    },
  },

  {
    letter: 'd',
    props: {
      rotate: '3deg',
      fontSize: 310,
      theme: 'blue',
    },
    glow: {
      resist: 93,
      inverse: true,
      offset: {
        x: 380,
        y: 0,
      },
      style: {
        transition: `all ease-out 1000ms`,
      },
    },
    underlayStyle: {
      borderRadius: 0,
      transform: `scale(0.5) translateY(30%)`,
    },
  },

  {
    letter: 'i',
    props: {
      rotate: '-16deg',
      fontSize: 380,
      theme: 'purple',
    },
    glow: {
      resist: 97,
      inverse: true,
      offset: {
        x: 560,
        y: 0,
      },
      style: {
        transition: `all ease-out 1000ms`,
      },
    },
  },

  {
    letter: 'O',
    props: {
      rotate: '10deg',
      fontSize: 300,
      theme: 'pink',
    },
    glow: {
      resist: 92,
      offset: {
        x: 630,
        y: 0,
      },
      style: {
        transition: `all ease-out 1000ms`,
      },
    },
    underlayStyle: {
      borderRadius: 20,
      transform: `rotate(-20deg) scale(0.75) translateX(40%) translateY(60%)`,
    },
  },
]

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

  const letters = lettersConf.map(
    ({
      underlayStyle,
      glow,
      letter,
      props: { scale, rotate, zIndex, ...headingProps },
    }) => {
      const colorVar = `var(--${headingProps.theme}8)`

      const Glow = useHoverGlow({
        resist: 90,
        size: Number(headingProps.fontSize) * 0.5,
        strategy: 'plain-underlay',
        underlayStyle: {
          transform: `rotate(${rotate}) scale(0.75) translateX(20%) translateY(20%)`,
          opacity: 0.3,
          borderRadius: 100,
          ...underlayStyle,
        },
        background: colorVar,
        // background: `rgb(from ${colorVar} r g b / 50%) `,
        opacity: 1,
        ...glow,
        offset: {
          x: glow.offset!.x! - 290,
          y: glow.offset!.y! - 230,
        },
        style: {
          ...glow.style,
          transform: `rotate(${rotate})`,
        },
        restingStyle: {
          rotate: '0deg',
        },
      })

      const Component = (
        <YStack key={letter} pos="relative" scale={scale} zIndex={zIndex}>
          <Glow.Component>
            <H1
              color="$color9"
              className="mix-blend"
              cursor="default"
              fos={320}
              lh={300}
              fow="900"
              rotate={rotate}
              ls={-8}
              zIndex={5}
              {...headingProps}
            >
              {letter}
            </H1>
          </Glow.Component>
        </YStack>
      )

      return {
        Component,
        Glow,
      }
    }
  )

  const parentRef = useComposedRefs(
    glow.parentRef,
    glint.parentRef,
    ...letters.map((l) => l.Glow.parentRef)
  )

  return (
    <YStack
      ai="center"
      scale={0.4}
      $gtXs={{ scale: 0.5 }}
      $gtSm={{ scale: 0.7 }}
      $gtMd={{ scale: 0.9 }}
      $gtLg={{ scale: 1 }}
      pos="relative"
      ref={parentRef as any}
    >
      <YStack>
        {glow.Component()}
        {glint.Component()}
        <YStack
          // onMouseEnter={() => setHovered(true)}
          // onMouseLeave={() => setHovered(false)}
          ai="center"
          pb={150}
          pos="relative"
        >
          <YStack h={600} w="100%">
            {letters.map(({ Component }) => {
              return Component
            })}
          </YStack>

          <YStack ai="center" als="center" f={1} w="100%">
            <ThemeTint>
              <NextLink target="_blank" href="https://github.com/sponsors/natew">
                <Button
                  bg="$color10"
                  color="$color1"
                  hoverStyle={{
                    bg: '$color9',
                  }}
                  pressStyle={{
                    bg: '$color8',
                  }}
                  size="$6"
                  borderRadius="$10"
                >
                  Sponsor for early access
                </Button>
              </NextLink>
            </ThemeTint>
          </YStack>

          <Spacer size="$12" />

          <XStack maw={790} space="$8" separator={<Separator vertical />}>
            <H2 als="center" size="$9" fow="900">
              A new way to design system.
            </H2>
          </XStack>
        </YStack>

        {/* <XStack
          mx="$8"
          px="$8"
          pos="relative"
          zi={1000000000}
          flexWrap="wrap"
          justifyContent="space-between"
          ref={belowGlow.parentRef as any}
        >
          {belowGlow.Component()}
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
        </XStack> */}
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
