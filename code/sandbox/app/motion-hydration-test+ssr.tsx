import { useMemo, useState } from 'react'
import { AnimatePresence, YStack, isClient, useDidFinishSSR } from 'tamagui'

/**
 * Test case for motion hydration regression.
 * This mimics the HomeGlow pattern on tamagui.dev:
 * - AnimatePresence wrapping animated elements
 * - enterStyle for initial state
 * - transition for animations
 * - positioned elements with x, y, scale
 * - KEY DIFFERENCE: keys that change after hydration (simulating useTint behavior)
 *
 * BUG: Elements animate from (0,0) to their final position on hydration
 * EXPECTED: Elements render at final position immediately without animation
 */
export default function MotionHydrationTest() {
  // simulate useTint behavior - on server uses initial=3, on client might use different value
  const didHydrate = useDidFinishSSR()
  // on server: tintIndex = 3, on client after hydration: tintIndex could be different
  // for testing, we keep it the same to NOT trigger key change
  const [tintIndex] = useState(3)
  const tint = ['red', 'green', 'blue', 'yellow'][tintIndex % 4]

  // mimic HomeGlow structure with AnimatePresence
  const glows = useMemo(() => {
    return [
      { id: 'glow-1', x: 400, y: 50, scale: 1.5, color: '$red10' },
      { id: 'glow-2', x: -200, y: 150, scale: 2, color: '$blue10' },
      { id: 'glow-3', x: 100, y: 100, scale: 3, color: '$green10' },
    ].map((glow, i) => (
      <YStack
        // use stable key like HomeGlow does: key={`${i}${tint}${tintAlt}`}
        key={`${i}${tint}`}
        data-testid={glow.id}
        // enable debug to see motion driver logs
        // debug
        transition="superLazy"
        enterStyle={{
          opacity: 0,
        }}
        exitStyle={{
          opacity: 0,
        }}
        opacity={0.8}
        position="absolute"
        width={200}
        height={200}
        t={100}
        l="calc(50vw - 100px)"
        x={glow.x}
        y={glow.y}
        scale={glow.scale}
        bg={glow.color}
        borderRadius={1000}
      />
    ))
  }, [tint])

  return (
    <YStack
      f={1}
      position="relative"
      bg="$background"
      height="100vh"
      overflow="hidden"
    >
      <AnimatePresence>{glows}</AnimatePresence>
    </YStack>
  )
}
