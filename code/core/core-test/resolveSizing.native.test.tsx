process.env.TAMAGUI_TARGET = 'native'

// native twin of resolveSizing.web.test.tsx: the derivation reads the same
// platform-invariant type keys, so the numbers agree on both targets.

import { expect, test } from 'vitest'

import { defaultConfig } from '@tamagui/config/v6'
import { createTamagui, getConfig, resolveSizing } from '../web/src'

createTamagui(defaultConfig as any)

const conf = getConfig()
const env = {
  sizing: conf.sizing,
  fonts: conf.fontsParsed,
  tokens: conf.tokensParsed,
  font: conf.fontsParsed[conf.defaultFontToken],
}

test('rungs derive the frozen px', () => {
  expect(resolveSizing('md', env)).toMatchObject({ height: 36, icon: 16, square: 22 })
  expect(resolveSizing('xs', env)).toMatchObject({ height: 24, icon: 12, square: 17 })
  expect(resolveSizing('sm', env)).toMatchObject({ height: 32, icon: 16, square: 20 })
  expect(resolveSizing('lg', env)).toMatchObject({ height: 40, icon: 16, square: 25 })
  expect(resolveSizing('xl', env)).toMatchObject({ height: 48, icon: 20, square: 28 })
})

test('true and absent resolve to the default rung, false to no styles', () => {
  expect(resolveSizing(true, env)).toEqual(resolveSizing('md', env))
  expect(resolveSizing(undefined, env)).toEqual(resolveSizing('md', env))
  expect(resolveSizing(false, env)).toBeUndefined()
})

test('render code without an env reads the active config', () => {
  expect(resolveSizing('md')).toEqual(resolveSizing('md', env))
})

test('an unknown name resolves to no styles, never throws', () => {
  const prev = process.env.NODE_ENV
  try {
    process.env.NODE_ENV = 'development'
    expect(resolveSizing('xxl' as any, env)).toBeUndefined()
  } finally {
    process.env.NODE_ENV = prev
  }
  expect(resolveSizing('xxl' as any, env)).toBeUndefined()
})

test('a numeric size resolves to no styles, never throws', () => {
  expect(resolveSizing('3' as any, env)).toBeUndefined()
  expect(resolveSizing(3 as any, env)).toBeUndefined()
})
