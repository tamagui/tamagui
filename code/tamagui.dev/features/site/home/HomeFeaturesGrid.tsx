import { EnsureFlexed, H4, Paragraph, YStack } from 'tamagui'

import { ContainerLarge } from '~/components/Containers'
import { Grid } from '~/components/Grid'

export function HomeFeaturesGrid() {
  return (
    <>
      <ContainerLarge space="$8">
        <YStack maw={950} als="center">
          <Grid gap={25} itemMinWidth={280}>
            <YStack gap="$4" p="$4">
              <H4 ls={0} fontFamily="$silkscreen" ta="center">
                Fully typed
              </H4>
              <Paragraph theme="alt1">
                <EnsureFlexed />
                Typed inline styles, themes, tokens, shorthands, media queries,
                animations, and hooks that optimize.
              </Paragraph>
            </YStack>

            <YStack gap="$4" p="$4">
              <H4 ls={0} fontFamily="$silkscreen" ta="center">
                Server-first
              </H4>
              <Paragraph theme="alt1">
                SSR and RSC just work, hydrate, and don't flicker, with all animation
                drivers, responsive styles, and themes.
              </Paragraph>
            </YStack>

            <YStack gap="$4" p="$4">
              <H4 ls={0} fontFamily="$silkscreen" ta="center">
                Fast AF
              </H4>
              <Paragraph theme="alt1">
                Fully optimizes and flattens to platform-ideal code for web and native,
                every feature works at compile and runtime.
              </Paragraph>
            </YStack>

            <YStack gap="$4" p="$4">
              <H4 ls={0} fontFamily="$silkscreen" ta="center">
                Introspection
              </H4>
              <Paragraph theme="alt1">
                <EnsureFlexed />
                Multi-level debug pragma and props, compile-time JSX props for quick
                file:line:component jump.
              </Paragraph>
            </YStack>

            <YStack gap="$4" p="$4">
              <H4 ls={0} fontFamily="$silkscreen" ta="center">
                Compatibility
              </H4>
              <Paragraph theme="alt1">
                Runs entirely without plugins, with optional optimizing plugins for Metro,
                Vite, and Webpack.
              </Paragraph>
            </YStack>

            <YStack gap="$4" p="$4">
              <H4 ls={0} fontFamily="$silkscreen" ta="center">
                Full Featured
              </H4>
              <Paragraph theme="alt1">
                Style library + headless components. Animations, themes, variants, tokens,
                fonts. Advanced selectors, and more.
              </Paragraph>
            </YStack>
          </Grid>
        </YStack>
      </ContainerLarge>
    </>
  )
}
