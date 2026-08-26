import { describe, expectTypeOf, test } from 'vitest'

import type { FlatStyleObject, FlatStyleValue, RootThemeName } from './types'

declare const accepts: <T>(value: T) => void

describe('flat value types', () => {
  test('theme modifiers only include root theme names', () => {
    type ConfigThemeName = 'light' | 'dark' | 'dark_blue' | 'dark_ProgressIndicator'

    expectTypeOf<RootThemeName<ConfigThemeName>>().toEqualTypeOf<'light' | 'dark'>()
  })

  test('a loose theme record does not create an open modifier prefix', () => {
    expectTypeOf<RootThemeName<string>>().toEqualTypeOf<never>()
  })

  test('flat objects keep their leaf value type at every condition', () => {
    accepts<FlatStyleObject<'red' | 'blue'>>({
      default: 'red',
      hover: 'blue',
      'hover:focus': 'red',
      'web:hover:focus': 'blue',
    })
    accepts<FlatStyleValue<number>>({ default: 0, hover: 1, 'sm:hover': 0.5 })

    // @ts-expect-error every payload remains the underlying property type
    accepts<FlatStyleObject<number>>({ hover: '1' })
  })

  test('container and named-group spellings are valid object keys', () => {
    // with no user config MediaQueryKey is string, so unknown keys also pass
    // here; key validation is the language service's and compiler's job
    accepts<FlatStyleObject<number>>({
      '@sm': 1,
      '@sm/card': 2,
      '@sm:hover': 3,
      'group-hover/card': 4,
      'group-press': 5,
    })
  })
})
