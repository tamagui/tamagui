import { expectTypeOf, test } from 'vitest'

import type { TextProps } from '../types'
import { html } from './html'

test('text-backed html elements accept the regular Tamagui text prop surface', () => {
  type AnchorProps = React.ComponentProps<typeof html.a>
  expectTypeOf<TextProps['tabIndex']>().toMatchTypeOf<AnchorProps['tabIndex']>()
})

test('html elements type against the web style contract', () => {
  type ParaProps = React.ComponentProps<typeof html.p>
  type DivProps = React.ComponentProps<typeof html.div>
  // the web logical props are in on both backings
  expectTypeOf<
    'marginInline' extends keyof ParaProps ? true : false
  >().toEqualTypeOf<true>()
  expectTypeOf<
    'marginInline' extends keyof DivProps ? true : false
  >().toEqualTypeOf<true>()
  expectTypeOf<'boxShadow' extends keyof ParaProps ? true : false>().toEqualTypeOf<true>()
  // the react-native-only keys are absent, not deprecated and not optional
  expectTypeOf<
    'marginHorizontal' extends keyof ParaProps ? true : false
  >().toEqualTypeOf<false>()
  expectTypeOf<
    'marginHorizontal' extends keyof DivProps ? true : false
  >().toEqualTypeOf<false>()
  expectTypeOf<'elevation' extends keyof DivProps ? true : false>().toEqualTypeOf<false>()
  expectTypeOf<
    'shadowColor' extends keyof DivProps ? true : false
  >().toEqualTypeOf<false>()
  expectTypeOf<
    'textAlignVertical' extends keyof ParaProps ? true : false
  >().toEqualTypeOf<false>()
  expectTypeOf<
    'includeFontPadding' extends keyof ParaProps ? true : false
  >().toEqualTypeOf<false>()
  expectTypeOf<
    'writingDirection' extends keyof ParaProps ? true : false
  >().toEqualTypeOf<false>()
})
