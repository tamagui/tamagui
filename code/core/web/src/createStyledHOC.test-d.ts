import { describe, expectTypeOf, test } from 'vitest'

import { createStyledHOC } from './createStyledHOC'
import { styled } from './styled'
import type { Ref } from 'react'

import type { GetProps, TamaguiElement } from './types'
import { View } from './views/View'

const Frame = styled(View, {
  variants: {
    pinned: {
      true: { backgroundColor: 'red' },
    },
  } as const,
})

describe('createStyledHOC', () => {
  test('generics infer from the component, render props default to its props', () => {
    const Hoc = createStyledHOC(Frame, (props, ref) => {
      expectTypeOf<boolean | undefined>().toMatchTypeOf<(typeof props)['pinned']>()
      return null
    })

    type Props = GetProps<typeof Hoc>
    expectTypeOf<true>().toMatchTypeOf<Props['pinned']>()
  })

  test('the render ref parameter accepts a required React ref annotation', () => {
    const Hoc = createStyledHOC(Frame, (props, ref: Ref<TamaguiElement>) => {
      expectTypeOf(ref).toEqualTypeOf<Ref<TamaguiElement>>()
      return null
    })
    expectTypeOf<true>().toMatchTypeOf<GetProps<typeof Hoc>['pinned']>()
  })

  test('annotating the render props param merges custom props over the component', () => {
    type ExtraProps = { intent?: 'danger' | 'safe' }

    const Hoc = createStyledHOC(Frame, (props: ExtraProps) => {
      expectTypeOf(props.intent).toEqualTypeOf<'danger' | 'safe' | undefined>()
      return null
    })

    type Props = GetProps<typeof Hoc>
    expectTypeOf<'danger'>().toMatchTypeOf<Props['intent']>()
    // wrapped component props still pass through
    expectTypeOf<true>().toMatchTypeOf<Props['pinned']>()
    // @ts-expect-error invalid custom prop values are rejected
    const invalid: Props['intent'] = 'nope'
    expectTypeOf(invalid).toMatchTypeOf<Props['intent']>()
  })

  test('custom props survive re-styling the HOC', () => {
    type ExtraProps = { intent?: 'danger' | 'safe' }

    const Hoc = createStyledHOC(Frame, (props: ExtraProps) => null)
    const Restyled = styled(Hoc, { backgroundColor: 'blue' })

    type Props = GetProps<typeof Restyled>
    expectTypeOf<'safe'>().toMatchTypeOf<Props['intent']>()
  })

  test('options are the third argument', () => {
    createStyledHOC(Frame, (props) => null, { disableTheme: true })
    createStyledHOC(Frame, (props) => null, {
      staticConfig: { memo: true },
    })
  })
})
