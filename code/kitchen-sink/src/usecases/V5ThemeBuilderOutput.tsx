import { Button, Card, H2, H3, H4, Paragraph, Text, Theme, XStack, YStack } from 'tamagui'

/**
 * Visual test for v5 theme builder output.
 *
 * This demonstrates that custom accent colors from the theme builder work correctly.
 * The accent theme should display PURPLE (hue 250) colors, NOT gray.
 *
 * Open in browser: http://localhost:7979/?test=V5ThemeBuilderOutput
 */
export function V5ThemeBuilderOutput() {
  return (
    <YStack gap="$6" padding="$6" backgroundColor="$background">
      <YStack gap="$2">
        <H2>V5 Theme Builder - Custom Accent Colors</H2>
        <Paragraph color="$color11">
          This test verifies that custom accent colors from tamagui.dev/theme work
          correctly. The accent theme should show PURPLE colors (hue 250), not gray.
        </Paragraph>
      </YStack>

      {/* BASE THEME - Show the default reddish-gray palette */}
      <YStack
        gap="$3"
        padding="$4"
        backgroundColor="$background"
        borderRadius="$4"
        borderWidth={1}
        borderColor="$borderColor"
      >
        <H3 testID="section-base">Base Theme (Default Palette)</H3>
        <Paragraph size="$2" color="$color11">
          Default base palette with reddish-gray tones
        </Paragraph>

        <XStack gap="$4" flexWrap="wrap">
          <Theme name="light">
            <YStack gap="$2" alignItems="center">
              <Card
                padding="$4"
                backgroundColor="$background"
                borderRadius="$4"
                minWidth={200}
              >
                <Button testID="button-light" size="$4">
                  Light Theme Button
                </Button>
                <XStack gap="$2" marginTop="$2">
                  <YStack
                    flex={1}
                    height={80}
                    backgroundColor="$color7"
                    borderRadius="$2"
                  />
                  <YStack
                    flex={1}
                    height={80}
                    backgroundColor="$color9"
                    borderRadius="$2"
                  />
                </XStack>
              </Card>
              <Text size="$2" color="$color11">
                Base Light
              </Text>
              <YStack
                testID="base-light-swatch"
                width={50}
                height={50}
                backgroundColor="$color7"
                borderRadius="$2"
              />
            </YStack>
          </Theme>

          <Theme name="dark">
            <YStack gap="$2" alignItems="center">
              <Card
                padding="$4"
                backgroundColor="$background"
                borderRadius="$4"
                minWidth={200}
              >
                <Button testID="button-dark" size="$4">
                  Dark Theme Button
                </Button>
                <XStack gap="$2" marginTop="$2">
                  <YStack
                    flex={1}
                    height={80}
                    backgroundColor="$color7"
                    borderRadius="$2"
                  />
                  <YStack
                    flex={1}
                    height={80}
                    backgroundColor="$color9"
                    borderRadius="$2"
                  />
                </XStack>
              </Card>
              <Text size="$2" color="$color11">
                Base Dark
              </Text>
              <YStack
                testID="base-dark-swatch"
                width={50}
                height={50}
                backgroundColor="$color7"
                borderRadius="$2"
              />
            </YStack>
          </Theme>
        </XStack>

        {/* Full base palette */}
        <YStack gap="$2" marginTop="$2">
          <Text size="$2" color="$color11">
            Base Palette (color1-12):
          </Text>
          <XStack gap="$1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <YStack
                key={i}
                testID={`palette-color-${i}`}
                width={40}
                height={40}
                backgroundColor={`$color${i}` as any}
                borderRadius="$2"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize={10} color={i > 6 ? '$color1' : '$color12'}>
                  {i}
                </Text>
              </YStack>
            ))}
          </XStack>
        </YStack>
      </YStack>

      {/* ACCENT THEME - Show the custom purple palette */}
      <YStack
        gap="$3"
        padding="$4"
        backgroundColor="$background"
        borderRadius="$4"
        borderWidth={2}
        borderColor="$color7"
      >
        <H3 testID="section-accent" color="$color11">
          Custom Accent Theme (Purple - Hue 250°)
        </H3>
        <Paragraph size="$2" color="$color11">
          ✅ Should be PURPLE (hue 250°, saturation 50%)
          {'\n'}❌ Should NOT be gray
        </Paragraph>

        <XStack gap="$4" flexWrap="wrap">
          <Theme name="light">
            <Theme name="accent">
              <YStack gap="$2" alignItems="center">
                <Card
                  padding="$4"
                  backgroundColor="$background"
                  borderRadius="$4"
                  minWidth={200}
                >
                  <Button
                    testID="button-accent-light"
                    backgroundColor="$color7"
                    size="$4"
                  >
                    Accent Light Button
                  </Button>
                  <XStack gap="$2" marginTop="$2">
                    <YStack
                      flex={1}
                      height={80}
                      backgroundColor="$color7"
                      borderRadius="$2"
                    />
                    <YStack
                      flex={1}
                      height={80}
                      backgroundColor="$color9"
                      borderRadius="$2"
                    />
                  </XStack>
                </Card>
                <Text size="$2" color="$color11">
                  Accent Light
                </Text>
                <YStack
                  testID="accent-light-swatch"
                  width={50}
                  height={50}
                  backgroundColor="$color7"
                  borderRadius="$2"
                />
              </YStack>
            </Theme>
          </Theme>

          <Theme name="dark">
            <Theme name="accent">
              <YStack gap="$2" alignItems="center">
                <Card
                  padding="$4"
                  backgroundColor="$background"
                  borderRadius="$4"
                  minWidth={200}
                >
                  <Button testID="button-accent-dark" backgroundColor="$color7" size="$4">
                    Accent Dark Button
                  </Button>
                  <XStack gap="$2" marginTop="$2">
                    <YStack
                      flex={1}
                      height={80}
                      backgroundColor="$color7"
                      borderRadius="$2"
                    />
                    <YStack
                      flex={1}
                      height={80}
                      backgroundColor="$color9"
                      borderRadius="$2"
                    />
                  </XStack>
                </Card>
                <Text size="$2" color="$color11">
                  Accent Dark
                </Text>
                <YStack
                  testID="accent-dark-swatch"
                  width={50}
                  height={50}
                  backgroundColor="$color7"
                  borderRadius="$2"
                />
              </YStack>
            </Theme>
          </Theme>
        </XStack>

        {/* Full accent palette */}
        <Theme name="accent">
          <YStack gap="$2" marginTop="$2">
            <Text size="$2" color="$color11">
              Accent Palette (color1-12) - Should be purple gradient:
            </Text>
            <XStack gap="$1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                <YStack
                  key={i}
                  width={40}
                  height={40}
                  backgroundColor={`$color${i}` as any}
                  borderRadius="$2"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text fontSize={10} color={i > 6 ? '$color1' : '$color12'}>
                    {i}
                  </Text>
                </YStack>
              ))}
            </XStack>
          </YStack>
        </Theme>
      </YStack>

      {/* OTHER COLOR THEMES */}
      <YStack
        gap="$3"
        padding="$4"
        backgroundColor="$background"
        borderRadius="$4"
        borderWidth={1}
        borderColor="$borderColor"
      >
        <H4 testID="section-semantic">Other Color Themes</H4>
        <Paragraph size="$2" color="$color11">
          Additional color themes from the theme builder
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
            <Card padding="$3" backgroundColor="$background" minWidth={140}>
              <Button testID="button-red" size="$3">
                Red
              </Button>
            </Card>
          </Theme>
          <Theme name="green">
            <Card padding="$3" backgroundColor="$background" minWidth={140}>
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
              <Text color="$color">Blue</Text>
            </Card>
          </Theme>
        </XStack>
      </YStack>
    </YStack>
  )
}
