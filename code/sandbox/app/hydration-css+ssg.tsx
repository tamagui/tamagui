import { animationsCSS } from '@tamagui/config/animations-css'
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
 * SSR Hydration Test Page - CSS Driver
 *
 * Tests that styles render consistently between server and client.
 * Key scenarios tested:
 * 1. a transition naming its properties (the bug we fixed - server rendered inline style, client rendered className)
 * 2. Transform styles
 * 3. AnimatePresence with enter clause/exit clause
 */
export default function HydrationCSSTest() {
  const driver = animationsCSS
  const didHydrate = useDidFinishSSR()
  const [showAnimated, setShowAnimated] = useState(true)

  // test case: a property list on a component that does not animate
  const indicatorDots = useMemo(
    () =>
      [0, 1, 2].map((i) => (
        <XStack
          key={i}
          data-testid={`indicator-dot-${i}`}
          width={i === 1 ? 16 : 8}
          height={8}
          bg={`${i === 1 ? 'color10' : 'color5'}`}
          rounded={100}
          transition={{ preset: 'quick', properties: 'width, backgroundColor' }}
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
      bg="blue10"
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
          bg="green10"
          opacity="1 enter:0 exit:0"
          scale="1 enter:0.8 exit:0.5"
          transition="bouncy"
        />
      )}
    </AnimatePresence>
  )

  return (
    <Configuration animationDriver={driver}>
      <YStack p="4" gap="4">
        <Text fontSize="6" fontWeight="bold">
          Hydration Test: css driver
        </Text>

        <Text fontSize="3" color="color11" data-testid={`hydrated-${didHydrate}`}>
          Hydrated: {String(didHydrate)}
        </Text>

        <Text fontSize="3" color="color11">
          inputStyle: {driver.inputStyle} | outputStyle: {driver.outputStyle}
        </Text>

        {/* Test 1: property-list indicator dots */}
        <YStack gap="2">
          <Text fontSize="4">Test 1: property list (indicator dots)</Text>
          <XStack gap="2">{indicatorDots}</XStack>
        </YStack>

        {/* Test 2: transform styles */}
        <YStack gap="2">
          <Text fontSize="4">Test 2: Transform styles</Text>
          {transformBox}
        </YStack>

        {/* Test 3: AnimatePresence */}
        <YStack gap="2">
          <Text fontSize="4">Test 3: AnimatePresence</Text>
          <XStack gap="2" cursor="pointer" onPress={() => setShowAnimated(!showAnimated)}>
            <Text color="blue10">Toggle (click)</Text>
          </XStack>
          {presenceBox}
        </YStack>
      </YStack>
    </Configuration>
  )
}
