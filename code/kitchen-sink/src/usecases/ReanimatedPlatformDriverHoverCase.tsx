import { useEffect, useState } from 'react'
import { setupPlatformDriver, type PlatformDriver } from '@tamagui/constants'
import { Button, Square, XStack, YStack } from 'tamagui'

/**
 * Repro for the reanimated avoidReRenders "stuck hover" bug on the platform-driver
 * path (react-native-gpui desktop): hover flips come from a registered PlatformDriver
 * pushing setStateShallow({hover}) — NOT from JS mouseenter/leave. With no transition
 * prop, the component resolves instant (0ms) through the emitter fast path.
 *
 * The driver path has no JS-event reconcile masking the bug, so a missed/raced latch
 * clear on hover-out leaves the hover style stuck. We expose driveHover on window so
 * the test can flip hover deterministically and interleave it with React re-renders.
 *
 * base bg = red; hover bg = green. After hover-out the bg MUST return to red.
 */

type Listener = (s: { hovered: boolean; pressed: boolean }) => void
const listeners = new Set<Listener>()

const driver: PlatformDriver = {
  pseudo: {
    subscribe(_host, listener) {
      listeners.add(listener as Listener)
      return () => listeners.delete(listener as Listener)
    },
  },
}
setupPlatformDriver(driver)

declare global {
  interface Window {
    driveHover?: (hovered: boolean) => void
  }
}

if (typeof window !== 'undefined') {
  window.driveHover = (hovered: boolean) => {
    for (const l of listeners) l({ hovered, pressed: false })
  }
}

export function ReanimatedPlatformDriverHoverCase() {
  const [tick, setTick] = useState(0)
  const [active, setActive] = useState(false)

  // expose re-render + base-flip triggers for interleaving tests
  useEffect(() => {
    ;(window as any).bumpTick = () => setTick((v) => v + 1)
    ;(window as any).toggleActive = () => setActive((v) => !v)
  }, [])

  return (
    <YStack gap="$4" padding="$4">
      {/* no transition prop — platform driver makes this ride the emitter, instant.
          base flips red<->blue with `active` (a plain re-render); hover is green.
          this exercises the latch-clear on the driver lane the same way the
          event-sourced ReanimatedEmitterLatchCase does for the mouse lane. */}
      <Square
        testID="driver-square"
        size={tick % 2 === 0 ? 120 : 121}
        backgroundColor={active ? 'rgb(0, 0, 255)' : 'rgb(255, 0, 0)'}
        hoverStyle={{ backgroundColor: 'rgb(0, 255, 0)' }}
      />
      <XStack gap="$4">
        <Button testID="driver-bump" onPress={() => setTick((v) => v + 1)}>
          Bump {tick}
        </Button>
        <Button testID="driver-toggle" onPress={() => setActive((v) => !v)}>
          Toggle
        </Button>
      </XStack>
    </YStack>
  )
}
