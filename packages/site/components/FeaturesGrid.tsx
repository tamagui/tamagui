import React from 'react'
import { Grid, H2, H4, Paragraph, YStack } from 'tamagui'

export function FeaturesGrid() {
  return (
    <YStack maxWidth={790} mx="auto" space="$3">
      <H2 ta="center">Everything you need</H2>

      <YStack pt="$6">
        <Grid gap={25} itemMinWidth={250}>
          <YStack padding="$4" space>
            <H4 fontFamily="$body">Style system</H4>
            <Paragraph theme="alt2">
              Inline typed styles with themes, constants, shorthand props and media queries, plus a
              set of accessible components that work together out of the box.
            </Paragraph>
          </YStack>

          <YStack ai="flex-start" space p="$4">
            <H4 fontFamily="$body">Optimizer</H4>
            <Paragraph theme="alt2">
              Tamagui avoids more JS parsing at runtime than other libraries, even with conditional
              logic in your render. It even flattens your tree when possible.
            </Paragraph>
          </YStack>

          <YStack ai="flex-start" space p="$4">
            <H4 fontFamily="$body">SSR</H4>
            <Paragraph theme="alt2">
              Tamagui supports cross-browser server-side rendering, even for responsive styles and
              variants.
            </Paragraph>
          </YStack>

          <YStack ai="flex-start" space p="$4">
            <H4 fontFamily="$body">Dev tools</H4>
            <Paragraph theme="alt2">
              A fully-typed API, completely extensible, token-aware properties, debug props and
              pragmas, and custom shorthands.
            </Paragraph>
          </YStack>

          <YStack ai="flex-start" space p="$4">
            <H4 fontFamily="$body">DX</H4>
            <Paragraph theme="alt2">
              Inline styles that don't affect render performance, no more naming styles. Let the
              compiler optimize it for you.
            </Paragraph>
          </YStack>

          <YStack ai="flex-start" space p="$4">
            <H4 fontFamily="$body">Compatibility</H4>
            <Paragraph theme="alt2">
              Everything you need included on all platforms from themes to responsive design and
              more. Augments react-native-web.
            </Paragraph>
          </YStack>
        </Grid>
      </YStack>
    </YStack>
  )
}
