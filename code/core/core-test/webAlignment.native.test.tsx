/**
 * Web Alignment Tests - Native Platform
 *
 * These tests verify that web-standard props (aria-*, role, tabIndex)
 * pass through getSplitStyles correctly on native.
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
    test.each([
      ['aria-label', 'Test label'],
      ['role', 'button'],
      ['aria-hidden', true],
      ['aria-disabled', true],
      ['aria-checked', true],
      ['aria-expanded', true],
      ['aria-selected', true],
      ['aria-live', 'polite'],
    ])('%s passes through to viewProps', (prop, value) => {
      const result = getSplitStylesFor({ [prop]: value })
      expect(result.viewProps[prop]).toBe(value)
    })

    test('aria-value props pass through together', () => {
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
      const result = getSplitStylesFor({ id: 'my-element' })
      expect(result.viewProps.id).toBe('my-element')
    })
  })

  describe('RN accessibility props are removed in v2', () => {
    test.each([
      'accessibilityLabel',
      'accessibilityRole',
      'accessibilityHint',
      'accessibilityState',
    ])('%s is ignored', (removedProp) => {
      const result = getSplitStylesFor({ [removedProp]: 'test' })
      expect(result.viewProps[removedProp]).toBeUndefined()
    })
  })
})

describe('Web Alignment - Native Focus Props', () => {
  test.each([
    [0, 0],
    [-1, -1],
  ])('tabIndex={%s} passes through to viewProps', (input, expected) => {
    const result = getSplitStylesFor({ tabIndex: input })
    expect(result.viewProps.tabIndex).toBe(expected)
  })

  test('focusable is ignored (use tabIndex instead)', () => {
    const result = getSplitStylesFor({ focusable: true })
    expect(result.viewProps.focusable).toBeUndefined()
    expect(result.viewProps.tabIndex).toBeUndefined()
  })
})
