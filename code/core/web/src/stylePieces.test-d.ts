import { describe, expectTypeOf, test } from 'vitest'

import { style } from './style'
import type { GetProps, StylePiece } from './types'
import { View } from './views/View'

describe('style() pieces', () => {
  test('returns a StylePiece accepted by the style prop', () => {
    const piece = style({
      backgroundColor: 'red10',
      padding: 4,
      opacity: '1 sm:0.5',
    })

    expectTypeOf(piece).toEqualTypeOf<StylePiece>()
    expectTypeOf(piece).toMatchTypeOf<NonNullable<GetProps<typeof View>['style']>>()
    const props: GetProps<typeof View> = { style: [piece, false, null] }
    expectTypeOf(props.style).toEqualTypeOf<GetProps<typeof View>['style']>()
  })

  test('checks style keys and values at the definition', () => {
    style({
      // @ts-expect-error invalid style key
      notAStyle: true,
    })
    style({
      // @ts-expect-error invalid opacity value
      opacity: () => 1,
    })
  })
})
