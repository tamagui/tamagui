process.env.TAMAGUI_TARGET = 'web'

import { describe, expect, test } from 'vitest'
import { createTamagui } from '../core/src'

const baseConfig = (fontSize: any, fontLineHeight: any, sizeTokens: any) => ({
  tokens: {
    color: { background: '#fff', color: '#000' },
    size: sizeTokens,
    space: { 4: 18 },
    radius: { 4: 9 },
    zIndex: { 4: 400 },
  },
  fonts: {
    body: {
      family: 'System',
      size: fontSize,
      lineHeight: fontLineHeight,
    },
  },
  themes: { light: { background: '#fff', color: '#000' } },
  settings: { defaultFont: 'body', defaultSize: '$4' },
})

describe('px string font values', () => {
  test('"Npx" font size + lineHeight strings normalize to the same numbers as raw numbers', () => {
    const numeric = createTamagui(
      baseConfig({ 4: 15, 5: 20 }, { 4: 23, 5: 28 }, { 4: 44, 5: 52 }) as any
    )
    const pxStrings = createTamagui(
      baseConfig(
        { 4: '15px', 5: '20px' },
        { 4: '23px', 5: '28px' },
        { 4: 44, 5: 52 }
      ) as any
    )

    const numFont = numeric.fontsParsed.$body
    const pxFont = pxStrings.fontsParsed.$body

    // values match exactly as numbers
    expect(pxFont.size['$4'].val).toBe(15)
    expect(pxFont.size['$5'].val).toBe(20)
    expect(pxFont.lineHeight['$4'].val).toBe(23)
    expect(numFont.size['$4'].val).toBe(15)
    expect(pxFont.size['$4'].val).toBe(numFont.size['$4'].val)
    expect(pxFont.lineHeight['$4'].val).toBe(numFont.lineHeight['$4'].val)

    // px string variant is flagged needsPx so web keeps the px unit
    expect(pxFont.size['$4'].needsPx).toBe(true)
    expect(numFont.size['$4'].needsPx).toBeFalsy()
  })

  test('a "Npx" size token normalizes to a number with needsPx', () => {
    const conf = createTamagui(
      baseConfig({ 4: 15 }, { 4: 23 }, { 4: '44px', 5: 52 }) as any
    )
    expect(conf.tokensParsed.size['$4'].val).toBe(44)
    expect(conf.tokensParsed.size['$4'].needsPx).toBe(true)
  })
})
