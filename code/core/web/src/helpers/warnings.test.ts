import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createTamagui } from '../createTamagui'
import { getSplitStyles } from './getSplitStyles'
import { resetWarned } from './warnOnce'

describe('v3 flat-value typo warnings', () => {
  const originalEnv = process.env.NODE_ENV
  const originalTamaguiEnvironment = process.env.TAMAGUI_ENVIRONMENT
  let warnSpy: ReturnType<typeof vi.spyOn>

  const conf = createTamagui({
    shorthands: {
      w: 'width',
      h: 'height',
      bg: 'backgroundColor',
      p: 'padding',
    },
    themes: {
      light: {
        background: '#ffffff',
        color: '#000000',
        'color-11': '#111111',
      },
    },
    tokens: {
      color: {
        red: '#ff0000',
        blue: '#0000ff',
      },
      size: {
        4: 16,
        8: 32,
      },
      space: {
        4: 16,
        8: 32,
        11: 44,
        44: 176,
      },
      radius: {
        4: 4,
      },
      zIndex: {
        1: 1,
      },
    },
  })

  beforeEach(() => {
    resetWarned()
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    process.env.NODE_ENV = originalEnv
    process.env.TAMAGUI_ENVIRONMENT = originalTamaguiEnvironment
    vi.useRealTimers()
    warnSpy.mockRestore()
  })

  it('keeps Vite evaluation config fallback quiet without hiding real duplicates', async () => {
    process.env.NODE_ENV = 'development'
    vi.useFakeTimers()
    const previousConfig = globalThis.__tamaguiConfig
    const previousEvaluationConfig = globalThis.__tamaguiEvaluationConfig
    const previousWarned = globalThis.__tamaguiHasWarnedGlobalFallback
    const previousPending = globalThis.__tamaguiPendingCheck

    try {
      delete globalThis.__tamaguiEvaluationConfig
      delete globalThis.__tamaguiHasWarnedGlobalFallback
      delete globalThis.__tamaguiPendingCheck
      globalThis.__tamaguiConfig = conf
      vi.resetModules()
      const unmarkedDuplicate = await import('../config')
      unmarkedDuplicate.getConfigMaybe()
      await vi.advanceTimersByTimeAsync(501)
      expect(warnSpy).toHaveBeenCalledTimes(1)

      warnSpy.mockClear()
      delete globalThis.__tamaguiConfig
      delete globalThis.__tamaguiHasWarnedGlobalFallback
      delete globalThis.__tamaguiPendingCheck
      process.env.TAMAGUI_ENVIRONMENT = 'tamagui'
      vi.resetModules()
      const evaluationInstance = await import('../config')
      evaluationInstance.setConfig(conf)
      expect(globalThis.__tamaguiEvaluationConfig).toBe(conf)

      process.env.TAMAGUI_ENVIRONMENT = originalTamaguiEnvironment
      vi.resetModules()
      const runtimeDuplicate = await import('../config')
      runtimeDuplicate.getConfigMaybe()
      await vi.advanceTimersByTimeAsync(501)
      expect(warnSpy).not.toHaveBeenCalled()
    } finally {
      globalThis.__tamaguiConfig = previousConfig
      globalThis.__tamaguiEvaluationConfig = previousEvaluationConfig
      globalThis.__tamaguiHasWarnedGlobalFallback = previousWarned
      globalThis.__tamaguiPendingCheck = previousPending
    }
  })

  describe('1. v2 dollar-prefixed tokens', () => {
    it('warns once in development with suggested word without $', () => {
      process.env.NODE_ENV = 'development'
      getSplitStyles(
        { color: '$custom' },
        { validStyles: { color: true } } as any,
        conf.themes.light,
        'light',
        {} as any,
        {} as any
      )
      // Call again to verify warn-once
      getSplitStyles(
        { color: '$custom' },
        { validStyles: { color: true } } as any,
        conf.themes.light,
        'light',
        {} as any,
        {} as any
      )

      expect(warnSpy).toHaveBeenCalledTimes(1)
      expect(warnSpy.mock.calls[0][0]).toContain('v3 tokens have no "$" prefix')
      expect(warnSpy.mock.calls[0][0]).toContain('custom')
    })

    it('does not warn in production', () => {
      process.env.NODE_ENV = 'production'
      getSplitStyles(
        { color: '$custom' },
        { validStyles: { color: true } } as any,
        conf.themes.light,
        'light',
        {} as any,
        {} as any
      )
      expect(warnSpy).not.toHaveBeenCalled()
    })
  })

  describe('2. bare numeric string on size/space/radius/zIndex', () => {
    it('warns once in development and names nearest token', () => {
      process.env.NODE_ENV = 'development'
      getSplitStyles(
        { gap: '46' },
        { validStyles: { gap: true } } as any,
        conf.themes.light,
        'light',
        {} as any,
        {} as any
      )
      getSplitStyles(
        { gap: '46' },
        { validStyles: { gap: true } } as any,
        conf.themes.light,
        'light',
        {} as any,
        {} as any
      )

      expect(warnSpy).toHaveBeenCalledTimes(1)
      expect(warnSpy.mock.calls[0][0]).toContain('passed to CSS as-is with px units')
      expect(warnSpy.mock.calls[0][0]).toContain('nearest token is "11"')
    })

    it('does not warn for valid tokens', () => {
      process.env.NODE_ENV = 'development'
      getSplitStyles(
        { w: '4' },
        { validStyles: { width: true } } as any,
        conf.themes.light,
        'light',
        {} as any,
        {} as any
      )
      expect(warnSpy).not.toHaveBeenCalled()
    })

    it('does not warn in production', () => {
      process.env.NODE_ENV = 'production'
      getSplitStyles(
        { w: '10' },
        { validStyles: { width: true } } as any,
        conf.themes.light,
        'light',
        {} as any,
        {} as any
      )
      expect(warnSpy).not.toHaveBeenCalled()
    })

    it('does not warn for a token-less category', () => {
      process.env.NODE_ENV = 'development'
      const confWithoutZIndexTokens = createTamagui({
        themes: { light: { background: '#fff', color: '#000' } },
        tokens: {
          color: {},
          size: {},
          space: {},
          radius: {},
          zIndex: {},
        },
      })

      getSplitStyles(
        { zIndex: '1' },
        { validStyles: { zIndex: true } } as any,
        confWithoutZIndexTokens.themes.light,
        'light',
        {} as any,
        {} as any
      )

      expect(warnSpy).not.toHaveBeenCalled()
    })

    it('does not describe unitless zIndex values as pixels', () => {
      process.env.NODE_ENV = 'development'
      const confWithZIndexTokens = createTamagui({
        themes: { light: { background: '#fff', color: '#000' } },
        tokens: {
          color: {},
          size: {},
          space: {},
          radius: {},
          zIndex: { 1: 1 },
        },
      })

      getSplitStyles(
        { zIndex: '2' },
        { validStyles: { zIndex: true } } as any,
        confWithZIndexTokens.themes.light,
        'light',
        {} as any,
        {} as any
      )

      expect(warnSpy).toHaveBeenCalledTimes(1)
      expect(warnSpy.mock.calls[0][0]).toContain('nearest token is "1"')
      expect(warnSpy.mock.calls[0][0]).not.toContain('px')
    })
  })

  describe('3. bare identifier on color-category property', () => {
    it('warns once in development with did-you-mean suggestion from theme keys', () => {
      process.env.NODE_ENV = 'development'
      getSplitStyles(
        { color: 'backgroun' },
        { validStyles: { color: true } } as any,
        conf.themes.light,
        'light',
        {} as any,
        {} as any
      )
      getSplitStyles(
        { color: 'backgroun' },
        { validStyles: { color: true } } as any,
        conf.themes.light,
        'light',
        {} as any,
        {} as any
      )

      expect(warnSpy).toHaveBeenCalledTimes(1)
      expect(warnSpy.mock.calls[0][0]).toContain('unknown color "backgroun"')
      expect(warnSpy.mock.calls[0][0]).toContain('did you mean "background"?')
    })

    it('does not warn on CSS named colors or keywords', () => {
      process.env.NODE_ENV = 'development'
      getSplitStyles(
        { color: 'red' },
        { validStyles: { color: true } } as any,
        conf.themes.light,
        'light',
        {} as any,
        {} as any
      )
      getSplitStyles(
        { color: 'currentColor' },
        { validStyles: { color: true } } as any,
        conf.themes.light,
        'light',
        {} as any,
        {} as any
      )
      getSplitStyles(
        { color: 'transparent' },
        { validStyles: { color: true } } as any,
        conf.themes.light,
        'light',
        {} as any,
        {} as any
      )
      getSplitStyles(
        { color: '#ffffff' },
        { validStyles: { color: true } } as any,
        conf.themes.light,
        'light',
        {} as any,
        {} as any
      )
      expect(warnSpy).not.toHaveBeenCalled()
    })

    it('does not warn in production', () => {
      process.env.NODE_ENV = 'production'
      getSplitStyles(
        { color: 'backgroun' },
        { validStyles: { color: true } } as any,
        conf.themes.light,
        'light',
        {} as any,
        {} as any
      )
      expect(warnSpy).not.toHaveBeenCalled()
    })
  })

  describe('4. removed v2 prop names', () => {
    const removedProps = [
      ['animation', 'transition='],
      ['hoverStyle', 'hover: clause'],
      ['pressStyle', 'press: clause'],
      ['focusStyle', 'focus: clause'],
      ['enterStyle', 'enter: clause'],
      ['exitStyle', 'exit: clause'],
      ['$sm', 'sm: clause'],
    ] as const

    it.each(removedProps)(
      'warns once in development for %s naming replacement %s',
      (prop, replacement) => {
        process.env.NODE_ENV = 'development'
        getSplitStyles(
          { [prop]: 'val' },
          { validStyles: {} } as any,
          conf.themes.light,
          'light',
          {} as any,
          {} as any
        )
        getSplitStyles(
          { [prop]: 'val' },
          { validStyles: {} } as any,
          conf.themes.light,
          'light',
          {} as any,
          {} as any
        )

        expect(warnSpy).toHaveBeenCalledTimes(1)
        expect(warnSpy.mock.calls[0][0]).toContain(`prop "${prop}" was removed in v3`)
        expect(warnSpy.mock.calls[0][0]).toContain(replacement)
      }
    )

    it('does not warn in production', () => {
      process.env.NODE_ENV = 'production'
      for (const [prop] of removedProps) {
        getSplitStyles(
          { [prop]: 'val' },
          { validStyles: {} } as any,
          conf.themes.light,
          'light',
          {} as any,
          {} as any
        )
      }
      expect(warnSpy).not.toHaveBeenCalled()
    })
  })

  describe('5. settings.styleValueSyntax', () => {
    it('warns in development when styleValueSyntax is object and string contains clauses', () => {
      process.env.NODE_ENV = 'development'
      const confObject = createTamagui({
        settings: { styleValueSyntax: 'object' },
        themes: { light: { background: '#fff', color: '#000' } },
        tokens: {
          color: { red: '#f00', blue: '#00f' },
          size: {},
          space: {},
          radius: {},
          zIndex: {},
        },
      })

      getSplitStyles(
        { color: 'red hover:blue' },
        { validStyles: { color: true } } as any,
        confObject.themes.light,
        'light',
        {} as any,
        {} as any
      )
      // Call again to verify warn-once
      getSplitStyles(
        { color: 'red hover:blue' },
        { validStyles: { color: true } } as any,
        confObject.themes.light,
        'light',
        {} as any,
        {} as any
      )

      expect(warnSpy).toHaveBeenCalledTimes(1)
      expect(warnSpy.mock.calls[0][0]).toContain('string syntax is disabled by config')
    })

    it('warns in development when styleValueSyntax is string and object-form conditional arrives', () => {
      process.env.NODE_ENV = 'development'
      const confString = createTamagui({
        settings: { styleValueSyntax: 'string' },
        themes: { light: { background: '#fff', color: '#000' } },
        tokens: {
          color: { red: '#f00', blue: '#00f' },
          size: {},
          space: {},
          radius: {},
          zIndex: {},
        },
      })

      getSplitStyles(
        { color: { hover: 'blue' } },
        { validStyles: { color: true } } as any,
        confString.themes.light,
        'light',
        {} as any,
        {} as any
      )
      // Call again to verify warn-once
      getSplitStyles(
        { color: { hover: 'blue' } },
        { validStyles: { color: true } } as any,
        confString.themes.light,
        'light',
        {} as any,
        {} as any
      )

      expect(warnSpy).toHaveBeenCalledTimes(1)
      expect(warnSpy.mock.calls[0][0]).toContain(
        'object-form conditional syntax is disabled by config'
      )
    })

    it('does not warn in production', () => {
      process.env.NODE_ENV = 'production'
      const confObject = createTamagui({
        settings: { styleValueSyntax: 'object' },
        themes: { light: { background: '#fff', color: '#000' } },
        tokens: {
          color: { red: '#f00', blue: '#00f' },
          size: {},
          space: {},
          radius: {},
          zIndex: {},
        },
      })
      getSplitStyles(
        { color: 'red hover:blue' },
        { validStyles: { color: true } } as any,
        confObject.themes.light,
        'light',
        {} as any,
        {} as any
      )

      const confString = createTamagui({
        settings: { styleValueSyntax: 'string' },
        themes: { light: { background: '#fff', color: '#000' } },
        tokens: {
          color: { red: '#f00', blue: '#00f' },
          size: {},
          space: {},
          radius: {},
          zIndex: {},
        },
      })
      getSplitStyles(
        { color: { hover: 'blue' } },
        { validStyles: { color: true } } as any,
        confString.themes.light,
        'light',
        {} as any,
        {} as any
      )

      expect(warnSpy).not.toHaveBeenCalled()
    })
  })
})
