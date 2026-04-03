/**
 * Nested Media + Platform Query Tests
 *
 * Verifies that media queries and platform queries can be nested inside each other.
 *
 * Examples:
 *   $xs={{ "$platform-android": { bg: "yellow" } }}  — platform inside media
 *   $platform-android={{ $xs: { bg: "red" } }}       — media inside platform
 *
 * Both directions should work and the nested condition should be checked.
 * The nested style should only apply when BOTH conditions are true.
 */

import { View, createTamagui } from '@tamagui/core'
import { beforeAll, describe, expect, test } from 'vitest'

// Set TAMAGUI_TARGET before importing getSplitStyles
process.env.TAMAGUI_TARGET = 'native'

// Import directly from source so mocks apply
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
  describe('platform query nested inside media query', () => {
    test('$xs with nested $platform-android applies on Android when xs is active', () => {
      const result = getSplitStylesFor(
        {
          $xs: {
            backgroundColor: 'orange',
            '$platform-android': {
              backgroundColor: 'yellow',
            },
          },
        },
        View,
        { xs: true }
      )
      // Both conditions met: xs is active + we're on Android
      // Nested platform overrides the outer value
      expect(result.style?.backgroundColor).toBe('yellow')
    })

    test('$xs with nested $platform-ios does NOT apply on Android', () => {
      const result = getSplitStylesFor(
        {
          $xs: {
            backgroundColor: 'orange',
            '$platform-ios': {
              backgroundColor: 'yellow',
            },
          },
        },
        View,
        { xs: true }
      )
      // xs is active but $platform-ios doesn't match Android
      // Only the outer $xs style applies
      expect(result.style?.backgroundColor).toBe('orange')
    })

    test('$xs with nested $platform-android does NOT apply when xs is inactive', () => {
      const result = getSplitStylesFor(
        {
          $xs: {
            backgroundColor: 'orange',
            '$platform-android': {
              backgroundColor: 'yellow',
            },
          },
        },
        View,
        { xs: false }
      )
      // xs is not active, so neither the outer nor nested styles apply
      expect(result.style?.backgroundColor).toBeUndefined()
    })
  })

  describe('media query nested inside platform query', () => {
    test('$platform-android with nested $xs applies on Android when xs is active', () => {
      const result = getSplitStylesFor(
        {
          '$platform-android': {
            backgroundColor: 'green',
            $xs: {
              backgroundColor: 'red',
            },
          },
        },
        View,
        { xs: true }
      )
      // Both conditions met: platform is Android + xs is active
      // Nested media query overrides the outer value
      expect(result.style?.backgroundColor).toBe('red')
    })

    test('$platform-android with nested $xs does NOT apply when xs is inactive', () => {
      const result = getSplitStylesFor(
        {
          '$platform-android': {
            backgroundColor: 'green',
            $xs: {
              backgroundColor: 'red',
            },
          },
        },
        View,
        { xs: false }
      )
      // Platform matches but xs is not active
      // Only the outer $platform-android style applies
      expect(result.style?.backgroundColor).toBe('green')
    })

    test('$platform-ios with nested $xs does NOT apply on Android', () => {
      const result = getSplitStylesFor(
        {
          '$platform-ios': {
            backgroundColor: 'green',
            $xs: {
              backgroundColor: 'red',
            },
          },
        },
        View,
        { xs: true }
      )
      // Platform doesn't match, nothing applies
      expect(result.style?.backgroundColor).toBeUndefined()
    })
  })

  describe('interchangeable nesting — both directions used together', () => {
    test('last-declared nested style wins when both conditions are met', () => {
      const result = getSplitStylesFor(
        {
          $xs: {
            backgroundColor: 'orange',
            '$platform-android': {
              backgroundColor: 'yellow',
            },
          },
          '$platform-android': {
            backgroundColor: 'green',
            $xs: {
              backgroundColor: 'red',
            },
          },
        },
        View,
        { xs: true }
      )
      // Both nesting directions have their conditions met and produce
      // identical importance (symmetric). Since $platform-android is declared
      // last in the props object, its nested $xs wins by declaration order.
      expect(result.style?.backgroundColor).toBe('red')
    })

    test('non-nested properties from both apply independently', () => {
      const result = getSplitStylesFor(
        {
          $xs: {
            opacity: 0.5,
            '$platform-android': {
              zIndex: 5,
            },
          },
          '$platform-android': {
            zIndex: 10,
            $xs: {
              flex: 1,
            },
          },
        },
        View,
        { xs: true }
      )
      // All conditions met — all properties should apply
      expect(result.style?.opacity).toBe(0.5)
      // zIndex is set in both nested contexts: $xs.$platform-android (5) and
      // $platform-android non-nested (10). The nested value (5) has higher
      // importance than the non-nested outer value, so 5 wins.
      expect(result.style?.zIndex).toBe(5)
      expect(result.style?.flex).toBe(1)
    })
  })

  describe('shorthand expansion in nested queries', () => {
    test('shorthands in nested platform query are expanded correctly', () => {
      const result = getSplitStylesFor(
        {
          $xs: {
            '$platform-android': {
              bg: 'yellow',
            },
          },
        },
        View,
        { xs: true }
      )
      // 'bg' shorthand should be expanded to 'backgroundColor'
      expect(result.style?.backgroundColor).toBe('yellow')
    })

    test('shorthands in nested media query are expanded correctly', () => {
      const result = getSplitStylesFor(
        {
          '$platform-android': {
            $xs: {
              bg: 'red',
            },
          },
        },
        View,
        { xs: true }
      )
      // 'bg' shorthand should be expanded to 'backgroundColor'
      expect(result.style?.backgroundColor).toBe('red')
    })
  })
})
