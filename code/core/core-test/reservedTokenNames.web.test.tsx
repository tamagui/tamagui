// review P1: the determinism rule says CSS-wide keywords are reserved at
// config creation ("a token may never take one of these names; config
// creation must reject it" — style-grammar valueTypes). no validation
// existed: a config could define color.transparent = hotpink and the resolver
// would never look it up (reserved idents short-circuit), silently emitting
// the CSS keyword instead of the configured value.

import { expect, test } from 'vitest'
import config from '../config-default'
import { createTamagui } from '../web/src'

const withToken = (category: string, name: string, value: string | number) => {
  const base = config.getDefaultTamaguiConfig() as any
  return {
    ...base,
    tokens: {
      ...base.tokens,
      [category]: { ...base.tokens[category], [name]: value },
    },
  }
}

test('a color token named transparent is a config creation error', () => {
  expect(() => createTamagui(withToken('color', 'transparent', 'hotpink'))).toThrowError(
    /transparent/
  )
})

test('a size token named auto is a config creation error', () => {
  expect(() => createTamagui(withToken('size', 'auto', 100))).toThrowError(/auto/)
})

test('reserved names reject case-insensitively, like CSS keywords resolve', () => {
  expect(() => createTamagui(withToken('color', 'TRANSPARENT', 'hotpink'))).toThrowError(
    /TRANSPARENT/
  )
})

test('ordinary token names still create fine', () => {
  expect(() => createTamagui(withToken('color', 'brand', 'hotpink'))).not.toThrow()
})
