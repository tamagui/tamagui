process.env.TAMAGUI_TARGET = 'web'

// v5's numeric scales cannot derive the ladder, so v5 rungs point text,
// padding and radius at v5 keys and pin the frozen geometry: same heights,
// v5-native styling.

import { expect, test } from 'vitest'

import { defaultConfig } from '@tamagui/config/v5'
import { createTamagui, getConfig, resolveSizing } from '../web/src'

createTamagui(defaultConfig as any)

const conf = getConfig()
const env = {
  sizing: conf.sizing,
  fonts: conf.fontsParsed,
  tokens: conf.tokensParsed,
  font: conf.fontsParsed[conf.defaultFontToken],
}

test('v5 rungs use v5 keys with pinned geometry', () => {
  expect(resolveSizing('md', env)).toEqual({
    name: 'md',
    fontSize: '3',
    lineHeight: '3',
    paddingInline: '3-5',
    paddingBlock: '2',
    gap: '2',
    radius: '2',
    height: 36,
    icon: 16,
    square: 22,
  })
})

test('v5 geometry matches the frozen ladder', () => {
  expect(resolveSizing('xs', env)).toMatchObject({ height: 24, icon: 12, square: 17 })
  expect(resolveSizing('sm', env)).toMatchObject({ height: 32, icon: 16, square: 20 })
  expect(resolveSizing('lg', env)).toMatchObject({ height: 40, icon: 16, square: 25 })
  expect(resolveSizing('xl', env)).toMatchObject({ height: 48, icon: 20, square: 28 })
  expect(resolveSizing(true, env)).toEqual(resolveSizing('md', env))
})
