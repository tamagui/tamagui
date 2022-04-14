import { Grid, H4, Paragraph, YStack } from 'tamagui'

import { CocentricCircles } from './CocentricCircles'
import { ContainerLarge } from './Container'
import { HomeH2, HomeH3 } from './HomeH2'

export function FeaturesGrid() {
  return (
    <>
      <YStack pos="absolute" o={0.1} top={-1000} left={0} right={0} ai="center">
        <CocentricCircles />
      </YStack>
      <ContainerLarge space="$6">
        <YStack zi={1} space="$1">
          <HomeH2 className="rainbow clip-text">All-in-one</HomeH2>
        </YStack>

        <YStack>
          <Grid gap={25} itemMinWidth={250}>
            <YStack space p="$4">
              <H4 ta="center" fontFamily="$body">
                Modern design system
              </H4>
              <Paragraph theme="alt2">
                Inline typed styles, typed themes, tokens, shorthands, media queries and animations,
                plus a full suite of accessible components.
              </Paragraph>
            </YStack>

            <YStack space p="$4">
              <H4 ta="center" fontFamily="$body">
                Fast by default
              </H4>
              <Paragraph theme="alt2">
                Tamagui saves you time writing code because it optimizes even inline styles, even
                flattening your tree when possible.
              </Paragraph>
            </YStack>

            <YStack space p="$4">
              <H4 ta="center" fontFamily="$body">
                SSR
              </H4>
              <Paragraph theme="alt2">
                Cross-browser server-side rendering, even for responsive styles and variants out of
                the box. Next.js plugin and example apps.
              </Paragraph>
            </YStack>

            <YStack space p="$4">
              <H4 ta="center" fontFamily="$body">
                Built-in dev tools
              </H4>
              <Paragraph theme="alt2">
                Debug prop and a debug pragmas, dev-time filename:linenumber props added on every
                element, global Tamagui for state introspection.
              </Paragraph>
            </YStack>

            <YStack space p="$4">
              <H4 ta="center" fontFamily="$body">
                Accessible
              </H4>
              <Paragraph theme="alt2">
                Built on top of react-native-web, you get complete accessiblity control out of the
                box, plus components that have smart defaults.
              </Paragraph>
            </YStack>

            <YStack space p="$4">
              <H4 ta="center" fontFamily="$body">
                Compatible
              </H4>
              <Paragraph theme="alt2">
                Everything you need included on all platforms from themes to responsive design and
                more. Augments react-native-web.
              </Paragraph>
            </YStack>
          </Grid>
        </YStack>
      </ContainerLarge>
    </>
  )
}
