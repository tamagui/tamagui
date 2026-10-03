process.env.TAMAGUI_TARGET = 'web'

// the sizing.default slot moves what true (and an absent size) resolves to.

import { expect, test } from 'vitest'

import { defaultConfig } from '@tamagui/config/v6'
import { createTamagui, defaultSizing, getConfig, resolveSizing } from '../web/src'

createTamagui({
  ...defaultConfig,
  sizing: { ...defaultSizing, default: 'lg' },
} as any)

const conf = getConfig()
const env = {
  sizing: conf.sizing,
  fonts: conf.fontsParsed,
  tokens: conf.tokensParsed,
  font: conf.fontsParsed[conf.defaultFontToken],
}

test('true and absent resolve to the configured default', () => {
  expect(resolveSizing(true, env)).toEqual(resolveSizing('lg', env))
  expect(resolveSizing(undefined, env)).toEqual(resolveSizing('lg', env))
  expect(resolveSizing('md', env)).toMatchObject({ height: 36, icon: 16, square: 22 })
})
