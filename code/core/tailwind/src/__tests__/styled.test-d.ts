import { describe, expectTypeOf, test } from 'vitest'

import { Text, View, styled } from '../index'
import type { TailwindTextProps, TailwindViewProps } from '../types'

type HasKey<T, K> = K extends keyof T ? true : false

describe('the tailwind style surface is className only', () => {
  test('className is the styling prop', () => {
    expectTypeOf<HasKey<TailwindViewProps, 'className'>>().toEqualTypeOf<true>()
    expectTypeOf<HasKey<TailwindTextProps, 'className'>>().toEqualTypeOf<true>()
  })

  test('tamagui inline style props are absent', () => {
    expectTypeOf<HasKey<TailwindViewProps, 'padding'>>().toEqualTypeOf<false>()
    expectTypeOf<HasKey<TailwindViewProps, 'backgroundColor'>>().toEqualTypeOf<false>()
    expectTypeOf<HasKey<TailwindViewProps, 'bg'>>().toEqualTypeOf<false>()
    expectTypeOf<HasKey<TailwindTextProps, 'fontSize'>>().toEqualTypeOf<false>()
  })

  test('ordinary behavior props remain', () => {
    expectTypeOf<HasKey<TailwindViewProps, 'children'>>().toEqualTypeOf<true>()
    expectTypeOf<HasKey<TailwindViewProps, 'id'>>().toEqualTypeOf<true>()
    expectTypeOf<HasKey<TailwindViewProps, 'onPress'>>().toEqualTypeOf<true>()
    expectTypeOf<HasKey<TailwindViewProps, 'style'>>().toEqualTypeOf<true>()
    expectTypeOf<HasKey<TailwindViewProps, 'aria-label'>>().toEqualTypeOf<true>()
  })
})

describe('components accept and reject the right props', () => {
  test('className, behavior props, and refs type', () => {
    View({ className: 'p-4', id: 'account', onPress: () => {} })
    Text({ className: 'text-lg', children: 'hi' })
  })

  test('tamagui style props are rejected', () => {
    // @ts-expect-error padding belongs to @tamagui/core authoring
    View({ padding: 4 })
    // @ts-expect-error bg belongs to @tamagui/core authoring
    View({ bg: 'red' })
  })
})

describe('class-first styled()', () => {
  const Frame = styled(View, 'bg-surface p-4', {
    displayName: 'Frame',
    variants: {
      tone: {
        warn: 'bg-yellow-500',
        danger: 'bg-red-500',
      },
      big: {
        true: 'p-8',
        false: 'p-2',
      },
    },
  })

  test('variant props are inferred finitely', () => {
    Frame({ tone: 'danger', className: 'rounded-lg' })
    Frame({ big: true })
    // @ts-expect-error 'quiet' is not one of the declared tone matchers
    Frame({ tone: 'quiet' })
  })

  test('a styled component still rejects tamagui style props', () => {
    // @ts-expect-error the class-first surface never gains inline style props
    Frame({ padding: 4 })
  })

  test('variant values must be class strings', () => {
    styled(View, 'p-4', {
      variants: {
        // @ts-expect-error object styles are the @tamagui/core authoring syntax
        tone: { warn: { backgroundColor: 'red' } },
      },
    })
  })

  test('a child styled component inherits its parent variants', () => {
    const Child = styled(Frame, 'rounded-lg', {
      variants: {
        flat: { true: 'shadow-none' },
      },
    })
    Child({ tone: 'warn', flat: true, className: 'p-2' })
    // @ts-expect-error still not an inline style surface
    Child({ padding: 4 })
  })

  test('the object-only overload works without a base class', () => {
    const Plain = styled(View, {
      variants: {
        tone: { warn: 'bg-yellow-500' },
      },
    })
    Plain({ tone: 'warn' })
  })
})
