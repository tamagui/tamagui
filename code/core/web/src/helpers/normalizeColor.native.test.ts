import { expect, test } from 'vitest'
import { normalizeColor } from './normalizeColor.native'

const shadowToken = {
  dynamic: { light: 'rgba(0,0,0,0.085)', dark: 'rgba(0,0,0,0.35)' },
}

test('applies an alpha suffix to every appearance of a DynamicColorIOS value', () => {
  // returning the object untouched here resolved `$color/70` and `$color/0` to
  // the fully opaque colour, so a `linear-gradient($color, $color/70, $color/0)`
  // collapsed into a solid fill.
  expect(normalizeColor(shadowToken, 0.7)).toEqual({
    dynamic: { light: 'rgba(0,0,0,0.7)', dark: 'rgba(0,0,0,0.7)' },
  })
  expect(normalizeColor(shadowToken, 0)).toEqual({
    dynamic: { light: 'rgba(0,0,0,0)', dark: 'rgba(0,0,0,0)' },
  })
})

test('leaves a DynamicColorIOS value alone when no alpha suffix was written', () => {
  // getSplitStyles normalizes a shadow colour with `shadow[2] ?? 1`, so opacity 1
  // means "no override" rather than "make it opaque". applying it would drop a
  // shadow token's own alpha and paint solid black under every floating surface.
  expect(normalizeColor(shadowToken, 1)).toBe(shadowToken)
  expect(normalizeColor(shadowToken, undefined)).toBe(shadowToken)
})
