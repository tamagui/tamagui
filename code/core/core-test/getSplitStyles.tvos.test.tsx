/**
 * tvOS Platform Style Tests
 *
 * Verifies that platform props work correctly on tvOS (Apple TV).
 *
 * react-native-tvos behavior (verified):
 *   - tvOS: Platform.OS === 'ios', Platform.isTV === true
 *
 * So on tvOS:
 *   - $ios should apply (Platform.OS === 'ios')
 *   - $native should apply (non-web platform)
 *   - $tv should apply (Platform.isTV === true)
 *   - $tvos should apply (Platform.OS === 'ios' && Platform.isTV === true)
 *   - $android should NOT apply
 *   - $androidtv should NOT apply
 *   - $web should NOT apply
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

describe('tvOS - platform style props', () => {
  test('$ios applies on tvOS (Platform.OS === "ios")', () => {
    const result = getSplitStylesFor({
      '$ios': { backgroundColor: 'red' },
    })
    expect(result.style?.backgroundColor).toBe('red')
  })

  test('$native applies on tvOS (non-web platform)', () => {
    const result = getSplitStylesFor({
      '$native': { backgroundColor: 'green' },
    })
    expect(result.style?.backgroundColor).toBe('green')
  })

  test('$tv applies on tvOS (Platform.isTV === true)', () => {
    const result = getSplitStylesFor({
      '$tv': { backgroundColor: 'blue' },
    })
    expect(result.style?.backgroundColor).toBe('blue')
  })

  test('$tvos applies on tvOS (Platform.OS === "ios" && Platform.isTV === true)', () => {
    const result = getSplitStylesFor({
      '$tvos': { backgroundColor: 'purple' },
    })
    expect(result.style?.backgroundColor).toBe('purple')
  })

  test('$android does NOT apply on tvOS', () => {
    const result = getSplitStylesFor({
      '$android': { backgroundColor: 'orange' },
    })
    expect(result.style?.backgroundColor).toBeUndefined()
  })

  test('$androidtv does NOT apply on tvOS', () => {
    const result = getSplitStylesFor({
      '$androidtv': { backgroundColor: 'pink' },
    })
    expect(result.style?.backgroundColor).toBeUndefined()
  })

  test('$web does NOT apply on tvOS', () => {
    const result = getSplitStylesFor({
      '$web': { backgroundColor: 'yellow' },
    })
    expect(result.style?.backgroundColor).toBeUndefined()
  })

  test('$tvos overrides $ios on tvOS (tvos declared after)', () => {
    const result = getSplitStylesFor({
      '$ios': { backgroundColor: 'red' },
      '$tvos': { backgroundColor: 'purple' },
    })
    // tvos is more specific → always wins regardless of declaration order
    expect(result.style?.backgroundColor).toBe('purple')
  })

  test('$tvos overrides $ios on tvOS (tvos declared first)', () => {
    const result = getSplitStylesFor({
      '$tvos': { backgroundColor: 'purple' },
      '$ios': { backgroundColor: 'red' },
    })
    // tvos is more specific → wins even when declared first
    expect(result.style?.backgroundColor).toBe('purple')
  })

  test('$tv and $tvos both apply on tvOS', () => {
    const result = getSplitStylesFor({
      '$tv': { marginTop: 10 },
      '$tvos': { marginBottom: 20 },
    })
    expect(result.style?.marginTop).toBe(10)
    expect(result.style?.marginBottom).toBe(20)
  })

  test('platform specificity cascade: native → tv → tvos (each overrides previous for same key, retains others)', () => {
    const result = getSplitStylesFor({
      '$native': { backgroundColor: 'green', opacity: 1, zIndex: 2 },
      '$tv': { backgroundColor: 'blue', marginTop: 8 },
      '$tvos': { backgroundColor: 'purple' },
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
      '$tvos': { backgroundColor: 'purple' },
      '$tv': { backgroundColor: 'blue', marginTop: 8 },
      '$native': { backgroundColor: 'green', opacity: 1, zIndex: 2 },
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
