import { YStack, XStack, Text, Square, styled } from 'tamagui'

/**
 * Test case for transform media query merging bug
 *
 * Bug: When a media query like $sm sets transform props like `x`, it should OVERWRITE
 * the base value, not be CUMULATIVE (added together).
 *
 * Example:
 * - Base: x={-100}
 * - $sm: { x: 50 }
 * - Expected at $sm: x = 50
 * - Actual bug: x = -100 + 50 = -50 (cumulative)
 */

// Styled component with transform in media query definition
const TransformBox = styled(Square, {
  size: 100,
  bg: '$blue10',
  x: -100, // base: shifted left 100px

  $sm: {
    x: 50, // at $sm: should be shifted right 50px (OVERWRITE, not cumulative)
    bg: '$green10',
  },
})

export function TransformMediaQueryMerge() {
  return (
    <YStack p="$4" gap="$6">
      <Text fontSize="$5" fontWeight="bold">Transform Media Query Merge Test</Text>
      <Text fontSize="$2" color="$color10">
        Resize window to test. At $sm breakpoint, x should OVERWRITE not be cumulative.
      </Text>

      {/* Test 1: styled() component with transform in definition */}
      <YStack gap="$2">
        <Text fontWeight="bold">Test 1: styled() component</Text>
        <Text fontSize="$2">Base: x=-100, $sm: x=50</Text>
        <Text fontSize="$2">Expected at $sm: x=50 (overwrite), NOT x=-50 (cumulative)</Text>
        <XStack height={150} bg="$color3" alignItems="center" justifyContent="center" position="relative">
          <YStack position="absolute" left={0} top={0} bottom={0} width={1} bg="$red10" />
          <Text position="absolute" left={5} top={5} fontSize="$1">x=0 line</Text>
          <TransformBox testID="test1" data-testid="test1" />
        </XStack>
      </YStack>

      {/* Test 3: Runtime prop with media query */}
      <YStack gap="$2">
        <Text fontWeight="bold">Test 3: Runtime prop with $sm</Text>
        <Text fontSize="$2">Base: x=-75, $sm: x=75</Text>
        <Text fontSize="$2">Expected at $sm: x=75 (overwrite), NOT x=0 (cumulative)</Text>
        <XStack height={150} bg="$color3" alignItems="center" justifyContent="center" position="relative">
          <YStack position="absolute" left="50%" top={0} bottom={0} width={1} bg="$red10" />
          <Text position="absolute" left={5} top={5} fontSize="$1">center line</Text>
          <Square
            testID="test3"
            data-testid="test3"
            size={100}
            bg="$red10"
            x={-75}
            $sm={{
              x: 75,
              bg: '$purple10',
            }}
          />
        </XStack>
      </YStack>
    </YStack>
  )
}
