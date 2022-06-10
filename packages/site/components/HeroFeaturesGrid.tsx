import { Grid, H4, Paragraph, YStack } from 'tamagui'

import { CocentricCircles } from './CocentricCircles'
import { ContainerLarge } from './Container'
import { HomeH2, HomeH3 } from './HomeH2'

export function FeaturesGrid() {
  return (
    <>
      {/* <YStack pe="none" zi={-1} pos="absolute" o={0.1} top={285} left={0} right={0} ai="center">
        <CocentricCircles />
      </YStack> */}
      <ContainerLarge space="$8">
        <YStack zi={1} space="$1">
          <HomeH2 className="rainbow clip-text">All-in-one</HomeH2>
          <HomeH3>Rapidly iterate on truly cross-platform&nbsp;apps.</HomeH3>
        </YStack>

        <YStack maw={950} als="center">
          <Grid gap={25} itemMinWidth={280}>
            <YStack space="$2" p="$4">
              <H4 letsp={0} fontFamily="$silkscreen" ta="center">
                Fully typed
              </H4>
              <Paragraph theme="alt2">
                Typed inline styles, themes, tokens, shorthands, media queries, animations, and
                hooks that optimize.
              </Paragraph>
            </YStack>

            <YStack space="$2" p="$4">
              <H4 letsp={0} fontFamily="$silkscreen" ta="center">
                Fast, all ways
              </H4>
              <Paragraph theme="alt2">
                Get faster feedback - inline styles author much faster, without performance
                downside.
              </Paragraph>
            </YStack>

            <YStack space="$2" p="$4">
              <H4 letsp={0} fontFamily="$silkscreen" ta="center">
                SSR
              </H4>
              <Paragraph theme="alt2">
                Cross-browser server-side rendering, even for responsive styles and variants out of
                the box.
              </Paragraph>
            </YStack>

            <YStack space="$2" p="$4">
              <H4 letsp={0} fontFamily="$silkscreen" ta="center">
                Dev tools
              </H4>
              <Paragraph theme="alt2">
                Debug props and pragmas, dev-time fileName/lineNumber props added on every element,
                global Tamagui for state introspection.
              </Paragraph>
            </YStack>

            <YStack space="$2" p="$4">
              <H4 letsp={0} fontFamily="$silkscreen" ta="center">
                Accessibility
              </H4>
              <Paragraph theme="alt2">
                Built on top of react-native-web, accessiblity control out of the box, plus
                components with smart defaults.
              </Paragraph>
            </YStack>

            <YStack space="$2" p="$4">
              <H4 letsp={0} fontFamily="$silkscreen" ta="center">
                Components
              </H4>
              <Paragraph theme="alt2">
                Components that smooth out bumps and add features between Native and Web.
              </Paragraph>
            </YStack>
          </Grid>
        </YStack>
      </ContainerLarge>
    </>
  )
}
