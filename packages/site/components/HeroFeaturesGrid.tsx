import { Grid, H4, Paragraph, YStack } from 'tamagui'

import { CocentricCircles } from './CocentricCircles'
import { ContainerLarge } from './Container'
import { HomeH2, HomeH3 } from './HomeH2'

export function FeaturesGrid() {
  return (
    <>
      <YStack pe="none" zi={-1} pos="absolute" o={0.1} top={-575} left={0} right={0} ai="center">
        <CocentricCircles />
      </YStack>
      <ContainerLarge space="$8">
        <YStack zi={1} space="$1">
          <HomeH2 className="rainbow clip-text" size="$12">
            All-in-one
          </HomeH2>
          <HomeH3 maw={600}>
            Low-level primitives designed to let you rapidly iterate on truly cross-platform apps
            without fuss.
          </HomeH3>
        </YStack>

        <YStack>
          <Grid gap={25} itemMinWidth={280}>
            <YStack space="$2" p="$4">
              <H4 fontFamily="$silkscreen" ta="center">
                Fully typed
              </H4>
              <Paragraph theme="alt2">
                Typed inline styles, themes, tokens, shorthands, media queries, animations, and
                hooks for all the above.
              </Paragraph>
            </YStack>

            <YStack space="$2" p="$4">
              <H4 fontFamily="$silkscreen" ta="center">
                Fast, all ways
              </H4>
              <Paragraph theme="alt2">
                Save time writing code - write inline styles without performance downside, even with
                conditional logic.
              </Paragraph>
            </YStack>

            <YStack space="$2" p="$4">
              <H4 fontFamily="$silkscreen" ta="center">
                SSR
              </H4>
              <Paragraph theme="alt2">
                Cross-browser server-side rendering, even for responsive styles and variants out of
                the box.
              </Paragraph>
            </YStack>

            <YStack space="$2" p="$4">
              <H4 fontFamily="$silkscreen" ta="center">
                Dev tools
              </H4>
              <Paragraph theme="alt2">
                Debug props and pragmas, dev-time filename:linenumber props added on every element,
                global Tamagui for state introspection.
              </Paragraph>
            </YStack>

            <YStack space="$2" p="$4">
              <H4 fontFamily="$silkscreen" ta="center">
                Accessibility
              </H4>
              <Paragraph theme="alt2">
                Built on top of react-native-web, accessiblity control out of the box, plus
                components with smart defaults.
              </Paragraph>
            </YStack>

            <YStack space="$2" p="$4">
              <H4 fontFamily="$silkscreen" ta="center">
                Components
              </H4>
              <Paragraph theme="alt2">
                Components that go further smoothing the differences between Native and Web, like
                Image and LinearGradient.
              </Paragraph>
            </YStack>
          </Grid>
        </YStack>
      </ContainerLarge>
    </>
  )
}
