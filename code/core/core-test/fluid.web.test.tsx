process.env.TAMAGUI_TARGET = 'web'

import { describe, expect, test } from 'vitest'
import { Text, createTamagui, fluid, getSplitStyles } from '@tamagui/core'
import configDefault from '../config-default'

describe('fluid() and dynamic units on web', () => {
  const config = createTamagui(configDefault.getDefaultTamaguiConfig('web'))

  test('fluid() generates valid CSS clamp expressions', () => {
    const res = fluid({ min: 18, max: 36, from: 375, to: 1200, unit: 'cqi' })
    expect(res).toBe('clamp(18px, 2.1818cqi + 9.82px, 36px)')
  })

  test('getSplitStyles passes clamp and cqi through to CSS styles on web', () => {
    const split = getSplitStyles(
      {
        fontSize: 'clamp(18px, 2cqi + 10px, 36px)',
        padding: '2rem',
        width: '50vw',
      },
      Text.staticConfig,
      config.themes.light,
      'light',
      { unmounted: true } as any,
      {} as any
    )

    // On web, rulesToInsert contains the exact atomic CSS rules with clamp and cqi
    const cssRules = JSON.stringify(split.rulesToInsert)
    expect(cssRules).toContain('clamp(18px, 2cqi + 10px, 36px)')
    expect(cssRules).toContain('50vw')
  })
})
