import { Button, Card, H1, H2, H3, H4, H5, H6, Paragraph, Separator, XStack, YStack } from 'tamagui'

import { useTint } from './ColorToggleButton'
import { ContainerLarge } from './Container'
import { HomeH2, HomeH3 } from './HomeH2'

export const HeroTypography = () => {
  return (
    <YStack pos="relative">
      <YStack ov="hidden">
        <ContainerLarge h={750} ov="hidden" position="relative">
          <YStack ai="center" space="$2">
            <HomeH2>Typography</HomeH2>
            <HomeH3>Plug-and-play fonts with ease.</HomeH3>
          </YStack>

          <YStack pos="relative">
            <YStack pe="none" fullscreen bottom={-300} bc="$background" opacity={0.4} zi={1} />
            <YStack pos="relative" scale={1.7} y={70} x={250}>
              <XStack mb={100} p="$6" space $sm={{ flexDirection: 'column' }}>
                <YStack
                  ai="flex-end"
                  p="$6"
                  mw="50%"
                  x={50}
                  $sm={{ mw: '100%', ai: 'center' }}
                  f={2}
                  als="flex-start"
                >
                  <H1 theme="red_alt4">Hot-swappable</H1>
                  <H2 theme="orange_alt4" opacity={1}>
                    individually-styled
                  </H2>
                  <H3 theme="pink_alt4" opacity={0.9}>
                    typed and optimized
                  </H3>
                  <H4 theme="purple_alt4" opacity={0.7}>
                    premade or custom
                  </H4>
                  <H5 theme="blue_alt4" opacity={0.6}>
                    easy to author
                  </H5>
                  <H6 theme="teal_alt4" opacity={0.5}>
                    font themes
                  </H6>
                </YStack>
              </XStack>

              <XStack pos="absolute" h="100%" rotate="-58deg" left="32%" y={-60}>
                <Separator vertical />
              </XStack>

              <YStack
                mt={-300}
                x={-50}
                mb={100}
                ai="flex-start"
                p="$6"
                mw="50%"
                $sm={{ mw: '100%', ai: 'center' }}
                f={2}
                als="flex-start"
              >
                <H6 fontFamily="$mono" theme="red_alt4" opacity={0.5}>
                  font themes
                </H6>
                <H5 fontFamily="$mono" theme="orange_alt4" opacity={0.6}>
                  easy to author
                </H5>
                <H4 fontFamily="$mono" theme="pink_alt4" opacity={0.7}>
                  premade or custom
                </H4>
                <H3 fontFamily="$mono" theme="purple_alt4" opacity={0.9}>
                  typed and optimized
                </H3>
                <H2 fontFamily="$mono" theme="blue_alt4" opacity={1}>
                  individually-styled
                </H2>
                <H1 fontFamily="$mono" theme="teal_alt4">
                  Hot-swappable
                </H1>
              </YStack>
            </YStack>
          </YStack>
        </ContainerLarge>
      </YStack>

      <XStack pos="absolute" top="50%" left="50%" x={-200} y={-180} zi={100}>
        <OverlayCard />
      </XStack>
    </YStack>
  )
}

const OverlayCard = () => {
  const { tint } = useTint()

  // {/* TODO elevation not overriding? */}
  return (
    <Card br="$6" elevation="$4">
      <YStack jc="center" p="$6" space="$6" mw={400}>
        <Paragraph ta="left" fontSize="$8" lineHeight="$7">
          Font themes should understand the needs of vertical rythym.
        </Paragraph>

        <Paragraph ta="left" size="$5" theme="alt1">
          Tamagui font tokens overcome limitations of existing design systems. By theming each font
          family independently, across every font style prop, it enables shareable, easy to swap
          font bundles.
        </Paragraph>

        <Button theme={tint}>Learn more</Button>
      </YStack>
    </Card>
  )
}
