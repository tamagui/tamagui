import { useState } from 'react'
import { Button, Square, XStack, YStack } from 'tamagui'

/**
 * Repro for the reanimated avoidReRenders "stuck hover" bug.
 *
 * Symptom (user-confirmed, reproduces on web too): a hovered element's hover
 * style stays applied after the pointer leaves. The avoidReRenders emitter fast
 * path latches the emitted snapshot into the worklet (`animatedTargetsRef`); a
 * missed/raced clear on hover-out leaves the hover style stuck.
 *
 * This case drives the exact interleavings:
 *  - plain hover-in then hover-out (instant 0ms)
 *  - hover-in, then an unrelated re-render lands while hovered, then hover-out
 *  - a spring transition variant (animated path) for parity
 *
 * Each square reports its resolved backgroundColor via getComputedStyle in the
 * test. base = red, hover = green. After hover-out the bg MUST return to base.
 */
export function ReanimatedStuckHoverCase() {
  const [tick, setTick] = useState(0)

  return (
    <YStack gap="$4" padding="$4">
      {/* instant (0ms) — matches platform-driver default + sidebar row */}
      <Square
        testID="stuck-instant"
        size={120}
        backgroundColor="rgb(255, 0, 0)"
        hoverStyle={{ backgroundColor: 'rgb(0, 255, 0)' }}
        transition="0ms"
      />

      {/* spring (animated path) */}
      <Square
        testID="stuck-spring"
        size={120}
        backgroundColor="rgb(255, 0, 0)"
        hoverStyle={{ backgroundColor: 'rgb(0, 255, 0)' }}
        animation="quick"
      />

      {/* re-render while hovered: the parent tick flips this row's irrelevant
          size/key, forcing a React commit mid-hover, then we hover out. */}
      <Square
        testID="stuck-rerender"
        size={tick % 2 === 0 ? 120 : 121}
        backgroundColor="rgb(255, 0, 0)"
        hoverStyle={{ backgroundColor: 'rgb(0, 255, 0)' }}
        transition="0ms"
      />

      <XStack gap="$4">
        <Button testID="bump-tick" onPress={() => setTick((v) => v + 1)}>
          Bump
        </Button>
      </XStack>
    </YStack>
  )
}
