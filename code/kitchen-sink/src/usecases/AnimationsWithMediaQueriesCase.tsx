import { YStack, XStack, Text, Square } from 'tamagui'

/**
 * Test case for animated properties with media queries
 *
 * Bug: With the motion driver, when resizing the viewport and triggering a media query change,
 * the scale property sometimes doesn't apply immediately. It may require multiple resize
 * cycles before taking effect.
 *
 * IMPORTANT: Do NOT use useMedia() here - that would cause a re-render and bypass the bug.
 * The bug is specifically in the useStyleEmitter path which avoids re-renders.
 */

export function AnimationsWithMediaQueriesCase() {
  return (
    <YStack p="$4" gap="$6" height={"100vh" as any}>
      <Text fontSize="$5" fontWeight="bold">
        Animations With Media Queries Test
      </Text>
      <Text fontSize="$2" color="$color10">
        Resize window to test. At $sm breakpoint (&lt;660px), styles should change.
      </Text>

      {/* Test 1: scale only */}
      <YStack gap="$2">
        <Text fontWeight="bold">Test 1: Scale in media query</Text>
        <Text fontSize="$2">
          Base: scale=1 (blue), $sm: scale=0.75 (green)
        </Text>
        <XStack
          height={150}
          bg="$color3"
          alignItems="center"
          justifyContent="center"
        >
          <Square
            testID="test-scale"
            data-testid="test-scale"
            size={100}
            bg="$blue10"
            scale={1}
            transition="quick"
            $sm={{
              scale: 0.75,
              bg: '$green10',
            }}
          />
        </XStack>
      </YStack>

      {/* Test 2: translateX only */}
      <YStack gap="$2">
        <Text fontWeight="bold">Test 2: TranslateX in media query</Text>
        <Text fontSize="$2">Base: x=0 (purple), $sm: x=50 (orange)</Text>
        <XStack
          height={150}
          bg="$color3"
          alignItems="center"
          justifyContent="center"
          position="relative"
        >
          <YStack
            position="absolute"
            left="50%"
            top={0}
            bottom={0}
            width={1}
            bg="$red10"
          />
          <Square
            testID="test-translate"
            data-testid="test-translate"
            size={100}
            bg="$purple10"
            x={10}
            transition="quick"
            $sm={{
              x: 50,
              bg: '$orange10',
            }}
          />
        </XStack>
      </YStack>

      {/* Test 3: combined scale + translate (mimics promo badge) */}
      <YStack gap="$2">
        <Text fontWeight="bold">Test 3: Combined scale + translateX</Text>
        <Text fontSize="$2">
          Base: scale=1, x=-50%, $sm: scale=0.75, x=-90%
        </Text>
        <XStack height={150} bg="$color3" position="relative" overflow="hidden">
          <XStack
            testID="test-combined"
            data-testid="test-combined"
            position="absolute"
            t={30}
            l="50%"
            x="-50%"
            rounded="$10"
            px="$4"
            py="$2"
            items="center"
            justify="center"
            gap="$2"
            bg="$color5"
            borderWidth={0.5}
            transition="quick"
            $sm={{
              scale: 0.75,
              x: '-90%',
            }}
          >
            <Text>Promo Badge</Text>
          </XStack>
        </XStack>
      </YStack>
    </YStack>
  )
}
