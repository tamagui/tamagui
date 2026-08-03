process.env.TAMAGUI_TARGET = 'web'

import { describe, expect, test } from 'vitest'

import config from '../config-default'
import { createTamagui } from '../web/src'

describe('createTamagui', () => {
  test(`z-index resolves to correct unitless values`, () => {
    const theme = createTamagui(config.getDefaultTamaguiConfig())
    expect(theme.themeConfig.cssRuleSets[0].includes('--t-zIndex-1:100;')).toBeTruthy()
    expect(theme.tokensParsed.zIndex['1'].name).toEqual('t-zIndex-1')
    expect(theme.tokensParsed.zIndex['1'].variable).toEqual('var(--t-zIndex-1)')
    expect(theme.tokensParsed.zIndex['1'].val).toEqual(100)
  })

  test(`font reset uses the configured default when another font sorts first`, () => {
    const baseConfig = config.getDefaultTamaguiConfig()
    const alternate = {
      ...baseConfig.fonts.body,
      family: 'AlphabeticallyFirst',
      lineHeight: {
        3: 111,
      },
    }
    const theme = createTamagui({
      ...baseConfig,
      fonts: {
        aaa: alternate,
        ...baseConfig.fonts,
      },
      settings: {
        ...baseConfig.settings,
        defaultFont: 'body',
      },
    })

    const rootFontRule = theme.themeConfig.cssRuleSets.find((rule) =>
      rule.includes('.is_View')
    )
    expect(rootFontRule).toContain(theme.fontsParsed['body'].family.variable)
    expect(rootFontRule).toContain(theme.fontsParsed['body'].lineHeight['4'].variable)
    expect(rootFontRule).not.toContain(theme.fontsParsed['aaa'].lineHeight['3'].variable)
  })

  test(`font reset uses body without depending on sort order when defaultFont is omitted`, () => {
    const baseConfig = config.getDefaultTamaguiConfig()
    const fonts = {
      ...baseConfig.fonts,
      aaa: {
        ...baseConfig.fonts.body,
        family: 'AlphabeticallyFirst',
        lineHeight: {
          3: 111,
        },
      },
    }
    const { defaultFont: _, ...settingsWithoutDefaultFont } = baseConfig.settings
    const withoutDefaultFont = createTamagui({
      ...baseConfig,
      fonts,
      settings: settingsWithoutDefaultFont,
    })
    const withExplicitDefault = createTamagui({
      ...baseConfig,
      fonts,
      settings: {
        ...settingsWithoutDefaultFont,
        defaultFont: 'body',
      },
    })

    expect(withoutDefaultFont.defaultFontToken).toBe('body')
    expect(withoutDefaultFont.themeConfig.cssRuleSets).toEqual(
      withExplicitDefault.themeConfig.cssRuleSets
    )
  })

  test(`settings.defaultFont must name a configured font`, () => {
    const baseConfig = config.getDefaultTamaguiConfig()

    expect(() =>
      createTamagui({
        ...baseConfig,
        settings: {
          ...baseConfig.settings,
          defaultFont: 'missing',
        },
      })
    ).toThrow(
      'settings.defaultFont points to missing font "missing". Configure fonts.missing or choose an existing default.'
    )
  })
})
