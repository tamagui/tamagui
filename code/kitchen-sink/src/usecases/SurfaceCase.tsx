import { Surface, Text, YStack } from 'tamagui'

// smoke case for the copied Surface fixture: nothing on by default, facets are
// opt-in, and `level` re-binds the subtree theme (surface1-3) so filled surfaces
// at different levels resolve to different backgrounds.
export function SurfaceCase() {
  return (
    <YStack gap="$4" padding="$4">
      <Surface testID="surface-bare" width={120} height={60}>
        <Text>bare</Text>
      </Surface>

      <Surface testID="surface-filled" filled width={120} height={60}>
        <Text>filled</Text>
      </Surface>

      <Surface testID="surface-outlined" outlined rounded width={120} height={60}>
        <Text>outlined</Text>
      </Surface>

      <Surface testID="surface-level-1" level={1} filled width={120} height={60}>
        <Text>level 1</Text>
      </Surface>

      <Surface testID="surface-level-2" level={2} filled width={120} height={60}>
        <Text>level 2</Text>
      </Surface>

      <Surface
        testID="surface-interactive"
        filled
        outlined
        rounded
        interactive
        width={120}
        height={60}
      >
        <Text>interactive</Text>
      </Surface>
    </YStack>
  )
}
