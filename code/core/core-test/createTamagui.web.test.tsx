process.env.TAMAGUI_TARGET = 'web'

import { describe, expect, test } from 'vitest'

import config from '../config-default'
import { getFontSizeToken } from '../font-size/src'
import { getRadius, getSize, getSpace } from '../get-token/src'
import { createTamagui, getDefaultToken, resolveDefaultToken } from '../web/src'

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

  test(`settings.defaultTokens normalize and resolve each category independently`, () => {
    const baseConfig = config.getDefaultTamaguiConfig()
    const theme = createTamagui({
      ...baseConfig,
      settings: {
        ...baseConfig.settings,
        defaultSize: '5',
        defaultTokens: {
          space: '4',
          radius: '3',
          zIndex: '2',
          fontSize: '4',
        },
      },
    })

    expect(theme.settings).toMatchObject({
      defaultSize: '$5',
      defaultTokens: {
        space: '$4',
        radius: '$3',
        zIndex: '$2',
        fontSize: '$4',
      },
    })
    expect(getDefaultToken('size')).toBe('$5')
    expect(getDefaultToken('space')).toBe('$4')
    expect(getDefaultToken('radius')).toBe('$3')
    expect(getDefaultToken('zIndex')).toBe('$2')
    expect(getDefaultToken('fontSize')).toBe('$4')
    expect(getSize(true).key).toBe('$5')
    expect(getSpace(true).key).toBe('$4')
    expect(getRadius(true).key).toBe('$3')
    expect(getFontSizeToken(true)).toBe('$4')
    expect(resolveDefaultToken('$5', 'space')).toBe('$5')

    const rootFontRule = theme.themeConfig.cssRuleSets.find((rule) =>
      rule.includes('.is_View')
    )
    expect(rootFontRule).toContain(theme.fontsParsed.$body.lineHeight.$4.variable)
    expect(rootFontRule).not.toContain('var(--f-lineHeight-5)')
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

  test(`settings.defaultTokens validation identifies the setting and missing category`, () => {
    const baseConfig = config.getDefaultTamaguiConfig()
    const originalNodeEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'

    try {
      expect(() =>
        createTamagui({
          ...baseConfig,
          settings: {
            ...baseConfig.settings,
            defaultTokens: {
              radius: 'missing',
            },
          },
        })
      ).toThrow(/settings\.defaultTokens\.radius.*tokens\.radius\.\$missing/)

      expect(() =>
        createTamagui({
          ...baseConfig,
          settings: {
            ...baseConfig.settings,
            defaultTokens: {
              space: 'missing',
            },
          },
        })
      ).toThrow(/settings\.defaultTokens\.space.*tokens\.space\.\$missing/)

      expect(() =>
        createTamagui({
          ...baseConfig,
          settings: {
            ...baseConfig.settings,
            defaultTokens: {
              zIndex: 'missing',
            },
          },
        })
      ).toThrow(/settings\.defaultTokens\.zIndex.*tokens\.zIndex\.\$missing/)

      expect(() =>
        createTamagui({
          ...baseConfig,
          settings: {
            ...baseConfig.settings,
            defaultTokens: {
              fontSize: 'missing',
            },
          },
        })
      ).toThrow(/settings\.defaultTokens\.fontSize.*fonts\.\$body\.size\.\$missing/)
    } finally {
      process.env.NODE_ENV = originalNodeEnv
    }
  })

  test(`true helper inputs resolve through settings.defaultSize`, () => {
    const legacyConfig = {
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
          5: 12,
        },
        zIndex: {
          4: 400,
          5: 500,
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
    }

    createTamagui(legacyConfig)

    expect(getSize(true).key).toBe('$4')
    expect(getSpace(true).key).toBe('$4')
    expect(getRadius(true).key).toBe('$4')
    expect(getFontSizeToken(true)).toBe('$4')
    expect(getFontSizeToken(true, { relativeSize: 1 })).toBe('$5')

    createTamagui({
      ...legacyConfig,
      settings: {
        ...legacyConfig.settings,
        defaultSize: '$5',
      },
    })

    expect(getSize(true).key).toBe('$5')
    expect(getSpace(true).key).toBe('$5')
    expect(getRadius(true).key).toBe('$5')
    expect(getDefaultToken('zIndex')).toBe('$5')
    expect(getFontSizeToken(true)).toBe('$5')
  })
})
