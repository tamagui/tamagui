import { useState, useCallback } from 'react'
import type { LayoutChangeEvent, LayoutRectangle } from 'react-native'
import { Button, Square, Text, YStack } from 'tamagui'

/**
 * Test case for onLayout with CSS scale transform.
 *
 * The issue: When a CSS scale transform is applied, getBoundingClientRect()
 * returns the transformed (scaled) dimensions, but the expected behavior
 * (matching React Native) is to return the pre-transform dimensions.
 *
 * For example:
 * - Element has width: 100px, height: 100px
 * - CSS scale(0.5) is applied
 * - getBoundingClientRect() returns width: 50, height: 50 (transformed)
 * - offsetWidth/offsetHeight return 100, 100 (pre-transform, expected)
 *
 * See: https://github.com/tamagui/tamagui/pull/2329
 */
export function OnLayoutScale() {
  const [layoutWithoutScale, setLayoutWithoutScale] = useState<LayoutRectangle | null>(null)
  const [layoutWithScale, setLayoutWithScale] = useState<LayoutRectangle | null>(null)

  const handleLayoutWithoutScale = useCallback((e: LayoutChangeEvent) => {
    setLayoutWithoutScale(e.nativeEvent.layout)
  }, [])

  const handleLayoutWithScale = useCallback((e: LayoutChangeEvent) => {
    setLayoutWithScale(e.nativeEvent.layout)
  }, [])

  const [triggerReLayout, setTriggerReLayout] = useState(0)

  return (
    <YStack gap="$4" padding="$4">
      {/* Box without scale - should report 200x200 */}
      <Square
        testID="box-no-scale"
        size={200}
        backgroundColor="$blue10"
        onLayout={handleLayoutWithoutScale}
        key={`no-scale-${triggerReLayout}`}
      />

      <Text testID="layout-no-scale">
        No Scale: {layoutWithoutScale ? `${layoutWithoutScale.width}x${layoutWithoutScale.height}` : 'waiting...'}
      </Text>

      {/* Box with scale(0.5) - should STILL report 200x200 (pre-transform size) */}
      <Square
        testID="box-with-scale"
        size={200}
        backgroundColor="$red10"
        scale={0.5}
        onLayout={handleLayoutWithScale}
        key={`with-scale-${triggerReLayout}`}
      />

      <Text testID="layout-with-scale">
        With Scale: {layoutWithScale ? `${layoutWithScale.width}x${layoutWithScale.height}` : 'waiting...'}
      </Text>

      <Button testID="trigger-relayout" onPress={() => setTriggerReLayout((n) => n + 1)}>
        Trigger Re-layout
      </Button>

      {/* Debug info */}
      <YStack gap="$2">
        <Text fontSize="$3" color="$gray10">
          Expected: Both boxes should report 200x200
        </Text>
        <Text fontSize="$3" color="$gray10">
          Bug: Scaled box may report 100x100 (transformed size)
        </Text>
      </YStack>
    </YStack>
  )
}
