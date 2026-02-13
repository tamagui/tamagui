import { YStack, XStack, Text, Square, styled } from 'tamagui'

// styled component with scale in definition - test if this behaves differently
const StyledBox = styled(YStack, {
  width: 100,
  height: 100,
  bg: '$purple10',
  scale: 1,
  transformOrigin: 'left top',
})

// styled component with scale in definition (for runtime media override test)
const StyledBoxWithMedia = styled(YStack, {
  width: 100,
  height: 100,
  bg: '$yellow10',
  scale: 1,
  transformOrigin: 'left top',
} as const)

// EXACT match for ContainerLarge from chat app:
// styled component with WIDTH media queries ($md, $lg) in definition
// then used with $height-sm at runtime
const ContainerLarge = styled(YStack, {
  mx: 'auto',
  px: '$6',
  width: '100%',
  position: 'relative',
  maxWidth: 1200,
  bg: '$blue10',

  $md: {
    px: '$8',
  },

  $lg: {
    px: '$10',
  },
})

/**
 * Test case for height media query override
 *
 * Tests that $height-lg media query properly overrides base scale.
 * height-lg breakpoint: minHeight 1280px
 */

export function HeightMediaQueryOverrideCase() {
  return (
    <YStack p="$4" gap="$6" flex={1} minH={0}>
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
            $height-sm={{
              scale: 2,
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

      {/* Test 3: styled component with scale=1 in definition + $height-sm override */}
      <YStack gap="$2">
        <Text fontWeight="bold">Test 3: Styled component with scale=1 in definition</Text>
        <Text fontSize="$2">StyledBox has scale=1, runtime $height-sm: scale=2</Text>
        <XStack height={200} bg="$color3" alignItems="center" justifyContent="center">
          <StyledBox
            testID="test-styled-scale"
            data-testid="test-styled-scale"
            {...{
              '$height-sm': {
                scale: 2,
                bg: '$green10',
              },
            }}
          />
        </XStack>
      </YStack>

      {/* Test 4: styled component with scale in definition, override at runtime */}
      <YStack gap="$2">
        <Text fontWeight="bold">
          Test 4: Styled with scale in definition + runtime $height-sm override
        </Text>
        <Text fontSize="$2">Definition: scale=1. Runtime $height-sm: scale=2</Text>
        <XStack height={200} bg="$color3" alignItems="center" justifyContent="center">
          <StyledBoxWithMedia
            testID="test-styled-media-override"
            data-testid="test-styled-media-override"
            {...{
              '$height-sm': {
                scale: 2,
                bg: '$green10',
              },
            }}
          />
        </XStack>
      </YStack>

      {/* Test 5: EXACT ContainerLarge scenario from chat app */}
      <YStack gap="$2">
        <Text fontWeight="bold">
          Test 5: ContainerLarge with WIDTH queries + runtime $height-sm scale
        </Text>
        <Text fontSize="$2">
          ContainerLarge has $md/$lg width queries. Runtime: scale=1, $height-sm: scale=2
        </Text>
        <XStack height={200} bg="$color3" alignItems="center" justifyContent="center">
          <ContainerLarge
            testID="test-container-large"
            data-testid="test-container-large"
            transformOrigin="left top"
            scale={1}
            $height-sm={{
              scale: 2,
            }}
          >
            <Square size={50} bg="$red10" />
          </ContainerLarge>
        </XStack>
      </YStack>
    </YStack>
  )
}
