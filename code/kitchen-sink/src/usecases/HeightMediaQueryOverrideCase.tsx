import { YStack, XStack, Text, Square } from 'tamagui'

/**
 * Test case for height media query override
 *
 * Tests that $height-lg media query properly overrides base scale.
 * height-lg breakpoint: minHeight 1280px
 */

export function HeightMediaQueryOverrideCase() {
  return (
    <YStack p="$4" gap="$6" height="100vh">
      <Text fontSize="$5" fontWeight="bold">
        Height Media Query Override Test
      </Text>
      <Text fontSize="$2" color="$color10">
        Resize window height to test. At $height-lg (height &gt;= 1280), scale should
        change.
      </Text>

      {/* Test 1: scale=1 base with $height-sm override (user's exact case) */}
      <YStack gap="$2">
        <Text fontWeight="bold">Test 1: scale=1 with $height-sm override</Text>
        <Text fontSize="$2">Base: scale=1, $height-sm: scale=2 (minHeight: 640)</Text>
        <XStack height={200} bg="$color3" alignItems="center" justifyContent="center">
          <Square
            testID="test-height-scale"
            data-testid="test-height-scale"
            size={100}
            bg="$red10"
            scale={1}
            transformOrigin="left top"
            {...{
              '$height-sm': {
                scale: 2,
              },
            }}
          />
        </XStack>
      </YStack>

      {/* Test 1b: NO base scale, only $height-lg */}
      <YStack gap="$2">
        <Text fontWeight="bold">Test 1b: NO base scale, only $height-lg</Text>
        <Text fontSize="$2">$height-lg: scale=2</Text>
        <XStack height={200} bg="$color3" alignItems="center" justifyContent="center">
          <Square
            testID="test-height-scale-no-base"
            data-testid="test-height-scale-no-base"
            size={100}
            bg="$blue10"
            transformOrigin="left top"
            {...{
              '$height-lg': {
                scale: 2,
              },
            }}
          />
        </XStack>
      </YStack>

      {/* Test 2: comparison with $sm (width query) for scale */}
      <YStack gap="$2">
        <Text fontWeight="bold">Test 2: Scale override with $sm (comparison)</Text>
        <Text fontSize="$2">Base: scale=0.8 (blue), $sm: scale=1.5 (orange)</Text>
        <Text fontSize="$2">
          Expected: When width &gt;= 640px, box should be 1.5x larger and orange
        </Text>
        <XStack height={200} bg="$color3" alignItems="center" justifyContent="center">
          <Square
            testID="test-width-scale"
            data-testid="test-width-scale"
            size={100}
            bg="$blue10"
            scale={0.8}
            transformOrigin="center center"
            $sm={{
              scale: 1.5,
              bg: '$orange10',
            }}
          />
        </XStack>
      </YStack>

      {/* Test 3: height query with backgroundColor only (no transforms) */}
      <YStack gap="$2">
        <Text fontWeight="bold">Test 3: Height query with bg only (no transform)</Text>
        <Text fontSize="$2">Base: red, $height-lg: green</Text>
        <XStack height={100} bg="$color3" alignItems="center" justifyContent="center">
          <Square
            testID="test-height-bg"
            data-testid="test-height-bg"
            size={80}
            bg="$red10"
            {...{
              '$height-lg': {
                bg: '$green10',
              },
            }}
          />
        </XStack>
      </YStack>
    </YStack>
  )
}
