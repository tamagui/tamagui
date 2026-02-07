process.env.TAMAGUI_TARGET = 'web'

import { describe, expectTypeOf, test } from 'vitest'
import type { StackStyleBase } from '../web/src'

// the default config has onlyShorthandStyleProps unset (false),
// so the type-level behavior is: longhands are available.
// we test both the default and a simulated "true" case via conditional types.

type HasProp<T, K extends string> = K extends keyof T ? true : false

describe('onlyShorthandStyleProps - default (false)', () => {
  // by default, both shorthands and longhands should be available

  test('border shorthand is available', () => {
    expectTypeOf<HasProp<StackStyleBase, 'border'>>().toEqualTypeOf<true>()
  })

  test('outline shorthand is available', () => {
    expectTypeOf<HasProp<StackStyleBase, 'outline'>>().toEqualTypeOf<true>()
  })

  test('boxShadow shorthand is available', () => {
    expectTypeOf<HasProp<StackStyleBase, 'boxShadow'>>().toEqualTypeOf<true>()
  })

  test('border longhands are available', () => {
    expectTypeOf<HasProp<StackStyleBase, 'borderWidth'>>().toEqualTypeOf<true>()
    expectTypeOf<HasProp<StackStyleBase, 'borderStyle'>>().toEqualTypeOf<true>()
    expectTypeOf<HasProp<StackStyleBase, 'borderColor'>>().toEqualTypeOf<true>()
  })

  test('outline longhands are available', () => {
    expectTypeOf<HasProp<StackStyleBase, 'outlineWidth'>>().toEqualTypeOf<true>()
    expectTypeOf<HasProp<StackStyleBase, 'outlineStyle'>>().toEqualTypeOf<true>()
    expectTypeOf<HasProp<StackStyleBase, 'outlineColor'>>().toEqualTypeOf<true>()
    expectTypeOf<HasProp<StackStyleBase, 'outlineOffset'>>().toEqualTypeOf<true>()
  })

  test('shadow longhands are available', () => {
    expectTypeOf<HasProp<StackStyleBase, 'shadowColor'>>().toEqualTypeOf<true>()
    expectTypeOf<HasProp<StackStyleBase, 'shadowOffset'>>().toEqualTypeOf<true>()
    expectTypeOf<HasProp<StackStyleBase, 'shadowOpacity'>>().toEqualTypeOf<true>()
    expectTypeOf<HasProp<StackStyleBase, 'shadowRadius'>>().toEqualTypeOf<true>()
  })
})

describe('onlyShorthandStyleProps - conditional type simulation', () => {
  // simulate what happens when the setting is true by manually applying
  // the same Omit that MaybeOmitLonghands does

  type ShorthandLonghandProps =
    | 'borderWidth'
    | 'borderStyle'
    | 'borderColor'
    | 'outlineWidth'
    | 'outlineStyle'
    | 'outlineColor'
    | 'outlineOffset'
    | 'shadowColor'
    | 'shadowOffset'
    | 'shadowOpacity'
    | 'shadowRadius'

  type WithSettingEnabled = Omit<StackStyleBase, ShorthandLonghandProps>

  test('shorthands are still available', () => {
    expectTypeOf<HasProp<WithSettingEnabled, 'border'>>().toEqualTypeOf<true>()
    expectTypeOf<HasProp<WithSettingEnabled, 'outline'>>().toEqualTypeOf<true>()
    expectTypeOf<HasProp<WithSettingEnabled, 'boxShadow'>>().toEqualTypeOf<true>()
  })

  test('border longhands are removed', () => {
    expectTypeOf<HasProp<WithSettingEnabled, 'borderWidth'>>().toEqualTypeOf<false>()
    expectTypeOf<HasProp<WithSettingEnabled, 'borderStyle'>>().toEqualTypeOf<false>()
    expectTypeOf<HasProp<WithSettingEnabled, 'borderColor'>>().toEqualTypeOf<false>()
  })

  test('outline longhands are removed', () => {
    expectTypeOf<HasProp<WithSettingEnabled, 'outlineWidth'>>().toEqualTypeOf<false>()
    expectTypeOf<HasProp<WithSettingEnabled, 'outlineStyle'>>().toEqualTypeOf<false>()
    expectTypeOf<HasProp<WithSettingEnabled, 'outlineColor'>>().toEqualTypeOf<false>()
    expectTypeOf<HasProp<WithSettingEnabled, 'outlineOffset'>>().toEqualTypeOf<false>()
  })

  test('shadow longhands are removed', () => {
    expectTypeOf<HasProp<WithSettingEnabled, 'shadowColor'>>().toEqualTypeOf<false>()
    expectTypeOf<HasProp<WithSettingEnabled, 'shadowOffset'>>().toEqualTypeOf<false>()
    expectTypeOf<HasProp<WithSettingEnabled, 'shadowOpacity'>>().toEqualTypeOf<false>()
    expectTypeOf<HasProp<WithSettingEnabled, 'shadowRadius'>>().toEqualTypeOf<false>()
  })

  test('unrelated props are not affected', () => {
    expectTypeOf<HasProp<WithSettingEnabled, 'backgroundColor'>>().toEqualTypeOf<true>()
    expectTypeOf<HasProp<WithSettingEnabled, 'padding'>>().toEqualTypeOf<true>()
    expectTypeOf<HasProp<WithSettingEnabled, 'opacity'>>().toEqualTypeOf<true>()
  })
})
