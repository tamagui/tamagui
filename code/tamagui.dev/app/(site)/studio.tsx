import { ThemeTint, ThemeTintAlt } from '@tamagui/logo'
import { Link, useRouter } from 'one'
import { memo, useEffect } from 'react'
import type { HeadingProps } from 'tamagui'
import {
  Button,
  EnsureFlexed,
  H1,
  H2,
  Separator,
  Spacer,
  XStack,
  YStack,
  useComposedRefs,
} from 'tamagui'
import { LinearGradient } from 'tamagui/linear-gradient'
import { Container, ContainerXL } from '~/components/Containers'
import { Features } from '~/components/Features'
import type { DivProps, HoverGlowProps } from '~/components/HoverGlow'
import { IS_SAFARI, useHoverGlow } from '~/components/HoverGlow'
import { ThemeNameEffect } from '~/features/site/theme/ThemeNameEffect'
import { LoadInter900 } from '~/features/site/fonts/LoadFonts'
import { HeadInfo } from '~/components/HeadInfo'
import { useUser } from '~/features/user/useUser'
import { useColorScheme } from '@vxrn/color-scheme'

export default function StudioSplashPage() {
  const user = useUser()
  const router = useRouter()
  const hasStudioAccess = user.data?.accessInfo.hasStudioAccess

  useEffect(() => {
    if (hasStudioAccess) {
      router.replace('/studio')
    }
  }, [hasStudioAccess])

  return (
    <>
      <HeadInfo title="Tamagui Studio" description="Tamagui Studio" />

      <LoadInter900 />

      <ThemeNameEffect />

      <YStack>
        <LinearGradient
          pos="absolute"
          fullscreen
          colors={['$background', '$color2', '$color2', '$color2', '$background']}
        />

        <ContainerXL>
          <YStack>
            <StudioScreen1 />

            <Container pe="none" ai="center">
              <YStack
                ai="center"
                jc="center"
                gap="$5"
                als="center"
                py="$8"
                f={1}
                w="100%"
                $sm={{ mt: -100, fd: 'column' }}
              >
                <ThemeTintAlt>
                  <Link target="_blank" href="https://github.com/sponsors/natew">
                    <Button
                      mt={60}
                      animation="quick"
                      bg="$color10"
                      color="$color1"
                      size="$6"
                      borderRadius="$10"
                      elevation="$2"
                      pe="auto"
                      hoverStyle={{
                        bg: '$color10',
                        outlineColor: '$color5',
                        outlineStyle: 'solid',
                        outlineWidth: 4,
                        elevation: '$3',
                      }}
                      pressStyle={{
                        bg: '$color8',
                        scale: 0.98,
                      }}
                    >
                      Sponsor for early access
                    </Button>
                  </Link>
                </ThemeTintAlt>

                <Link href="/login">
                  <Button pe="auto" variant="outlined" size="$3" borderRadius="$10">
                    Login
                  </Button>
                </Link>
              </YStack>

              <XStack maw={790} space="$8" separator={<Separator vertical />}>
                <H2
                  theme="alt1"
                  className="text-glow"
                  als="center"
                  ff="$silkscreen"
                  size="$8"
                  fow="900"
                  $sm={{ size: '$5' }}
                >
                  Your design system!
                </H2>
              </XStack>
            </Container>

            <Spacer size="$12" />

            <XStack
              ov="hidden"
              maw={1000}
              als="center"
              $sm={{ fd: 'column', maw: '100%' }}
            >
              <YStack px="$6" maw="50%" $sm={{ maw: '100%', p: '$2' }}>
                <EnsureFlexed />
                <Features
                  size="$5"
                  items={[
                    `Generate complete theme suites step-by-step.`,
                    `Visualize your design system.`,
                    `Export themes directly to your app.`,
                  ]}
                />
              </YStack>

              <YStack px="$6" maw="50%" $sm={{ maw: '100%', p: '$2' }}>
                <EnsureFlexed />
                <Features
                  soon
                  size="$5"
                  items={[
                    <span>Animation test environment and visualizer.</span>,
                    <span>Advanced theme editor.</span>,
                    <span>Figma and local integrations.</span>,
                  ]}
                />
              </YStack>
            </XStack>

            <Spacer size="$12" />
            <Spacer size="$12" />
          </YStack>
        </ContainerXL>
      </YStack>
    </>
  )
}

const StudioScreen1 = memo(() => {
  const [resolvedTheme] = useColorScheme()
  const isLight = resolvedTheme === 'light'

  const glow = useHoverGlow({
    resist: 85,
    size: 1000,
    offset: {
      x: -50,
      y: -50,
    },
    strategy: 'blur',
    blurPct: 50,
    color: 'var(--color6)',
    opacity: isLight ? 0.225 : 0.15,
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
            <YStack
              animation={[
                'kindaBouncy',
                {
                  opacity: {
                    overshootClamping: true,
                  },
                },
              ]}
              enterStyle={{ o: 0, y: -20 }}
              pos="relative"
              w={320}
              h={320}
            >
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
      <YStack y={-54} pe="none" o={0.0175} fullscreen className="bg-grid" />

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
