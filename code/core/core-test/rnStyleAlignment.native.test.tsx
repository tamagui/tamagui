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
      focusVisible: false,
      disabled: false,
      unmounted: true,
    },
    {
      isAnimated: false,
      mediaState: undefined,
      noClassNames: false,
      resolveValues: 'auto',
    } as any,
    {},
    {
      animationDriver: {},
      groups: { state: {} },
    } as any,
    undefined,
    undefined,
    true
  )
}

describe('RN 0.76+ Style Alignment - Native', () => {
  describe('boxShadow', () => {
    test('boxShadow object is kept as object array with resolved tokens', () => {
      const { style } = getSplitStylesFor({
        boxShadow: { offsetX: 5, offsetY: 5, blurRadius: 10, color: 'red' },
      })
      // On native, boxShadow objects stay as objects (RN 0.76+ format)
      expect(style?.boxShadow).toBeDefined()
      expect(Array.isArray(style?.boxShadow)).toBe(true)
      const value = style!.boxShadow as any
      expect(value[0]).toHaveProperty('offsetX', 5)
      expect(value[0]).toHaveProperty('offsetY', 5)
      expect(value[0]).toHaveProperty('blurRadius', 10)
      expect(value[0]).toHaveProperty('color', 'red')
    })

    test('boxShadow object array stays as array', () => {
      const { style } = getSplitStylesFor({
        boxShadow: [
          { offsetX: 0, offsetY: 2, blurRadius: 4, color: 'rgba(0,0,0,0.1)' },
          { offsetX: 0, offsetY: 4, blurRadius: 8, color: 'rgba(0,0,0,0.2)' },
        ],
      })
      expect(style?.boxShadow).toBeDefined()
      expect(Array.isArray(style?.boxShadow)).toBe(true)
      const value = style!.boxShadow as any
      expect(value.length).toBe(2)
    })

    test('boxShadow object with token values resolves tokens to numbers', () => {
      const { style } = getSplitStylesFor({
        boxShadow: { offsetX: '$2', offsetY: '$2', blurRadius: '$4', color: '$white' },
      })
      expect(style?.boxShadow).toBeDefined()
      expect(Array.isArray(style?.boxShadow)).toBe(true)
      const value = style!.boxShadow as any
      // Tokens should be resolved to numeric values
      expect(typeof value[0].offsetX).toBe('number')
      expect(typeof value[0].offsetY).toBe('number')
      // Color should be resolved to actual color value
      expect(value[0].color).not.toContain('$')
    })

    test('boxShadow inset object preserves inset flag', () => {
      const { style } = getSplitStylesFor({
        boxShadow: { offsetX: 0, offsetY: 2, blurRadius: 4, color: 'black', inset: true },
      })
      expect(style?.boxShadow).toBeDefined()
      const value = style!.boxShadow as any
      expect(value[0]).toHaveProperty('inset', true)
    })

    test('boxShadow with spreadDistance preserves it', () => {
      const { style } = getSplitStylesFor({
        boxShadow: {
          offsetX: 0,
          offsetY: 0,
          blurRadius: 10,
          spreadDistance: 5,
          color: 'red',
        },
      })
      expect(style?.boxShadow).toBeDefined()
      const value = style!.boxShadow as any
      expect(value[0]).toHaveProperty('spreadDistance', 5)
    })

    test('boxShadow string is parsed to object array', () => {
      const { style } = getSplitStylesFor({
        boxShadow: '5px 5px 10px red',
      })
      expect(style?.boxShadow).toBeDefined()
      expect(Array.isArray(style?.boxShadow)).toBe(true)
      const value = style!.boxShadow as any
      expect(value[0]).toHaveProperty('offsetX', 5)
      expect(value[0]).toHaveProperty('offsetY', 5)
      expect(value[0]).toHaveProperty('blurRadius', 10)
      expect(value[0]).toHaveProperty('color', 'red')
    })
  })

  describe('filter', () => {
    test('filter object is kept as object array', () => {
      const { style } = getSplitStylesFor({
        filter: { brightness: 1.2 },
      })
      expect(style?.filter).toBeDefined()
      expect(Array.isArray(style?.filter)).toBe(true)
      const value = style!.filter as any
      expect(value[0]).toHaveProperty('brightness', 1.2)
    })

    test('filter object array stays as array', () => {
      const { style } = getSplitStylesFor({
        filter: [{ brightness: 1.2 }, { contrast: 1.1 }],
      })
      expect(style?.filter).toBeDefined()
      expect(Array.isArray(style?.filter)).toBe(true)
      const value = style!.filter as any
      expect(value.length).toBe(2)
      expect(value[0]).toHaveProperty('brightness', 1.2)
      expect(value[1]).toHaveProperty('contrast', 1.1)
    })

    test('filter blur with token resolves to number', () => {
      const { style } = getSplitStylesFor({
        filter: { blur: '$2' },
      })
      expect(style?.filter).toBeDefined()
      expect(Array.isArray(style?.filter)).toBe(true)
      const value = style!.filter as any
      // Token should be resolved to numeric value
      expect(typeof value[0].blur).toBe('number')
    })

    test('filter dropShadow object is preserved', () => {
      const { style } = getSplitStylesFor({
        filter: { dropShadow: { offsetX: 5, offsetY: 5, blurRadius: 10, color: 'red' } },
      })
      expect(style?.filter).toBeDefined()
      expect(Array.isArray(style?.filter)).toBe(true)
      const value = style!.filter as any
      expect(value[0]).toHaveProperty('dropShadow')
      expect(value[0].dropShadow).toHaveProperty('offsetX', 5)
      expect(value[0].dropShadow).toHaveProperty('color', 'red')
    })

    test('filter string is parsed to object array', () => {
      const { style } = getSplitStylesFor({
        filter: 'brightness(1.2)',
      })
      expect(style?.filter).toBeDefined()
      expect(Array.isArray(style?.filter)).toBe(true)
      const value = style!.filter as any
      expect(value[0]).toHaveProperty('brightness', 1.2)
    })
  })

  describe('mixBlendMode', () => {
    test('mixBlendMode passes through', () => {
      const { style } = getSplitStylesFor({
        mixBlendMode: 'multiply',
      })
      expect(style?.mixBlendMode).toBe('multiply')
    })
  })

  describe('isolation', () => {
    test('isolation passes through', () => {
      const { style } = getSplitStylesFor({
        isolation: 'isolate',
      })
      expect(style?.isolation).toBe('isolate')
    })
  })

  describe('boxSizing', () => {
    test('boxSizing passes through', () => {
      const { style } = getSplitStylesFor({
        boxSizing: 'content-box',
      })
      expect(style?.boxSizing).toBe('content-box')
    })
  })

  describe('outline props', () => {
    test('outlineColor with token resolves', () => {
      const { style } = getSplitStylesFor({
        outlineColor: '$white',
      })
      expect(style?.outlineColor).toBeDefined()
      expect(style?.outlineColor).not.toContain('$')
    })

    test('outlineWidth passes through', () => {
      const { style } = getSplitStylesFor({
        outlineWidth: 2,
      })
      expect(style?.outlineWidth).toBe(2)
    })

    test('outlineStyle passes through', () => {
      const { style } = getSplitStylesFor({
        outlineStyle: 'dashed',
      })
      expect(style?.outlineStyle).toBe('dashed')
    })

    test('outlineOffset passes through', () => {
      const { style } = getSplitStylesFor({
        outlineOffset: 4,
      })
      expect(style?.outlineOffset).toBe(4)
    })
  })

  describe('display contents', () => {
    test('display contents passes through', () => {
      const { style } = getSplitStylesFor({
        display: 'contents',
      })
      expect(style?.display).toBe('contents')
    })
  })
})
