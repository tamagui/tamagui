/**
 * Web Alignment Tests - Web Platform
 *
 * These tests verify that Tamagui v2 uses web-standard props exclusively.
 * After the migration, RN-specific props should not be supported.
 *
 * Test categories:
 * 1. Web props work correctly (should PASS now and after migration)
 * 2. RN props should NOT work (should FAIL now, PASS after migration)
 */

import { Stack, Text, View, createTamagui } from '@tamagui/core'
import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'
import { simplifiedGetSplitStyles } from './utils'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig())
})

describe('Web Alignment - Accessibility Props', () => {
  describe('Web props should work (aria-*, role)', () => {
    test('aria-label is passed through to viewProps', () => {
      const { viewProps } = simplifiedGetSplitStyles(Stack, {
        'aria-label': 'Test label',
      })

      expect(viewProps['aria-label']).toBe('Test label')
    })

    test('aria-labelledby is passed through to viewProps', () => {
      const { viewProps } = simplifiedGetSplitStyles(Stack, {
        'aria-labelledby': 'label-id',
      })

      expect(viewProps['aria-labelledby']).toBe('label-id')
    })

    test('aria-describedby is passed through to viewProps', () => {
      const { viewProps } = simplifiedGetSplitStyles(Stack, {
        'aria-describedby': 'desc-id',
      })

      expect(viewProps['aria-describedby']).toBe('desc-id')
    })

    test('role is passed through to viewProps', () => {
      const { viewProps } = simplifiedGetSplitStyles(Stack, {
        role: 'button',
      })

      expect(viewProps.role).toBe('button')
    })

    test('aria-hidden is passed through to viewProps', () => {
      const { viewProps } = simplifiedGetSplitStyles(Stack, {
        'aria-hidden': true,
      })

      expect(viewProps['aria-hidden']).toBe(true)
    })

    test('aria-disabled is passed through to viewProps', () => {
      const { viewProps } = simplifiedGetSplitStyles(Stack, {
        'aria-disabled': true,
      })

      expect(viewProps['aria-disabled']).toBe(true)
    })

    test('aria-checked is passed through to viewProps', () => {
      const { viewProps } = simplifiedGetSplitStyles(Stack, {
        'aria-checked': true,
      })

      expect(viewProps['aria-checked']).toBe(true)
    })

    test('aria-expanded is passed through to viewProps', () => {
      const { viewProps } = simplifiedGetSplitStyles(Stack, {
        'aria-expanded': true,
      })

      expect(viewProps['aria-expanded']).toBe(true)
    })

    test('aria-selected is passed through to viewProps', () => {
      const { viewProps } = simplifiedGetSplitStyles(Stack, {
        'aria-selected': true,
      })

      expect(viewProps['aria-selected']).toBe(true)
    })

    test('aria-busy is passed through to viewProps', () => {
      const { viewProps } = simplifiedGetSplitStyles(Stack, {
        'aria-busy': true,
      })

      expect(viewProps['aria-busy']).toBe(true)
    })

    test('aria-live is passed through to viewProps', () => {
      const { viewProps } = simplifiedGetSplitStyles(Stack, {
        'aria-live': 'polite',
      })

      expect(viewProps['aria-live']).toBe('polite')
    })

    test('aria-modal is passed through to viewProps', () => {
      const { viewProps } = simplifiedGetSplitStyles(Stack, {
        'aria-modal': true,
      })

      expect(viewProps['aria-modal']).toBe(true)
    })

    test('aria-valuemin/max/now/text are passed through to viewProps', () => {
      const { viewProps } = simplifiedGetSplitStyles(Stack, {
        'aria-valuemin': 0,
        'aria-valuemax': 100,
        'aria-valuenow': 50,
        'aria-valuetext': '50%',
      })

      expect(viewProps['aria-valuemin']).toBe(0)
      expect(viewProps['aria-valuemax']).toBe(100)
      expect(viewProps['aria-valuenow']).toBe(50)
      expect(viewProps['aria-valuetext']).toBe('50%')
    })

    test('id is passed through to viewProps', () => {
      const { viewProps } = simplifiedGetSplitStyles(Stack, {
        id: 'my-element',
      })

      expect(viewProps.id).toBe('my-element')
    })
  })

  describe('RN accessibility props are removed in v2', () => {
    test('accessibilityLabel is NOT converted to aria-label (removed in v2)', () => {
      const { viewProps } = simplifiedGetSplitStyles(Stack, {
        accessibilityLabel: 'Test label',
      })

      // v2: This prop is ignored entirely - use aria-label instead
      expect(viewProps['aria-label']).toBeUndefined()
      expect(viewProps.accessibilityLabel).toBeUndefined()
    })

    test('accessibilityRole is NOT converted to role (removed in v2)', () => {
      const { viewProps } = simplifiedGetSplitStyles(Stack, {
        accessibilityRole: 'button',
      })

      // v2: This prop is ignored entirely - use role instead
      expect(viewProps.role).toBeUndefined()
      expect(viewProps.accessibilityRole).toBeUndefined()
    })

    test('accessibilityLabelledBy is NOT converted to aria-labelledby (removed in v2)', () => {
      const { viewProps } = simplifiedGetSplitStyles(Stack, {
        accessibilityLabelledBy: 'label-id',
      })

      // v2: This prop is ignored entirely - use aria-labelledby instead
      expect(viewProps['aria-labelledby']).toBeUndefined()
      expect(viewProps.accessibilityLabelledBy).toBeUndefined()
    })

    test('accessibilityHint is NOT converted (removed in v2)', () => {
      const { viewProps } = simplifiedGetSplitStyles(Stack, {
        accessibilityHint: 'Test hint',
      })

      // v2: This prop is ignored entirely - use aria-describedby instead
      expect(viewProps['aria-describedby']).toBeUndefined()
      expect(viewProps.accessibilityHint).toBeUndefined()
    })

    test('accessibilityElementsHidden is NOT converted (removed in v2)', () => {
      const { viewProps } = simplifiedGetSplitStyles(Stack, {
        accessibilityElementsHidden: true,
      })

      // v2: This prop is ignored entirely - use aria-hidden instead
      expect(viewProps['aria-hidden']).toBeUndefined()
      expect(viewProps.accessibilityElementsHidden).toBeUndefined()
    })

    test('accessibilityLiveRegion is NOT converted (removed in v2)', () => {
      const { viewProps } = simplifiedGetSplitStyles(Stack, {
        accessibilityLiveRegion: 'polite',
      })

      // v2: This prop is ignored entirely - use aria-live instead
      expect(viewProps['aria-live']).toBeUndefined()
      expect(viewProps.accessibilityLiveRegion).toBeUndefined()
    })

    test('accessibilityState is NOT converted (removed in v2)', () => {
      const { viewProps } = simplifiedGetSplitStyles(Stack, {
        accessibilityState: { checked: true, disabled: true },
      })

      // v2: This prop is ignored entirely - use aria-checked, aria-disabled instead
      expect(viewProps['aria-checked']).toBeUndefined()
      expect(viewProps['aria-disabled']).toBeUndefined()
      expect(viewProps.accessibilityState).toBeUndefined()
    })

    test('accessibilityValue is NOT converted (removed in v2)', () => {
      const { viewProps } = simplifiedGetSplitStyles(Stack, {
        accessibilityValue: { min: 0, max: 100, now: 50 },
      })

      // v2: This prop is ignored entirely - use aria-valuemin, aria-valuemax, aria-valuenow instead
      expect(viewProps['aria-valuemin']).toBeUndefined()
      expect(viewProps['aria-valuemax']).toBeUndefined()
      expect(viewProps['aria-valuenow']).toBeUndefined()
      expect(viewProps.accessibilityValue).toBeUndefined()
    })

    test('nativeID is NOT converted (removed in v2, use id instead)', () => {
      const { viewProps } = simplifiedGetSplitStyles(Stack, {
        nativeID: 'my-element',
      })

      // v2: nativeID is ignored entirely - use id instead
      expect(viewProps.id).toBeUndefined()
      expect(viewProps.nativeID).toBeUndefined()
    })

    test('accessible is NOT converted (removed in v2, use tabIndex instead)', () => {
      const { viewProps } = simplifiedGetSplitStyles(Stack, {
        accessible: true,
      })

      // v2: accessible is ignored entirely - use tabIndex={0} instead
      expect(viewProps.tabIndex).toBeUndefined()
      expect(viewProps.accessible).toBeUndefined()
    })
  })
})

