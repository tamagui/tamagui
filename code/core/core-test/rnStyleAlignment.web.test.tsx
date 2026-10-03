import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'
import { View, createTamagui } from '../web/src'
import { getStyleValue, simplifiedGetSplitStyles } from './utils'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig())
})

describe('RN 0.76+ Style Alignment - Web', () => {
  // boxShadow and filter are string-only
  describe('boxShadow', () => {
    test('boxShadow string with tokens resolves', () => {
      const styles = simplifiedGetSplitStyles(View, {
        boxShadow: '0 0 10px white',
      })
      const value = getStyleValue(styles, 'boxShadow')
      expect(value).toBeDefined()
      expect(value).toContain('var(--')
    })

    test('boxShadow string passes through', () => {
      const styles = simplifiedGetSplitStyles(View, {
        boxShadow: '5px 5px 10px red',
      })
      const value = getStyleValue(styles, 'boxShadow')
      expect(value).toBe('5px 5px 10px red')
    })

    test('boxShadow multiple shadows', () => {
      const styles = simplifiedGetSplitStyles(View, {
        boxShadow: '0 0 10px red, 0 0 20px blue',
      })
      const value = getStyleValue(styles, 'boxShadow')
      expect(value).toBe('0 0 10px red, 0 0 20px blue')
    })

    test('boxShadow inset syntax', () => {
      const styles = simplifiedGetSplitStyles(View, {
        boxShadow: 'inset 0 2px 4px black',
      })
      const value = getStyleValue(styles, 'boxShadow')
      // config-first: 'black' resolves through the configured color token
      expect(value).toBe('inset 0 2px 4px var(--c-black)')
    })

    test('boxShadow with multiple tokens resolves all', () => {
      const styles = simplifiedGetSplitStyles(View, {
        boxShadow: '0 0 10px white, 0 0 20px black',
      })
      const value = getStyleValue(styles, 'boxShadow')
      expect(value).toBe('0 0 10px var(--c-white), 0 0 20px var(--c-black)')
    })
  })

  describe('filter', () => {
    test('filter string passes through', () => {
      const styles = simplifiedGetSplitStyles(View, {
        filter: 'brightness(1.2)',
      })
      const value = getStyleValue(styles, 'filter')
      expect(value).toBe('brightness(1.2)')
    })

    test('filter with a migrated token value stays literal CSS', () => {
      const styles = simplifiedGetSplitStyles(View, {
        filter: 'blur(7px)',
      })
      const value = getStyleValue(styles, 'filter')
      expect(value).toBe('blur(7px)')
    })

    test('filter multiple functions', () => {
      const styles = simplifiedGetSplitStyles(View, {
        filter: 'blur(10px) brightness(1.2)',
      })
      const value = getStyleValue(styles, 'filter')
      expect(value).toBe('blur(10px) brightness(1.2)')
    })

    test('filter drop-shadow', () => {
      const styles = simplifiedGetSplitStyles(View, {
        filter: 'drop-shadow(5px 5px 10px red)',
      })
      const value = getStyleValue(styles, 'filter')
      expect(value).toBe('drop-shadow(5px 5px 10px red)')
    })
  })

  describe('mixBlendMode', () => {
    test('mixBlendMode passes through', () => {
      const styles = simplifiedGetSplitStyles(View, {
        mixBlendMode: 'multiply',
      })
      const value = getStyleValue(styles, 'mixBlendMode')
      expect(value).toBe('multiply')
    })
  })

  describe('isolation', () => {
    test('isolation passes through', () => {
      const styles = simplifiedGetSplitStyles(View, {
        isolation: 'isolate',
      })
      const value = getStyleValue(styles, 'isolation')
      expect(value).toBe('isolate')
    })
  })

  describe('boxSizing', () => {
    test('boxSizing passes through', () => {
      const styles = simplifiedGetSplitStyles(View, {
        boxSizing: 'content-box',
      })
      const value = getStyleValue(styles, 'boxSizing')
      expect(value).toBe('content-box')
    })
  })

  describe('outline props', () => {
    test('outlineColor with token resolves', () => {
      const styles = simplifiedGetSplitStyles(View, {
        outlineColor: 'white',
      })
      const value = getStyleValue(styles, 'outlineColor')
      expect(value).toContain('var(--')
    })

    test('outlineWidth passes through', () => {
      const styles = simplifiedGetSplitStyles(View, {
        outlineWidth: 2,
      })
      const value = getStyleValue(styles, 'outlineWidth')
      expect(value).toBe('2px')
    })

    test('outlineStyle passes through', () => {
      const styles = simplifiedGetSplitStyles(View, {
        outlineStyle: 'dashed',
      })
      const value = getStyleValue(styles, 'outlineStyle')
      expect(value).toBe('dashed')
    })

    test('outlineOffset passes through', () => {
      const styles = simplifiedGetSplitStyles(View, {
        outlineOffset: 4,
      })
      const value = getStyleValue(styles, 'outlineOffset')
      expect(value).toBe('4px')
    })
  })

  describe('display contents', () => {
    test('display contents passes through', () => {
      const styles = simplifiedGetSplitStyles(View, {
        display: 'contents',
      })
      const value = getStyleValue(styles, 'display')
      expect(value).toBe('contents')
    })
  })

  describe('logical CSS properties', () => {
    test('inset stays a browser shorthand', () => {
      const styles = simplifiedGetSplitStyles(View, { inset: 0 })
      expect(getStyleValue(styles, 'inset')).toBe('0px')
    })

    test('insetBlock stays logical', () => {
      const styles = simplifiedGetSplitStyles(View, { insetBlock: 4 })
      expect(getStyleValue(styles, 'insetBlock')).toBe('4px')
    })

    test('insetBlockStart stays logical', () => {
      const styles = simplifiedGetSplitStyles(View, { insetBlockStart: 8 })
      expect(getStyleValue(styles, 'insetBlockStart')).toBe('8px')
    })

    test('later top overrides inset (atomic merge)', () => {
      const styles = simplifiedGetSplitStyles(View, { inset: 0, top: 10 })
      expect(getStyleValue(styles, 'top')).toBe('10px')
      expect(getStyleValue(styles, 'inset')).toBe('0px')
    })

    test('marginBlock stays logical', () => {
      const styles = simplifiedGetSplitStyles(View, { marginBlock: 10 })
      expect(getStyleValue(styles, 'marginBlock')).toBe('10px')
    })

    test('paddingBlock stays logical', () => {
      const styles = simplifiedGetSplitStyles(View, { paddingBlock: 12 })
      expect(getStyleValue(styles, 'paddingBlock')).toBe('12px')
    })

    test('blockSize stays logical', () => {
      const styles = simplifiedGetSplitStyles(View, { blockSize: 100 })
      expect(getStyleValue(styles, 'blockSize')).toBe('100px')
    })

    test('inlineSize stays logical', () => {
      const styles = simplifiedGetSplitStyles(View, { inlineSize: 100 })
      expect(getStyleValue(styles, 'inlineSize')).toBe('100px')
    })

    test('minBlockSize stays logical', () => {
      const styles = simplifiedGetSplitStyles(View, { minBlockSize: 50 })
      expect(getStyleValue(styles, 'minBlockSize')).toBe('50px')
    })
  })
})
