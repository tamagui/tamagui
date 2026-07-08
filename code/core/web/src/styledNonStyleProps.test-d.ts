/**
 * Regression type tests for issue #4010.
 *
 * When a config's `Themes` type carries a string index signature (which the generic
 * config and many real configs do, e.g. @tamagui/config), `keyof Themes` resolves to
 * `string` and `ThemeMediaKeys` used to become `$theme-${string}`. that template-literal
 * key collapsed the whole `WithMediaProps` mapped type into a `[key: string]` index
 * signature, which then swallowed every non-style prop on a styled() component (onPress,
 * onPressIn, children, ...) and even the styled() options object. the public type then
 * typed `onPress`/`children` as the style token union instead of a function / react node.
 *
 * the index-signature collapse only surfaces against the built declarations a downstream
 * project consumes (where `keyof Themes` becomes literally `string`). these tests pin the
 * root-cause type (`ThemeMediaKeys`) directly so the regression is caught from source, and
 * also assert the resulting styled() public props stay correct.
 *
 * Run with: bun run test:web
 */

import { describe, expectTypeOf, test } from 'vitest'
import { styled } from './styled'
import { createStyledContext } from './helpers/createStyledContext'
import { View } from './views/View'
import { Text } from './views/Text'
import type { GetProps, MediaPropKeys, PlatformMediaKeys, ThemeMediaKeys } from './types'

// builds a mapped type from a key union, mirroring how WithMediaProps maps over its keys
type IndexedBy<K extends PropertyKey> = { [P in K]?: number }
type HasStringIndex<T> = string extends keyof T ? true : false

describe('issue #4010 - ThemeMediaKeys must not collapse to a string index', () => {
  test('a loose Themes (keyof = string) yields no theme media keys', () => {
    // root cause: without the guard this was `$theme-${string}`, a template-literal key
    // that turns any mapped type over it into a `[key: string]` index signature
    expectTypeOf<ThemeMediaKeys<string>>().toEqualTypeOf<never>()
  })

  test('mapping over the loose-Themes result introduces no string index signature', () => {
    expectTypeOf<
      HasStringIndex<IndexedBy<ThemeMediaKeys<string>>>
    >().toEqualTypeOf<false>()
  })

  test('concrete themes still produce usable $theme- keys, sub-themes excluded', () => {
    expectTypeOf<ThemeMediaKeys<'light' | 'dark' | 'light_red'>>().toEqualTypeOf<
      '$theme-light' | '$theme-dark'
    >()
  })
})

describe('platform media keys', () => {
  test('a loose Media (keyof = string) yields no media keys', () => {
    expectTypeOf<MediaPropKeys>().toEqualTypeOf<never>()
  })

  test('platform props use short keys', () => {
    expectTypeOf<PlatformMediaKeys>().toEqualTypeOf<
      '$web' | '$native' | '$android' | '$ios' | '$tv' | '$androidtv' | '$tvos'
    >()
  })

  test('$web accepts web-only style props', () => {
    type PlainProps = GetProps<typeof View>
    const webProps: PlainProps['$web'] = {
      position: 'fixed',
      touchAction: 'none',
      textWrap: 'balance',
    }
    expectTypeOf(webProps).toMatchTypeOf<PlainProps['$web']>()
  })
})

describe('issue #4010 - non-style props survive styled()', () => {
  // exact repro shape from the official "how to build a button" guide
  const ButtonContext = createStyledContext({ size: '$md' as any })

  const ButtonFrame = styled(View, {
    name: 'Button',
    context: ButtonContext,
    variants: { size: { $md: { padding: '$3' } } } as const,
    defaultVariants: { size: '$md' },
  })

  const ButtonText = styled(Text, { name: 'ButtonText', context: ButtonContext })

  type ButtonFrameProps = GetProps<typeof ButtonFrame>
  type ButtonTextProps = GetProps<typeof ButtonText>

  test('styled() public props have no string index signature', () => {
    expectTypeOf<HasStringIndex<ButtonFrameProps>>().toEqualTypeOf<false>()
    expectTypeOf<HasStringIndex<ButtonTextProps>>().toEqualTypeOf<false>()
  })

  test('onPress and press handlers are functions, not style values', () => {
    expectTypeOf<ButtonFrameProps['onPress']>().toMatchTypeOf<
      ((event: any) => void) | null | undefined
    >()
    expectTypeOf<ButtonFrameProps['onPressIn']>().toMatchTypeOf<
      ((event: any) => void) | null | undefined
    >()
    expectTypeOf<ButtonFrameProps['onPressOut']>().toMatchTypeOf<
      ((event: any) => void) | null | undefined
    >()
    expectTypeOf<ButtonFrameProps['onLongPress']>().toMatchTypeOf<
      ((event: any) => void) | null | undefined
    >()
  })

  test('children accepts react nodes on styled(Text) and styled(View)', () => {
    expectTypeOf<'hello'>().toMatchTypeOf<ButtonTextProps['children']>()
    expectTypeOf<'hello'>().toMatchTypeOf<ButtonFrameProps['children']>()
  })

  test('plain styled(View) without context/variants keeps onPress + children', () => {
    const Plain = styled(View, {})
    type PlainProps = GetProps<typeof Plain>
    expectTypeOf<HasStringIndex<PlainProps>>().toEqualTypeOf<false>()
    expectTypeOf<PlainProps['onPress']>().toMatchTypeOf<
      ((event: any) => void) | null | undefined
    >()
    expectTypeOf<'child'>().toMatchTypeOf<PlainProps['children']>()
  })

  test('style + variant props still resolve', () => {
    expectTypeOf<ButtonFrameProps>().toHaveProperty('size')
    expectTypeOf<ButtonFrameProps>().toHaveProperty('hoverStyle')
  })
})
