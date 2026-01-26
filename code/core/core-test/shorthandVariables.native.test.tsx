import type { GetStyleResult } from '@tamagui/web'
import { View, createTamagui, getSplitStyles } from '@tamagui/core'
import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig('native'))
})

describe('shorthand variables - native', () => {
  // boxShadow/filter/backgroundImage are string-only, passed through to RN 0.76+

  test('boxShadow with $variable resolves token to raw value', () => {
    const { style } = getSplitStylesFor({
      boxShadow: '0 0 10px $white',
    })

    expect(style?.boxShadow).toBe('0 0 10px #fff')
  })

  test('boxShadow with multiple tokens resolves all', () => {
    const { style } = getSplitStylesFor({
      boxShadow: '0 0 10px $white, 0 0 20px $black',
    })

    expect(style?.boxShadow).toBe('0 0 10px #fff, 0 0 20px #000')
  })

  test('boxShadow without variables passed through unchanged', () => {
    const { style } = getSplitStylesFor({
      boxShadow: '0 0 10px red',
    })

    expect(style?.boxShadow).toBe('0 0 10px red')
  })

  test('boxShadow with unresolvable $variable keeps token string', () => {
    const { style } = getSplitStylesFor({
      boxShadow: '0 0 10px $nonexistent',
    })

    expect(style?.boxShadow).toBe('0 0 10px $nonexistent')
  })

  test('filter with $variable resolves space token', () => {
    const { style } = getSplitStylesFor({
      filter: 'blur($2)',
    })

    // $2 in space = 7 (size 28 * 0.333 rounded)
    expect(style?.filter).toBe('blur(7)')
  })

  test('filter without variables passed through unchanged', () => {
    const { style } = getSplitStylesFor({
      filter: 'brightness(1.2)',
    })

    expect(style?.filter).toBe('brightness(1.2)')
  })

  // backgroundImage - RN 0.76+ supports linear-gradient
  // note: ViewStyle types don't include backgroundImage yet, so we cast
  test('backgroundImage with $variable resolves tokens to raw values', () => {
    const { style } = getSplitStylesFor({
      backgroundImage: 'linear-gradient(to bottom, $white, $black)',
    })

    expect((style as any)?.backgroundImage).toBe('linear-gradient(to bottom, #fff, #000)')
  })

  test('backgroundImage with angle and multiple color stops', () => {
    const { style } = getSplitStylesFor({
      backgroundImage: 'linear-gradient(45deg, $black 0%, $white 50%, $black 100%)',
    })

    expect((style as any)?.backgroundImage).toBe(
      'linear-gradient(45deg, #000 0%, #fff 50%, #000 100%)'
    )
  })

  test('backgroundImage without variables passed through unchanged', () => {
    const { style } = getSplitStylesFor({
      backgroundImage: 'linear-gradient(to bottom, red, blue)',
    })

    expect((style as any)?.backgroundImage).toBe('linear-gradient(to bottom, red, blue)')
  })

  test('backgroundImage with unresolvable $variable keeps token string', () => {
    const { style } = getSplitStylesFor({
      backgroundImage: 'linear-gradient($nonexistent, $white)',
    })

    expect((style as any)?.backgroundImage).toBe('linear-gradient($nonexistent, #fff)')
  })
})

function getSplitStylesFor(
  props: Record<string, unknown>,
  Component: { staticConfig: Parameters<typeof getSplitStyles>[1] } = View
): GetStyleResult {
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
      resolveValues: 'value',
    },
    undefined,
    undefined,
    undefined,
    undefined
  )!
}
