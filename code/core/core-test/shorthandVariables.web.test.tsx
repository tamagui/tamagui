import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'
import { Stack, createTamagui, StyleObjectValue } from '../web/src'
import { simplifiedGetSplitStyles } from './utils'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig())
})

// Helper to get boxShadow value from either style (no plugin) or rulesToInsert (with plugin)
function getBoxShadowValue(styles: ReturnType<typeof simplifiedGetSplitStyles>): string | undefined {
  // Check style first (when not using tamagui plugin/CSS extraction)
  if (styles.style?.boxShadow) {
    return styles.style.boxShadow as string
  }
  // Check rulesToInsert (when using tamagui plugin with CSS extraction)
  if (styles.rulesToInsert) {
    const rule = Object.values(styles.rulesToInsert).find(
      (r: any) => r[0] === 'boxShadow'
    ) as any
    return rule?.[StyleObjectValue]
  }
  return undefined
}

describe('shorthand variables - web', () => {
  test('boxShadow with $variable resolves to CSS var', () => {
    const styles = simplifiedGetSplitStyles(Stack, {
      boxShadow: '0 0 10px $white',
    })
    const value = getBoxShadowValue(styles)
    expect(value).toBeDefined()
    // Should contain CSS var reference
    expect(value).toContain('var(--')
    expect(value).toContain('0 0 10px')
  })

  test('boxShadow with color token resolves', () => {
    const styles = simplifiedGetSplitStyles(Stack, {
      boxShadow: '0 0 10px $black',
    })
    const value = getBoxShadowValue(styles)
    expect(value).toBeDefined()
    expect(value).toContain('var(--')
  })

  test('boxShadow with multiple variables resolves all', () => {
    const styles = simplifiedGetSplitStyles(Stack, {
      boxShadow: '0 0 10px $white, 0 0 20px $black',
    })
    const value = getBoxShadowValue(styles)
    expect(value).toBeDefined()
    // Both variables should be resolved
    expect(value!.match(/var\(--/g)?.length).toBe(2)
  })

  test('boxShadow without variables passes through unchanged', () => {
    const styles = simplifiedGetSplitStyles(Stack, {
      boxShadow: '0 0 10px red',
    })
    const value = getBoxShadowValue(styles)
    expect(value).toBe('0 0 10px red')
  })

  // Note: CSS border shorthand (e.g., "1px solid $red") works on web but
  // doesn't expand to individual props - it's passed through as a CSS value
  // border shorthand token resolution was removed - use borderColor/borderWidth instead
  test.skip('border with $variable resolves correctly (web-only)', () => {})
  test.skip('borderTop with $variable resolves correctly (web-only)', () => {})

  test('unresolvable $variable stays as-is', () => {
    const styles = simplifiedGetSplitStyles(Stack, {
      boxShadow: '0 0 10px $nonexistent',
    })
    const value = getBoxShadowValue(styles)
    expect(value).toBeDefined()
    // Unresolved variable stays as the original token string
    expect(value).toContain('$nonexistent')
  })

  test('$variable.with.dots resolves correctly', () => {
    const styles = simplifiedGetSplitStyles(Stack, {
      boxShadow: '0 0 10px $color.white',
    })
    const value = getBoxShadowValue(styles)
    expect(value).toBeDefined()
    expect(value).toContain('var(--')
  })
})
