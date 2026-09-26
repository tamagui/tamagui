process.env.TAMAGUI_TARGET = 'native'

// native twin of sizingCustom.web.test.tsx.

import { expect, test } from 'vitest'

import { defaultConfig } from '@tamagui/config/v6'
import { createTamagui, defaultSizing, getConfig, resolveSizing } from '../web/src'

createTamagui({
  ...defaultConfig,
  sizing: {
    ...defaultSizing,
    sizes: {
      ...defaultSizing.sizes,
      xxl: {
        fontSize: 'xl',
        controlFontSize: '2xl',
        paddingInline: '10',
        paddingBlock: '3',
        gap: '3',
        radius: 'xl',
      },
    },
  },
} as any)

const conf = getConfig()
const env = {
  sizing: conf.sizing,
  fonts: conf.fontsParsed,
  tokens: conf.tokensParsed,
  font: conf.fontsParsed[conf.defaultFontToken],
}

test('a custom rung derives from its own keys', () => {
  expect(resolveSizing('xxl' as any, env)).toMatchObject({
    name: 'xxl',
    height: 52,
    icon: 20,
    square: 34,
  })
})

test('the default rungs are untouched', () => {
  expect(resolveSizing('md', env)).toMatchObject({ height: 36, icon: 16, square: 22 })
  expect(resolveSizing(true, env)).toEqual(resolveSizing('md', env))
})
