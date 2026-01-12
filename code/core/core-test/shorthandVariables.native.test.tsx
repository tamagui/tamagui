import { Stack, createTamagui, getSplitStyles } from '@tamagui/core'
import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig('native'))
})

describe('shorthand variables - native', () => {
  test('boxShadow with $variable resolves to raw value on native', () => {
    const { style } = getSplitStylesFor({
      boxShadow: '0 0 10px $white',
    })

    expect(style?.boxShadow).toBeDefined()
    // On native, should resolve to actual color value, not CSS var
    expect(style?.boxShadow).not.toContain('var(--')
    expect(style?.boxShadow).toContain('0 0 10px')
    // Should contain the resolved color (white = #fff or rgb format)
    expect(style?.boxShadow).toMatch(/#fff|rgb|white/i)
  })

  test('boxShadow with color token resolves to raw value', () => {
    const { style } = getSplitStylesFor({
      boxShadow: '0 0 10px $black',
    })

    expect(style?.boxShadow).toBeDefined()
    expect(style?.boxShadow).not.toContain('var(--')
  })

  test('boxShadow with multiple variables resolves all to raw values', () => {
    const { style } = getSplitStylesFor({
      boxShadow: '0 0 10px $white, 0 0 20px $black',
    })

    expect(style?.boxShadow).toBeDefined()
    // Should not contain any CSS vars
    expect(style?.boxShadow).not.toContain('var(--')
    // Should contain both resolved colors
    expect(style?.boxShadow).toContain(',')
  })

  test('boxShadow without variables passes through unchanged', () => {
    const { style } = getSplitStylesFor({
      boxShadow: '0 0 10px red',
    })

    expect(style?.boxShadow).toBe('0 0 10px red')
  })

  // Note: CSS border shorthand is web-only - native uses individual props (borderWidth, borderColor, etc.)
  test.skip('border with $variable is web-only', () => {
    // border shorthand like "1px solid $red" only works on web
    // On native, use borderWidth, borderColor, borderStyle individually
  })

  test('unresolvable $variable stays as-is', () => {
    const { style } = getSplitStylesFor({
      boxShadow: '0 0 10px $nonexistent',
    })

    expect(style?.boxShadow).toBeDefined()
    // Unresolved variable stays as the original token string
    expect(style?.boxShadow).toContain('$nonexistent')
  })
})

function getSplitStylesFor(props: Record<string, any>, Component = Stack) {
  return getSplitStyles(
    props,
    Component.staticConfig,
    {} as any,
    '',
    {
      hover: false,
      press: false,
      pressIn: false,
      focus: false,
      unmounted: true,
      disabled: false,
      focusVisible: false,
    },
    {
      isAnimated: false,
      resolveValues: 'value', // On native, resolve tokens to raw values
    },
    undefined,
    undefined,
    undefined,
    undefined
  )!
}
