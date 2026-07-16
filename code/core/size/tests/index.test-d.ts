import type { ComponentProps } from 'react'
import type { GenericFont, TokensParsed, Variable } from '@tamagui/web'
import { describe, expectTypeOf, test } from 'vitest'

import {
  createSizeContext,
  createSizeTable,
  resolveTokenSize,
  type SizeTableName,
  type SizeTableProjection,
  type SizeTableSelection,
} from '../src'

declare const extras: {
  tokens: Pick<TokensParsed, 'size' | 'space' | 'radius'>
  font: GenericFont
}

const first = createSizeTable(
  {
    small: {
      frame: { height: 28, borderRadius: '$2' },
      text: { fontSize: '$3' },
      icon: 14,
    },
    large: {
      frame: { height: 44, borderRadius: '$4' },
      text: { fontSize: '$5' },
      icon: 22,
    },
  } as const,
  'small'
)

const second = createSizeTable(
  {
    small: {
      frame: { height: 20 },
      text: { fontSize: '$1' },
      icon: 10,
    },
  } as const,
  'small'
)

describe('size table types', () => {
  test('retains exact names and literal projections', () => {
    expectTypeOf<SizeTableName<typeof first.values>>().toEqualTypeOf<'small' | 'large'>()
    expectTypeOf(first.resolve('small').frame.height).toEqualTypeOf<28>()
    expectTypeOf(first.resolve('large').text.fontSize).toEqualTypeOf<'$5'>()
    expectTypeOf(first.resolve('small').icon).toEqualTypeOf<14>()
    expectTypeOf(first.resolve().frame.height).toEqualTypeOf<28>()
    expectTypeOf(first.frame.small.height).toEqualTypeOf<28>()
    expectTypeOf(first.text.large.fontSize).toEqualTypeOf<'$5'>()
    expectTypeOf(first.icon.small).toEqualTypeOf<14>()
  })

  test('keeps independent table projections', () => {
    expectTypeOf(second.resolve('small').frame.height).toEqualTypeOf<20>()
    expectTypeOf(second.resolve('small').icon).toEqualTypeOf<10>()
  })

  test('exports the resolved selection shape', () => {
    expectTypeOf(first.resolve('small')).toEqualTypeOf<
      SizeTableSelection<typeof first.values, 'small'>
    >()
    expectTypeOf(first.frame).toEqualTypeOf<
      SizeTableProjection<typeof first.values, 'frame'>
    >()
  })

  test('creates table-local size contexts with a default name', () => {
    type FirstProviderProps = ComponentProps<typeof first.Context.Provider>
    type SecondProviderProps = ComponentProps<typeof second.Context.Provider>

    expectTypeOf<FirstProviderProps['size']>().toEqualTypeOf<
      'small' | 'large' | undefined
    >()
    expectTypeOf<SecondProviderProps['size']>().toEqualTypeOf<'small' | undefined>()
    expectTypeOf(first.defaultSize).toEqualTypeOf<'small'>()
  })

  test('creates typed token and raw-size contexts with defaults', () => {
    const context = createSizeContext<'$2' | '$4' | 24 | true>('$2')
    type ProviderProps = ComponentProps<typeof context.Provider>

    expectTypeOf<ProviderProps['size']>().toEqualTypeOf<
      '$2' | '$4' | 24 | true | undefined
    >()
  })

  test('resolves token categories independently and leaves literals intact', () => {
    const token = resolveTokenSize('$4', extras)
    const literal = resolveTokenSize(24, extras)
    const defaults = resolveTokenSize(true, extras)

    expectTypeOf(token.frame.size).toEqualTypeOf<Variable>()
    expectTypeOf(token.frame.space).toEqualTypeOf<Variable>()
    expectTypeOf(token.frame.radius).toEqualTypeOf<Variable>()
    expectTypeOf(token.text.fontSize).toEqualTypeOf<number | Variable>()
    expectTypeOf(token.text.lineHeight).toEqualTypeOf<number | Variable | undefined>()
    expectTypeOf(token.icon).toEqualTypeOf<number | Variable>()
    expectTypeOf(literal.frame.size).toEqualTypeOf<24>()
    expectTypeOf(literal.text.fontSize).toEqualTypeOf<24>()
    expectTypeOf(literal.text.lineHeight).toEqualTypeOf<undefined>()
    expectTypeOf(literal.icon).toEqualTypeOf<24>()
    expectTypeOf(defaults.frame.size).toEqualTypeOf<Variable>()
    expectTypeOf(defaults.text.fontSize).toEqualTypeOf<number | Variable>()
  })

  // @ts-expect-error invalid names are rejected
  first.resolve('medium')

  // @ts-expect-error the default must be a table key
  createSizeTable({ small: { frame: {}, text: {}, icon: 12 } } as const, 'medium')
})
