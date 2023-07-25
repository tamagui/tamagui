process.env.TAMAGUI_TARGET = 'web'

import { describe, expect, test } from 'vitest'

import config from '../config-default-node'
import { createTamagui } from '../core/src'

describe('createTamagui', () => {
  test(`z-index resolves to correct unitless values`, () => {
    process.env.TAMAGUI_TEST_AVOID_SET_CONFIG = '1'
    const theme = createTamagui(config.getDefaultTamaguiConfig())
    delete process.env.TAMAGUI_TEST_AVOID_SET_CONFIG
    expect(theme.themeConfig.cssRuleSets[0].includes('--zIndex-2:100;')).toBeTruthy()
    expect(theme.tokensParsed.zIndex['$1'].name).toEqual('zIndex-2')
    expect(theme.tokensParsed.zIndex['$1'].variable).toEqual('var(--zIndex-2)')
    expect(theme.tokensParsed.zIndex['$1'].val).toEqual(100)
  })
})
