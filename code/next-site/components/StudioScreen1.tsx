import { ThemeTint } from '@tamagui/logo'
import { useThemeSetting } from '@tamagui/next-theme'
import type { DivProps, HoverGlowProps } from 'components/HoverGlow'
import { IS_SAFARI, useHoverGlow } from 'components/HoverGlow'
import { memo } from 'react'
import type { HeadingProps } from 'tamagui'
import { H1, YStack, useComposedRefs } from 'tamagui'

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
    color: 'var(--color6)',
    opacity: isLight ? 0.225 : 0.3,
    background: 'transparent',
  })

  const shadow = useHoverGlow({
    resist: 95,
    size: isLight ? 100 : 200,
    strategy: 'blur',
    blurPct: isLight ? 10 : 15,
    color: '#000',
    offset: {
      x: 200,
      y: -200,
    },
    opacity: isLight ? 0.05 : 0.3,
    background: 'transparent',
  })

  const lettersContainerBounds = {
    width: 1000,
    height: 900,
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
    shadow.parentRef,
    ...letters.map((l) => l.Glow.parentRef)
  )

  return (
    <ThemeTint>
      <YStack pe="none" o={0.035} fullscreen className="bg-grid" />

      <YStack
        als="center"
        pos="relative"
        {...lettersContainerBounds}
        minWidth={lettersContainerBounds.width}
        minHeight={lettersContainerBounds.height}
        mb={-400}
        x={15}
        y={-20}
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
            {shadow.Component()}
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
        transition: `transform ease-out 300ms`,
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
        transition: `transform ease-out 300ms`,
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
        transition: `transform ease-out 300ms`,
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
        transition: `transform ease-out 300ms`,
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
        transition: `transform ease-out 300ms`,
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
        transition: `transform ease-out 300ms`,
      },
    },
    underlayStyle: {
      borderRadius: 20,
      transform: `rotate(-20deg) scale(0.75) translateX(40%) translateY(60%)`,
      opacity: 0.25,
    },
  },
]
