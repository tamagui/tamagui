/**
 * type tests for the opacity modifier syntax (e.g., $color/50)
 *
 * the runtime already supports this syntax in getTokenForKey, but the types
 * were not accepting it. these tests verify that color tokens with opacity
 * modifiers are now type-safe.
 */

import { expectTypeOf, describe, test } from 'vitest'
import type { ColorTokens, FontColorTokens, GetThemeValueForKey } from './types'

type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
type ColorTokenKey = `color${Digit}${Digit}${Digit}`

describe('opacity modifier types', () => {
  test('ColorTokens accepts opacity modifier syntax', () => {
    // should accept token with opacity modifier
    const colorWithOpacity: ColorTokens = '$color/50'
    const colorWithFullOpacity: ColorTokens = '$color/100'
    const colorWithLowOpacity: ColorTokens = '$color/10'

    // should still accept regular tokens
    const regularToken: ColorTokens = '$color'
    const colorName: ColorTokens = 'red'

    expectTypeOf(colorWithOpacity).toMatchTypeOf<ColorTokens>()
    expectTypeOf(colorWithFullOpacity).toMatchTypeOf<ColorTokens>()
    expectTypeOf(colorWithLowOpacity).toMatchTypeOf<ColorTokens>()
    expectTypeOf(regularToken).toMatchTypeOf<ColorTokens>()
    expectTypeOf(colorName).toMatchTypeOf<ColorTokens>()
  })

  test('FontColorTokens accepts opacity modifier syntax', () => {
    const fontColorNumber: FontColorTokens = 42
    const fontColorWithOpacity: FontColorTokens = '$bodyColor/50'

    expectTypeOf(fontColorNumber).toMatchTypeOf<FontColorTokens>()
    expectTypeOf(fontColorWithOpacity).toMatchTypeOf<FontColorTokens>()
    expectTypeOf<number>().toMatchTypeOf<FontColorTokens>()
  })

  test('opacity modifier requires token prefix', () => {
    const validOpacity: ColorTokens = '$color/75'
    expectTypeOf(validOpacity).toMatchTypeOf<ColorTokens>()

    // @ts-expect-error opacity modifiers only apply to token-like values.
    const cssColorWithOpacity: ColorTokens = 'red/75'
    expectTypeOf(cssColorWithOpacity).toMatchTypeOf<ColorTokens>()
  })

  test('color props accept opacity without expanding large token unions', () => {
    type LargeColorTokens = `$${ColorTokenKey}` | ColorTokens

    const colorToken: LargeColorTokens = '$color123'
    const colorTokenWithOpacity: LargeColorTokens = '$color123/50'
    const propColorTokenWithOpacity: GetThemeValueForKey<'backgroundColor'> =
      '$color123/50'

    expectTypeOf(colorToken).toMatchTypeOf<LargeColorTokens>()
    expectTypeOf(colorTokenWithOpacity).toMatchTypeOf<LargeColorTokens>()
    expectTypeOf(propColorTokenWithOpacity).toMatchTypeOf<
      GetThemeValueForKey<'backgroundColor'>
    >()
  })
})
