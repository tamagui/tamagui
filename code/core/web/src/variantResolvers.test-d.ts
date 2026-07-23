import { describe, expectTypeOf, test } from 'vitest'

import { styled } from './styled'
import type {
  Color,
  ColorTokens,
  FontLetterSpacingTokens,
  FontLineHeightTokens,
  FontSize,
  FontSizeTokens,
  FontStyleTokens,
  FontTransformTokens,
  GetProps,
  Radius,
  RadiusTokens,
  Size,
  SizeTokens,
  Space,
  SpaceTokens,
  ThemeTokens,
  Variable,
  VariantResolverKey,
  VariantResolverValue,
  VariantSpreadExtras,
  ZIndex,
  ZIndexTokens,
} from './types'
import { View } from './views/View'

describe('variant resolver types', () => {
  test('preferred token type names keep compatibility aliases', () => {
    expectTypeOf<Size>().toEqualTypeOf<SizeTokens>()
    expectTypeOf<Space>().toEqualTypeOf<SpaceTokens>()
    expectTypeOf<Color>().toEqualTypeOf<ColorTokens>()
    expectTypeOf<Radius>().toEqualTypeOf<RadiusTokens>()
    expectTypeOf<ZIndex>().toEqualTypeOf<ZIndexTokens>()
    expectTypeOf<FontSize>().toEqualTypeOf<FontSizeTokens>()
  })

  test('every resolver name maps to its value type', () => {
    expectTypeOf<VariantResolverValue<'Size'>>().toEqualTypeOf<Size>()
    expectTypeOf<VariantResolverValue<'Space'>>().toEqualTypeOf<Space>()
    expectTypeOf<VariantResolverValue<'Color'>>().toEqualTypeOf<Color>()
    expectTypeOf<VariantResolverValue<'Radius'>>().toEqualTypeOf<Radius>()
    expectTypeOf<VariantResolverValue<'ZIndex'>>().toEqualTypeOf<ZIndex>()
    expectTypeOf<VariantResolverValue<'Theme'>>().toEqualTypeOf<ThemeTokens>()
    expectTypeOf<VariantResolverValue<'FontSize'>>().toEqualTypeOf<FontSize>()
    expectTypeOf<VariantResolverValue<'FontStyle'>>().toEqualTypeOf<FontStyleTokens>()
    expectTypeOf<
      VariantResolverValue<'FontTransform'>
    >().toEqualTypeOf<FontTransformTokens>()
    expectTypeOf<
      VariantResolverValue<'FontLineHeight'>
    >().toEqualTypeOf<FontLineHeightTokens>()
    expectTypeOf<
      VariantResolverValue<'FontLetterSpacing'>
    >().toEqualTypeOf<FontLetterSpacingTokens>()
    expectTypeOf<VariantResolverValue<'number'>>().toEqualTypeOf<number>()
    expectTypeOf<VariantResolverValue<'string'>>().toEqualTypeOf<string>()
    expectTypeOf<VariantResolverValue<'boolean'>>().toEqualTypeOf<boolean>()
    expectTypeOf<VariantResolverValue<'any'>>().toEqualTypeOf<any>()
  })

  test('unions are trimmed and reject invalid registry members', () => {
    expectTypeOf<VariantResolverValue<' Size | number '>>().toEqualTypeOf<Size | number>()
    expectTypeOf<VariantResolverValue<'\tSize\n|\rnumber\f'>>().toEqualTypeOf<
      Size | number
    >()

    const validKey: VariantResolverKey<'Size | number'> = 'Size | number'
    expectTypeOf(validKey).toEqualTypeOf<'Size | number'>()
    const whitespaceKey: VariantResolverKey<'\tSize\n|\rnumber\f'> = '\tSize\n|\rnumber\f'
    expectTypeOf(whitespaceKey).toEqualTypeOf<'\tSize\n|\rnumber\f'>()

    // @ts-expect-error invalid resolver key aliases become never
    const invalidKey: VariantResolverKey<'Nope'> = 'Nope'
    expectTypeOf(invalidKey).toEqualTypeOf<never>()
    expectTypeOf<VariantResolverKey<'Size | Nope'>>().toEqualTypeOf<never>()
  })

  test('resolver value types include representative non-token members', () => {
    expectTypeOf<6>().toMatchTypeOf<VariantResolverValue<'Radius'>>()
    expectTypeOf<'1rem'>().toMatchTypeOf<VariantResolverValue<'Radius'>>()
    expectTypeOf<2>().toMatchTypeOf<VariantResolverValue<'ZIndex'>>()
    expectTypeOf<18>().toMatchTypeOf<VariantResolverValue<'FontSize'>>()
    expectTypeOf<'1rem'>().toMatchTypeOf<VariantResolverValue<'FontSize'>>()
    expectTypeOf<'red'>().toMatchTypeOf<VariantResolverValue<'Color'>>()
    expectTypeOf<'$color/50'>().toMatchTypeOf<VariantResolverValue<'Color'>>()
    expectTypeOf<'$/0x10'>().toMatchTypeOf<VariantResolverValue<'Color'>>()
    expectTypeOf<'$color/.5'>().toMatchTypeOf<VariantResolverValue<'Color'>>()
    expectTypeOf<'$color/-1'>().toMatchTypeOf<VariantResolverValue<'Color'>>()
    expectTypeOf<'$color/+1'>().toMatchTypeOf<VariantResolverValue<'Color'>>()
    expectTypeOf<'$color/1e3'>().toMatchTypeOf<VariantResolverValue<'Color'>>()
    expectTypeOf<'$not/Configured/1E-3'>().toMatchTypeOf<VariantResolverValue<'Color'>>()
  })

  test('variables are excluded from Size and included in fallback aliases', () => {
    const variable = {} as Variable
    // @ts-expect-error Size does not include Variable
    const invalidSize: Size = variable
    expectTypeOf(invalidSize).toEqualTypeOf<Size>()

    const validSpace: Space = variable
    const validRadius: Radius = variable
    const validZIndex: ZIndex = variable
    expectTypeOf(validSpace).toMatchTypeOf<Space>()
    expectTypeOf(validRadius).toMatchTypeOf<Radius>()
    expectTypeOf(validZIndex).toMatchTypeOf<ZIndex>()
  })

  test('resolver callbacks are runtime-matched by key, values need annotations', () => {
    styled(View, {
      variants: {
        tone: {
          'Size | number': (value, extras) => {
            expectTypeOf(value).toEqualTypeOf<any>()
            expectTypeOf(extras.props).toMatchTypeOf<Record<string, any>>()
            return {
              width: value,
            }
          },
        },
      } as const,
    })

    type MyProps = {
      tone?: 'critical'
      disabled?: boolean
    }

    styled(View, {
      variants: {
        pad: {
          Size: (value: Size, extras: VariantSpreadExtras<MyProps>) => {
            expectTypeOf(value).toEqualTypeOf<Size>()
            expectTypeOf(extras.props).toEqualTypeOf<MyProps>()
            expectTypeOf(extras.props.tone).toEqualTypeOf<'critical' | undefined>()
            return {}
          },
        },
      } as const,
    })
  })

  test('styled variant props infer exact values and resolver values from keys', () => {
    const Comp = styled(View, {
      variants: {
        tone: {
          sm: {
            width: 10,
          },
          'Size | number': (value: Size | number) => ({
            width: value,
          }),
        },
      } as const,
    })

    type Props = GetProps<typeof Comp>
    expectTypeOf<'sm'>().toMatchTypeOf<Props['tone']>()
    expectTypeOf<'$4'>().toMatchTypeOf<Props['tone']>()
    expectTypeOf<4>().toMatchTypeOf<Props['tone']>()
    // @ts-expect-error object is not accepted by exact or Size | number
    const invalid: Props['tone'] = {}
    expectTypeOf(invalid).toEqualTypeOf<Props['tone']>()
  })

  test('primitive resolver values stay distinct in props', () => {
    const Comp = styled(View, {
      variants: {
        kind: {
          number: (value: number) => ({}),
          string: (value: string) => ({}),
          boolean: (value: boolean) => ({}),
        },
      } as const,
    })

    type Props = GetProps<typeof Comp>
    expectTypeOf<1>().toMatchTypeOf<Props['kind']>()
    expectTypeOf<'1'>().toMatchTypeOf<Props['kind']>()
    expectTypeOf<true>().toMatchTypeOf<Props['kind']>()
  })
})
