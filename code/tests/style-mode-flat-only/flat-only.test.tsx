/**
 * Type tests for styleMode: 'flat' (flat ONLY)
 *
 * In this mode:
 * - Flat props ($bg, $hover:bg, $sm:bg) WORK
 * - Classic tamagui style props (backgroundColor, etc.) should NOT exist
 * - Object media/pseudo syntax ($sm, hoverStyle) should NOT exist
 * - className with tailwind syntax should NOT be processed (just passed through)
 */
import './tamagui.config'

import { describe, test, expectTypeOf } from 'vitest'
import {
  View,
  Text,
  styled,
  type ViewProps,
  type TextProps,
  type GetProps,
} from '@tamagui/web'

// helper to test prop existence
type HasKey<T, K> = K extends keyof T ? true : false

describe('flat-only mode - POSITIVE tests (should work)', () => {
  test('$bg exists on ViewProps', () => {
    expectTypeOf<HasKey<ViewProps, '$bg'>>().toEqualTypeOf<true>()
  })

  test('$backgroundColor exists on ViewProps', () => {
    expectTypeOf<HasKey<ViewProps, '$backgroundColor'>>().toEqualTypeOf<true>()
  })

  test('$p exists on ViewProps', () => {
    expectTypeOf<HasKey<ViewProps, '$p'>>().toEqualTypeOf<true>()
  })

  test('$m exists on ViewProps', () => {
    expectTypeOf<HasKey<ViewProps, '$m'>>().toEqualTypeOf<true>()
  })

  test('$w exists on ViewProps', () => {
    expectTypeOf<HasKey<ViewProps, '$w'>>().toEqualTypeOf<true>()
  })

  test('$h exists on ViewProps', () => {
    expectTypeOf<HasKey<ViewProps, '$h'>>().toEqualTypeOf<true>()
  })

  test('$hover:bg exists on ViewProps', () => {
    expectTypeOf<HasKey<ViewProps, '$hover:bg'>>().toEqualTypeOf<true>()
  })

  test('$press:bg exists on ViewProps', () => {
    expectTypeOf<HasKey<ViewProps, '$press:bg'>>().toEqualTypeOf<true>()
  })

  test('$focus:bg exists on ViewProps', () => {
    expectTypeOf<HasKey<ViewProps, '$focus:bg'>>().toEqualTypeOf<true>()
  })

  test('$sm:bg exists on ViewProps', () => {
    expectTypeOf<HasKey<ViewProps, '$sm:bg'>>().toEqualTypeOf<true>()
  })

  test('$md:bg exists on ViewProps', () => {
    expectTypeOf<HasKey<ViewProps, '$md:bg'>>().toEqualTypeOf<true>()
  })

  test('$sm:hover:bg exists on ViewProps', () => {
    expectTypeOf<HasKey<ViewProps, '$sm:hover:bg'>>().toEqualTypeOf<true>()
  })

  test('$color exists on TextProps', () => {
    expectTypeOf<HasKey<TextProps, '$color'>>().toEqualTypeOf<true>()
  })

  test('$fontSize exists on TextProps', () => {
    expectTypeOf<HasKey<TextProps, '$fontSize'>>().toEqualTypeOf<true>()
  })

  test('id exists (HTML props work)', () => {
    expectTypeOf<HasKey<ViewProps, 'id'>>().toEqualTypeOf<true>()
  })

  test('style exists (inline style always works)', () => {
    expectTypeOf<HasKey<ViewProps, 'style'>>().toEqualTypeOf<true>()
  })

  test('onPress exists (event handlers work)', () => {
    expectTypeOf<HasKey<ViewProps, 'onPress'>>().toEqualTypeOf<true>()
  })

  test('children exists', () => {
    expectTypeOf<HasKey<ViewProps, 'children'>>().toEqualTypeOf<true>()
  })

  test('className exists (pass-through)', () => {
    expectTypeOf<HasKey<ViewProps, 'className'>>().toEqualTypeOf<true>()
  })
})

