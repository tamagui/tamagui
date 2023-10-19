import { ThemeTint } from '@tamagui/logo'
import { Lock } from '@tamagui/lucide-icons'
import { useThemeSetting } from '@tamagui/next-theme'
import { Container } from 'components/Container'
import { DivProps, HoverGlowProps, IS_SAFARI, useHoverGlow } from 'components/HoverGlow'
import { NextLink } from 'components/NextLink'
import { memo } from 'react'
import {
  Button,
  H1,
  H2,
  HeadingProps,
  Separator,
  Spacer,
  XStack,
  YStack,
  useComposedRefs,
} from 'tamagui'

export const StudioScreen1 = memo(() => {
  const { resolvedTheme: themeName } = useThemeSetting()!
  const isLight = themeName === 'light'

  const glow = useHoverGlow({
    resist: 65,
    size: 900,
    offset: {
      x: -50,
      y: -50,
    },
    strategy: 'blur',
    blurPct: 100,
    color: 'var(--color10)',
    opacity: isLight ? 0.225 : 0.125,
    background: 'transparent',
    style: {
      transition: `all ease-out ms300`,
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
      transition: `all ease-out ms300`,
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
      <YStack o={0.035} fullscreen className="bg-grid" />

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
        <XStack
          ai="center"
          jc="center"
          gap="$5"
          als="center"
          f={1}
          w="100%"
          $sm={{ mt: -100, fd: 'column' }}
        >
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
                elevation: '$3',
              }}
              pressStyle={{
                bg: '$color8',
                scale: 0.98,
              }}
            >
              Sponsor for early access
            </Button>
          </NextLink>

          <NextLink href="/login">
            <Button icon={Lock} variant="outlined" size="$3" borderRadius="$10">
              Sponsor login
            </Button>
          </NextLink>
        </XStack>

        <Spacer size="$8" />

        <XStack maw={790} space="$8" separator={<Separator vertical />}>
          <H2 als="center" size="$9" fow="900" $sm={{ size: '$5' }}>
            A new way to design system
          </H2>
        </XStack>
      </Container>
    </ThemeTint>
  )
})

type LetterConf = {
  letter: string
  glow: HoverGlowProps
  props: HeadingProps
  underlayStyle?: DivProps['style']
}

const fontSizeMultiply = 1

const lettersConf: LetterConf[] = [
  {
    letter: 'S',
    props: {
      rotate: '-12deg',
      fontSize: 380 * fontSizeMultiply,
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
      opacity: 0,
      // marginBottom: -10,
      // backgroundColor: 'var(--background)',
      // transform: `scale(1) translateY(30%) translateX(-20%)`,
    },
  },

  {
    letter: 't',
    props: {
      rotate: '10deg',
      zIndex: 20,
      fontSize: 320 * fontSizeMultiply,
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
      fontSize: 400 * fontSizeMultiply,
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
      fontSize: 310 * fontSizeMultiply,
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
      fontSize: 380 * fontSizeMultiply,
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
      fontSize: 300 * fontSizeMultiply,
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
