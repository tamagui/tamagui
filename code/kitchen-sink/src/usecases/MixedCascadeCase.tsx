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
        // the composite shorthand is deliberately absent from the v3 type
        // surface; authoring it here is the point — it must refuse conversion
        // and ride the legacy pseudo path until the textDecoration family lands
        hoverStyle={{ textDecoration: 'none' } as any}
      >
        Hover removes the underline
      </Text>
    </YStack>
  )
}
