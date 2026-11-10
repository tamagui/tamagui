process.env.TAMAGUI_TARGET = 'web'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { simpleHash } from '@tamagui/helpers'
import { expect, test } from 'vitest'

import { createTamagui } from '../web/src'

const alias = (key: string) => `--${simpleHash(key, 40)}:`

test('color token aliases no theme overrides are declared once on the root', () => {
  const base = getDefaultTamaguiConfig()
  const conf = createTamagui({
    ...base,
    tokens: {
      ...base.tokens,
      color: { shared: '#111111', overridden: '#222222' },
    },
    themes: {
      light: { background: '#ffffff', color: '#000000', overridden: '#aaaaaa' },
      dark: { background: '#000000', color: '#ffffff', overridden: '#bbbbbb' },
      dark_sub: { background: '#101010', color: '#eeeeee', overridden: '#cccccc' },
    },
  } as any)

  const rules = conf.getCSS().split('\n')
  const sharedRules = rules.filter((rule) => rule.includes(alias('shared')))
  expect(sharedRules).toHaveLength(1)
  expect(sharedRules[0]).toMatch(/^:root, \.tm_xxt/)

  // an overridden token keeps its own value in every theme rule
  const overriddenRules = rules.filter((rule) => rule.includes(alias('overridden')))
  expect(overriddenRules.length).toBeGreaterThanOrEqual(3)
  expect(sharedRules[0]).not.toContain(alias('overridden'))

  // the JS themes still carry every token
  expect(conf.themes.dark_sub.shared.val).toBe('#111111')
})
