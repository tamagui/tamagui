import { EnsureFlexed, Grid, H4, Paragraph, YStack } from 'tamagui'

import { ContainerLarge } from './Container'

export function FeaturesGrid() {
  return (
    <>
      <ContainerLarge space="$8">
        <YStack maw={950} als="center">
          <Grid gap={25} itemMinWidth={280}>
            <YStack space="$2" p="$4">
              <H4 ls={0} fontFamily="$silkscreen" ta="center">
                Fully typed
              </H4>
              <Paragraph theme="alt2">
                <EnsureFlexed />
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
                Beta support for React Server Components for dramatically less up-front bundle size
                and parsing.
              </Paragraph>
            </YStack>

            <YStack space="$2" p="$4">
              <H4 ls={0} fontFamily="$silkscreen" ta="center">
                Introspection
              </H4>
              <Paragraph theme="alt2">
                <EnsureFlexed />
                Multi-level debug pragma and props, compile-time JSX props for quick
                file:line:component jump.
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
                Full Featured
              </H4>
              <Paragraph theme="alt2">
                A styled factory, variants, tokens, fonts, themes, media queries, shorthands and
                more.
              </Paragraph>
            </YStack>
          </Grid>
        </YStack>
      </ContainerLarge>
    </>
  )
}
