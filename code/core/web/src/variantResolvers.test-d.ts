import { describe, expectTypeOf, test } from 'vitest'

import {
  createVariantResolver as createVariantResolverFromWebPackage,
  type Color as WebPackageColor,
  type Radius as WebPackageRadius,
  type Size as WebPackageSize,
} from '@tamagui/web'
import {
  createVariantResolver as createVariantResolverFromCorePackage,
  type Color as CorePackageColor,
  type Radius as CorePackageRadius,
  type Size as CorePackageSize,
} from '@tamagui/core'
import { createVariantResolver as createVariantResolverFromWebIndex } from './index'
import { createVariantResolver, styled } from './styled'
import * as CoreSource from '../../core/src'
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

  test('createVariantResolver validates every registry member', () => {
    createVariantResolver('Size', (value) => {
      expectTypeOf(value).toEqualTypeOf<Size>()
      return {}
    })
    createVariantResolver('Space', (value) => {
      expectTypeOf(value).toEqualTypeOf<Space>()
      return {}
    })
    createVariantResolver('Color', (value) => {
      expectTypeOf(value).toEqualTypeOf<Color>()
      return {}
    })
    createVariantResolver('Radius', (value) => {
      expectTypeOf(value).toEqualTypeOf<Radius>()
      return {}
    })
    createVariantResolver('ZIndex', (value) => {
      expectTypeOf(value).toEqualTypeOf<ZIndex>()
      return {}
    })
    createVariantResolver('Theme', (value) => {
      expectTypeOf(value).toEqualTypeOf<ThemeTokens>()
      return {}
    })
    createVariantResolver('FontSize', (value) => {
      expectTypeOf(value).toEqualTypeOf<FontSize>()
      return {}
    })
    createVariantResolver('FontStyle', (value) => {
      expectTypeOf(value).toEqualTypeOf<FontStyleTokens>()
      return {}
    })
    createVariantResolver('FontTransform', (value) => {
      expectTypeOf(value).toEqualTypeOf<FontTransformTokens>()
      return {}
    })
    createVariantResolver('FontLineHeight', (value) => {
      expectTypeOf(value).toEqualTypeOf<FontLineHeightTokens>()
      return {}
    })
    createVariantResolver('FontLetterSpacing', (value) => {
      expectTypeOf(value).toEqualTypeOf<FontLetterSpacingTokens>()
      return {}
    })
    createVariantResolver('number', (value) => {
      expectTypeOf(value).toEqualTypeOf<number>()
      return {}
    })
    createVariantResolver('string', (value) => {
      expectTypeOf(value).toEqualTypeOf<string>()
      return {}
    })
    createVariantResolver('boolean', (value) => {
      expectTypeOf(value).toEqualTypeOf<boolean>()
      return {}
    })
    createVariantResolver('any', (value) => {
      expectTypeOf(value).toEqualTypeOf<any>()
      return {}
    })
  })

  test('unions are trimmed and reject invalid registry members', () => {
    createVariantResolver(' Size | number ', (value) => {
      expectTypeOf(value).toEqualTypeOf<Size | number>()
      return {}
    })
    createVariantResolver('\tSize\n|\rnumber\f', (value) => {
      expectTypeOf(value).toEqualTypeOf<Size | number>()
      return {}
    })

    const validKey: VariantResolverKey<'Size | number'> = 'Size | number'
    expectTypeOf(validKey).toEqualTypeOf<'Size | number'>()
    const whitespaceKey: VariantResolverKey<'\tSize\n|\rnumber\f'> =
      '\tSize\n|\rnumber\f'
    expectTypeOf(whitespaceKey).toEqualTypeOf<'\tSize\n|\rnumber\f'>()

    // @ts-expect-error invalid resolver names are not accepted
    createVariantResolver('Size | Nope', () => ({}))

    // @ts-expect-error invalid resolver key aliases become never
    const invalidKey: VariantResolverKey<'Nope'> = 'Nope'
    expectTypeOf(invalidKey).toEqualTypeOf<never>()
  })

  test('resolver value types include representative non-token members', () => {
    createVariantResolver('Radius', (value) => {
      expectTypeOf<6>().toMatchTypeOf<typeof value>()
      expectTypeOf<'1rem'>().toMatchTypeOf<typeof value>()
      return {}
    })
    createVariantResolver('ZIndex', (value) => {
      expectTypeOf<2>().toMatchTypeOf<typeof value>()
      return {}
    })
    createVariantResolver('FontSize', (value) => {
      expectTypeOf<18>().toMatchTypeOf<typeof value>()
      expectTypeOf<'1rem'>().toMatchTypeOf<typeof value>()
      return {}
    })
    createVariantResolver('Color', (value) => {
      expectTypeOf<'red'>().toMatchTypeOf<typeof value>()
      expectTypeOf<'$color/50'>().toMatchTypeOf<typeof value>()
      expectTypeOf<'$/0x10'>().toMatchTypeOf<typeof value>()
      expectTypeOf<'$color/.5'>().toMatchTypeOf<typeof value>()
      expectTypeOf<'$color/-1'>().toMatchTypeOf<typeof value>()
      expectTypeOf<'$color/+1'>().toMatchTypeOf<typeof value>()
      expectTypeOf<'$color/1e3'>().toMatchTypeOf<typeof value>()
      expectTypeOf<'$not/Configured/1E-3'>().toMatchTypeOf<typeof value>()
      return {}
    })
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

  test('public source entries export createVariantResolver', () => {
    createVariantResolverFromWebIndex('string', (value) => {
      expectTypeOf(value).toEqualTypeOf<string>()
      return {}
    })
    CoreSource.createVariantResolver('number', (value) => {
      expectTypeOf(value).toEqualTypeOf<number>()
      return {}
    })
  })

  test('package entries export createVariantResolver and preferred aliases', () => {
    createVariantResolverFromWebPackage('Size | Color | Radius', (value) => {
      expectTypeOf(value).toEqualTypeOf<
        WebPackageSize | WebPackageColor | WebPackageRadius
      >()
      return {}
    })
    createVariantResolverFromCorePackage('Size | Color | Radius', (value) => {
      expectTypeOf(value).toEqualTypeOf<
        CorePackageSize | CorePackageColor | CorePackageRadius
      >()
      return {}
    })
  })

  test('helper extras props are generic unless explicitly annotated', () => {
    createVariantResolver('Size', (value, extras) => {
      expectTypeOf(value).toEqualTypeOf<Size>()
      expectTypeOf(extras.props).toMatchTypeOf<Record<string, any>>()
      expectTypeOf(extras.fonts).toMatchTypeOf<Record<string, any>>()
      return {}
    })

    type MyProps = {
      tone?: 'critical'
      disabled?: boolean
    }

    createVariantResolver('Size', (value, extras: VariantSpreadExtras<MyProps>) => {
      expectTypeOf(value).toEqualTypeOf<Size>()
      expectTypeOf(extras.props).toEqualTypeOf<MyProps>()
      expectTypeOf(extras.props.tone).toEqualTypeOf<'critical' | undefined>()
      return {}
    })
  })

  test('raw TS-style resolver callbacks are runtime-supported but not contextually typed', () => {
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
  })

  test('styled variant props infer exact values and resolver values', () => {
    const Comp = styled(View, {
      variants: {
        tone: {
          sm: {
            width: 10,
          },
          'Size | number': createVariantResolver('Size | number', (value) => {
            expectTypeOf(value).toEqualTypeOf<Size | number>()
            return {
              width: value,
            }
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
          number: createVariantResolver('number', (value) => {
            expectTypeOf(value).toEqualTypeOf<number>()
            return {}
          }),
          string: createVariantResolver('string', (value) => {
            expectTypeOf(value).toEqualTypeOf<string>()
            return {}
          }),
          boolean: createVariantResolver('boolean', (value) => {
            expectTypeOf(value).toEqualTypeOf<boolean>()
            return {}
          }),
        },
      } as const,
    })

    type Props = GetProps<typeof Comp>
    expectTypeOf<1>().toMatchTypeOf<Props['kind']>()
    expectTypeOf<'1'>().toMatchTypeOf<Props['kind']>()
    expectTypeOf<true>().toMatchTypeOf<Props['kind']>()
  })
})
