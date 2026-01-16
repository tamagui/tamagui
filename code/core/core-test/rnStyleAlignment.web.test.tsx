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
  describe('boxShadow', () => {
    test('boxShadow string with tokens resolves', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        boxShadow: '0 0 10px $white',
      })
      const value = getStyleValue(styles, 'boxShadow')
      expect(value).toBeDefined()
      expect(value).toContain('var(--')
    })

    test('boxShadow object converts to CSS string', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        boxShadow: { offsetX: 5, offsetY: 5, blurRadius: 10, color: 'red' },
      })
      const value = getStyleValue(styles, 'boxShadow')
      expect(value).toBeDefined()
      expect(value).toContain('5px')
      expect(value).toContain('10px')
      expect(value).toContain('red')
    })

    test('boxShadow object array converts to CSS string with commas', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        boxShadow: [
          { offsetX: 0, offsetY: 2, blurRadius: 4, color: 'rgba(0,0,0,0.1)' },
          { offsetX: 0, offsetY: 4, blurRadius: 8, color: 'rgba(0,0,0,0.2)' },
        ],
      })
      const value = getStyleValue(styles, 'boxShadow')
      expect(value).toBeDefined()
      expect(value).toContain(',')
    })

    test('boxShadow object with token values resolves tokens', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        boxShadow: { offsetX: '$2', offsetY: '$2', blurRadius: '$4', color: '$white' },
      })
      const value = getStyleValue(styles, 'boxShadow')
      expect(value).toBeDefined()
      // Tokens should be resolved to CSS vars or values
      expect(value).toContain('var(--')
    })

    test('boxShadow inset object adds inset keyword', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        boxShadow: { offsetX: 0, offsetY: 2, blurRadius: 4, color: 'black', inset: true },
      })
      const value = getStyleValue(styles, 'boxShadow')
      expect(value).toBeDefined()
      expect(value).toContain('inset')
    })

    test('boxShadow with spreadDistance includes it', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        boxShadow: { offsetX: 0, offsetY: 0, blurRadius: 10, spreadDistance: 5, color: 'red' },
      })
      const value = getStyleValue(styles, 'boxShadow')
      expect(value).toBeDefined()
      // Should have 4 length values: offsetX offsetY blurRadius spreadDistance
      expect(value).toMatch(/0px\s+0px\s+10px\s+5px/)
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

    test('filter object converts to CSS string', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        filter: { brightness: 1.2 },
      })
      const value = getStyleValue(styles, 'filter')
      expect(value).toBe('brightness(1.2)')
    })

    test('filter object array converts to space-separated CSS', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        filter: [{ brightness: 1.2 }, { contrast: 1.1 }],
      })
      const value = getStyleValue(styles, 'filter')
      expect(value).toBe('brightness(1.2) contrast(1.1)')
    })

    test('filter blur with token resolves', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        filter: { blur: '$2' },
      })
      const value = getStyleValue(styles, 'filter')
      expect(value).toContain('blur(')
      // Token should be resolved
      expect(value).not.toContain('$2')
    })

    test('filter dropShadow object converts correctly', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        filter: { dropShadow: { offsetX: 5, offsetY: 5, blurRadius: 10, color: 'red' } },
      })
      const value = getStyleValue(styles, 'filter')
      expect(value).toContain('drop-shadow(')
      expect(value).toContain('5px')
      expect(value).toContain('red')
    })

    test('filter with embedded tokens resolves', () => {
      const styles = simplifiedGetSplitStyles(Stack, {
        filter: 'blur($2)',
      })
      const value = getStyleValue(styles, 'filter')
      // Token should be resolved
      expect(value).not.toContain('$2')
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
