/**
 * Web Alignment Tests - Native Platform
 *
 * These tests verify that web-standard props (aria-*, role, tabIndex)
 * pass through getSplitStyles correctly on native.
 *
 * Note: The actual conversion from web props to RN props (e.g., aria-label → accessibilityLabel)
 * happens in createOptimizedView.native.tsx at render time.
 */

import { Stack, createTamagui, getSplitStyles } from '@tamagui/core'
import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig('native'))
})

function getSplitStylesFor(props: Record<string, any>, Component = Stack) {
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

describe('Web Alignment - Native Props Pass-Through', () => {
  describe('Web aria-* props pass through getSplitStyles', () => {
    test('aria-label passes through to viewProps', () => {
      const result = getSplitStylesFor({
        'aria-label': 'Test label',
      })

      expect(result.viewProps['aria-label']).toBe('Test label')
    })

    test('role passes through to viewProps', () => {
      const result = getSplitStylesFor({
        role: 'button',
      })

      expect(result.viewProps.role).toBe('button')
    })

    test('aria-hidden passes through to viewProps', () => {
      const result = getSplitStylesFor({
        'aria-hidden': true,
      })

      expect(result.viewProps['aria-hidden']).toBe(true)
    })

    test('aria-disabled passes through to viewProps', () => {
      const result = getSplitStylesFor({
        'aria-disabled': true,
      })

      expect(result.viewProps['aria-disabled']).toBe(true)
    })

    test('aria-checked passes through to viewProps', () => {
      const result = getSplitStylesFor({
        'aria-checked': true,
      })

      expect(result.viewProps['aria-checked']).toBe(true)
    })

    test('aria-expanded passes through to viewProps', () => {
      const result = getSplitStylesFor({
        'aria-expanded': true,
      })

      expect(result.viewProps['aria-expanded']).toBe(true)
    })

    test('aria-selected passes through to viewProps', () => {
      const result = getSplitStylesFor({
        'aria-selected': true,
      })

      expect(result.viewProps['aria-selected']).toBe(true)
    })

    test('aria-busy passes through to viewProps', () => {
      const result = getSplitStylesFor({
        'aria-busy': true,
      })

      expect(result.viewProps['aria-busy']).toBe(true)
    })

    test('aria-live passes through to viewProps', () => {
      const result = getSplitStylesFor({
        'aria-live': 'polite',
      })

      expect(result.viewProps['aria-live']).toBe('polite')
    })

    test('aria-valuemin/max/now/text pass through to viewProps', () => {
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

    test('id passes through to viewProps', () => {
      const result = getSplitStylesFor({
        id: 'my-element',
      })

      expect(result.viewProps.id).toBe('my-element')
    })
  })

  describe('RN accessibility props are removed in v2', () => {
    test('accessibilityLabel is ignored (use aria-label instead)', () => {
      const result = getSplitStylesFor({
        accessibilityLabel: 'Test label',
      })

      expect(result.viewProps.accessibilityLabel).toBeUndefined()
      expect(result.viewProps['aria-label']).toBeUndefined()
    })

    test('accessibilityRole is ignored (use role instead)', () => {
      const result = getSplitStylesFor({
        accessibilityRole: 'button',
      })

      expect(result.viewProps.accessibilityRole).toBeUndefined()
      expect(result.viewProps.role).toBeUndefined()
    })

    test('accessibilityHint is ignored (use aria-describedby instead)', () => {
      const result = getSplitStylesFor({
        accessibilityHint: 'Test hint',
      })

      expect(result.viewProps.accessibilityHint).toBeUndefined()
    })

    test('accessibilityState is ignored (use aria-checked, aria-disabled, etc.)', () => {
      const result = getSplitStylesFor({
        accessibilityState: { checked: true },
      })

      expect(result.viewProps.accessibilityState).toBeUndefined()
    })
  })
})

describe('Web Alignment - Native Focus Props', () => {
  describe('tabIndex passes through getSplitStyles', () => {
    test('tabIndex={0} passes through to viewProps', () => {
      const result = getSplitStylesFor({
        tabIndex: 0,
      })

      expect(result.viewProps.tabIndex).toBe(0)
    })

    test('tabIndex={-1} passes through to viewProps', () => {
      const result = getSplitStylesFor({
        tabIndex: -1,
      })

      expect(result.viewProps.tabIndex).toBe(-1)
    })
  })

  describe('RN focusable prop is removed in v2', () => {
    test('focusable is ignored (use tabIndex instead)', () => {
      const result = getSplitStylesFor({
        focusable: true,
      })

      expect(result.viewProps.focusable).toBeUndefined()
      expect(result.viewProps.tabIndex).toBeUndefined()
    })
  })
})
