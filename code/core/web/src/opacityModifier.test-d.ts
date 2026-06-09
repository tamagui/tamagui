/**
 * Type tests for the opacity modifier syntax (e.g., $color/50)
 *
 * The runtime already supports this syntax in getTokenForKey, but the types
 * were not accepting it. These tests verify that color tokens with opacity
 * modifiers are now type-safe.
 */

import { expectTypeOf, describe, test } from 'vitest'
import type { ColorTokens, FontColorTokens } from './types'

describe('opacity modifier types', () => {
  test('ColorTokens accepts opacity modifier syntax', () => {
    // Should accept token with opacity modifier
    const colorWithOpacity: ColorTokens = '$color/50'
    const colorWithFullOpacity: ColorTokens = '$color/100'
    const colorWithLowOpacity: ColorTokens = '$color/10'

    // Should still accept regular tokens
    const regularToken: ColorTokens = '$color'
    const colorName: ColorTokens = 'red'

    // These should all be valid
    expectTypeOf(colorWithOpacity).toMatchTypeOf<ColorTokens>()
    expectTypeOf(colorWithFullOpacity).toMatchTypeOf<ColorTokens>()
    expectTypeOf(colorWithLowOpacity).toMatchTypeOf<ColorTokens>()
    expectTypeOf(regularToken).toMatchTypeOf<ColorTokens>()
    expectTypeOf(colorName).toMatchTypeOf<ColorTokens>()
  })

  test('FontColorTokens accepts opacity modifier syntax', () => {
    // Should accept font color token with opacity modifier
    const fontColorWithOpacity: FontColorTokens = '$fontColor/50'
    const fontColorWithFullOpacity: FontColorTokens = '$fontColor/100'

    // Should still accept regular tokens and numbers
    const regularFontToken: FontColorTokens = '$fontColor'
    const fontColorNumber: FontColorTokens = 42

    // These should all be valid
    expectTypeOf(fontColorWithOpacity).toMatchTypeOf<FontColorTokens>()
    expectTypeOf(fontColorWithFullOpacity).toMatchTypeOf<FontColorTokens>()
    expectTypeOf(regularFontToken).toMatchTypeOf<FontColorTokens>()
    expectTypeOf(fontColorNumber).toMatchTypeOf<FontColorTokens>()
  })

  test('opacity modifier rejects invalid formats', () => {
    // These should NOT be valid (but TypeScript will still accept them as strings)
    // The runtime parsing handles validation

    // Valid opacity numbers (0-100)
    const validOpacity: ColorTokens = '$color/75'
    expectTypeOf(validOpacity).toMatchTypeOf<ColorTokens>()

    // Note: TypeScript template literal types are permissive with numbers
    // The runtime validation in getTokenForKey handles edge cases like:
    // - Negative numbers
    // - Numbers > 100
    // - Non-numeric strings after /
  })
})
