/**
 * tvOS Platform Style Tests
 *
 * Verifies that $platform-* props work correctly on tvOS (Apple TV).
 *
 * react-native-tvos behavior (verified):
 *   - tvOS: Platform.OS === 'ios', Platform.isTV === true
 *
 * So on tvOS:
 *   - $platform-ios should apply (Platform.OS === 'ios')
 *   - $platform-native should apply (non-web platform)
 *   - $platform-tv should apply (Platform.isTV === true)
 *   - $platform-tvos should apply (Platform.OS === 'ios' && Platform.isTV === true)
 *   - $platform-android should NOT apply
 *   - $platform-androidtv should NOT apply
 *   - $platform-web should NOT apply
 */

import { View, createTamagui } from '@tamagui/core'
import { beforeAll, describe, expect, test } from 'vitest'

// Set TAMAGUI_TARGET before importing getSplitStyles
process.env.TAMAGUI_TARGET = 'native'

// Import directly from source so mocks apply
import { getSplitStyles } from '../web/src/helpers/getSplitStyles'

// Mock @tamagui/constants to simulate tvOS environment:
// - isIos: true (Platform.OS === 'ios')
// - isTV: true (Platform.isTV === true)
// - isAndroid: false
vi.mock('@tamagui/constants', async () => {
  const actual = await vi.importActual('@tamagui/constants')
  return {
    ...actual,
    isIos: true,
    isAndroid: false,
    isTV: true,
    isWeb: false,
    isClient: true,
    currentPlatform: 'ios',
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

describe('tvOS - $platform-* style props', () => {
  test('$platform-ios applies on tvOS (Platform.OS === "ios")', () => {
    const result = getSplitStylesFor({
      '$platform-ios': { backgroundColor: 'red' },
    })
    expect(result.style?.backgroundColor).toBe('red')
  })

  test('$platform-native applies on tvOS (non-web platform)', () => {
    const result = getSplitStylesFor({
      '$platform-native': { backgroundColor: 'green' },
    })
    expect(result.style?.backgroundColor).toBe('green')
  })

  test('$platform-tv applies on tvOS (Platform.isTV === true)', () => {
    const result = getSplitStylesFor({
      '$platform-tv': { backgroundColor: 'blue' },
    })
    expect(result.style?.backgroundColor).toBe('blue')
  })

  test('$platform-tvos applies on tvOS (Platform.OS === "ios" && Platform.isTV === true)', () => {
    const result = getSplitStylesFor({
      '$platform-tvos': { backgroundColor: 'purple' },
    })
    expect(result.style?.backgroundColor).toBe('purple')
  })

  test('$platform-android does NOT apply on tvOS', () => {
    const result = getSplitStylesFor({
      '$platform-android': { backgroundColor: 'orange' },
    })
    expect(result.style?.backgroundColor).toBeUndefined()
  })

  test('$platform-androidtv does NOT apply on tvOS', () => {
    const result = getSplitStylesFor({
      '$platform-androidtv': { backgroundColor: 'pink' },
    })
    expect(result.style?.backgroundColor).toBeUndefined()
  })

  test('$platform-web does NOT apply on tvOS', () => {
    const result = getSplitStylesFor({
      '$platform-web': { backgroundColor: 'yellow' },
    })
    expect(result.style?.backgroundColor).toBeUndefined()
  })

  test('$platform-tvos overrides $platform-ios on tvOS (tvos declared after)', () => {
    const result = getSplitStylesFor({
      '$platform-ios': { backgroundColor: 'red' },
      '$platform-tvos': { backgroundColor: 'purple' },
    })
    // tvos is more specific → always wins regardless of declaration order
    expect(result.style?.backgroundColor).toBe('purple')
  })

  test('$platform-tvos overrides $platform-ios on tvOS (tvos declared first)', () => {
    const result = getSplitStylesFor({
      '$platform-tvos': { backgroundColor: 'purple' },
      '$platform-ios': { backgroundColor: 'red' },
    })
    // tvos is more specific → wins even when declared first
    expect(result.style?.backgroundColor).toBe('purple')
  })

  test('$platform-tv and $platform-tvos both apply on tvOS', () => {
    const result = getSplitStylesFor({
      '$platform-tv': { marginTop: 10 },
      '$platform-tvos': { marginBottom: 20 },
    })
    expect(result.style?.marginTop).toBe(10)
    expect(result.style?.marginBottom).toBe(20)
  })

  test('platform specificity cascade: native → tv → tvos (each overrides previous for same key, retains others)', () => {
    const result = getSplitStylesFor({
      '$platform-native': { backgroundColor: 'green', opacity: 1, zIndex: 2 },
      '$platform-tv': { backgroundColor: 'blue', marginTop: 8 },
      '$platform-tvos': { backgroundColor: 'purple' },
    })
    // tvos wins for backgroundColor (most specific)
    expect(result.style?.backgroundColor).toBe('purple')
    // tv-only prop marginTop is retained (not overridden by tvos)
    expect(result.style?.marginTop).toBe(8)
    // native-only props are retained (not overridden by tv or tvos)
    expect(result.style?.opacity).toBe(1)
    expect(result.style?.zIndex).toBe(2)
  })

  test('platform specificity cascade is order-independent (most specific declared first, retains other props)', () => {
    const result = getSplitStylesFor({
      '$platform-tvos': { backgroundColor: 'purple' },
      '$platform-tv': { backgroundColor: 'blue', marginTop: 8 },
      '$platform-native': { backgroundColor: 'green', opacity: 1, zIndex: 2 },
    })
    // tvos wins for backgroundColor even though it was declared first
    expect(result.style?.backgroundColor).toBe('purple')
    // tv-only prop marginTop is retained even though tv was not the winner for backgroundColor
    expect(result.style?.marginTop).toBe(8)
    // native-only props are retained even though native was not the winner for backgroundColor
    expect(result.style?.opacity).toBe(1)
    expect(result.style?.zIndex).toBe(2)
  })
})
