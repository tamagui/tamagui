/**
 * Android TV Platform Style Tests
 *
 * Verifies that $platform-* props work correctly on Android TV.
 *
 * react-native-tvos behavior (verified):
 *   - Android TV: Platform.OS === 'android', Platform.isTV === true
 *
 * So on Android TV:
 *   - $platform-android should apply (Platform.OS === 'android')
 *   - $platform-native should apply (non-web platform)
 *   - $platform-tv should apply (Platform.isTV === true)
 *   - $platform-androidtv should apply (Platform.OS === 'android' && Platform.isTV === true)
 *   - $platform-ios should NOT apply
 *   - $platform-tvos should NOT apply
 *   - $platform-web should NOT apply
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

describe('Android TV - $platform-* style props', () => {
  test('$platform-android applies on Android TV (Platform.OS === "android")', () => {
    const result = getSplitStylesFor({
      '$platform-android': { backgroundColor: 'red' },
    })
    expect(result.style?.backgroundColor).toBe('red')
  })

  test('$platform-native applies on Android TV (non-web platform)', () => {
    const result = getSplitStylesFor({
      '$platform-native': { backgroundColor: 'green' },
    })
    expect(result.style?.backgroundColor).toBe('green')
  })

  test('$platform-tv applies on Android TV (Platform.isTV === true)', () => {
    const result = getSplitStylesFor({
      '$platform-tv': { backgroundColor: 'blue' },
    })
    expect(result.style?.backgroundColor).toBe('blue')
  })

  test('$platform-androidtv applies on Android TV (Platform.OS === "android" && Platform.isTV === true)', () => {
    const result = getSplitStylesFor({
      '$platform-androidtv': { backgroundColor: 'purple' },
    })
    expect(result.style?.backgroundColor).toBe('purple')
  })

  test('$platform-ios does NOT apply on Android TV', () => {
    const result = getSplitStylesFor({
      '$platform-ios': { backgroundColor: 'orange' },
    })
    expect(result.style?.backgroundColor).toBeUndefined()
  })

  test('$platform-tvos does NOT apply on Android TV', () => {
    const result = getSplitStylesFor({
      '$platform-tvos': { backgroundColor: 'pink' },
    })
    expect(result.style?.backgroundColor).toBeUndefined()
  })

  test('$platform-web does NOT apply on Android TV', () => {
    const result = getSplitStylesFor({
      '$platform-web': { backgroundColor: 'yellow' },
    })
    expect(result.style?.backgroundColor).toBeUndefined()
  })

  test('$platform-androidtv overrides $platform-android on Android TV', () => {
    const result = getSplitStylesFor({
      '$platform-android': { backgroundColor: 'red' },
      '$platform-androidtv': { backgroundColor: 'purple' },
    })
    // Both apply; androidtv wins due to order of application
    expect(result.style?.backgroundColor).toBe('purple')
  })

  test('$platform-tv and $platform-androidtv both apply on Android TV', () => {
    const result = getSplitStylesFor({
      '$platform-tv': { marginTop: 10 },
      '$platform-androidtv': { marginBottom: 20 },
    })
    expect(result.style?.marginTop).toBe(10)
    expect(result.style?.marginBottom).toBe(20)
  })
})
