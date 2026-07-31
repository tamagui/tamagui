import { Text, YStack } from 'tamagui'

// mixed legacy-vs-program cascade: the base is a (0,1,0) program rule while
// the hoverStyle's `textDecoration` is a resetting composite shorthand with no
// family split yet, so it refuses conversion and rides the legacy pseudo
// machinery (priority selector + !important). the legacy tier must still beat
// the program base, exactly as it beat the old (0,1,1) atomic base.
export function MixedCascadeCase() {
  return (
    <YStack gap="$4" p="$4">
      <Text
        data-testid="mixed-decoration"
        textDecorationLine="underline"
        hoverStyle={{ textDecoration: 'none' }}
      >
        Hover removes the underline
      </Text>
    </YStack>
  )
}
