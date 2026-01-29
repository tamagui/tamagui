/**
 * Web Alignment Tests - Native Platform
 *
 * These tests verify that on native, web-standard props (aria-*, role, onClick)
 * are correctly mapped to their React Native equivalents.
 *
 * The key insight: Users write web props, native runtime maps them to RN props.
 */

import { View, createTamagui, getSplitStyles } from '@tamagui/core'
import { beforeAll, describe, expect, test } from 'vitest'

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

describe('Web Alignment - Native Accessibility Mapping', () => {
  describe('Web aria-* props should map to RN accessibilityX props', () => {
    test('aria-label maps to accessibilityLabel on native', () => {
      const result = getSplitStylesFor({
        'aria-label': 'Test label',
      })

      // On native, aria-label should be converted to accessibilityLabel
      // This happens in createOptimizedView.native.tsx
      expect(result.viewProps['aria-label']).toBe('Test label')
    })

    test('role maps correctly on native', () => {
      const result = getSplitStylesFor({
        role: 'button',
      })

      // role should be passed through (createOptimizedView.native handles conversion)
      expect(result.viewProps.role).toBe('button')
    })

    test('aria-hidden is passed through on native', () => {
      const result = getSplitStylesFor({
        'aria-hidden': true,
      })

      expect(result.viewProps['aria-hidden']).toBe(true)
    })

    test('aria-disabled is passed through on native', () => {
      const result = getSplitStylesFor({
        'aria-disabled': true,
      })

      expect(result.viewProps['aria-disabled']).toBe(true)
    })

    test('aria-checked is passed through on native', () => {
      const result = getSplitStylesFor({
        'aria-checked': true,
      })

      expect(result.viewProps['aria-checked']).toBe(true)
    })

    test('aria-expanded is passed through on native', () => {
      const result = getSplitStylesFor({
        'aria-expanded': true,
      })

      expect(result.viewProps['aria-expanded']).toBe(true)
    })

    test('aria-selected is passed through on native', () => {
      const result = getSplitStylesFor({
        'aria-selected': true,
      })

      expect(result.viewProps['aria-selected']).toBe(true)
    })

    test('aria-busy is passed through on native', () => {
      const result = getSplitStylesFor({
        'aria-busy': true,
      })

      expect(result.viewProps['aria-busy']).toBe(true)
    })

    test('aria-live is passed through on native', () => {
      const result = getSplitStylesFor({
        'aria-live': 'polite',
      })

      expect(result.viewProps['aria-live']).toBe('polite')
    })

    test('aria-valuemin/max/now/text are passed through on native', () => {
      const result = getSplitStylesFor({
        'aria-valuemin': 0,
        'aria-valuemax': 100,
        'aria-valuenow': 50,
        'aria-valuetext': '50%',
      })

      expect(result.viewProps['aria-valuemin']).toBe(0)
      expect(result.viewProps['aria-valuemax']).toBe(100)
      expect(result.viewProps['aria-valuenow']).toBe(50)
      expect(result.viewProps['aria-valuetext']).toBe('50%')
    })

    test('id is passed through on native', () => {
      const result = getSplitStylesFor({
        id: 'my-element',
      })

      expect(result.viewProps.id).toBe('my-element')
    })
  })

  describe('RN accessibility props are NOT converted (v2)', () => {
    // These tests verify that RN-specific props are NOT converted
    // Users should use web-standard aria-* props instead

    test('accessibilityLabel is NOT converted (use aria-label)', () => {
      const result = getSplitStylesFor({
        accessibilityLabel: 'Test label',
      })

      // accessibilityLabel is no longer converted - use aria-label instead
      expect(result.viewProps['aria-label']).toBeUndefined()
    })

    test('accessibilityRole is NOT converted (use role)', () => {
      const result = getSplitStylesFor({
        accessibilityRole: 'button',
      })

      // accessibilityRole is no longer converted - use role instead
      expect(result.viewProps.role).toBeUndefined()
    })
  })
})

