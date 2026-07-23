import { Text, useMedia, YStack } from 'tamagui'

/**
 * Smoke test for the built-in $motionReduce / $motionSafe media keys.
 *
 * Web: subscribes to `(prefers-reduced-motion: reduce | no-preference)` via
 * `window.matchMedia`. Native: subscribes to
 * `AccessibilityInfo.isReduceMotionEnabled` + the `reduceMotionChanged` event
 * via `@tamagui/react-native-media-driver`.
 *
 * To exercise on web in Chrome DevTools: cmd-shift-p ->
 * "Emulate CSS prefers-reduced-motion: reduce". The yellow swatch should
 * switch to lime and the live text should flip true/false.
 */
export const MotionReduceCase = () => {
  const media = useMedia()

  return (
    <YStack p="$4" gap="$4">
      <Text testID="motion-reduce-state">{`motionReduce: ${media.motionReduce}`}</Text>
      <Text testID="motion-safe-state">{`motionSafe: ${media.motionSafe}`}</Text>

      <YStack
        id="motion-swatch"
        testID="motion-swatch"
        height={100}
        width={100}
        backgroundColor="yellow"
        $motionReduce={{ backgroundColor: 'lime' }}
      />

      <YStack
        id="motion-safe-swatch"
        testID="motion-safe-swatch"
        height={100}
        width={100}
        backgroundColor="red"
        $motionSafe={{ backgroundColor: 'blue' }}
      />
    </YStack>
  )
}
