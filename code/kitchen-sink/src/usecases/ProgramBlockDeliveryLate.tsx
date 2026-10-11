import { View } from 'tamagui'

/**
 * The code-split half of `ProgramBlockDeliveryCase`.
 *
 * This module is only ever reached through a dynamic import, so its program
 * blocks arrive after the page has rendered and hydrated. One of them is a
 * program the shell already inserted (duplicate arrival, same hashed class) and
 * one is new (late insertion). Keep the values here identical to the shell's:
 * the test's whole point is that the two resolve the same.
 */
export function ProgramBlockDeliveryLate() {
  return (
    <>
      <View
        data-testid="late-shared"
        width={80}
        height={80}
        backgroundColor="rgb(10, 20, 30) hover:rgb(40, 50, 60)"
      />
      <View
        data-testid="late-only"
        width={80}
        height={80}
        backgroundColor="rgb(200, 200, 200)"
        opacity="0.25 hover:0.75"
      />
    </>
  )
}
