import { animationsMotion } from '@tamagui/config/v5-motion'
import { useMemo, useState } from 'react'
import {
  AnimatePresence,
  Configuration,
  Text,
  useDidFinishSSR,
  XStack,
  YStack,
} from 'tamagui'

/**
 * SSR Hydration Test Page - Motion Driver
 *
 * Tests that styles render consistently between server and client.
 * Key scenarios tested:
 * 1. animateOnly prop (the bug we fixed - server rendered inline style, client rendered className)
 * 2. Transform styles
 * 3. AnimatePresence with enterStyle/exitStyle
 */
export default function HydrationMotionTest() {
  const driver = animationsMotion
  const didHydrate = useDidFinishSSR()
  const [showAnimated, setShowAnimated] = useState(true)

  // test case: animateOnly with non-animated component
  const indicatorDots = useMemo(
    () =>
      [0, 1, 2].map((i) => (
        <XStack
          key={i}
          data-testid={`indicator-dot-${i}`}
          width={i === 1 ? 16 : 8}
          height={8}
          bg={i === 1 ? '$color10' : '$color5'}
          rounded={100}
          animateOnly={['width', 'backgroundColor']}
          transition="quick"
        />
      )),
    []
  )

  // test case: transform styles
  const transformBox = (
    <YStack
      data-testid="transform-box"
      width={100}
      height={100}
      bg="$blue10"
      x={50}
      y={20}
      scale={1.1}
      rotate="5deg"
      transition="medium"
    />
  )

  // test case: AnimatePresence with enter/exit
  const presenceBox = (
    <AnimatePresence>
      {showAnimated && (
        <YStack
          key="presence-box"
          data-testid="presence-box"
          width={80}
          height={80}
          bg="$green10"
          opacity={1}
          scale={1}
          transition="bouncy"
          enterStyle={{
            opacity: 0,
            scale: 0.8,
          }}
          exitStyle={{
            opacity: 0,
            scale: 0.5,
          }}
        />
      )}
    </AnimatePresence>
  )

  return (
    <Configuration animationDriver={driver}>
      <YStack p="$4" gap="$4">
        <Text fontSize="$6" fontWeight="bold">
          Hydration Test: motion driver
        </Text>

        <Text fontSize="$3" color="$color11">
          Hydrated: {String(didHydrate)}
        </Text>

        <Text fontSize="$3" color="$color11">
          inputStyle: {driver.inputStyle} | outputStyle: {driver.outputStyle}
        </Text>

        {/* Test 1: animateOnly indicator dots */}
        <YStack gap="$2">
          <Text fontSize="$4">Test 1: animateOnly (indicator dots)</Text>
          <XStack gap="$2">{indicatorDots}</XStack>
        </YStack>

        {/* Test 2: transform styles */}
        <YStack gap="$2">
          <Text fontSize="$4">Test 2: Transform styles</Text>
          {transformBox}
        </YStack>

        {/* Test 3: AnimatePresence */}
        <YStack gap="$2">
          <Text fontSize="$4">Test 3: AnimatePresence</Text>
          <XStack
            gap="$2"
            cursor="pointer"
            onPress={() => setShowAnimated(!showAnimated)}
          >
            <Text color="$blue10">Toggle (click)</Text>
          </XStack>
          {presenceBox}
        </YStack>
      </YStack>
    </Configuration>
  )
}
