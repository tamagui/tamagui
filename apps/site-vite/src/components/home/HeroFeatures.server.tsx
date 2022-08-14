import React from 'react'
import { Grid, H4, Paragraph, YStack } from 'tamagui'

import { ContainerLarge } from '../Container.server'
import { HomeH2, HomeH3 } from './HomeHeading.server'

export function HeroFeatures() {
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
                Fast, all ways
              </H4>
              <Paragraph theme="alt2">
                Get faster feedback - inline styles author much faster, without performance
                downside.
              </Paragraph>
            </YStack>

            <YStack space="$2" p="$4">
              <H4 ls={0} fontFamily="$silkscreen" ta="center">
                SSR
              </H4>
              <Paragraph theme="alt2">
                Cross-browser server-side rendering, even for responsive styles and variants out of
                the box.
              </Paragraph>
            </YStack>

            <YStack space="$2" p="$4">
              <H4 ls={0} fontFamily="$silkscreen" ta="center">
                Dev tools
              </H4>
              <Paragraph theme="alt2">
                Debug props and pragmas, dev-time fileName/lineNumber props added on every element,
                global Tamagui for state introspection.
              </Paragraph>
            </YStack>

            <YStack space="$2" p="$4">
              <H4 ls={0} fontFamily="$silkscreen" ta="center">
                Accessibility
              </H4>
              <Paragraph theme="alt2">
                Built on top of react-native-web, accessiblity control out of the box, plus
                components with smart defaults.
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
