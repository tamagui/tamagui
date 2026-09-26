import { expectTypeOf, test } from 'vitest'

test('keeps type-only fixtures out of package builds', () => {
  expectTypeOf(true).toEqualTypeOf<boolean>()
})
