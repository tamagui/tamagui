import { getDefaultLayout } from '@lib/getDefaultLayout'
import { ThemeTint } from '@tamagui/logo'
import { Lock } from '@tamagui/lucide-icons'
import { useThemeSetting } from '@tamagui/next-theme'
import { Container, ContainerXL } from 'components/Container'
import { Features } from 'components/Features'
import { DivProps, HoverGlowProps, IS_SAFARI, useHoverGlow } from 'components/HoverGlow'
import { NextLink } from 'components/NextLink'
import { NextSeo } from 'next-seo'
import Head from 'next/head'
import { memo } from 'react'
import {
  Button,
  EnsureFlexed,
  H1,
  H2,
  HeadingProps,
  Separator,
  SizableText,
  Spacer,
  XStack,
  YStack,
  useComposedRefs,
} from 'tamagui'

import { LoadInter900 } from '../components/LoadFont'

export default function StudioSplashPage() {
  const soonButton = (
    <Button
      size="$2"
      theme="green"
      br="$9"
      pe="none"
      mr="$1"
      y={-2}
      display="inline-flex"
    >
      Soon
    </Button>
  )

  return (
    <>
      <NextSeo title="Tamagui Studio" description="Tamagui Studio" />

      <Head>
        <LoadInter900 />
      </Head>

      <YStack fullscreen className="bg-grid" />

      <YStack>
        <RibbonContainer />

        <ContainerXL>
          <Hero />

          <Spacer size="$8" />

          <XStack ov="hidden" maw={1000} als="center" $sm={{ fd: 'column', maw: '100%' }}>
            <YStack px="$6" maw="50%" $sm={{ maw: '100%', p: '$2' }}>
              <EnsureFlexed />
              <Features
                size="$5"
                items={[
                  `Intuitive views into your design system`,
                  `Realtime tamagui.config.ts load`,
                  `Visualize media queries, tokens, fonts and more`,
                  `View & edit color palettes with accessibility`,
                ]}
              />
            </YStack>
            <YStack px="$6" maw="50%" $sm={{ maw: '100%', p: '$2' }}>
              <EnsureFlexed />
              <Features
                size="$5"
                items={[
                  `View and edit animations across every driver`,
                  `See components + themes for every pseudo state`,
                  <span>{soonButton} Edit themes in your app in realtime</span>,
                  <span>{soonButton} Sync tokens & components with Figma</span>,
                ]}
              />
            </YStack>
          </XStack>

          <Spacer size="$12" />
        </ContainerXL>
      </YStack>
    </>
  )
}

StudioSplashPage.getLayout = getDefaultLayout

const RibbonContainer = () => {
  const { resolvedTheme: themeName } = useThemeSetting()!
  const isLight = themeName === 'light'

  return (
    <YStack
      o={isLight ? 0.26 : 0.3}
      pos="absolute"
      fullscreen
      scaleX="200%"
      rotateX="-180deg"
      y={600}
      rotate="20deg"
    >
      <YStack fullscreen pe="none" zIndex={100} className="themes-fader" />
      <Ribbon id="green" color="var(--color8)" />
    </YStack>
  )
}

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
      rotate: '-12deg',
      fontSize: 380,
      theme: 'red',
    },
    glow: {
      resist: 96,
      inverse: true,
      offset: {
        x: -120,
        y: 0,
      },
      style: {
        transition: `all ease-out 300ms`,
      },
    },
    underlayStyle: {
      // marginBottom: -10,
      backgroundColor: 'var(--background)',
      transform: `scale(1) translateY(30%) translateX(-20%)`,
    },
  },

  {
    letter: 't',
    props: {
      rotate: '10deg',
      zIndex: 20,
      fontSize: 320,
      theme: 'yellow',
    },
    glow: {
      resist: 92,
      offset: {
        x: 120,
        y: 0,
      },
      style: {
        transition: `all ease-out 300ms`,
      },
    },
    underlayStyle: {
      transform: `scale(0.45) translateY(210%)`,
      opacity: 0.15,
      backgroundColor: 'var(--color)',
    },
  },

  {
    letter: 'U',
    props: {
      rotate: '-5deg',
      fontSize: 400,
      theme: 'green',
    },
    glow: {
      resist: 99,
      offset: {
        x: 170,
        y: 0,
      },
      style: {
        transition: `all ease-out 300ms`,
      },
    },
    underlayStyle: {
      opacity: 0,
      // transform: `translateY(50%) translateX(-10%) rotate(20deg)`,
      // borderRadius: 80,
      // opacity: 0.25,
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
      resist: 95,
      inverse: true,
      offset: {
        x: 380,
        y: 0,
      },
      style: {
        transition: `all ease-out 300ms`,
      },
    },
    underlayStyle: {
      opacity: 0,
      // transform: `scale(0.5) translateY(30%)`,
      // opacity: 0.25,
    },
  },

  {
    letter: 'i',
    props: {
      rotate: '-8deg',
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
        transition: `all ease-out 300ms`,
      },
    },
    underlayStyle: {
      transform: `scale(0.2) translateX(-85%) translateY(-115%)`,
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
      resist: 97,
      offset: {
        x: 600,
        y: -30,
      },
      style: {
        transition: `all ease-out 300ms`,
      },
    },
    underlayStyle: {
      borderRadius: 20,
      transform: `rotate(-20deg) scale(0.75) translateX(40%) translateY(60%)`,
      opacity: 0.25,
    },
  },
]