describe('Web Alignment - Native Focus Mapping', () => {
  describe('Web tabIndex should map to native focusable', () => {
    test('tabIndex={0} is passed through on native', () => {
      const result = getSplitStylesFor({
        tabIndex: 0,
      })

      // tabIndex is converted to focusable in createOptimizedView.native.tsx
      expect(result.viewProps.tabIndex).toBe(0)
    })

    test('tabIndex={-1} is passed through on native', () => {
      const result = getSplitStylesFor({
        tabIndex: -1,
      })

      expect(result.viewProps.tabIndex).toBe(-1)
    })
  })

  describe('RN focusable prop is NOT converted (v2)', () => {
    test('focusable is NOT converted (use tabIndex)', () => {
      const result = getSplitStylesFor({
        focusable: true,
      })

      // focusable is no longer converted - use tabIndex instead
      expect(result.viewProps.tabIndex).toBeUndefined()
    })
  })
})

describe('Web Alignment - Native Event Mapping', () => {
  describe('Web event props should work on native (after migration)', () => {
    // IMPORTANT: Currently, web event props (onClick, onPointerDown, etc.) are
    // filtered out on native via webPropsToSkip.native.ts
    // After migration, we need to:
    // 1. Remove these from webPropsToSkip.native.ts
    // 2. Add mapping in createComponent/createOptimizedView to convert onClick → onPress

    test.fails(
      'onClick should be passed through on native (needs migration: currently filtered)',
      () => {
        const handler = () => {}
        const result = getSplitStylesFor({
          onClick: handler,
        })

        // After migration, onClick should pass through and be mapped to onPress
        expect(result.viewProps.onClick).toBe(handler)
      }
    )

    test.fails(
      'onPointerDown should be passed through on native (needs migration: currently filtered)',
      () => {
        const handler = () => {}
        const result = getSplitStylesFor({
          onPointerDown: handler,
        })

        expect(result.viewProps.onPointerDown).toBe(handler)
      }
    )

    test.fails(
      'onPointerUp should be passed through on native (needs migration: currently filtered)',
      () => {
        const handler = () => {}
        const result = getSplitStylesFor({
          onPointerUp: handler,
        })

        expect(result.viewProps.onPointerUp).toBe(handler)
      }
    )
  })

  describe('RN event props still work (kept for cross-platform compatibility)', () => {
    test('onPress is passed through on native', () => {
      const handler = () => {}
      const result = getSplitStylesFor({
        onPress: handler,
      })

      // onPress is kept for cross-platform compatibility
      expect(result.viewProps.onPress).toBe(handler)
    })

    test('onPressIn is passed through on native', () => {
      const handler = () => {}
      const result = getSplitStylesFor({
        onPressIn: handler,
      })

      expect(result.viewProps.onPressIn).toBe(handler)
    })

    test('onPressOut is passed through on native', () => {
      const handler = () => {}
      const result = getSplitStylesFor({
        onPressOut: handler,
      })

      expect(result.viewProps.onPressOut).toBe(handler)
    })
  })
})

describe('Web Alignment - Native Shadow Props', () => {
  describe('boxShadow should work on native (RN 0.76+)', () => {
    test('boxShadow string is passed through directly on native', () => {
      const result = getSplitStylesFor({
        boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
      })

      // boxShadow strings are passed through directly to RN 0.76+ which handles CSS syntax
      expect(result.style?.boxShadow).toBe('0 2px 10px rgba(0,0,0,0.5)')
    })
  })

  describe('Legacy shadow props should NOT work after migration', () => {
    test.fails('shadowColor should be ignored after migration', () => {
      const result = getSplitStylesFor({
        shadowColor: 'black',
      })

      // After migration, users should use boxShadow
      expect(result.style?.shadowColor).toBeUndefined()
    })

    test.fails('shadowOffset should be ignored after migration', () => {
      const result = getSplitStylesFor({
        shadowOffset: { width: 0, height: 2 },
      })

      expect(result.style?.shadowOffset).toBeUndefined()
    })

    test.fails('shadowOpacity should be ignored after migration', () => {
      const result = getSplitStylesFor({
        shadowOpacity: 0.5,
      })

      expect(result.style?.shadowOpacity).toBeUndefined()
    })

    test.fails('shadowRadius should be ignored after migration', () => {
      const result = getSplitStylesFor({
        shadowRadius: 10,
      })

      expect(result.style?.shadowRadius).toBeUndefined()
    })
  })
})
