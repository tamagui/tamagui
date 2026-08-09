import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'
import { View, createTamagui, StyleObjectValue } from '../web/src'
import { simplifiedGetSplitStyles } from './utils'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig())
})

// Helper to get style value from either style (no plugin) or rulesToInsert (with plugin)
function getStyleValue(
  styles: ReturnType<typeof simplifiedGetSplitStyles>,
  prop: string
): string | undefined {
  // Check style first (when not using tamagui plugin/CSS extraction)
  if (styles.style?.[prop] !== undefined) {
    return styles.style[prop] as string
  }
  // Check rulesToInsert (when using tamagui plugin with CSS extraction)
  if (styles.rulesToInsert) {
    const rule = Object.values(styles.rulesToInsert).find(
      (r: any) => r[0] === prop
    ) as any
    return rule?.[StyleObjectValue]
  }
  return undefined
}

describe('RN 0.76+ Style Alignment - Web', () => {
  // boxShadow and filter are string-only
  describe('boxShadow', () => {
    test('boxShadow string with tokens resolves', () => {
      const styles = simplifiedGetSplitStyles(View, {
        boxShadow: '0 0 10px $white',
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
      expect(value).toBe('inset 0 2px 4px black')
    })

    test('boxShadow with multiple tokens resolves all', () => {
      const styles = simplifiedGetSplitStyles(View, {
        boxShadow: '0 0 10px $white, 0 0 20px $black',
      })
      const value = getStyleValue(styles, 'boxShadow')
      expect(value).toBeDefined()
      expect(value).not.toContain('$white')
      expect(value).not.toContain('$black')
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

    test('filter with embedded tokens resolves', () => {
      const styles = simplifiedGetSplitStyles(View, {
        filter: 'blur($2)',
      })
      const value = getStyleValue(styles, 'filter')
      // Token should be resolved
      expect(value).not.toContain('$2')
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
        outlineColor: '$white',
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

  // atomic CSS requires one class per longhand. If a shorthand like `inset`
  // emits a single _inset-0px class, it silently controls 4 sub-properties
  // and breaks dedup/override against top/right/bottom/left.
  describe('logical property expansion (atomic CSS correctness)', () => {
    test('inset expands to top/right/bottom/left', () => {
      const styles = simplifiedGetSplitStyles(View, { inset: 0 })
      expect(getStyleValue(styles, 'top')).toBe('0px')
      expect(getStyleValue(styles, 'right')).toBe('0px')
      expect(getStyleValue(styles, 'bottom')).toBe('0px')
      expect(getStyleValue(styles, 'left')).toBe('0px')
      expect(getStyleValue(styles, 'inset')).toBeUndefined()
    })

    test('insetBlock expands to top/bottom', () => {
      const styles = simplifiedGetSplitStyles(View, { insetBlock: 4 })
      expect(getStyleValue(styles, 'top')).toBe('4px')
      expect(getStyleValue(styles, 'bottom')).toBe('4px')
      expect(getStyleValue(styles, 'insetBlock')).toBeUndefined()
    })

    test('insetBlockStart expands to top', () => {
      const styles = simplifiedGetSplitStyles(View, { insetBlockStart: 8 })
      expect(getStyleValue(styles, 'top')).toBe('8px')
      expect(getStyleValue(styles, 'insetBlockStart')).toBeUndefined()
    })

    test('later top overrides inset (atomic merge)', () => {
      const styles = simplifiedGetSplitStyles(View, { inset: 0, top: 10 })
      expect(getStyleValue(styles, 'top')).toBe('10px')
      expect(getStyleValue(styles, 'right')).toBe('0px')
      expect(getStyleValue(styles, 'bottom')).toBe('0px')
      expect(getStyleValue(styles, 'left')).toBe('0px')
    })

    test('marginBlock expands to marginTop/marginBottom', () => {
      const styles = simplifiedGetSplitStyles(View, { marginBlock: 10 })
      expect(getStyleValue(styles, 'marginTop')).toBe('10px')
      expect(getStyleValue(styles, 'marginBottom')).toBe('10px')
      expect(getStyleValue(styles, 'marginBlock')).toBeUndefined()
    })

    test('paddingBlock expands to paddingTop/paddingBottom', () => {
      const styles = simplifiedGetSplitStyles(View, { paddingBlock: 12 })
      expect(getStyleValue(styles, 'paddingTop')).toBe('12px')
      expect(getStyleValue(styles, 'paddingBottom')).toBe('12px')
      expect(getStyleValue(styles, 'paddingBlock')).toBeUndefined()
    })

    test('blockSize expands to height', () => {
      const styles = simplifiedGetSplitStyles(View, { blockSize: 100 })
      expect(getStyleValue(styles, 'height')).toBe('100px')
      expect(getStyleValue(styles, 'blockSize')).toBeUndefined()
    })

    test('inlineSize expands to width', () => {
      const styles = simplifiedGetSplitStyles(View, { inlineSize: 100 })
      expect(getStyleValue(styles, 'width')).toBe('100px')
      expect(getStyleValue(styles, 'inlineSize')).toBeUndefined()
    })

    test('minBlockSize expands to minHeight', () => {
      const styles = simplifiedGetSplitStyles(View, { minBlockSize: 50 })
      expect(getStyleValue(styles, 'minHeight')).toBe('50px')
      expect(getStyleValue(styles, 'minBlockSize')).toBeUndefined()
    })
  })
})
