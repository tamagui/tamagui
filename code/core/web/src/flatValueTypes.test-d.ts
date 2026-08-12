import { describe, expectTypeOf, test } from 'vitest'

import type { RootThemeName } from './types'

describe('flat value types', () => {
  test('theme modifiers only include root theme names', () => {
    type ConfigThemeName =
      | 'light'
      | 'dark'
      | 'dark_blue'
      | 'dark_ProgressIndicator'

    expectTypeOf<RootThemeName<ConfigThemeName>>().toEqualTypeOf<'light' | 'dark'>()
  })

  test('a loose theme record does not create an open modifier prefix', () => {
    expectTypeOf<RootThemeName<string>>().toEqualTypeOf<never>()
  })
})
