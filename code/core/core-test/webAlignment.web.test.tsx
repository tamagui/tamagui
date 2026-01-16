/**
 * Web Alignment Tests - Web Platform
 *
 * These tests verify that Tamagui v2 uses web-standard props exclusively.
 * RN-specific props are removed and should not work.
 */

import { Stack, createTamagui } from '@tamagui/core'
import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'
import { simplifiedGetSplitStyles } from './utils'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig())
})

describe('Web Alignment - Accessibility Props', () => {
  describe('Web props pass through correctly (aria-*, role)', () => {
    test.each([
      ['aria-label', 'Test label'],
      ['aria-labelledby', 'label-id'],
      ['aria-describedby', 'desc-id'],
      ['role', 'button'],
      ['aria-hidden', true],
      ['aria-disabled', true],
      ['aria-checked', true],
      ['aria-expanded', true],
      ['aria-selected', true],
      ['aria-modal', true],
      ['aria-live', 'polite'],
    ])('%s passes through to viewProps', (prop, value) => {
      const { viewProps } = simplifiedGetSplitStyles(Stack, { [prop]: value })
      expect(viewProps[prop]).toBe(value)
    })

    test('aria-value props pass through together', () => {
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

    test('id passes through to viewProps', () => {
      const { viewProps } = simplifiedGetSplitStyles(Stack, { id: 'my-element' })
      expect(viewProps.id).toBe('my-element')
    })
  })

  describe('RN accessibility props are removed in v2', () => {
    test.each([
      ['accessibilityLabel', 'aria-label'],
      ['accessibilityRole', 'role'],
      ['accessibilityLabelledBy', 'aria-labelledby'],
      ['accessibilityHint', 'aria-describedby'],
      ['accessibilityElementsHidden', 'aria-hidden'],
      ['accessibilityLiveRegion', 'aria-live'],
      ['nativeID', 'id'],
      ['accessible', 'tabIndex'],
    ])('%s is ignored (use %s instead)', (removedProp) => {
      const { viewProps } = simplifiedGetSplitStyles(Stack, { [removedProp]: 'test' })
      expect(viewProps[removedProp]).toBeUndefined()
    })

    test('accessibilityState is ignored (use aria-checked, aria-disabled, etc)', () => {
      const { viewProps } = simplifiedGetSplitStyles(Stack, {
        accessibilityState: { checked: true, disabled: true },
      })
      expect(viewProps.accessibilityState).toBeUndefined()
      expect(viewProps['aria-checked']).toBeUndefined()
      expect(viewProps['aria-disabled']).toBeUndefined()
    })

    test('accessibilityValue is ignored (use aria-valuemin, aria-valuemax, etc)', () => {
      const { viewProps } = simplifiedGetSplitStyles(Stack, {
        accessibilityValue: { min: 0, max: 100, now: 50 },
      })
      expect(viewProps.accessibilityValue).toBeUndefined()
      expect(viewProps['aria-valuemin']).toBeUndefined()
    })
  })
})

describe('Web Alignment - Focus Props', () => {
  test.each([
    [0, 0],
    [-1, -1],
  ])('tabIndex={%s} passes through correctly', (input, expected) => {
    const { viewProps } = simplifiedGetSplitStyles(Stack, { tabIndex: input }, { tag: 'div' })
    expect(viewProps.tabIndex).toBe(expected)
  })

  test('focusable is ignored (use tabIndex instead)', () => {
    const { viewProps } = simplifiedGetSplitStyles(Stack, { focusable: true }, { tag: 'div' })
    expect(viewProps.focusable).toBeUndefined()
    expect(viewProps.tabIndex).toBeUndefined()
  })
})
