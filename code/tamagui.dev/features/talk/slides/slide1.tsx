import { useThemeSetting } from '@tamagui/next-theme'
import type { DivProps, HoverGlowProps } from '~/components/HoverGlow'
import { IS_SAFARI, useHoverGlow } from '~/components/HoverGlow'
import { memo } from 'react'
import type { HeadingProps } from 'tamagui'
import {
  H1,
  H2,
  Separator,
  SizableText,
  Spacer,
  Theme,
  XStack,
  YStack,
  useComposedRefs,
} from 'tamagui'
import { Container } from '~/components/Containers'
import { Slide } from '../Slide'

export default memo(({ subTitle }: { subTitle?: string }) => {
  const { resolvedTheme: themeName } = useThemeSetting()!
  const isLight = themeName === 'light'

  const glow = useHoverGlow({
    resist: 65,
    size: 700,
    strategy: 'blur',
    blurPct: 100,
    color: 'var(--color10)',
    opacity: isLight ? 0.22 : 0.3,
    background: 'transparent',
    offset: {
      x: -200,
      y: 200,
    },
  })

  const glint = useHoverGlow({
    resist: 90,
    size: 800,
    strategy: 'blur',
    blurPct: 80,
    color: 'var(--pink10)',
    offset: {
      x: 400,
      y: -200,
    },
    opacity: 0.2,
    background: 'transparent',
    inverse: true,
  })

  const lettersContainerBounds = {
    width: 1000,
    height: 600,
    left: 0,
    top: 0,
  }

  const letters = lettersConf.map(
    (
      { underlayStyle, glow, letter, props: { scale, rotate, zIndex, ...headingProps } },
      index
    ) => {
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
          x: glow.offset!.x! - 250,
          y: glow.offset!.y! - 50,
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
        <YStack key={index} pos="relative" scale={scale} zIndex={zIndex}>
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
    <Slide
      steps={[
        [
          {
            type: 'content',
            content: (
              <Theme name="blue">
                <YStack
                  als="center"
                  pos="relative"
                  {...lettersContainerBounds}
                  minWidth={lettersContainerBounds.width}
                  minHeight={lettersContainerBounds.height}
                >
                  <YStack
                    ai="center"
                    pos="relative"
                    ref={parentRef as any}
                    {...lettersContainerBounds}
                    minWidth={lettersContainerBounds.width}
                    minHeight={lettersContainerBounds.height}
                    mt="$10"
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

                {subTitle !== ' ' && (
                  <Container mt={-200} ai="center">
                    <>
                      <Spacer size="$8" />
                      <XStack maw={790} space="$8" separator={<Separator vertical />}>
                        <H2 als="center" size="$9" fow="900" $sm={{ size: '$5' }}>
                          {subTitle || 'Better apps with less code'}
                        </H2>
                      </XStack>

                      <Spacer />

                      <XStack space ai="center">
                        <SizableText o={0.5} size="$3">
                          By Nate Wienert
                        </SizableText>
                      </XStack>
                    </>
                  </Container>
                )}
              </Theme>
            ),
          },
        ],
      ]}
    />
  )
})

type LetterConf = {
  letter: string
  glow: HoverGlowProps
  props: HeadingProps
  underlayStyle?: DivProps['style']
}

const lettersConf: LetterConf[] = [
  {
    letter: 't',
    props: {
      rotate: '5deg',
      fontSize: 380,
      theme: 'orange',
    },
    glow: {
      resist: 96,
      inverse: true,
      offset: {
        x: -250,
        y: 0,
      },
      style: {
        transition: `all ease-out 100ms`,
      },
    },
    underlayStyle: {
      opacity: 0,
    },
  },

  {
    letter: 'a',
    props: {
      rotate: '-20deg',
      fontSize: 380,
      theme: 'yellow',
    },
    glow: {
      resist: 96,
      inverse: true,
      offset: {
        x: -170,
        y: 0,
      },
      style: {
        transition: `all ease-out 100ms`,
      },
    },
    underlayStyle: {
      opacity: 0,
    },
  },

  {
    letter: 'm',
    props: {
      rotate: '5deg',
      zIndex: 20,
      fontSize: 320,
      theme: 'green',
    },
    glow: {
      resist: 92,
      offset: {
        x: 80,
        y: 0,
      },
      style: {
        transition: `all ease-out 100ms`,
      },
    },
    underlayStyle: {
      transform: `scale(0.45) translateY(210%)`,
      opacity: 0.15,
      backgroundColor: 'var(--color)',
    },
  },

  {
    letter: 'a',
    props: {
      rotate: '-5deg',
      fontSize: 400,
      theme: 'blue',
    },
    glow: {
      resist: 99,
      offset: {
        x: 290,
        y: 0,
      },
      style: {
        transition: `all ease-out 100ms`,
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
    letter: 'g',
    props: {
      rotate: '3deg',
      fontSize: 310,
      theme: 'purple',
    },
    glow: {
      resist: 95,
      inverse: true,
      offset: {
        x: 480,
        y: 0,
      },
      style: {
        transition: `all ease-out 100ms`,
      },
    },
    underlayStyle: {
      opacity: 0,
    },
  },

  {
    letter: 'u',
    props: {
      rotate: '-8deg',
      fontSize: 380,
      theme: 'pink',
    },
    glow: {
      resist: 97,
      inverse: true,
      offset: {
        x: 660,
        y: 0,
      },
      style: {
        transition: `all ease-out 100ms`,
      },
    },
    underlayStyle: {
      opacity: 0,
    },
  },

  {
    letter: 'i',
    props: {
      rotate: '10deg',
      fontSize: 300,
      theme: 'red',
    },
    glow: {
      resist: 92,
      offset: {
        x: 800,
        y: -30,
      },
      style: {
        transition: `all ease-out 100ms`,
      },
    },
    underlayStyle: {
      opacity: 0,
    },
  },
]
