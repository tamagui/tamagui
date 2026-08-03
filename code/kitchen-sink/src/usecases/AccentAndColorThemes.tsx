import { Card, H2, H3, H4, Paragraph, Text, Theme, XStack, YStack } from 'tamagui'
import { Button } from '../components/Button'

import { TEST_IDS } from '../constants/test-ids'

/**
 * Visual test for accent and color child themes, against the app's own theme
 * corpus (see src/themes/theme.dev.ts).
 *
 * Tests the documented usage patterns from the docs:
 * 1. <Theme name="accent"> wrapping components (docs: theme-builder.mdx)
 * 2. <Button theme="accent"> component prop
 * 3. accent-background / accent-color tokens
 * 4. color1-color11 inside the accent theme
 *
 * Open in browser: http://localhost:9000/?test=AccentAndColorThemes
 */
export function AccentAndColorThemes() {
  return (
    <YStack gap="6" padding="6" backgroundColor="background">
      <YStack gap="2">
        <H2>Accent and Color Theme Tests</H2>
        <Paragraph color="color11">
          Tests documented accent usage patterns against the configured themes.
        </Paragraph>
      </YStack>

      {/* === SECTION 1: <Theme name="accent"> === */}
      <YStack
        gap="3"
        padding="4"
        backgroundColor="background"
        borderRadius="4"
        borderWidth={2}
        borderColor="color7"
      >
        <H3 color="color11">{'<Theme name="accent">'}</H3>
        <Paragraph size="2" color="color11">
          Expected: first square is the base background. Second square is a soft brand
          tint. Text below it should stay readable against the accent background.
        </Paragraph>

        <XStack gap="3" alignItems="flex-start">
          {/* Baseline: base theme background for comparison */}
          <YStack gap="1" alignItems="center">
            <YStack
              testID={TEST_IDS.baseBackground}
              width={100}
              height={100}
              backgroundColor="background"
              borderRadius="4"
            />
            <Text color="color11">Base background</Text>
          </YStack>

          {/* Accent theme: background should differ from base */}
          <Theme name="accent">
            <YStack gap="1" alignItems="center">
              <YStack
                testID={TEST_IDS.accentThemeBackground}
                width={100}
                height={100}
                backgroundColor="background"
                borderRadius="4"
              />
              <Text color="color11">Accent background</Text>
              <Text testID={TEST_IDS.accentThemeColor} color="color" marginTop="2">
                Accent color text
              </Text>
            </YStack>
          </Theme>
        </XStack>
      </YStack>

      {/* === SECTION 2: <Button theme="accent"> === */}
      <YStack
        gap="3"
        padding="4"
        backgroundColor="background"
        borderRadius="4"
        borderWidth={2}
        borderColor="color7"
      >
        <H3 color="color11">{'<Button theme="accent">'}</H3>
        <Paragraph size="2" color="color11">
          Expected: first button is the default surface. Second button uses the brand tint
          and stays visually distinct from the base button.
        </Paragraph>

        <XStack gap="3">
          <Button testID={TEST_IDS.baseButton}>Base Button</Button>

          <Button testID={TEST_IDS.accentPropButton} theme="accent">
            Accent Button
          </Button>
        </XStack>
      </YStack>

      {/* === SECTION 3: accent-background / accent-color tokens === */}
      <YStack
        gap="3"
        padding="4"
        backgroundColor="background"
        borderRadius="4"
        borderWidth={2}
        borderColor="color7"
      >
        <H3 color="color11">accent-background / accent-color</H3>
        <Paragraph size="2" color="color11">
          Expected: square uses the fixed brand fill. This is a semantic theme token, not
          the adaptive accent surface above.
        </Paragraph>

        <YStack
          testID={TEST_IDS.accentBgToken}
          width={100}
          height={100}
          backgroundColor="accent-background"
          borderRadius="4"
        />
      </YStack>

      {/* === SECTION 4: adaptive accent ramp === */}
      <YStack
        gap="3"
        padding="4"
        backgroundColor="background"
        borderRadius="4"
        borderWidth={1}
        borderColor="border-color"
      >
        <H4>Adaptive Accent Ramp (color1-11)</H4>
        <Paragraph size="2" color="color11">
          Expected: a gradient of 11 swatches stepping through the accent palette. The
          direction adapts to the active color scheme.
        </Paragraph>
        <Theme name="accent">
          <XStack gap="1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
              <YStack
                key={i}
                testID={`palette-accent-${i}`}
                width={40}
                height={40}
                backgroundColor={`${`color${i}`}`}
                borderRadius="2"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize={10} color={i > 6 ? 'color1' : 'color11'}>
                  {i}
                </Text>
              </YStack>
            ))}
          </XStack>
        </Theme>
      </YStack>

      {/* === SECTION 5: Color child themes === */}
      <YStack
        gap="3"
        padding="4"
        backgroundColor="background"
        borderRadius="4"
        borderWidth={1}
        borderColor="border-color"
      >
        <H4>Color Themes</H4>
        <Paragraph size="2" color="color11">
          Expected: each card and button should have a distinct tint matching its color
          name. Yellow should look warm, red should look red, etc.
        </Paragraph>
        <XStack gap="3" flexWrap="wrap">
          <Theme name="yellow">
            <Card padding="3" backgroundColor="background" minWidth={140}>
              <Button testID="button-yellow">Yellow</Button>
            </Card>
          </Theme>
          <Theme name="red">
            <Card
              testID="card-red"
              padding="3"
              backgroundColor="background"
              minWidth={140}
            >
              <Button testID="button-red">Red</Button>
            </Card>
          </Theme>
          <Theme name="green">
            <Card
              testID="card-green"
              padding="3"
              backgroundColor="background"
              minWidth={140}
            >
              <Button testID="button-green">Green</Button>
            </Card>
          </Theme>
        </XStack>
      </YStack>
    </YStack>
  )
}
