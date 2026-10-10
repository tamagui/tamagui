// css property recognition and public types must agree. omitted type keys do
// not produce diagnostics until a caller uses them, so this suite checks every
// canonical key and the additional tamagui style keys under vitest --typecheck.

import { stylePropsAll, stylePropsText, stylePropsView } from '@tamagui/helpers'
import type { UnprefixedCSSProperties } from './dom/styleTypes'
import { describe, expect, expectTypeOf, test } from 'vitest'
import { cssStyleProps } from '../../helpers/src/cssStyleProps'
import { createStyledHOC } from './createStyledHOC'
import { createStyledContext } from './helpers/createStyledContext'
import { styled } from './styled'
import { View } from './views/View'
import type {
  GetFinalProps,
  FlatStyleValue,
  GetProps,
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
    type _allStackCss = Pick<PublicStackProps, keyof UnprefixedCSSProperties>
    type _allTextCss = Pick<PublicTextProps, keyof UnprefixedCSSProperties>
    expectTypeOf<
      Exclude<keyof UnprefixedCSSProperties, keyof typeof stylePropsAll>
    >().toEqualTypeOf<never>()
    expectTypeOf<
      Exclude<keyof typeof cssStyleProps, keyof UnprefixedCSSProperties>
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

  test('an explicit css-named variant owns its public value type', () => {
    type VariantProps = GetFinalProps<
      StackNonStyleProps,
      StackStyleBase,
      { accentColor: boolean }
    >
    const VariantView = styled(View, {
      variants: { accentColor: { true: { opacity: 0.4 } } },
      accentColor: true,
    })
    expectTypeOf<GetProps<typeof VariantView>['accentColor']>().toEqualTypeOf<
      FlatStyleValue<boolean> | undefined
    >()
    expectTypeOf<VariantProps['accentColor']>().toEqualTypeOf<
      FlatStyleValue<boolean> | undefined
    >()
  })

  test('css-named context values retain their type without narrowing inherited styles', () => {
    const Context = createStyledContext({ fillOpacity: false, width: 0 })
    const ContextView = styled(View, { context: Context, fillOpacity: true })
    expectTypeOf<GetProps<typeof ContextView>['fillOpacity']>().toEqualTypeOf<
      FlatStyleValue<boolean> | undefined
    >()
    expectTypeOf<GetProps<typeof ContextView>['width']>().toEqualTypeOf<
      GetProps<typeof View>['width']
    >()
  })

  test('an explicit css-named HOC prop retains its type when restyled', () => {
    const Receiver = createStyledHOC(View, (_props: { fillOpacity?: boolean }) => null)
    const Restyled = styled(Receiver, {})
    expectTypeOf<GetProps<typeof Receiver>['fillOpacity']>().toEqualTypeOf<
      boolean | undefined
    >()
    expectTypeOf<GetProps<typeof Restyled>['fillOpacity']>().toEqualTypeOf<
      boolean | undefined
    >()
  })

  test('an explicit css-named inline prop retains its receiver type', () => {
    const Receiver = styled(
      (_props: { fillOpacity?: boolean }) => null,
      {},
      {
        inlineProps: new Set(['fillOpacity']),
      }
    )
    expectTypeOf<GetProps<typeof Receiver>['fillOpacity']>().toEqualTypeOf<
      boolean | undefined
    >()
  })

  test('generated CSS additions are unprefixed and recognized by every browser host', () => {
    for (const key of Object.keys(cssStyleProps)) {
      expect(key).not.toMatch(/^(Webkit|Moz|ms)/)
      expect(key in stylePropsAll, key).toBe(true)
      expect(key in stylePropsView, key).toBe(true)
      expect(key in stylePropsText, key).toBe(true)
    }
  })
})
