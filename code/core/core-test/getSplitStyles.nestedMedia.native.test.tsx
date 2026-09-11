/**
 * Nested Media + Platform Query Tests
 *
 * Verifies that media and platform modifiers can be chained in either order.
 * A chained clause applies only when both conditions are true.
 */

import { beforeAll, describe, expect, test } from 'vitest'

// Set TAMAGUI_TARGET before importing getSplitStyles
process.env.TAMAGUI_TARGET = 'native'

// Import directly from source so mocks apply
import { View, createTamagui } from '../web/src'
import { getSplitStyles } from '../web/src/helpers/getSplitStyles'

// Mock @tamagui/constants to simulate Android environment
vi.mock('@tamagui/constants', async () => {
  const actual = await vi.importActual('@tamagui/constants')
  return {
    ...actual,
    isAndroid: true,
    isIos: false,
    isTV: false,
    isWeb: false,
    isClient: true,
    currentPlatform: 'android',
    platformMatches: (name: string) => name === 'native' || name === 'android',
  }
})

import config from '../config-default'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig('native'))
})

function getSplitStylesFor(
  props: Record<string, any>,
  Component = View,
  mediaState?: Record<string, boolean>
) {
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
      noClass: true,
      // provide media state so nested media queries can be checked
      ...(mediaState ? { mediaState } : {}),
    },
    undefined,
    undefined,
    undefined,
    undefined
  )!
}

describe('Nested media + platform queries', () => {
  describe('platform modifier after media modifier', () => {
    test('xs:android applies on Android when xs is active', () => {
      const result = getSplitStylesFor(
        {
          backgroundColor: 'xs:orange xs:android:yellow',
        },
        View,
        { xs: true }
      )
      // Both conditions met: xs is active + we're on Android
      // Nested platform overrides the outer value
      expect(result.style?.backgroundColor).toBe('yellow')
    })

    test('xs:ios does NOT apply on Android', () => {
      const result = getSplitStylesFor(
        {
          backgroundColor: 'xs:orange xs:ios:yellow',
        },
        View,
        { xs: true }
      )
      // xs is active but ios doesn't match Android, so the xs clause applies.
      expect(result.style?.backgroundColor).toBe('orange')
    })

    test('xs:android does NOT apply when xs is inactive', () => {
      const result = getSplitStylesFor(
        {
          backgroundColor: 'xs:orange xs:android:yellow',
        },
        View,
        { xs: false }
      )
      // xs is not active, so neither the outer nor nested styles apply
      expect(result.style?.backgroundColor).toBeUndefined()
    })
  })

  describe('media modifier after platform modifier', () => {
    test('android:xs applies on Android when xs is active', () => {
      const result = getSplitStylesFor(
        {
          backgroundColor: 'android:green android:xs:red',
        },
        View,
        { xs: true }
      )
      // Both conditions met: platform is Android + xs is active
      // Nested media query overrides the outer value
      expect(result.style?.backgroundColor).toBe('red')
    })

    test('android:xs does NOT apply when xs is inactive', () => {
      const result = getSplitStylesFor(
        {
          backgroundColor: 'android:green android:xs:red',
        },
        View,
        { xs: false }
      )
      // Platform matches but xs is not active
      // Only the android clause applies.
      expect(result.style?.backgroundColor).toBe('green')
    })

    test('ios:xs does NOT apply on Android', () => {
      const result = getSplitStylesFor(
        {
          backgroundColor: 'ios:green ios:xs:red',
        },
        View,
        { xs: true }
      )
      // Platform doesn't match, nothing applies
      expect(result.style?.backgroundColor).toBeUndefined()
    })
  })

  describe('both modifier orders together', () => {
    test('the last equally specific clause wins when both conditions are met', () => {
      const result = getSplitStylesFor(
        {
          backgroundColor: 'xs:orange xs:android:yellow android:green android:xs:red',
        },
        View,
        { xs: true }
      )
      // Both chains have identical importance, so the last clause wins.
      expect(result.style?.backgroundColor).toBe('red')
    })

    test('non-nested properties from both apply independently', () => {
      const result = getSplitStylesFor(
        {
          opacity: 'xs:0.5',
          zIndex: 'xs:android:5 android:10',
          flex: 'android:xs:1',
        },
        View,
        { xs: true }
      )
      // All conditions met — all properties should apply
      expect(result.style?.opacity).toBe(0.5)
      // zIndex matches in both a chained clause (token 5 -> 500) and a later
      // android clause (10). Platform rank ties, then the deeper chain wins.
      expect(result.style?.zIndex).toBe(500)
      expect(result.style?.flex).toBe(1)
    })
  })

  describe('shorthand expansion in chained clauses', () => {
    test('shorthand with media:platform is expanded correctly', () => {
      const result = getSplitStylesFor(
        {
          bg: 'xs:android:yellow',
        },
        View,
        { xs: true }
      )
      // 'bg' shorthand should be expanded to 'backgroundColor'
      expect(result.style?.backgroundColor).toBe('yellow')
    })

    test('shorthand with platform:media is expanded correctly', () => {
      const result = getSplitStylesFor(
        {
          bg: 'android:xs:red',
        },
        View,
        { xs: true }
      )
      // 'bg' shorthand should be expanded to 'backgroundColor'
      expect(result.style?.backgroundColor).toBe('red')
    })
  })
})
