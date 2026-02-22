import { Button, Card, H2, H3, H4, Paragraph, Text, Theme, XStack, YStack } from 'tamagui'

import { TEST_IDS } from '../constants/test-ids'

/**
 * Visual test for v5 theme builder output.
 *
 * Tests the documented usage patterns from the docs:
 * 1. <Theme name="accent"> wrapping components (docs: theme-builder.mdx)
 * 2. <Button theme="accent"> component prop (docs: config-v5.mdx)
 * 3. $accentBackground / $accentColor tokens (docs: config-v5.mdx)
 * 4. $accent1-$accent12 raw tokens
 *
 * Open in browser: http://localhost:9000/?test=V5ThemeBuilderOutput&generatedV5=true
 */
export function V5ThemeBuilderOutput() {
  return (
    <YStack gap="$6" padding="$6" backgroundColor="$background">
      <YStack gap="$2">
        <H2>V5 Theme Builder - Accent Theme Tests</H2>
        <Paragraph color="$color11">
          Tests documented accent usage patterns from tamagui.dev docs.
        </Paragraph>
      </YStack>

      {/* === SECTION 1: <Theme name="accent"> === */}
      <YStack
        gap="$3"
        padding="$4"
        backgroundColor="$background"
        borderRadius="$4"
        borderWidth={2}
        borderColor="$color7"
      >
        <H3 color="$color11">{'<Theme name="accent">'}</H3>
        <Paragraph size="$2" color="$color11">
          Expected: first square is the base gray background. Second square should be DARK
          PURPLE (the accent palette inverted). Text below it should be light/readable
          against the accent background.
        </Paragraph>

        <XStack gap="$3" alignItems="flex-start">
          {/* Baseline: base theme background for comparison */}
          <YStack gap="$1" alignItems="center">
            <YStack
              testID={TEST_IDS.baseBackground}
              width={100}
              height={100}
              backgroundColor="$background"
              borderRadius="$4"
            />
            <Text color="$color11">Base $background</Text>
          </YStack>

          {/* Accent theme: $background should differ from base */}
          <Theme name="accent">
            <YStack gap="$1" alignItems="center">
              <YStack
                testID={TEST_IDS.accentThemeBackground}
                width={100}
                height={100}
                backgroundColor="$background"
                borderRadius="$4"
              />
              <Text color="$color11">Accent $background</Text>
              <Text testID={TEST_IDS.accentThemeColor} color="$color" marginTop="$2">
                Accent $color text
              </Text>
            </YStack>
          </Theme>
        </XStack>
      </YStack>

      {/* === SECTION 2: <Button theme="accent"> === */}
      <YStack
        gap="$3"
        padding="$4"
        backgroundColor="$background"
        borderRadius="$4"
        borderWidth={2}
        borderColor="$color7"
      >
        <H3 color="$color11">{'<Button theme="accent">'}</H3>
        <Paragraph size="$2" color="$color11">
          Expected: first button is the default gray surface. Second button should have a
          PURPLE background with light text — visually distinct from the base button.
        </Paragraph>

        <XStack gap="$3">
          <Button testID={TEST_IDS.baseButton} size="$4">
            Base Button
          </Button>

          <Button testID={TEST_IDS.accentPropButton} theme="accent" size="$4">
            Accent Button
          </Button>
        </XStack>
      </YStack>

      {/* === SECTION 3: $accentBackground / $accentColor tokens === */}
      <YStack
        gap="$3"
        padding="$4"
        backgroundColor="$background"
        borderRadius="$4"
        borderWidth={2}
        borderColor="$color7"
      >
        <H3 color="$color11">$accentBackground / $accentColor</H3>
        <Paragraph size="$2" color="$color11">
          Expected: square should be a DARK PURPLE — same hue as the accent palette. This
          is the raw token, not a theme wrapper.
        </Paragraph>

        <YStack
          testID={TEST_IDS.accentBgToken}
          width={100}
          height={100}
          backgroundColor="$accentBackground"
          borderRadius="$4"
        />
      </YStack>

      {/* === SECTION 4: $accent1-12 raw palette tokens === */}
      <YStack
        gap="$3"
        padding="$4"
        backgroundColor="$background"
        borderRadius="$4"
        borderWidth={1}
        borderColor="$borderColor"
      >
        <H4>Accent Palette (accent1-12)</H4>
        <Paragraph size="$2" color="$color11">
          Expected: a gradient of 12 swatches going from dark purple to light purple. If
          these are all gray, the accent palette is broken.
        </Paragraph>
        <XStack gap="$1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <YStack
              key={i}
              testID={`palette-accent-${i}`}
              width={40}
              height={40}
              backgroundColor={`$accent${i}` as any}
              borderRadius="$2"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize={10} color={i > 6 ? '$accent1' : '$accent12'}>
                {i}
              </Text>
            </YStack>
          ))}
        </XStack>
      </YStack>

      {/* === SECTION 5: Color child themes === */}
      <YStack
        gap="$3"
        padding="$4"
        backgroundColor="$background"
        borderRadius="$4"
        borderWidth={1}
        borderColor="$borderColor"
      >
        <H4>Color Themes</H4>
        <Paragraph size="$2" color="$color11">
          Expected: each card and button should have a distinct tint matching its color
          name. Yellow should look warm, red should look red, etc.
        </Paragraph>
        <XStack gap="$3" flexWrap="wrap">
          <Theme name="yellow">
            <Card padding="$3" backgroundColor="$background" minWidth={140}>
              <Button testID="button-yellow" size="$3">
                Yellow
              </Button>
            </Card>
          </Theme>
          <Theme name="red">
            <Card
              testID="card-red"
              padding="$3"
              backgroundColor="$background"
              minWidth={140}
            >
              <Button testID="button-red" size="$3">
                Red
              </Button>
            </Card>
          </Theme>
          <Theme name="green">
            <Card
              testID="card-green"
              padding="$3"
              backgroundColor="$background"
              minWidth={140}
            >
              <Button testID="button-green" size="$3">
                Green
              </Button>
            </Card>
          </Theme>
          <Theme name="blue">
            <Card
              testID="card-blue"
              padding="$3"
              backgroundColor="$background"
              minWidth={140}
            >
              <Button testID="button-blue" size="$3">
                Blue
              </Button>
            </Card>
          </Theme>
        </XStack>
      </YStack>
    </YStack>
  )
}
