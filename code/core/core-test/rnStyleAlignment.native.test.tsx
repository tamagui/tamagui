import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'
import { Stack, createTamagui, getSplitStyles, defaultComponentState } from '@tamagui/core'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig('native'))
})

const emptyObj = {} as any
const styleProps = {
  mediaState: undefined,
  isAnimated: false,
  resolveValues: 'auto',
} as any

function simplifiedGetSplitStyles(component: any, props: Record<string, any>) {
  return getSplitStyles(
    props,
    component.staticConfig,
    emptyObj,
    '',
    defaultComponentState,
    styleProps,
    emptyObj,
    {
      animationDriver: {},
      groups: { state: {} },
    } as any,
    undefined,
    undefined,
    true
  )!
}

describe('RN 0.76+ Style Alignment - Native', () => {
  describe('boxShadow', () => {
    test('boxShadow object is kept as object array with resolved tokens', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        boxShadow: { offsetX: 5, offsetY: 5, blurRadius: 10, color: 'red' },
      })
      // On native, boxShadow objects stay as objects (RN 0.76+ format)
      const value = styles.style?.boxShadow
      expect(value).toBeDefined()
      expect(Array.isArray(value)).toBe(true)
      expect(value[0]).toHaveProperty('offsetX', 5)
      expect(value[0]).toHaveProperty('offsetY', 5)
      expect(value[0]).toHaveProperty('blurRadius', 10)
      expect(value[0]).toHaveProperty('color', 'red')
    })

    test('boxShadow object array stays as array', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        boxShadow: [
          { offsetX: 0, offsetY: 2, blurRadius: 4, color: 'rgba(0,0,0,0.1)' },
          { offsetX: 0, offsetY: 4, blurRadius: 8, color: 'rgba(0,0,0,0.2)' },
        ],
      })
      const value = styles.style?.boxShadow
      expect(value).toBeDefined()
      expect(Array.isArray(value)).toBe(true)
      expect(value.length).toBe(2)
    })

    test('boxShadow object with token values resolves tokens to numbers', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        boxShadow: { offsetX: '$2', offsetY: '$2', blurRadius: '$4', color: '$white' },
      })
      const value = styles.style?.boxShadow
      expect(value).toBeDefined()
      expect(Array.isArray(value)).toBe(true)
      // Tokens should be resolved to numeric values
      expect(typeof value[0].offsetX).toBe('number')
      expect(typeof value[0].offsetY).toBe('number')
      // Color should be resolved to actual color value
      expect(value[0].color).not.toContain('$')
    })

    test('boxShadow inset object preserves inset flag', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        boxShadow: { offsetX: 0, offsetY: 2, blurRadius: 4, color: 'black', inset: true },
      })
      const value = styles.style?.boxShadow
      expect(value).toBeDefined()
      expect(value[0]).toHaveProperty('inset', true)
    })

    test('boxShadow with spreadDistance preserves it', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        boxShadow: { offsetX: 0, offsetY: 0, blurRadius: 10, spreadDistance: 5, color: 'red' },
      })
      const value = styles.style?.boxShadow
      expect(value).toBeDefined()
      expect(value[0]).toHaveProperty('spreadDistance', 5)
    })

    test('boxShadow string is parsed to object array', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        boxShadow: '5px 5px 10px red',
      })
      const value = styles.style?.boxShadow
      expect(value).toBeDefined()
      expect(Array.isArray(value)).toBe(true)
      expect(value[0]).toHaveProperty('offsetX', 5)
      expect(value[0]).toHaveProperty('offsetY', 5)
      expect(value[0]).toHaveProperty('blurRadius', 10)
      expect(value[0]).toHaveProperty('color', 'red')
    })
  })

  describe('filter', () => {
    test('filter object is kept as object array', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        filter: { brightness: 1.2 },
      })
      const value = styles.style?.filter
      expect(value).toBeDefined()
      expect(Array.isArray(value)).toBe(true)
      expect(value[0]).toHaveProperty('brightness', 1.2)
    })

    test('filter object array stays as array', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        filter: [{ brightness: 1.2 }, { contrast: 1.1 }],
      })
      const value = styles.style?.filter
      expect(value).toBeDefined()
      expect(Array.isArray(value)).toBe(true)
      expect(value.length).toBe(2)
      expect(value[0]).toHaveProperty('brightness', 1.2)
      expect(value[1]).toHaveProperty('contrast', 1.1)
    })

    test('filter blur with token resolves to number', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        filter: { blur: '$2' },
      })
      const value = styles.style?.filter
      expect(value).toBeDefined()
      expect(Array.isArray(value)).toBe(true)
      // Token should be resolved to numeric value
      expect(typeof value[0].blur).toBe('number')
    })

    test('filter dropShadow object is preserved', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        filter: { dropShadow: { offsetX: 5, offsetY: 5, blurRadius: 10, color: 'red' } },
      })
      const value = styles.style?.filter
      expect(value).toBeDefined()
      expect(Array.isArray(value)).toBe(true)
      expect(value[0]).toHaveProperty('dropShadow')
      expect(value[0].dropShadow).toHaveProperty('offsetX', 5)
      expect(value[0].dropShadow).toHaveProperty('color', 'red')
    })

    test('filter string is parsed to object array', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        filter: 'brightness(1.2)',
      })
      const value = styles.style?.filter
      expect(value).toBeDefined()
      expect(Array.isArray(value)).toBe(true)
      expect(value[0]).toHaveProperty('brightness', 1.2)
    })
  })

  describe('mixBlendMode', () => {
    test('mixBlendMode passes through', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        mixBlendMode: 'multiply',
      })
      expect(styles.style?.mixBlendMode).toBe('multiply')
    })
  })

  describe('isolation', () => {
    test('isolation passes through', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        isolation: 'isolate',
      })
      expect(styles.style?.isolation).toBe('isolate')
    })
  })

  describe('boxSizing', () => {
    test('boxSizing passes through', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        boxSizing: 'content-box',
      })
      expect(styles.style?.boxSizing).toBe('content-box')
    })
  })

  describe('outline props', () => {
    test('outlineColor with token resolves', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        outlineColor: '$white',
      })
      const value = styles.style?.outlineColor
      expect(value).toBeDefined()
      expect(value).not.toContain('$')
    })

    test('outlineWidth passes through', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        outlineWidth: 2,
      })
      expect(styles.style?.outlineWidth).toBe(2)
    })

    test('outlineStyle passes through', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        outlineStyle: 'dashed',
      })
      expect(styles.style?.outlineStyle).toBe('dashed')
    })

    test('outlineOffset passes through', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        outlineOffset: 4,
      })
      expect(styles.style?.outlineOffset).toBe(4)
    })
  })

  describe('display contents', () => {
    test('display contents passes through', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        display: 'contents',
      })
      expect(styles.style?.display).toBe('contents')
    })
  })
})
