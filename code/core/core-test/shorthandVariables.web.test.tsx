import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'
import { Stack, StyleObjectProperty, StyleObjectValue, createTamagui } from '../web/src'
import { simplifiedGetSplitStyles } from './utils'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig())
})

describe('shorthand variables - web', () => {
  test('boxShadow with $variable resolves to CSS var', () => {
    const styles = simplifiedGetSplitStyles(Stack, {
      boxShadow: '0 0 10px $white',
    })

    const boxShadowRule = Object.values(styles.rulesToInsert).find(
      (rule) => rule[StyleObjectProperty] === 'boxShadow'
    )

    expect(boxShadowRule).toBeDefined()
    // Should contain CSS var reference
    expect(boxShadowRule![StyleObjectValue]).toContain('var(--')
    expect(boxShadowRule![StyleObjectValue]).toContain('0 0 10px')
  })

  test('boxShadow with color token resolves', () => {
    const styles = simplifiedGetSplitStyles(Stack, {
      boxShadow: '0 0 10px $black',
    })

    const boxShadowRule = Object.values(styles.rulesToInsert).find(
      (rule) => rule[StyleObjectProperty] === 'boxShadow'
    )

    expect(boxShadowRule).toBeDefined()
    expect(boxShadowRule![StyleObjectValue]).toContain('var(--')
  })

  test('boxShadow with multiple variables resolves all', () => {
    const styles = simplifiedGetSplitStyles(Stack, {
      boxShadow: '0 0 10px $white, 0 0 20px $black',
    })

    const boxShadowRule = Object.values(styles.rulesToInsert).find(
      (rule) => rule[StyleObjectProperty] === 'boxShadow'
    )

    expect(boxShadowRule).toBeDefined()
    const value = boxShadowRule![StyleObjectValue]
    // Both variables should be resolved
    expect(value.match(/var\(--/g)?.length).toBe(2)
  })

  test('boxShadow without variables passes through unchanged', () => {
    const styles = simplifiedGetSplitStyles(Stack, {
      boxShadow: '0 0 10px red',
    })

    const boxShadowRule = Object.values(styles.rulesToInsert).find(
      (rule) => rule[StyleObjectProperty] === 'boxShadow'
    )

    expect(boxShadowRule).toBeDefined()
    expect(boxShadowRule![StyleObjectValue]).toBe('0 0 10px red')
  })

  // Note: CSS border shorthand (e.g., "1px solid $red") works on web but
  // doesn't expand to individual props - it's passed through as a CSS value
  test('border with $variable resolves correctly (web-only)', () => {
    const styles = simplifiedGetSplitStyles(Stack, {
      border: '1px solid $white',
    })

    // On web, border passes through as a single CSS property with resolved var
    const borderRule = Object.values(styles.rulesToInsert).find(
      (rule) => rule[StyleObjectProperty] === 'border'
    )

    expect(borderRule).toBeDefined()
    expect(borderRule![StyleObjectValue]).toContain('var(--')
  })

  test('borderTop with $variable resolves correctly (web-only)', () => {
    const styles = simplifiedGetSplitStyles(Stack, {
      borderTop: '2px dashed $black',
    })

    const borderTopRule = Object.values(styles.rulesToInsert).find(
      (rule) => rule[StyleObjectProperty] === 'borderTop'
    )

    expect(borderTopRule).toBeDefined()
    expect(borderTopRule![StyleObjectValue]).toContain('var(--')
  })

  test('unresolvable $variable stays as-is', () => {
    const styles = simplifiedGetSplitStyles(Stack, {
      boxShadow: '0 0 10px $nonexistent',
    })

    const boxShadowRule = Object.values(styles.rulesToInsert).find(
      (rule) => rule[StyleObjectProperty] === 'boxShadow'
    )

    expect(boxShadowRule).toBeDefined()
    // Unresolved variable stays as the original token string
    expect(boxShadowRule![StyleObjectValue]).toContain('$nonexistent')
  })

  test('$variable.with.dots resolves correctly', () => {
    const styles = simplifiedGetSplitStyles(Stack, {
      boxShadow: '0 0 10px $color.white',
    })

    const boxShadowRule = Object.values(styles.rulesToInsert).find(
      (rule) => rule[StyleObjectProperty] === 'boxShadow'
    )

    expect(boxShadowRule).toBeDefined()
    expect(boxShadowRule![StyleObjectValue]).toContain('var(--')
  })
})
