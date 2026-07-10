process.env.TAMAGUI_TARGET = 'web'

import { describe, expect, test } from 'vitest'

import config from '../config-default'
import { createTamagui } from '../core/src'
import { getFontSizeToken } from '../font-size/src'
import { getSize } from '../get-token/src'

describe('createTamagui', () => {
  test(`z-index resolves to correct unitless values`, () => {
    const theme = createTamagui(config.getDefaultTamaguiConfig())
    expect(theme.themeConfig.cssRuleSets[0].includes('--t-zIndex-1:100;')).toBeTruthy()
    expect(theme.tokensParsed.zIndex['$1'].name).toEqual('t-zIndex-1')
    expect(theme.tokensParsed.zIndex['$1'].variable).toEqual('var(--t-zIndex-1)')
    expect(theme.tokensParsed.zIndex['$1'].val).toEqual(100)
  })

  test(`settings.defaultSize defaults to $4`, () => {
    const theme = createTamagui(config.getDefaultTamaguiConfig())
    expect(theme.settings.defaultSize).toBe('$4')
  })

  test(`settings.defaultSize normalizes unprefixed token names`, () => {
    const baseConfig = config.getDefaultTamaguiConfig()
    const theme = createTamagui({
      ...baseConfig,
      settings: {
        ...baseConfig.settings,
        defaultSize: '5',
      },
    })

    expect(theme.settings.defaultSize).toBe('$5')
  })

  test(`settings.defaultSize validates size, space, and font size maps in development`, () => {
    const baseConfig = config.getDefaultTamaguiConfig()
    const originalNodeEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'

    try {
      expect(() =>
        createTamagui({
          ...baseConfig,
          settings: {
            ...baseConfig.settings,
            defaultSize: '$missing',
          },
        })
      ).toThrow(/settings\.defaultSize.*tokens\.size\.\$missing/)
    } finally {
      process.env.NODE_ENV = originalNodeEnv
    }
  })

  test(`true helper inputs resolve through settings.defaultSize`, () => {
    createTamagui({
      tokens: {
        color: {
          background: '#fff',
          color: '#000',
        },
        size: {
          4: 44,
          5: 52,
        },
        space: {
          4: 18,
          5: 24,
        },
        radius: {
          4: 9,
        },
        zIndex: {
          4: 400,
        },
      },
      fonts: {
        body: {
          family: 'System',
          size: {
            4: 16,
            5: 20,
          },
          lineHeight: {
            4: 20,
            5: 24,
          },
        },
      },
      themes: {
        light: {
          background: '#fff',
          color: '#000',
        },
      },
      settings: {
        defaultFont: 'body',
        defaultSize: '$4',
      },
    })

    expect(getSize(true).key).toBe('$4')
    expect(getFontSizeToken(true)).toBe('$4')
    expect(getFontSizeToken(true, { relativeSize: 1 })).toBe('$5')
  })
})