const Hero = memo(() => {
  const { resolvedTheme: themeName } = useThemeSetting()!
  const isLight = themeName === 'light'

  const glow = useHoverGlow({
    resist: 85,
    size: 900,
    offset: {
      x: -50,
      y: -50,
    },
    strategy: 'blur',
    blurPct: 100,
    color: 'var(--color10)',
    opacity: isLight ? 0.4 : 0.285,
    background: 'transparent',
    style: {
      transition: `all ease-out 500ms`,
    },
  })

  const glint = useHoverGlow({
    resist: 95,
    size: isLight ? 100 : 200,
    strategy: 'blur',
    blurPct: isLight ? 10 : 10,
    color: isLight ? '#fff' : '#000',
    offset: {
      x: 200,
      y: -200,
    },
    opacity: isLight ? 1 : 0.4,
    background: 'transparent',
    inverse: true,
    style: {
      transition: `all ease-out 500ms`,
    },
  })

  const lettersContainerBounds = {
    width: 1000,
    height: 600,
    left: 0,
    top: 0,
  }

  const letters = lettersConf.map(
    ({
      underlayStyle,
      glow,
      letter,
      props: { scale, rotate, zIndex, ...headingProps },
    }) => {
      const colorVar = `var(--${headingProps.theme}8)`

      const Glow = useHoverGlow({
        useResizeObserverRect: IS_SAFARI,
        resist: 90,
        size: Number(headingProps.fontSize) * 0.5,
        strategy: 'plain-underlay',
        initialParentBounds: lettersContainerBounds,
        initialRelativeToParentBounds: {
          ...lettersContainerBounds,
          // arbitrary...
          left: 500,
          top: 0,
        },
        initialOffset: {
          x: lettersContainerBounds.width / 2,
          y: lettersContainerBounds.height / 2,
        },
        underlayStyle: {
          transform: `rotate(${rotate}) scale(0.75) translateX(20%) translateY(20%)`,
          opacity: 1,
          borderRadius: 100,
          ...underlayStyle,
        },
        background: colorVar,
        // background: `rgb(from ${colorVar} r g b / 50%) `,
        opacity: 1,
        ...glow,
        offset: {
          x: glow.offset!.x! - 290,
          y: glow.offset!.y! - 130,
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
            <YStack pos="relative" w={320} h={320}>
              <H1
                pos="absolute"
                t={0}
                l={0}
                color="$color9"
                className="mix-blend text-3d"
                cursor="default"
                fos={320}
                lh={300}
                fow="900"
                rotate={rotate}
                zIndex={5}
                {...headingProps}
              >
                {letter}
              </H1>

              <H1
                pos="absolute"
                t={1}
                l={1}
                o={0.75}
                className="clip-text grain"
                cursor="default"
                fos={320}
                lh={300}
                fow="900"
                rotate={rotate}
                zIndex={6}
                {...headingProps}
              >
                {letter}
              </H1>
            </YStack>
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
    <ThemeTint>
      <YStack
        als="center"
        pt={100}
        pos="relative"
        {...lettersContainerBounds}
        minWidth={lettersContainerBounds.width}
        minHeight={lettersContainerBounds.height}
      >
        <YStack
          ai="center"
          $gtSm={{ scale: 0.7 }}
          $gtMd={{ scale: 0.9 }}
          $gtLg={{ scale: 1 }}
          $sm={{ scale: 0.55 }}
          $xs={{ scale: 0.4 }}
          pos="relative"
          ref={parentRef as any}
          {...lettersContainerBounds}
          minWidth={lettersContainerBounds.width}
          minHeight={lettersContainerBounds.height}
        >
          <YStack>
            {glow.Component()}
            {glint.Component()}
            <YStack ai="center" pos="relative" w="100%">
              <YStack w="100%" h={lettersContainerBounds.height}>
                {letters.map(({ Component }) => {
                  return Component
                })}
              </YStack>
            </YStack>
          </YStack>
        </YStack>
      </YStack>

      <Container ai="center">
        <YStack ai="center" als="center" f={1} w="100%" $sm={{ mt: -100 }}>
          <NextLink target="_blank" href="https://github.com/sponsors/natew">
            <Button
              animation="quick"
              bg="$color10"
              color="$color1"
              size="$6"
              borderRadius="$10"
              elevation="$2"
              className="glowing"
              hoverStyle={{
                bg: '$color9',
                elevation: '$10',
                scale: 1.04,
              }}
              pressStyle={{
                bg: '$color8',
                scale: 0.96,
              }}
            >
              Sponsor for early access
            </Button>
          </NextLink>
        </YStack>

        <Spacer size="$8" />

        <XStack maw={790} space="$8" separator={<Separator vertical />}>
          <H2 als="center" size="$9" fow="900" $sm={{ size: '$5' }}>
            A new way to design system.
          </H2>
        </XStack>

        <Spacer />

        <XStack space ai="center">
          <SizableText o={0.5} size="$3">
            Launching Summer 2023
          </SizableText>

          <NextLink href="/login">
            <Button icon={Lock} chromeless size="$3" borderRadius="$10">
              Sponsor login
            </Button>
          </NextLink>
        </XStack>
      </Container>
    </ThemeTint>
  )
})

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
