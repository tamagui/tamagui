/**
 * Android TV Platform Style Tests
 *
 * Verifies that platform props work correctly on Android TV.
 *
 * react-native-tvos behavior (verified):
 *   - Android TV: Platform.OS === 'android', Platform.isTV === true
 *
 * So on Android TV the android, native, tv, and androidtv modifiers apply;
 * ios, tvos, and web do not.
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
  test('android applies on Android TV (Platform.OS === "android")', () => {
    const result = getSplitStylesFor({ backgroundColor: 'android:red' })
    expect(result.style?.backgroundColor).toBe('red')
  })

  test('native applies on Android TV (non-web platform)', () => {
    const result = getSplitStylesFor({ backgroundColor: 'native:green' })
    expect(result.style?.backgroundColor).toBe('green')
  })

  test('tv applies on Android TV (Platform.isTV === true)', () => {
    const result = getSplitStylesFor({ backgroundColor: 'tv:blue' })
    expect(result.style?.backgroundColor).toBe('blue')
  })

  test('androidtv applies on Android TV (Platform.OS === "android" && Platform.isTV === true)', () => {
    const result = getSplitStylesFor({ backgroundColor: 'androidtv:purple' })
    expect(result.style?.backgroundColor).toBe('purple')
  })

  test('ios does NOT apply on Android TV', () => {
    const result = getSplitStylesFor({ backgroundColor: 'ios:orange' })
    expect(result.style?.backgroundColor).toBeUndefined()
  })

  test('tvos does NOT apply on Android TV', () => {
    const result = getSplitStylesFor({ backgroundColor: 'tvos:pink' })
    expect(result.style?.backgroundColor).toBeUndefined()
  })

  test('web does NOT apply on Android TV', () => {
    const result = getSplitStylesFor({ backgroundColor: 'web:yellow' })
    expect(result.style?.backgroundColor).toBeUndefined()
  })

  test('androidtv overrides android on Android TV (androidtv authored after)', () => {
    const result = getSplitStylesFor({
      backgroundColor: 'android:red androidtv:purple',
    })
    // androidtv is more specific → always wins regardless of declaration order
    expect(result.style?.backgroundColor).toBe('purple')
  })

  test('androidtv overrides android on Android TV (androidtv authored first)', () => {
    const result = getSplitStylesFor({
      backgroundColor: 'androidtv:purple android:red',
    })
    // androidtv is more specific → wins even when declared first
    expect(result.style?.backgroundColor).toBe('purple')
  })

  test('tv and androidtv both apply on Android TV', () => {
    const result = getSplitStylesFor({
      marginTop: 'tv:10px',
      marginBottom: 'androidtv:20px',
    })
    expect(result.style?.marginTop).toBe(10)
    expect(result.style?.marginBottom).toBe(20)
  })

  test('platform specificity cascade: native → tv → androidtv (each overrides previous for same key, retains others)', () => {
    const result = getSplitStylesFor({
      backgroundColor: 'native:green tv:blue androidtv:purple',
      opacity: 'native:1',
      zIndex: 'native:2',
      marginTop: 'tv:8px',
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
      backgroundColor: 'androidtv:purple tv:blue native:green',
      marginTop: 'tv:8px',
      opacity: 'native:1',
      zIndex: 'native:2',
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
