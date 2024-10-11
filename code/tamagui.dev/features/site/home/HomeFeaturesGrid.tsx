import { EnsureFlexed, H4, Paragraph, YStack } from 'tamagui'

import { ContainerLarge } from '~/components/Containers'
import { Grid } from '~/components/Grid'

export function HomeFeaturesGrid() {
  return (
    <>
      <ContainerLarge space="$8">
        <YStack
          maw={950}
          als="center"
        >
          <Grid
            gap={25}
            itemMinWidth={280}
          >
            <YStack
              gap="$2"
              p="$4"
            >
              <H4
                ls={0}
                fontFamily="$silkscreen"
                ta="center"
              >
                Fully typed
              </H4>
              <Paragraph theme="alt1">
                <EnsureFlexed />
                Typed inline styles, themes, tokens, shorthands, media queries, animations, and
                hooks that optimize.
              </Paragraph>
            </YStack>

            <YStack
              gap="$2"
              p="$4"
            >
              <H4
                ls={0}
                fontFamily="$silkscreen"
                ta="center"
              >
                SSR
              </H4>
              <Paragraph theme="alt1">
                Server-side rendering works by default, including responsive styles, themes and
                variants.
              </Paragraph>
            </YStack>

            <YStack
              gap="$2"
              p="$4"
            >
              <H4
                ls={0}
                fontFamily="$silkscreen"
                ta="center"
              >
                Server Components
              </H4>
              <Paragraph theme="alt1">
                Beta support for React Server Components for bundle size reduction.
              </Paragraph>
            </YStack>

            <YStack
              gap="$2"
              p="$4"
            >
              <H4
                ls={0}
                fontFamily="$silkscreen"
                ta="center"
              >
                Introspection
              </H4>
              <Paragraph theme="alt1">
                <EnsureFlexed />
                Multi-level debug pragma and props, compile-time JSX props for quick
                file:line:component jump.
              </Paragraph>
            </YStack>

            <YStack
              gap="$2"
              p="$4"
            >
              <H4
                ls={0}
                fontFamily="$silkscreen"
                ta="center"
              >
                Compatibility
              </H4>
              <Paragraph theme="alt1">
                Runs entirely without plugins, with optional optimizing plugins for Metro, Vite, and
                Webpack.
              </Paragraph>
            </YStack>

            <YStack
              gap="$2"
              p="$4"
            >
              <H4
                ls={0}
                fontFamily="$silkscreen"
                ta="center"
              >
                Full Featured
              </H4>
              <Paragraph theme="alt1">
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
