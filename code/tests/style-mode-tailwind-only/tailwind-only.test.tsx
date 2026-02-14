/**
 * Type tests for styleMode: 'tailwind' (tailwind ONLY)
 *
 * In this mode:
 * - className with tailwind-style syntax WORKS
 * - Classic tamagui style props (backgroundColor, etc.) should NOT exist
 * - Flat props ($bg, $hover:bg) should NOT exist
 * - Object media/pseudo syntax ($sm, hoverStyle) should NOT exist
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

describe('tailwind-only mode - POSITIVE tests (should work)', () => {
  test('className exists on ViewProps', () => {
    expectTypeOf<HasKey<ViewProps, 'className'>>().toEqualTypeOf<true>()
  })

  test('className exists on TextProps', () => {
    expectTypeOf<HasKey<TextProps, 'className'>>().toEqualTypeOf<true>()
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
})

describe('tailwind-only mode - NEGATIVE tests (style props should NOT exist)', () => {
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

describe('tailwind-only mode - NEGATIVE tests (pseudo/media objects should NOT exist)', () => {
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

describe('tailwind-only mode - NEGATIVE tests (flat props should NOT exist)', () => {
  test('$bg should NOT exist', () => {
    expectTypeOf<HasKey<ViewProps, '$bg'>>().toEqualTypeOf<false>()
  })

  test('$backgroundColor should NOT exist', () => {
    expectTypeOf<HasKey<ViewProps, '$backgroundColor'>>().toEqualTypeOf<false>()
  })

  test('$hover:bg should NOT exist', () => {
    expectTypeOf<HasKey<ViewProps, '$hover:bg'>>().toEqualTypeOf<false>()
  })

  test('$sm:bg should NOT exist', () => {
    expectTypeOf<HasKey<ViewProps, '$sm:bg'>>().toEqualTypeOf<false>()
  })

  test('$p should NOT exist', () => {
    expectTypeOf<HasKey<ViewProps, '$p'>>().toEqualTypeOf<false>()
  })
})

describe('tailwind-only mode - shorthands should NOT exist', () => {
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

describe('tailwind-only mode - styled() components', () => {
  const Box = styled(View, {
    // NOTE: in tailwind-only mode, even styled() definition shouldn't accept style props
    // This test verifies that styled() still works but props are restricted
  })

  type BoxProps = GetProps<typeof Box>

  test('styled component has className', () => {
    expectTypeOf<HasKey<BoxProps, 'className'>>().toEqualTypeOf<true>()
  })

  test('styled component should NOT have backgroundColor', () => {
    expectTypeOf<HasKey<BoxProps, 'backgroundColor'>>().toEqualTypeOf<false>()
  })

  test('styled component should NOT have $bg', () => {
    expectTypeOf<HasKey<BoxProps, '$bg'>>().toEqualTypeOf<false>()
  })
})

describe('tailwind-only mode - JSX usage compile tests', () => {
  test('className usage compiles', () => {
    // This should compile without errors
    const element = <View className="bg-red hover:bg-blue" />
    expectTypeOf(element).toBeObject()
  })

  test('id and data attributes compile', () => {
    const element = <View id="test" data-testid="test" />
    expectTypeOf(element).toBeObject()
  })

  // NOTE: These should be compile errors:
  // @ts-expect-error - backgroundColor should not be allowed in tailwind-only mode
  const badElement = <View backgroundColor="red" />

  // @ts-expect-error - $bg should not be allowed in tailwind-only mode
  const badFlatElement = <View $bg="red" />
})
