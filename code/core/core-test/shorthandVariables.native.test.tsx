import { Stack, createTamagui, getSplitStyles } from '@tamagui/core'
import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig('native'))
})

describe('shorthand variables - native', () => {
  // On native RN 0.76+, boxShadow strings are converted to object arrays
  test('boxShadow with $variable resolves token in object array', () => {
    const { style } = getSplitStylesFor({
      boxShadow: '0 0 10px $white',
    })

    expect(style?.boxShadow).toBeDefined()
    expect(Array.isArray(style?.boxShadow)).toBe(true)
    const boxShadow = style!.boxShadow as any
    const shadow = boxShadow[0]
    expect(shadow.offsetX).toBe(0)
    expect(shadow.offsetY).toBe(0)
    expect(shadow.blurRadius).toBe(10)
    // Color token should be resolved to a raw value (not CSS var or token string)
    expect(shadow.color).toBeDefined()
    expect(String(shadow.color)).not.toContain('var(--')
    expect(shadow.color).not.toBe('$white')
  })

  test('boxShadow with color token resolves to raw value', () => {
    const { style } = getSplitStylesFor({
      boxShadow: '0 0 10px $black',
    })

    expect(style?.boxShadow).toBeDefined()
    expect(Array.isArray(style?.boxShadow)).toBe(true)
    const boxShadow = style!.boxShadow as any
    const shadow = boxShadow[0]
    expect(shadow.color).toBeDefined()
    expect(String(shadow.color)).not.toContain('var(--')
  })

  test('boxShadow with multiple shadows produces array', () => {
    const { style } = getSplitStylesFor({
      boxShadow: '0 0 10px $white, 0 0 20px $black',
    })

    expect(style?.boxShadow).toBeDefined()
    expect(Array.isArray(style?.boxShadow)).toBe(true)
    const boxShadow = style!.boxShadow as any
    // Should have 2 shadow objects
    expect(boxShadow.length).toBe(2)
    // Both should have resolved colors
    expect(String(boxShadow[0].color)).not.toContain('var(--')
    expect(String(boxShadow[1].color)).not.toContain('var(--')
  })

  test('boxShadow without variables converted to object array', () => {
    const { style } = getSplitStylesFor({
      boxShadow: '0 0 10px red',
    })

    expect(style?.boxShadow).toBeDefined()
    expect(Array.isArray(style?.boxShadow)).toBe(true)
    const boxShadow = style!.boxShadow as any
    const shadow = boxShadow[0]
    expect(shadow.offsetX).toBe(0)
    expect(shadow.offsetY).toBe(0)
    expect(shadow.blurRadius).toBe(10)
    expect(shadow.color).toBe('red')
  })

  // Note: CSS border shorthand is web-only - native uses individual props (borderWidth, borderColor, etc.)
  test.skip('border with $variable is web-only', () => {
    // border shorthand like "1px solid $red" only works on web
    // On native, use borderWidth, borderColor, borderStyle individually
  })

  test('unresolvable $variable stays as-is in color', () => {
    const { style } = getSplitStylesFor({
      boxShadow: '0 0 10px $nonexistent',
    })

    expect(style?.boxShadow).toBeDefined()
    expect(Array.isArray(style?.boxShadow)).toBe(true)
    const boxShadow = style!.boxShadow as any
    // Unresolved variable stays as the original token string in color
    expect(boxShadow[0].color).toBe('$nonexistent')
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
