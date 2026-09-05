process.env.TAMAGUI_TARGET = 'native'

import { describe, expect, test } from 'vitest'

import { View, createTamagui, getConfig, style } from '../web/src'
import { getDefaultTamaguiConfig } from '../config-default'
import { simplifiedGetSplitStyles } from './utils'

createTamagui(getDefaultTamaguiConfig('native'))

describe('style() pieces on native', () => {
  test('resolve the authored shape through the active native style path', () => {
    const piece = style({ width: 10, padding: 4, backgroundColor: 'red10' })
    const conf = getConfig()
    const result = simplifiedGetSplitStyles(
      View,
      { style: piece },
      {
        theme: conf.themes.light,
        themeName: 'light',
      }
    )

    expect(result.style).toMatchObject({
      width: 10,
      paddingTop: 4,
      paddingRight: 4,
      paddingBottom: 4,
      paddingLeft: 4,
    })
    expect(result.style.backgroundColor).toBeTruthy()
  })

  test('caches a static piece once per active theme', () => {
    let reads = 0
    const piece = style({
      get width() {
        reads++
        return 10
      },
    })
    const theme = getConfig().themes.light

    simplifiedGetSplitStyles(View, { style: piece }, { theme, themeName: 'light' })
    simplifiedGetSplitStyles(View, { style: piece }, { theme, themeName: 'light' })

    expect(reads).toBe(2)
  })

  test('does not theme-cache conditional pieces whose media result can change', () => {
    const piece = style({ opacity: '1 sm:0.5' })
    const theme = getConfig().themes.light
    const large = simplifiedGetSplitStyles(
      View,
      { style: piece },
      { theme, themeName: 'light', mediaState: { sm: false } }
    )
    const small = simplifiedGetSplitStyles(
      View,
      { style: piece },
      { theme, themeName: 'light', mediaState: { sm: true } }
    )

    expect(large.style.opacity).toBe(1)
    expect(small.style.opacity).toBe(0.5)
  })
})
