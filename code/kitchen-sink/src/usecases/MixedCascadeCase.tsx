import { Text, YStack } from 'tamagui'

// mixed legacy-vs-program cascade: the base is a (0,1,0) program rule while
// the hoverStyle's `font` is the one resetting composite shorthand with no
// family split, so it refuses conversion and rides the legacy pseudo
// machinery (priority selector + !important). the legacy tier must still beat
// the program base, exactly as it beat the old (0,1,1) atomic base.
export function MixedCascadeCase() {
  return (
    <YStack gap="$4" p="$4">
      <Text
        data-testid="mixed-font"
        fontSize="20px"
        // the composite shorthand is deliberately absent from the v3 type
        // surface; authoring it here is the point — it must refuse conversion
        // and ride the legacy pseudo path until a font family split exists
        hoverStyle={{ font: 'italic 12px serif' } as any}
      >
        Hover shrinks through the legacy font shorthand
      </Text>

      <Text
        data-testid="mixed-decoration"
        textDecorationLine="underline"
        // the text-decoration family converts this condition object into a
        // program clause; the converted clause must override the base program
        hoverStyle={{ textDecoration: 'none' } as any}
      >
        Hover removes the underline
      </Text>
    </YStack>
  )
}
