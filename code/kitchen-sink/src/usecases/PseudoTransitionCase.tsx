import { Square, YStack, Text, XStack, View, styled } from 'tamagui'

/**
 * PSEUDO TRANSITION TEST CASES
 *
 * Tests for transition prop inside pseudo-style props (hover clause, press clause, etc.)
 * CSS semantics: enter uses pseudo's transition, exit uses base transition
 *
 * Test scenarios:
 * 1. hover clause with transition - enter fast (200ms), exit slow (1000ms)
 * 2. press clause with transition - press fast (200ms), release slow (1000ms)
 * 3. Multiple pseudo states with different transitions
 * 4. group-hover with transition
 */

// styled component for group test
const GroupHoverSquare = styled(Square, {
  width: 100,
  height: 100,
  backgroundColor: 'blue-600',
  transition: '1000ms',
  variants: {
    groupHover: {
      true: {
        // this would be the group-hover case - tested via props below
      },
    },
  },
})

export function PseudoTransitionCase() {
  return (
    <YStack padding="4" gap="8">
      <Text fontSize="6" fontWeight="bold">
        Pseudo Transition Tests
      </Text>

      {/* Scenario 1: hover clause transition */}
      <YStack gap="2">
        <Text>Scenario 1: hover - enter 200ms, exit 1000ms</Text>
        <Text color="color10" fontSize="2">
          Hover over the square. Enter should be fast, exit should be slow.
        </Text>
        <Square
          data-testid="scenario-1-target"
          width={100}
          height={100}
          backgroundColor="blue-600 hover:red-600"
          transition="1000ms hover:200ms"
        />
      </YStack>

      {/* Scenario 2: press clause transition */}
      <YStack gap="2">
        <Text>Scenario 2: press - enter 200ms, exit 1000ms</Text>
        <Text color="color10" fontSize="2">
          Press and hold the square. Press should be fast, release should be slow.
        </Text>
        <Square
          data-testid="scenario-2-target"
          width={100}
          height={100}
          backgroundColor="green-600 press:purple-600"
          transition="1000ms press:200ms"
        />
      </YStack>

      {/* Scenario 3: hover and press with different transitions */}
      <YStack gap="2">
        <Text>Scenario 3: hover 400ms, press 200ms (press takes priority)</Text>
        <Text color="color10" fontSize="2">
          Hover uses 400ms, press uses 200ms. When both active, press wins.
        </Text>
        <Square
          data-testid="scenario-3-target"
          width={100}
          height={100}
          backgroundColor="orange-600 hover:yellow-600 press:pink-600"
          transition="1000ms hover:400ms press:200ms"
        />
      </YStack>

      {/* Scenario 4: group-hover with transition - uses opacity for simpler testing */}
      <YStack gap="2">
        <Text>Scenario 4: group hover - enter 200ms, exit 1000ms</Text>
        <Text color="color10" fontSize="2">
          Hover over the container. Child square opacity animates with group hover.
        </Text>
        <XStack
          data-testid="scenario-4-container"
          group="testy"
          padding="4"
          backgroundColor="#eee"
          borderRadius="4"
        >
          <Square
            data-testid="scenario-4-target"
            width={100}
            height={100}
            backgroundColor="#06b6d4"
            opacity="0.3 group-hover/testy:1"
            transition="1000ms group-hover/testy:200ms"
          />
        </XStack>
      </YStack>

      {/* Scenario 5: focus clause with transition */}
      <YStack gap="2">
        <Text>Scenario 5: focus - enter 200ms, exit 1000ms</Text>
        <Text color="color10" fontSize="2">
          Click to focus the square. Focus enter should be fast, blur should be slow.
        </Text>
        <View
          data-testid="scenario-5-target"
          tabIndex={0}
          width={100}
          height={100}
          backgroundColor="purple-600 focus:blue-600"
          transition="1000ms focus:200ms"
          outlineWidth="focus:2px"
          outlineColor="focus:blue-600"
          outlineStyle="focus:solid"
        />
      </YStack>

      {/* Scenario 6: opacity animation in hover clause */}
      <YStack gap="2">
        <Text>Scenario 6: opacity - hover enter 200ms, exit 1000ms</Text>
        <Text color="color10" fontSize="2">
          Opacity fades in fast (200ms) and fades out slow (1000ms).
        </Text>
        <Square
          data-testid="scenario-6-target"
          width={100}
          height={100}
          backgroundColor="gray-600"
          opacity="0.3 hover:1"
          transition="1000ms hover:200ms"
        />
      </YStack>
    </YStack>
  )
}

export default PseudoTransitionCase
