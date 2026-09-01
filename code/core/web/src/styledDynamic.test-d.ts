import { describe, expectTypeOf, test } from 'vitest'

import type { FlatStyleValue, GetProps, StyledDynamicEnv } from './types'
import { styled } from './styled'
import { View } from './views/View'

type Cond<T> = FlatStyleValue<T> | undefined

describe('styled.dynamic', () => {
  test('function form: value type flows to the prop and the callback', () => {
    const Sized = styled(View, {
      variants: {
        size: styled.dynamic<'big' | 'small'>((value, env) => {
          expectTypeOf(value).toEqualTypeOf<'big' | 'small'>()
          expectTypeOf(env).toEqualTypeOf<StyledDynamicEnv>()
          return { width: value === 'big' ? 200 : 50 }
        }),
      },
    })

    type Props = GetProps<typeof Sized>
    expectTypeOf<Props['size']>().toEqualTypeOf<Cond<'big' | 'small'>>()
  })

  test('bare form: declares a typed consumed prop', () => {
    const Toned = styled(View, {
      variants: {
        tone: styled.dynamic<'neutral' | 'critical'>(),
      },
    })

    type Props = GetProps<typeof Toned>
    expectTypeOf<Props['tone']>().toEqualTypeOf<Cond<'neutral' | 'critical'>>()
  })

  test('dynamic props work in defaultVariants', () => {
    styled(View, {
      variants: {
        tone: styled.dynamic<'neutral' | 'critical'>(),
      },
      defaultVariants: {
        tone: 'neutral',
      },
    })

    styled(View, {
      variants: {
        tone: styled.dynamic<'neutral' | 'critical'>(),
      },
      defaultVariants: {
        // @ts-expect-error not an accepted value
        tone: 'loud',
      },
    })
  })
})

describe('.resolve', () => {
  test('receives the complete props including variants, returns styles', () => {
    const Thing = styled(View, {
      variants: {
        big: {
          true: { width: 100 },
        },
        tone: styled.dynamic<'neutral' | 'critical'>(),
      },
    }).resolve((props, env) => {
      expectTypeOf(props.tone).toEqualTypeOf<Cond<'neutral' | 'critical'>>()
      expectTypeOf(props.big).toEqualTypeOf<Cond<boolean>>()
      expectTypeOf(env).toEqualTypeOf<StyledDynamicEnv>()
      return {
        backgroundColor: props.tone === 'critical' ? 'red' : undefined,
      }
    })

    type Props = GetProps<typeof Thing>
    expectTypeOf<Props['tone']>().toEqualTypeOf<Cond<'neutral' | 'critical'>>()

    // the resolved component still accepts styled() extension
    const Extended = styled(Thing, { opacity: 0.5 })
    type ExtendedProps = GetProps<typeof Extended>
    expectTypeOf<ExtendedProps['tone']>().toEqualTypeOf<Cond<'neutral' | 'critical'>>()
  })
})