describe('flat-only mode - NEGATIVE tests (classic style props should NOT exist)', () => {
  test('backgroundColor should NOT exist', () => {
    expectTypeOf<HasKey<ViewProps, 'backgroundColor'>>().toEqualTypeOf<false>()
  })

  test('padding should NOT exist', () => {
    expectTypeOf<HasKey<ViewProps, 'padding'>>().toEqualTypeOf<false>()
  })

  test('margin should NOT exist', () => {
    expectTypeOf<HasKey<ViewProps, 'margin'>>().toEqualTypeOf<false>()
  })

  test('width should NOT exist', () => {
    expectTypeOf<HasKey<ViewProps, 'width'>>().toEqualTypeOf<false>()
  })

  test('height should NOT exist', () => {
    expectTypeOf<HasKey<ViewProps, 'height'>>().toEqualTypeOf<false>()
  })

  test('opacity should NOT exist', () => {
    expectTypeOf<HasKey<ViewProps, 'opacity'>>().toEqualTypeOf<false>()
  })

  test('flex should NOT exist', () => {
    expectTypeOf<HasKey<ViewProps, 'flex'>>().toEqualTypeOf<false>()
  })

  test('borderRadius should NOT exist', () => {
    expectTypeOf<HasKey<ViewProps, 'borderRadius'>>().toEqualTypeOf<false>()
  })

  test('color on Text should NOT exist', () => {
    expectTypeOf<HasKey<TextProps, 'color'>>().toEqualTypeOf<false>()
  })

  test('fontSize on Text should NOT exist', () => {
    expectTypeOf<HasKey<TextProps, 'fontSize'>>().toEqualTypeOf<false>()
  })
})

describe('flat-only mode - NEGATIVE tests (classic shorthands should NOT exist)', () => {
  test('bg shorthand should NOT exist', () => {
    expectTypeOf<HasKey<ViewProps, 'bg'>>().toEqualTypeOf<false>()
  })

  test('p shorthand should NOT exist', () => {
    expectTypeOf<HasKey<ViewProps, 'p'>>().toEqualTypeOf<false>()
  })

  test('m shorthand should NOT exist', () => {
    expectTypeOf<HasKey<ViewProps, 'm'>>().toEqualTypeOf<false>()
  })

  test('w shorthand should NOT exist', () => {
    expectTypeOf<HasKey<ViewProps, 'w'>>().toEqualTypeOf<false>()
  })

  test('h shorthand should NOT exist', () => {
    expectTypeOf<HasKey<ViewProps, 'h'>>().toEqualTypeOf<false>()
  })
})

describe('flat-only mode - NEGATIVE tests (object pseudo/media should NOT exist)', () => {
  test('hoverStyle should NOT exist', () => {
    expectTypeOf<HasKey<ViewProps, 'hoverStyle'>>().toEqualTypeOf<false>()
  })

  test('pressStyle should NOT exist', () => {
    expectTypeOf<HasKey<ViewProps, 'pressStyle'>>().toEqualTypeOf<false>()
  })

  test('focusStyle should NOT exist', () => {
    expectTypeOf<HasKey<ViewProps, 'focusStyle'>>().toEqualTypeOf<false>()
  })

  test('$sm media object should NOT exist', () => {
    expectTypeOf<HasKey<ViewProps, '$sm'>>().toEqualTypeOf<false>()
  })

  test('$md media object should NOT exist', () => {
    expectTypeOf<HasKey<ViewProps, '$md'>>().toEqualTypeOf<false>()
  })
})

describe('flat-only mode - styled() components', () => {
  const Box = styled(View, {
    // NOTE: in flat-only mode, even styled() definition shouldn't accept classic style props
    // This test verifies that styled() still works but props are restricted
  })

  type BoxProps = GetProps<typeof Box>

  test('styled component has $bg', () => {
    expectTypeOf<HasKey<BoxProps, '$bg'>>().toEqualTypeOf<true>()
  })

  test('styled component has $hover:bg', () => {
    expectTypeOf<HasKey<BoxProps, '$hover:bg'>>().toEqualTypeOf<true>()
  })

  test('styled component should NOT have backgroundColor', () => {
    expectTypeOf<HasKey<BoxProps, 'backgroundColor'>>().toEqualTypeOf<false>()
  })

  test('styled component should NOT have bg shorthand', () => {
    expectTypeOf<HasKey<BoxProps, 'bg'>>().toEqualTypeOf<false>()
  })
})

describe('flat-only mode - JSX usage compile tests', () => {
  test('flat prop usage compiles', () => {
    // This should compile without errors
    const element = <View $bg="red" $hover:bg="blue" />
    expectTypeOf(element).toBeObject()
  })

  test('media flat prop usage compiles', () => {
    const element = <View $sm:bg="red" $md:p={10} />
    expectTypeOf(element).toBeObject()
  })

  test('id and data attributes compile', () => {
    const element = <View id="test" data-testid="test" />
    expectTypeOf(element).toBeObject()
  })

  // NOTE: These should be compile errors in flat-only mode:
  // @ts-expect-error - backgroundColor should not be allowed in flat-only mode
  const badElement = <View backgroundColor="red" />

  // @ts-expect-error - bg shorthand should not be allowed in flat-only mode
  const badShorthandElement = <View bg="red" />

  // @ts-expect-error - hoverStyle should not be allowed in flat-only mode
  const badPseudoElement = <View hoverStyle={{ backgroundColor: 'red' }} />
})
