/**
 * Android TV Platform Style Tests
 *
 * Verifies that platform props work correctly on Android TV.
 *
 * react-native-tvos behavior (verified):
 *   - Android TV: Platform.OS === 'android', Platform.isTV === true
 *
 * So on Android TV:
 *   - $android should apply (Platform.OS === 'android')
 *   - $native should apply (non-web platform)
 *   - $tv should apply (Platform.isTV === true)
 *   - $androidtv should apply (Platform.OS === 'android' && Platform.isTV === true)
 *   - $ios should NOT apply
 *   - $tvos should NOT apply
 *   - $web should NOT apply
 */

import { View, createTamagui } from '@tamagui/core'
import { beforeAll, describe, expect, test } from 'vitest'

// Set TAMAGUI_TARGET before importing getSplitStyles
process.env.TAMAGUI_TARGET = 'native'

// Import directly from source so mocks apply
import { getSplitStyles } from '../web/src/helpers/getSplitStyles'

// Mock @tamagui/constants to simulate Android TV environment:
// - isAndroid: true (Platform.OS === 'android')
// - isTV: true (Platform.isTV === true)
// - isIos: false
vi.mock('@tamagui/constants', async () => {
  const actual = await vi.importActual('@tamagui/constants')
  return {
    ...actual,
    isAndroid: true,
    isIos: false,
    isTV: true,
    isWeb: false,
    isClient: true,
    currentPlatform: 'android',
  }
})

import config from '../config-default'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig('native'))
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
    },
    undefined,
    undefined,
    undefined,
    undefined
  )!
}

describe('Android TV - platform style props', () => {
  test('$android applies on Android TV (Platform.OS === "android")', () => {
    const result = getSplitStylesFor({
      '$android': { backgroundColor: 'red' },
    })
    expect(result.style?.backgroundColor).toBe('red')
  })

  test('$native applies on Android TV (non-web platform)', () => {
    const result = getSplitStylesFor({
      '$native': { backgroundColor: 'green' },
    })
    expect(result.style?.backgroundColor).toBe('green')
  })

  test('$tv applies on Android TV (Platform.isTV === true)', () => {
    const result = getSplitStylesFor({
      '$tv': { backgroundColor: 'blue' },
    })
    expect(result.style?.backgroundColor).toBe('blue')
  })

  test('$androidtv applies on Android TV (Platform.OS === "android" && Platform.isTV === true)', () => {
    const result = getSplitStylesFor({
      '$androidtv': { backgroundColor: 'purple' },
    })
    expect(result.style?.backgroundColor).toBe('purple')
  })

  test('$ios does NOT apply on Android TV', () => {
    const result = getSplitStylesFor({
      '$ios': { backgroundColor: 'orange' },
    })
    expect(result.style?.backgroundColor).toBeUndefined()
  })

  test('$tvos does NOT apply on Android TV', () => {
    const result = getSplitStylesFor({
      '$tvos': { backgroundColor: 'pink' },
    })
    expect(result.style?.backgroundColor).toBeUndefined()
  })

  test('$web does NOT apply on Android TV', () => {
    const result = getSplitStylesFor({
      '$web': { backgroundColor: 'yellow' },
    })
    expect(result.style?.backgroundColor).toBeUndefined()
  })

  test('$androidtv overrides $android on Android TV (androidtv declared after)', () => {
    const result = getSplitStylesFor({
      '$android': { backgroundColor: 'red' },
      '$androidtv': { backgroundColor: 'purple' },
    })
    // androidtv is more specific → always wins regardless of declaration order
    expect(result.style?.backgroundColor).toBe('purple')
  })

  test('$androidtv overrides $android on Android TV (androidtv declared first)', () => {
    const result = getSplitStylesFor({
      '$androidtv': { backgroundColor: 'purple' },
      '$android': { backgroundColor: 'red' },
    })
    // androidtv is more specific → wins even when declared first
    expect(result.style?.backgroundColor).toBe('purple')
  })

  test('$tv and $androidtv both apply on Android TV', () => {
    const result = getSplitStylesFor({
      '$tv': { marginTop: 10 },
      '$androidtv': { marginBottom: 20 },
    })
    expect(result.style?.marginTop).toBe(10)
    expect(result.style?.marginBottom).toBe(20)
  })

  test('platform specificity cascade: native → tv → androidtv (each overrides previous for same key, retains others)', () => {
    const result = getSplitStylesFor({
      '$native': { backgroundColor: 'green', opacity: 1, zIndex: 2 },
      '$tv': { backgroundColor: 'blue', marginTop: 8 },
      '$androidtv': { backgroundColor: 'purple' },
    })
    // androidtv wins for backgroundColor (most specific)
    expect(result.style?.backgroundColor).toBe('purple')
    // tv-only prop marginTop is retained (not overridden by androidtv)
    expect(result.style?.marginTop).toBe(8)
    // native-only props are retained (not overridden by tv or androidtv)
    expect(result.style?.opacity).toBe(1)
    expect(result.style?.zIndex).toBe(2)
  })

  test('platform specificity cascade is order-independent (most specific declared first, retains other props)', () => {
    const result = getSplitStylesFor({
      '$androidtv': { backgroundColor: 'purple' },
      '$tv': { backgroundColor: 'blue', marginTop: 8 },
      '$native': { backgroundColor: 'green', opacity: 1, zIndex: 2 },
    })
    // androidtv wins for backgroundColor even though it was declared first
    expect(result.style?.backgroundColor).toBe('purple')
    // tv-only prop marginTop is retained even though tv was not the winner for backgroundColor
    expect(result.style?.marginTop).toBe(8)
    // native-only props are retained even though native was not the winner for backgroundColor
    expect(result.style?.opacity).toBe(1)
    expect(result.style?.zIndex).toBe(2)
  })
})
