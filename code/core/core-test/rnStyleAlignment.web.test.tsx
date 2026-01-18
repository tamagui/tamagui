import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'
import { Stack, createTamagui, StyleObjectValue } from '../web/src'
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
      const styles = simplifiedGetSplitStyles(Stack, {
        boxShadow: '0 0 10px $white',
      })
      const value = getStyleValue(styles, 'boxShadow')
      expect(value).toBeDefined()
      expect(value).toContain('var(--')
    })

    test('boxShadow string passes through', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        boxShadow: '5px 5px 10px red',
      })
      const value = getStyleValue(styles, 'boxShadow')
      expect(value).toBe('5px 5px 10px red')
    })

    test('boxShadow multiple shadows', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        boxShadow: '0 0 10px red, 0 0 20px blue',
      })
      const value = getStyleValue(styles, 'boxShadow')
      expect(value).toBe('0 0 10px red, 0 0 20px blue')
    })

    test('boxShadow inset syntax', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        boxShadow: 'inset 0 2px 4px black',
      })
      const value = getStyleValue(styles, 'boxShadow')
      expect(value).toBe('inset 0 2px 4px black')
    })

    test('boxShadow with multiple tokens resolves all', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
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
      const styles = simplifiedGetSplitStyles(Stack, {
        filter: 'brightness(1.2)',
      })
      const value = getStyleValue(styles, 'filter')
      expect(value).toBe('brightness(1.2)')
    })

    test('filter with embedded tokens resolves', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        filter: 'blur($2)',
      })
      const value = getStyleValue(styles, 'filter')
      // Token should be resolved
      expect(value).not.toContain('$2')
    })

    test('filter multiple functions', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        filter: 'blur(10px) brightness(1.2)',
      })
      const value = getStyleValue(styles, 'filter')
      expect(value).toBe('blur(10px) brightness(1.2)')
    })

    test('filter drop-shadow', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        filter: 'drop-shadow(5px 5px 10px red)',
      })
      const value = getStyleValue(styles, 'filter')
      expect(value).toBe('drop-shadow(5px 5px 10px red)')
    })
  })

  describe('mixBlendMode', () => {
    test('mixBlendMode passes through', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        mixBlendMode: 'multiply',
      })
      const value = getStyleValue(styles, 'mixBlendMode')
      expect(value).toBe('multiply')
    })
  })

  describe('isolation', () => {
    test('isolation passes through', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        isolation: 'isolate',
      })
      const value = getStyleValue(styles, 'isolation')
      expect(value).toBe('isolate')
    })
  })

  describe('boxSizing', () => {
    test('boxSizing passes through', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        boxSizing: 'content-box',
      })
      const value = getStyleValue(styles, 'boxSizing')
      expect(value).toBe('content-box')
    })
  })

  describe('outline props', () => {
    test('outlineColor with token resolves', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        outlineColor: '$white',
      })
      const value = getStyleValue(styles, 'outlineColor')
      expect(value).toContain('var(--')
    })

    test('outlineWidth passes through', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        outlineWidth: 2,
      })
      const value = getStyleValue(styles, 'outlineWidth')
      expect(value).toBe('2px')
    })

    test('outlineStyle passes through', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        outlineStyle: 'dashed',
      })
      const value = getStyleValue(styles, 'outlineStyle')
      expect(value).toBe('dashed')
    })

    test('outlineOffset passes through', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        outlineOffset: 4,
      })
      const value = getStyleValue(styles, 'outlineOffset')
      expect(value).toBe('4px')
    })
  })

  describe('display contents', () => {
    test('display contents passes through', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        display: 'contents',
      })
      const value = getStyleValue(styles, 'display')
      expect(value).toBe('contents')
    })
  })
})
