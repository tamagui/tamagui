import { useState } from 'react'
import { Button, Square, YStack } from 'tamagui'

/**
 * Repro for the reanimated avoidReRenders emitter latch bug.
 *
 * Once a pseudo state (hover) fires the useStyleEmitter fast path, the worklet
 * latches onto its last-emitted snapshot (`animatedTargetsRef !== null`) and
 * ignores `animatedStyles` from later re-renders. So a base style driven by
 * external state — like a sidebar row's `backgroundColor` flipping with a
 * selection store — gets stuck on the stale emitted value until the next hover.
 *
 * Steps to reproduce: hover the square (fires the emitter), move away, then flip
 * `active` via the button (a plain re-render, no hover). The background must
 * update to the active color. Before the fix it stays on the pre-hover value.
 */
export function ReanimatedEmitterLatchCase() {
  const [active, setActive] = useState(false)

  return (
    <YStack gap="$4" padding="$4">
      <Square
        testID="latch-square"
        size={120}
        backgroundColor={active ? 'rgb(0, 0, 255)' : 'rgb(255, 0, 0)'}
        hoverStyle={{ backgroundColor: active ? 'rgb(0, 0, 255)' : 'rgb(0, 255, 0)' }}
        // 0ms so the base-style flip is immediate and easy to assert (matches the
        // sidebar row's transition="0ms")
        transition="0ms"
      />

      <Button testID="toggle-active" onPress={() => setActive((v) => !v)}>
        Toggle Active
      </Button>
    </YStack>
  )
}
