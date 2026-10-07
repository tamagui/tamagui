// css property recognition and public types must agree. omitted type keys do
// not produce diagnostics until a caller uses them, so this suite checks every
// canonical key and the additional tamagui style keys under vitest --typecheck.

import { stylePropsAll, stylePropsText, stylePropsView } from '@tamagui/helpers'
import type { Properties } from 'csstype'
import { describe, expect, expectTypeOf, test } from 'vitest'
import { cssStyleProps } from '../../helpers/src/cssStyleProps'
import type {
  GetFinalProps,
  StackNonStyleProps,
  StackStyleBase,
  TamaguiComponentPropsBase,
  TextNonStyleProps,
  TextStylePropsBase,
} from './types'

type PublicStackProps = GetFinalProps<StackNonStyleProps, StackStyleBase, {}>
type PublicTextProps = GetFinalProps<TextNonStyleProps, TextStylePropsBase, {}>

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
    type _allStackCss = Pick<PublicStackProps, keyof Properties>
    type _allTextCss = Pick<PublicTextProps, keyof Properties>
    expectTypeOf<
      Exclude<keyof Properties, keyof typeof cssStyleProps>
    >().toEqualTypeOf<never>()
    expectTypeOf<
      Exclude<keyof typeof cssStyleProps, keyof Properties>
    >().toEqualTypeOf<never>()
  })

  test('the container query prop retains its boolean and named container API', () => {
    expectTypeOf<PublicStackProps['container']>().toEqualTypeOf<
      TamaguiComponentPropsBase['container']
    >()
    expectTypeOf<PublicTextProps['container']>().toEqualTypeOf<
      TamaguiComponentPropsBase['container']
    >()
    expectTypeOf<Extract<keyof StackStyleBase, 'container'>>().toEqualTypeOf<never>()
    expectTypeOf<Extract<keyof TextStylePropsBase, 'container'>>().toEqualTypeOf<never>()
  })

  test('canonical css properties are recognized instead of forwarded as attributes', () => {
    for (const key of Object.keys(cssStyleProps)) {
      expect(key in stylePropsAll, key).toBe(true)
      expect(key in stylePropsView, key).toBe(true)
      expect(key in stylePropsText, key).toBe(true)
    }
  })
})
