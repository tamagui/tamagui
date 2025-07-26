process.env.TAMAGUI_TARGET = 'web'

import { describe, expect, test } from 'vitest'

import config from '../config-default'
import { createTamagui } from '../core/src'

describe('createTamagui', () => {
  test(`z-index resolves to correct unitless values`, () => {
    const theme = createTamagui(config.getDefaultTamaguiConfig())
    expect(theme.themeConfig.cssRuleSets[0].includes('--t-zIndex-1:100;')).toBeTruthy()
    expect(theme.tokensParsed.zIndex['$1'].name).toEqual('t-zIndex-1')
    expect(theme.tokensParsed.zIndex['$1'].variable).toEqual('var(--t-zIndex-1)')
    expect(theme.tokensParsed.zIndex['$1'].val).toEqual(100)
  })
})
