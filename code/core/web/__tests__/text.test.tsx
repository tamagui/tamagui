import { config } from '@tamagui/config/v3'
import {
  TamaguiProvider,
  Text,
  createFont,
  createTamagui,
  type TamaguiInternalConfig,
} from '@tamagui/web'
import { render, screen } from '@testing-library/react'
import { beforeAll, describe, expect, it } from 'vitest'

describe('@tamagui/web Text', () => {
  const createTestConfig = (
    customConfig: Partial<TamaguiInternalConfig> = {}
  ): TamaguiInternalConfig => {
    const mergedConfig = {
      ...config,
      ...customConfig,
      settings: {
        ...config.settings,
        ...customConfig.settings,
      },
      tokens: {
        ...config.tokens,
        ...customConfig.tokens,
      },
      themes: {
        ...config.themes,
        ...customConfig.themes,
      },
      fonts: {
        ...config.fonts,
        ...customConfig.fonts,
      },
      animations: {
        ...config.animations,
        ...customConfig.animations,
      },
      media: {
        ...config.media,
        ...customConfig.media,
      },
      shorthands: {
        ...config.shorthands,
        ...customConfig.shorthands,
      },
    }
    return createTamagui(mergedConfig)
  }

  describe('createFont', () => {
    let testFont: ReturnType<typeof createFont>

    beforeAll(() => {
      testFont = createFont({
        family: 'TestFont',
        size: {
          1: 12,
          2: 14,
          3: 16,
        },
        lineHeight: {
          1: 16,
          2: 20,
          3: 24,
        },
        weight: {
          4: '300',
          6: '600',
        },
        letterSpacing: {
          4: 0,
          8: -1,
        },
      })
    })

    it('should set the correct font family', () => {
      expect(testFont.family).toBe('TestFont')
    })

    it('should set the correct font sizes', () => {
      expect(testFont.size[1]).toBe(12)
      expect(testFont.size[2]).toBe(14)
      expect(testFont.size[3]).toBe(16)
    })

    it('should set the correct line heights', () => {
      expect(testFont.lineHeight?.[1]).toBe(16)
      expect(testFont.lineHeight?.[2]).toBe(20)
      expect(testFont.lineHeight?.[3]).toBe(24)
    })

    it('should set the correct font weights', () => {
      expect(testFont.weight?.[4]).toBe('300')
      expect(testFont.weight?.[6]).toBe('600')
    })

    it('should set the correct letter spacing', () => {
      expect(testFont.letterSpacing?.[4]).toBe(0)
      expect(testFont.letterSpacing?.[8]).toBe(-1)
    })
  })

  describe('rendering components with correct styles', () => {
    let computedStyles: CSSStyleDeclaration

    beforeAll(() => {
      const testFont = createFont({
        family: 'TestFont',
        size: { 1: 12, 2: 14, 3: 16 },
        lineHeight: { 1: 16, 2: 20, 3: 24 },
        weight: { 4: '300', 6: '600' },
        letterSpacing: { 4: 0, 8: -1 },
      })
      const tamaguiConfig = createTestConfig({
        fonts: { ...config.fonts, body: testFont },
      })

      const TestComponent = () => (
        <TamaguiProvider config={tamaguiConfig}>
          <Text fontWeight={'$6'}>Hello, Tamagui!</Text>
        </TamaguiProvider>
      )

      render(<TestComponent />)
      const text = screen.getByText('Hello, Tamagui!')
      computedStyles = window.getComputedStyle(text)
    })

    it('applies correct line height', () => {
      // console.info({ computedStyles })
      expect(computedStyles.getPropertyValue('--f-lineHeight-2')).toBe('20px')
      expect(computedStyles.lineHeight).toBe('var(--f-lineHeight-2)')
    })

    it('applies correct font weight', () => {
      expect(computedStyles.getPropertyValue('--f-weight-6')).toBe('600')
      expect(computedStyles.fontWeight).toBe('var(--f-weight-6)')
    })

    it('applies correct letter spacing', () => {
      expect(computedStyles.getPropertyValue('--f-letterSpacing-8')).toBe('-1px')
      expect(computedStyles.letterSpacing).toBe('var(--f-letterSpacing-8)')
    })

    it('applies correct font size', () => {
      expect(computedStyles.getPropertyValue('--f-size-2')).toBe('14px')
      expect(computedStyles.fontSize).toBe('var(--f-size-2)')
    })
  })

  describe('rendering components with correct defaults', () => {
    let computedStyles: CSSStyleDeclaration

    beforeAll(() => {
      const testFont = createFont({
        family:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        size: { true: 16, 1: 12, 2: 14, 3: 16 },
        lineHeight: { true: 24, 1: 16, 2: 20, 3: 24 },
        weight: { 4: '300', 6: '600' },
        letterSpacing: { true: -1, 4: 0, 8: -1 },
      })
      const tamaguiConfig = createTestConfig({
        fonts: { ...config.fonts, body: testFont },
      })
      const TestComponent = () => (
        <TamaguiProvider config={tamaguiConfig}>
          <Text>Default Size and LineHeight</Text>
        </TamaguiProvider>
      )

      render(<TestComponent />)
      const defaultText = screen.getByText('Default Size and LineHeight')
      expect(defaultText).toBeInTheDocument()
      computedStyles = window.getComputedStyle(defaultText)
    })

    it('applies correct font family', () => {
      expect(computedStyles.getPropertyValue('--f-family')).toBe(
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
      )
      expect(computedStyles.fontFamily).toBe('var(--f-family)')
    })

    it('applies correct line height', () => {
      expect(computedStyles.getPropertyValue('--f-lineHeight-3')).toBe('24px')
      expect(computedStyles.lineHeight).toBe('var(--f-lineHeight-3)')
    })

    it('applies correct font size', () => {
      expect(computedStyles.getPropertyValue('--f-size')).toBe('16px')
      expect(computedStyles.fontSize).toBe('var(--f-size-3)')
    })
  })
})
