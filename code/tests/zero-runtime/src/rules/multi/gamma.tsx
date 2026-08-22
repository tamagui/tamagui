import { View } from 'tamagui'

/**
 * Rule 5, on its own module.
 *
 * A module that already has a compiler-local violation never reaches reference
 * erasure, so the rules erasure reports cannot share a module with the rules
 * the lowering pass reports. That is why the multi-file fixture has five
 * modules rather than one: each violation the compiler can classify needs a
 * module that gets far enough for its own gate to run.
 */
export function Gamma() {
  return (
    <View
      data-testid="gamma"
      animateOnly={['opacity']}
      transition="all 200ms ease"
      opacity={0.5}
    />
  )
}
