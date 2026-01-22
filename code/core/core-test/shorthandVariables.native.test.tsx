import { View, createTamagui, getSplitStyles } from '@tamagui/core'
import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig('native'))
})

describe('shorthand variables - native', () => {
  // boxShadow/filter are string-only, passed through to RN 0.76+ which handles CSS syntax
  test('boxShadow with $variable resolves token in string', () => {
    const { style } = getSplitStylesFor({
      boxShadow: '0 0 10px $white',
    })

    expect(style?.boxShadow).toBeDefined()
    expect(typeof style?.boxShadow).toBe('string')
    // Token should be resolved to a raw value
    expect(style?.boxShadow).not.toContain('$white')
    expect(style?.boxShadow).toContain('0 0 10px')
  })

  test('boxShadow with color token resolves to raw value', () => {
    const { style } = getSplitStylesFor({
      boxShadow: '0 0 10px $black',
    })

    expect(style?.boxShadow).toBeDefined()
    expect(typeof style?.boxShadow).toBe('string')
    expect(style?.boxShadow).not.toContain('$black')
  })

  test('boxShadow with multiple shadows stays as string', () => {
    const { style } = getSplitStylesFor({
      boxShadow: '0 0 10px $white, 0 0 20px $black',
    })

    expect(style?.boxShadow).toBeDefined()
    expect(typeof style?.boxShadow).toBe('string')
    // Both tokens should be resolved
    expect(style?.boxShadow).not.toContain('$white')
    expect(style?.boxShadow).not.toContain('$black')
    // Should have comma for multiple shadows
    expect(style?.boxShadow).toContain(',')
  })

  test('boxShadow without variables passed through as string', () => {
    const { style } = getSplitStylesFor({
      boxShadow: '0 0 10px red',
    })

    expect(style?.boxShadow).toBeDefined()
    expect(style?.boxShadow).toBe('0 0 10px red')
  })

  test('unresolvable $variable stays as-is in string', () => {
    const { style } = getSplitStylesFor({
      boxShadow: '0 0 10px $nonexistent',
    })

    expect(style?.boxShadow).toBeDefined()
    expect(typeof style?.boxShadow).toBe('string')
    // Unresolved variable stays as the original token string
    expect(style?.boxShadow).toContain('$nonexistent')
  })

  test('filter with $variable resolves token', () => {
    const { style } = getSplitStylesFor({
      filter: 'blur($2)',
    })

    expect(style?.filter).toBeDefined()
    expect(typeof style?.filter).toBe('string')
    expect(style?.filter).not.toContain('$2')
  })

  test('filter without variables passed through', () => {
    const { style } = getSplitStylesFor({
      filter: 'brightness(1.2)',
    })

    expect(style?.filter).toBe('brightness(1.2)')
  })
})

function getSplitStylesFor(props: Record<string, any>, Component = View) {
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
