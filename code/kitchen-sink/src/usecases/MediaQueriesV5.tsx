import { Text, useMedia, YStack, XStack } from 'tamagui'

/**
 * Test case for v5 media queries
 *
 * v5 uses mobile-first (minWidth) for base queries and desktop-first (maxWidth) for max-* queries
 *
 * Breakpoints:
 * - xxxs: 260, xxs: 340, xs: 460, sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1536
 *
 * Width queries (mobile-first, minWidth):
 * - $sm, $md, $lg, etc. - apply at minWidth and above
 * - Larger breakpoints override smaller ones
 *
 * Max-width queries (desktop-first, maxWidth):
 * - $max-sm, $max-md, $max-lg, etc. - apply at maxWidth and below
 * - Smaller breakpoints override larger ones
 *
 * Height queries (minHeight):
 * - $height-sm, $height-md, $height-lg, etc.
 */
export const MediaQueriesV5 = () => {
  const media = useMedia()

  return (
    <YStack p="$4" gap="$4">
      <Text fontWeight="bold">v5 Media Query Test</Text>
      <Text fontSize={12} color="$color10">
        Use ?v5config in URL to test with v5 config
      </Text>

      {/* Display current media state */}
      <YStack gap="$1">
        <Text testID="media-sm">{`sm (≥640): ${media.sm}`}</Text>
        <Text testID="media-md">{`md (≥768): ${media.md}`}</Text>
        <Text testID="media-lg">{`lg (≥1024): ${media.lg}`}</Text>
        <Text testID="media-max-sm">{`max-sm (≤640): ${media['max-sm']}`}</Text>
        <Text testID="media-max-md">{`max-md (≤768): ${media['max-md']}`}</Text>
        <Text testID="media-max-lg">{`max-lg (≤1024): ${media['max-lg']}`}</Text>
      </YStack>

      {/* Test 1: Mobile-first (minWidth) - larger should win */}
      <YStack gap="$2">
        <Text fontWeight="bold">Test 1: Mobile-first (larger wins)</Text>
        <Text fontSize={12}>On large screen: should be green ($lg wins over $sm)</Text>
        <YStack
          testID="test-mobile-first"
          height={60}
          width={100}
          backgroundColor="red"
          $sm={{ backgroundColor: 'yellow' }}
          $md={{ backgroundColor: 'orange' }}
          $lg={{ backgroundColor: 'green' }}
        />
      </YStack>

      {/* Test 2: Desktop-first (maxWidth) - smaller should win */}
      <YStack gap="$2">
        <Text fontWeight="bold">Test 2: Desktop-first (smaller wins)</Text>
        <Text fontSize={12}>On small screen: should be yellow ($max-sm wins over $max-lg)</Text>
        <YStack
          testID="test-desktop-first"
          height={60}
          width={100}
          backgroundColor="red"
          {...{
            '$max-lg': { backgroundColor: 'green' },
            '$max-md': { backgroundColor: 'orange' },
            '$max-sm': { backgroundColor: 'yellow' },
          }}
        />
      </YStack>

      {/* Test 3: Height queries */}
      <YStack gap="$2">
        <Text fontWeight="bold">Test 3: Height queries</Text>
        <Text fontSize={12}>Taller screens get larger breakpoints</Text>
        <YStack
          testID="test-height"
          height={60}
          width={100}
          backgroundColor="red"
          {...{
            '$height-xs': { backgroundColor: 'yellow' },
            '$height-sm': { backgroundColor: 'orange' },
            '$height-md': { backgroundColor: 'green' },
          }}
        />
      </YStack>

      {/* Test 4: Combined width queries */}
      <YStack gap="$2">
        <Text fontWeight="bold">Test 4: All breakpoints</Text>
        <XStack gap="$2" flexWrap="wrap">
          <YStack
            testID="test-sm-only"
            height={40}
            width={40}
            backgroundColor="gray"
            $sm={{ backgroundColor: 'green' }}
          >
            <Text fontSize={10}>sm</Text>
          </YStack>
          <YStack
            testID="test-md-only"
            height={40}
            width={40}
            backgroundColor="gray"
            $md={{ backgroundColor: 'green' }}
          >
            <Text fontSize={10}>md</Text>
          </YStack>
          <YStack
            testID="test-lg-only"
            height={40}
            width={40}
            backgroundColor="gray"
            $lg={{ backgroundColor: 'green' }}
          >
            <Text fontSize={10}>lg</Text>
          </YStack>
          <YStack
            testID="test-xl-only"
            height={40}
            width={40}
            backgroundColor="gray"
            $xl={{ backgroundColor: 'green' }}
          >
            <Text fontSize={10}>xl</Text>
          </YStack>
        </XStack>
      </YStack>
    </YStack>
  )
}
