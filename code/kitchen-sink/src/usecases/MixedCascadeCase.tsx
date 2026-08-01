import { Text, YStack } from 'tamagui'

// mixed legacy-vs-program cascade. the base is a (0,1,0) program rule; the
// hoverStyle carries a legacy transform PART prop (skewX), which by design
// never converts (parts belong inside a flat `transform` value), so the whole
// condition object rides the legacy pseudo machinery (priority selector +
// !important). the legacy tier must still beat the program base, exactly as
// it beat the old (0,1,1) atomic base.
//
// this fixture retires WITH the engine contraction: once the legacy condition
// machinery is physically deleted, mixed legacy-vs-program cascade stops
// being a reachable scenario, and this test failing at that point is the
// designed signal to remove it (decision recorded in plans/v3-handoff-log.md).
export function MixedCascadeCase() {
  return (
    <YStack gap="4" p="4">
      <Text
        data-testid="mixed-legacy"
        backgroundColor="blue"
        hoverStyle={{ skewX: '5deg', backgroundColor: 'red' } as any}
      >
        Hover turns red through the legacy pseudo rule
      </Text>

      <Text
        data-testid="mixed-decoration"
        textDecorationLine="underline"
        textDecoration="hover:none"
      >
        Hover removes the underline
      </Text>
    </YStack>
  )
}
