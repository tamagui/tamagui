// css property recognition and public types must agree. omitted type keys do
// not produce diagnostics until a caller uses them, so this suite checks every
// canonical key and the additional tamagui style keys under vitest --typecheck.

import { stylePropsAll, stylePropsText, stylePropsView } from '@tamagui/helpers'
import type { Properties } from 'csstype'
import { describe, expect, expectTypeOf, test } from 'vitest'
import { cssStyleProps } from '../../helpers/src/cssStyleProps'
import type { StackStyleBase, TextStylePropsBase } from './types'

// keys valid on every host (ExtraStyleProps -> both bases)
const sharedAdditions = [
  'border',
  'borderBlock',
  'borderInline',
  'containerName',
  'outline',
  'overflowWrap',
  'wordWrap',
  'resize',
  'pointerEvents',
] as const

// css text composites also support inheritance on browser views.
const textAdditions = ['textDecoration', 'font', 'textShadow'] as const

describe('grammar-era style keys: runtime tables and public types agree', () => {
  test('every shared addition is in the view and text tables', () => {
    for (const key of sharedAdditions) {
      expect(key in stylePropsView, key).toBe(true)
      expect(key in stylePropsText, key).toBe(true)
    }
  })

  test('every css text addition is also valid for browser inheritance on views', () => {
    for (const key of textAdditions) {
      expect(key in stylePropsText, key).toBe(true)
      expect(key in stylePropsAll, key).toBe(true)
      expect(key in stylePropsView, key).toBe(true)
    }
  })

  test('the public types carry the same keys', () => {
    // pick fails to compile when a required key is absent from the style type.
    type _stackPin = Pick<StackStyleBase, (typeof sharedAdditions)[number]>
    type _textPin = Pick<
      TextStylePropsBase,
      (typeof sharedAdditions)[number] | (typeof textAdditions)[number]
    >
    type _allStackCss = Pick<StackStyleBase, keyof Properties>
    type _allTextCss = Pick<TextStylePropsBase, keyof Properties>
    expectTypeOf<
      Exclude<keyof Properties, keyof typeof cssStyleProps>
    >().toEqualTypeOf<never>()
    expectTypeOf<
      Exclude<keyof typeof cssStyleProps, keyof Properties>
    >().toEqualTypeOf<never>()
  })

  test('canonical css properties are recognized instead of forwarded as attributes', () => {
    for (const key of Object.keys(cssStyleProps)) {
      expect(key in stylePropsAll, key).toBe(true)
      expect(key in stylePropsView, key).toBe(true)
      expect(key in stylePropsText, key).toBe(true)
    }
  })
})