describe('Web Alignment - Focus Props', () => {
  describe('Web props should work (tabIndex)', () => {
    test('tabIndex={0} makes element focusable', () => {
      const { viewProps } = simplifiedGetSplitStyles(
        Stack,
        {
          tabIndex: 0,
        },
        { tag: 'div' }
      )

      expect(viewProps.tabIndex).toBe(0)
    })

    test('tabIndex={-1} makes element not focusable', () => {
      const { viewProps } = simplifiedGetSplitStyles(
        Stack,
        {
          tabIndex: -1,
        },
        { tag: 'div' }
      )

      expect(viewProps.tabIndex).toBe(-1)
    })
  })

  describe('RN focus props are removed in v2', () => {
    test('focusable is NOT converted (removed in v2, use tabIndex instead)', () => {
      const { viewProps } = simplifiedGetSplitStyles(
        Stack,
        {
          focusable: true,
        },
        { tag: 'div' }
      )

      // v2: focusable is ignored entirely - use tabIndex instead
      expect(viewProps.tabIndex).toBeUndefined()
      expect(viewProps.focusable).toBeUndefined()
    })
  })
})

describe('Web Alignment - Event Handlers', () => {
  // Note: Event handler tests need to be done at the createComponent level
  // since getSplitStyles doesn't handle event attachment
  // These tests verify the props are passed through

  describe('Web event props should work', () => {
    test('onClick is passed through to viewProps', () => {
      const handler = () => {}
      const { viewProps } = simplifiedGetSplitStyles(Stack, {
        onClick: handler,
      })

      expect(viewProps.onClick).toBe(handler)
    })

    test('onPointerDown is passed through to viewProps', () => {
      const handler = () => {}
      const { viewProps } = simplifiedGetSplitStyles(Stack, {
        onPointerDown: handler,
      })

      expect(viewProps.onPointerDown).toBe(handler)
    })

    test('onPointerUp is passed through to viewProps', () => {
      const handler = () => {}
      const { viewProps } = simplifiedGetSplitStyles(Stack, {
        onPointerUp: handler,
      })

      expect(viewProps.onPointerUp).toBe(handler)
    })

    test('onMouseEnter is passed through to viewProps', () => {
      const handler = () => {}
      const { viewProps } = simplifiedGetSplitStyles(Stack, {
        onMouseEnter: handler,
      })

      expect(viewProps.onMouseEnter).toBe(handler)
    })

    test('onMouseLeave is passed through to viewProps', () => {
      const handler = () => {}
      const { viewProps } = simplifiedGetSplitStyles(Stack, {
        onMouseLeave: handler,
      })

      expect(viewProps.onMouseLeave).toBe(handler)
    })
  })

  // TODO: RN event props deprecation tests to be added back
  // - onPress, onPressIn, onPressOut should be deprecated
})

// TODO: Shadow props tests need investigation - boxShadow not generating CSS rules
// - boxShadow string should be applied correctly
// - RN shadow props (shadowColor, etc.) should be deprecated
