import React from 'react'
import { Grid, H2, H4, Paragraph, YStack } from 'tamagui'

export function FeaturesGrid() {
  return (
    <YStack maxWidth={790} mx="auto" space="$3">
      <H2 fontWeight="800" ta="center">
        Features
      </H2>
      <H4 fontWeight="400" color="$color3" ta="center">
        A full featured styling library.
      </H4>

      <YStack pt="$6">
        <Grid gap={25} itemMinWidth={250}>
          <YStack padding="$4" space>
            <H4 fontFamily="$body">Complete</H4>
            <Paragraph color="$color3">
              Inline typed styles with themes, constants, shorthand props and media queries, plus a
              set of accessible components that work together out of the box.
            </Paragraph>
          </YStack>

          <YStack ai="flex-start" space p="$4">
            <H4 fontFamily="$body">Performant</H4>
            <Paragraph color="$color3">
              Tamagui avoids more JS parsing at runtime than other libraries, even with conditional
              logic in your render. It even flattens your tree when possible.
            </Paragraph>
          </YStack>

          <YStack ai="flex-start" space p="$4">
            <H4 fontFamily="$body">Server-side</H4>
            <Paragraph color="$color3">
              Tamagui supports cross-browser server-side rendering, even for responsive styles and
              variants.
            </Paragraph>
          </YStack>

          <YStack ai="flex-start" space p="$4">
            <H4 fontFamily="$body">Developer friendly</H4>
            <Paragraph color="$color3">
              A fully-typed API, completely extensible, token-aware properties, debug props and
              pragmas, and custom shorthands.
            </Paragraph>
          </YStack>

          <YStack ai="flex-start" space p="$4">
            <H4 fontFamily="$body">Stay in flow</H4>
            <Paragraph color="$color3">
              Inline styles that don't affect render performance, no more naming styles. Let the
              compiler optimize it for you.
            </Paragraph>
          </YStack>

          <YStack ai="flex-start" space p="$4">
            <H4 fontFamily="$body">Full-featured</H4>
            <Paragraph color="$color3">
              Everything you need included on all platforms from themes to responsive design and
              more. Augments react-native-web.
            </Paragraph>
          </YStack>
        </Grid>
      </YStack>
    </YStack>
  )
}
