import React from 'react'
import { Grid, H2, H4, Paragraph, YStack } from 'tamagui'

import { Features } from './Features'
import { Highlights } from './Highlights'

export function FeaturesGrid() {
  return (
    <YStack maxWidth={790} mx="auto" space="$3">
      <H2 ta="center">Everything you need</H2>

      <YStack pt="$6">
        <Grid gap={25} itemMinWidth={250}>
          <YStack padding="$4" space>
            <H4 fontFamily="$body">Ultra-modern design system</H4>
            <Paragraph theme="alt2">
              Inline typed styles, typed themes, tokens, shorthands, media queries and animations,
              plus a full suite of accessible components.
            </Paragraph>
          </YStack>

          <YStack ai="flex-start" space p="$4">
            <H4 fontFamily="$body">Fast by default</H4>
            <Paragraph theme="alt2">
              Tamagui saves you time writing code because it optimizes even inline styles, even
              flattening your tree when possible.
            </Paragraph>
          </YStack>

          <YStack ai="flex-start" space p="$4">
            <H4 fontFamily="$body">SSR</H4>
            <Paragraph theme="alt2">
              Cross-browser server-side rendering, even for responsive styles and variants out of
              the box. Next.js plugin and example apps.
            </Paragraph>
          </YStack>

          <YStack ai="flex-start" space p="$4">
            <H4 fontFamily="$body">Avanced dev tools</H4>
            <Paragraph theme="alt2">
              A fully-typed API, completely extensible, token-aware properties, debug props and
              pragmas, dev-time filename and line numbers on each html tag.
            </Paragraph>
          </YStack>

          <YStack ai="flex-start" space p="$4">
            <H4 fontFamily="$body">Accesible</H4>
            <Paragraph theme="alt2">
              Built on top of react-native-web, you get complete accessiblity control out of the
              box, plus components that have smart defaults.
            </Paragraph>
          </YStack>

          <YStack ai="flex-start" space p="$4">
            <H4 fontFamily="$body">Compatible</H4>
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
