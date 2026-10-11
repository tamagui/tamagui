import { describe, expectTypeOf, test } from 'vitest'

import { splitStyleProps } from './splitStyleProps'
import type { SplitStylePropsResult } from './splitStyleProps'

describe('splitStyleProps types', () => {
  test('default splitting separates known style keys', () => {
    const [styleProps, regularProps] = splitStyleProps({
      id: 'save' as const,
      opacity: 0.5,
    })

    expectTypeOf(styleProps).toEqualTypeOf<{ opacity: number }>()
    expectTypeOf(regularProps).toEqualTypeOf<{ id: 'save' }>()
  })

  test('a filter map narrows both sides', () => {
    const [selectedProps, remainingProps] = splitStyleProps(
      {
        id: 'title' as const,
        numberOfLines: 1,
        opacity: 0.5,
      },
      {
        filter: {
          numberOfLines: true,
          opacity: true,
        },
      }
    )

    expectTypeOf(selectedProps).toEqualTypeOf<{
      numberOfLines: number
      opacity: number
    }>()
    expectTypeOf(remainingProps).toEqualTypeOf<{ id: 'title' }>()
  })

  test('a type-guard callback narrows both sides', () => {
    const props = {
      id: 'title' as const,
      opacity: 0.5,
    }
    const [selectedProps, remainingProps] = splitStyleProps(props, {
      filter: (_key, _value, originalKey): originalKey is 'opacity' => {
        return originalKey === 'opacity'
      },
    })

    expectTypeOf(selectedProps).toEqualTypeOf<{ opacity: number }>()
    expectTypeOf(remainingProps).toEqualTypeOf<{ id: 'title' }>()
  })

  test('expanded results remap configured shorthand keys', () => {
    type Result = SplitStylePropsResult<
      { id: 'save'; p: number },
      'p',
      true,
      { p: 'padding' }
    >

    expectTypeOf<Result[0]>().toEqualTypeOf<{ padding: number }>()
    expectTypeOf<Result[1]>().toEqualTypeOf<{ id: 'save' }>()
  })
})
