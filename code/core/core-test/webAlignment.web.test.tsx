/**
 * Web Alignment Tests - Web Platform
 *
 * These tests verify that Tamagui v2 uses web-standard props exclusively.
 * RN-specific accessibility props are no longer converted - use aria-* directly.
 */

import { View, Text, View, createTamagui } from '@tamagui/core'
import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'
import { simplifiedGetSplitStyles } from './utils'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig())
})

describe('Web Alignment - Accessibility Props', () => {
  describe('Web props should work (aria-*, role)', () => {
    test('aria-label is passed through to viewProps', () => {
      const { viewProps } = simplifiedGetSplitStyles(View, {
        'aria-label': 'Test label',
      })

      expect(viewProps['aria-label']).toBe('Test label')
    })

    test('aria-labelledby is passed through to viewProps', () => {
      const { viewProps } = simplifiedGetSplitStyles(View, {
        'aria-labelledby': 'label-id',
      })

      expect(viewProps['aria-labelledby']).toBe('label-id')
    })

    test('aria-describedby is passed through to viewProps', () => {
      const { viewProps } = simplifiedGetSplitStyles(View, {
        'aria-describedby': 'desc-id',
      })

      expect(viewProps['aria-describedby']).toBe('desc-id')
    })

    test('role is passed through to viewProps', () => {
      const { viewProps } = simplifiedGetSplitStyles(View, {
        role: 'button',
      })

      expect(viewProps.role).toBe('button')
    })

    test('aria-hidden is passed through to viewProps', () => {
      const { viewProps } = simplifiedGetSplitStyles(View, {
        'aria-hidden': true,
      })

      expect(viewProps['aria-hidden']).toBe(true)
    })

    test('aria-disabled is passed through to viewProps', () => {
      const { viewProps } = simplifiedGetSplitStyles(View, {
        'aria-disabled': true,
      })

      expect(viewProps['aria-disabled']).toBe(true)
    })

    test('aria-checked is passed through to viewProps', () => {
      const { viewProps } = simplifiedGetSplitStyles(View, {
        'aria-checked': true,
      })

      expect(viewProps['aria-checked']).toBe(true)
    })

    test('aria-expanded is passed through to viewProps', () => {
      const { viewProps } = simplifiedGetSplitStyles(View, {
        'aria-expanded': true,
      })

      expect(viewProps['aria-expanded']).toBe(true)
    })

    test('aria-selected is passed through to viewProps', () => {
      const { viewProps } = simplifiedGetSplitStyles(View, {
        'aria-selected': true,
      })

      expect(viewProps['aria-selected']).toBe(true)
    })

    test('aria-busy is passed through to viewProps', () => {
      const { viewProps } = simplifiedGetSplitStyles(View, {
        'aria-busy': true,
      })

      expect(viewProps['aria-busy']).toBe(true)
    })

    test('aria-live is passed through to viewProps', () => {
      const { viewProps } = simplifiedGetSplitStyles(View, {
        'aria-live': 'polite',
      })

      expect(viewProps['aria-live']).toBe('polite')
    })

    test('aria-modal is passed through to viewProps', () => {
      const { viewProps } = simplifiedGetSplitStyles(View, {
        'aria-modal': true,
      })

      expect(viewProps['aria-modal']).toBe(true)
    })

    test('aria-valuemin/max/now/text are passed through to viewProps', () => {
      const { viewProps } = simplifiedGetSplitStyles(View, {
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
      const { viewProps } = simplifiedGetSplitStyles(View, {
        id: 'my-element',
      })

      expect(viewProps.id).toBe('my-element')
    })
  })

  describe('RN accessibility props are NOT converted (v2)', () => {
    test('accessibilityLabel is NOT converted to aria-label', () => {
      const { viewProps } = simplifiedGetSplitStyles(View, {
        accessibilityLabel: 'Test label',
      })

      // RN props are no longer converted - use aria-label directly
      expect(viewProps['aria-label']).toBeUndefined()
    })

    test('accessibilityRole is NOT converted to role', () => {
      const { viewProps } = simplifiedGetSplitStyles(View, {
        accessibilityRole: 'button',
      })

      // RN props are no longer converted - use role directly
      expect(viewProps.role).toBeUndefined()
    })

    test('accessibilityLabelledBy is NOT converted to aria-labelledby', () => {
      const { viewProps } = simplifiedGetSplitStyles(View, {
        accessibilityLabelledBy: 'label-id',
      })

      expect(viewProps['aria-labelledby']).toBeUndefined()
    })

    test('accessibilityHint is NOT converted to aria-describedby', () => {
      const { viewProps } = simplifiedGetSplitStyles(View, {
        accessibilityHint: 'Test hint',
      })

      expect(viewProps['aria-describedby']).toBeUndefined()
    })

    test('accessibilityElementsHidden is NOT converted to aria-hidden', () => {
      const { viewProps } = simplifiedGetSplitStyles(View, {
        accessibilityElementsHidden: true,
      })

      expect(viewProps['aria-hidden']).toBeUndefined()
    })

    test('nativeID is NOT converted to id (use id instead)', () => {
      const { viewProps } = simplifiedGetSplitStyles(View, {
        nativeID: 'my-element',
      })

      // nativeID is no longer converted - use id directly
      expect(viewProps.id).toBeUndefined()
    })
  })
})

describe('Web Alignment - Focus Props', () => {
  describe('Web props should work (tabIndex)', () => {
    test('tabIndex={0} makes element focusable', () => {
      const { viewProps } = simplifiedGetSplitStyles(View, {
        tabIndex: 0,
      })

      expect(viewProps.tabIndex).toBe(0)
    })

    test('tabIndex={-1} makes element not focusable', () => {
      const { viewProps } = simplifiedGetSplitStyles(View, {
        tabIndex: -1,
      })

      expect(viewProps.tabIndex).toBe(-1)
    })
  })

  describe('RN focus props are NOT converted (v2)', () => {
    test('focusable is NOT converted (use tabIndex instead)', () => {
      const { viewProps } = simplifiedGetSplitStyles(View, {
        focusable: true,
      })

      // focusable is no longer converted - use tabIndex directly
      expect(viewProps.tabIndex).toBeUndefined()
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
      const { viewProps } = simplifiedGetSplitStyles(View, {
        onClick: handler,
      })

      expect(viewProps.onClick).toBe(handler)
    })

    test('onPointerDown is passed through to viewProps', () => {
      const handler = () => {}
      const { viewProps } = simplifiedGetSplitStyles(View, {
        onPointerDown: handler,
      })

      expect(viewProps.onPointerDown).toBe(handler)
    })

    test('onPointerUp is passed through to viewProps', () => {
      const handler = () => {}
      const { viewProps } = simplifiedGetSplitStyles(View, {
        onPointerUp: handler,
      })

      expect(viewProps.onPointerUp).toBe(handler)
    })

    test('onMouseEnter is passed through to viewProps', () => {
      const handler = () => {}
      const { viewProps } = simplifiedGetSplitStyles(View, {
        onMouseEnter: handler,
      })

      expect(viewProps.onMouseEnter).toBe(handler)
    })

    test('onMouseLeave is passed through to viewProps', () => {
      const handler = () => {}
      const { viewProps } = simplifiedGetSplitStyles(View, {
        onMouseLeave: handler,
      })

      expect(viewProps.onMouseLeave).toBe(handler)
    })
  })

  describe('RN event props still work (kept for cross-platform compatibility)', () => {
    test('onPress is passed through to viewProps', () => {
      const handler = () => {}
      const { viewProps } = simplifiedGetSplitStyles(View, {
        onPress: handler,
      })

      // onPress is kept for cross-platform compatibility
      expect(viewProps.onPress).toBe(handler)
    })

    test('onPressIn is passed through to viewProps', () => {
      const handler = () => {}
      const { viewProps } = simplifiedGetSplitStyles(View, {
        onPressIn: handler,
      })

      expect(viewProps.onPressIn).toBe(handler)
    })

    test('onPressOut is passed through to viewProps', () => {
      const handler = () => {}
      const { viewProps } = simplifiedGetSplitStyles(View, {
        onPressOut: handler,
      })

      expect(viewProps.onPressOut).toBe(handler)
    })
  })
})

describe('Web Alignment - Shadow Props', () => {
  describe('Web props should work (boxShadow)', () => {
    test('boxShadow string is applied correctly', () => {
      const { rulesToInsert } = simplifiedGetSplitStyles(View, {
        boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
      })

      const boxShadowRule = Object.values(rulesToInsert).find(
        (rule: any) => rule[0] === 'boxShadow'
      )
      expect(boxShadowRule).toBeDefined()
    })
  })

  describe('RN shadow props should NOT work after migration', () => {
    // Note: These currently get converted to boxShadow, which is the desired behavior
    // But in v2, we want users to use boxShadow directly
    // For now, we may keep the conversion as a convenience, or deprecate it

    test.skip('shadowColor/shadowOffset/shadowOpacity/shadowRadius should be deprecated', () => {
      // This is more of a documentation test - the actual behavior may still work
      // but we want to discourage usage via deprecation warnings
    })
  })
})
