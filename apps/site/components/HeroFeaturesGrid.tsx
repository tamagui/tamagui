import React from 'react'
import { Grid, H4, Paragraph, YStack } from 'tamagui'

import { ContainerLarge } from './Container'
import { HomeH2, HomeH3 } from './HomeH2'

export function FeaturesGrid() {
  return (
    <>
      <ContainerLarge space="$8">
        <YStack zi={1} space="$3">
          <HomeH2>
            <span className="rainbow clip-text">Years of developer-time</span> out of the box.
          </HomeH2>
          <HomeH3>Start day one with more than you'd build by year two.</HomeH3>
        </YStack>

        <YStack maw={950} als="center">
          <Grid gap={25} itemMinWidth={280}>
            <YStack space="$2" p="$4">
              <H4 ls={0} fontFamily="$silkscreen" ta="center">
                Fully typed
              </H4>
              <Paragraph theme="alt2">
                Typed inline styles, themes, tokens, shorthands, media queries, animations, and
                hooks that optimize.
              </Paragraph>
            </YStack>

            <YStack space="$2" p="$4">
              <H4 ls={0} fontFamily="$silkscreen" ta="center">
                SSR
              </H4>
              <Paragraph theme="alt2">
                Server-side rendering works by default, including responsive styles, themes and
                variants.
              </Paragraph>
            </YStack>

            <YStack space="$2" p="$4">
              <H4 ls={0} fontFamily="$silkscreen" ta="center">
                Server Components
              </H4>
              <Paragraph theme="alt2">
                Initial support for React Server Components delivering server-side rendered CSS
                without hydration cost.
              </Paragraph>
            </YStack>

            <YStack space="$2" p="$4">
              <H4 ls={0} fontFamily="$silkscreen" ta="center">
                Dev tools
              </H4>
              <Paragraph theme="alt2">
                Jump between source and code faster with compile-time file/line/component
                data-props. Debug runtime and compile-time output with props and pragmas.
              </Paragraph>
            </YStack>

            <YStack space="$2" p="$4">
              <H4 ls={0} fontFamily="$silkscreen" ta="center">
                Compatibility
              </H4>
              <Paragraph theme="alt2">
                Runs entirely without plugins, with optional optimizing plugins for Metro, Vite, and
                Webpack.
              </Paragraph>
            </YStack>

            <YStack space="$2" p="$4">
              <H4 ls={0} fontFamily="$silkscreen" ta="center">
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
