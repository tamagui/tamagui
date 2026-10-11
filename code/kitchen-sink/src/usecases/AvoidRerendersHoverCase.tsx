import { Profiler, useState } from 'react'
import { Button, Square, YStack } from 'tamagui'

/**
 * Proves the avoidReRenders pipeline: on a driver that declares it (motion,
 * reanimated, react-native) a hover pushes the resolved style straight to the
 * node through useStyleEmitter and React never commits. On a driver that does
 * not (css) the same hover goes through setState and does commit.
 *
 * The Profiler counts commits in the square's subtree, which is the only way to
 * see the component's own internal re-render from outside it.
 */

declare global {
  interface Window {
    __commits: number
  }
}

if (typeof window !== 'undefined') {
  window.__commits = 0
}

export function AvoidRerendersHoverCase() {
  const [tick, setTick] = useState(0)

  return (
    <YStack gap="4" padding="4">
      <Profiler
        id="avoid-rerenders"
        onRender={() => {
          window.__commits++
        }}
      >
        <Square
          testID="avoid-rerenders-square"
          size={120}
          backgroundColor="rgb(255, 0, 0) hover:rgb(0, 255, 0)"
          transition="0ms"
        />
      </Profiler>

      {/* a plain re-render, so the test can prove the Profiler counts at all */}
      <Button testID="avoid-rerenders-bump" onPress={() => setTick((v) => v + 1)}>
        Bump {tick}
      </Button>
    </YStack>
  )
}
