import { describe, expect, test } from 'bun:test'

import { createTamagui } from '@tamagui/web'
import { defaultConfig, themes, tokens } from '../src/v5'
import {
  defaultConfig as subtleDefaultConfig,
  themes as subtleThemes,
} from '../src/v5-subtle'
import { defaultConfig as v6DefaultConfig } from '../src/v6'
import { toV6Themes } from '../src/v6-themes'

describe('v5 compatibility config', () => {
  test('preserves the v5 size and space scales beside the v6 default', () => {
    expect(tokens.size['4']).toBe(44)
    expect(tokens.space['4']).toBe(18)
    expect(tokens.size['0-5']).toBe(4)
    expect(tokens.space['0-5']).toBe(1)
    expect(v6DefaultConfig.tokens.size['4']).toBe(16)
    expect(v6DefaultConfig.tokens.space['4']).toBe(16)
  })

  test('preserves the generated 12-step themes and surface names', () => {
    expect(themes.light.color12).toBeTruthy()
    expect(themes.light_surface1).toBeTruthy()
    expect(themes.dark_blue_surface2).toBeTruthy()
    expect(themes.light_Button).toBeTruthy()
    expect(subtleThemes.light_blue.color1).not.toBe(themes.light_blue.color1)
  })

  test('creates normal and subtle Tamagui configs', () => {
    const normal = createTamagui(defaultConfig)
    const subtle = createTamagui({ ...subtleDefaultConfig, themes: subtleThemes })

    expect(normal.tokensParsed.size['4'].val).toBe(44)
    expect(normal.tokensParsed.space['4'].val).toBe(18)
    expect(normal.fontsParsed.body.size['1'].val).toBe(12)
    expect(normal.fontsParsed.body.size['4'].val).toBe(15)
    expect(normal.fontsParsed.body.size['4'].needsPx).toBe(true)
    expect(normal.fontsParsed.heading.lineHeight['4'].val).toBe(22)
    expect(subtle.themes.light_blue.color9.val).toBeTruthy()
    expect(subtle.themes.light_blue.color9.val).not.toBe(
      normal.themes.light_blue.color9.val
    )
  })

  test('can adopt the v3 theme-key grammar without changing v5 values', () => {
    const converted = toV6Themes({ light: themes.light, light_alias: themes.light })

    expect(converted.light['background-hover']).toBe(themes.light.backgroundHover)
    expect(converted.light['border-color']).toBe(themes.light.borderColor)
    expect(converted.light.color11).toBe(themes.light.color11)
    expect(converted.light).not.toHaveProperty('backgroundHover')
    expect(converted.light.color12).toBe(themes.light.color12)
    expect(converted.light_alias).toBe(converted.light)
  })
})
