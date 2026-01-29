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
  // boxShadow and filter are string-only - passed directly to RN 0.76+
  describe('boxShadow', () => {
    test('boxShadow string passed through directly', () => {
      const { style } = getSplitStylesFor({
        boxShadow: '5px 5px 10px red',
      })
      expect(style?.boxShadow).toBe('5px 5px 10px red')
    })

    test('boxShadow with tokens resolves them', () => {
      const { style } = getSplitStylesFor({
        boxShadow: '0 0 10px $white',
      })
      expect(style?.boxShadow).toBeDefined()
      expect(style?.boxShadow).not.toContain('$white')
    })

    test('boxShadow with multiple shadows', () => {
      const { style } = getSplitStylesFor({
        boxShadow: '0 0 10px red, 0 0 20px blue',
      })
      expect(style?.boxShadow).toBe('0 0 10px red, 0 0 20px blue')
    })

    test('boxShadow inset syntax', () => {
      const { style } = getSplitStylesFor({
        boxShadow: 'inset 0 2px 4px black',
      })
      expect(style?.boxShadow).toBe('inset 0 2px 4px black')
    })
  })

  describe('filter', () => {
    test('filter string passed through directly', () => {
      const { style } = getSplitStylesFor({
        filter: 'brightness(1.2)',
      })
      expect(style?.filter).toBe('brightness(1.2)')
    })

    test('filter with tokens resolves them', () => {
      const { style } = getSplitStylesFor({
        filter: 'blur($2)',
      })
      expect(style?.filter).toBeDefined()
      expect(style?.filter).not.toContain('$2')
    })

    test('filter multiple functions', () => {
      const { style } = getSplitStylesFor({
        filter: 'blur(10px) brightness(1.2)',
      })
      expect(style?.filter).toBe('blur(10px) brightness(1.2)')
    })

    test('filter drop-shadow', () => {
      const { style } = getSplitStylesFor({
        filter: 'drop-shadow(5px 5px 10px red)',
      })
      expect(style?.filter).toBe('drop-shadow(5px 5px 10px red)')
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
