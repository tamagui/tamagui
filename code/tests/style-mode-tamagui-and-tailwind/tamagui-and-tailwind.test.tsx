/**
 * Type tests for styleMode: 'tamagui-and-tailwind'
 *
 * In this mode:
 * - Classic tamagui style props (backgroundColor, padding, etc.) WORK
 * - Shorthands (bg, p, m, etc.) WORK
 * - Object media/pseudo syntax ($sm, hoverStyle) WORK
 * - className with tailwind-style syntax WORKS
 * - Flat props ($bg, $hover:bg) should NOT exist
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

describe('tamagui-and-tailwind mode - POSITIVE tests (classic style props should work)', () => {
  test('backgroundColor exists on ViewProps', () => {
    expectTypeOf<HasKey<ViewProps, 'backgroundColor'>>().toEqualTypeOf<true>()
  })

  test('padding exists on ViewProps', () => {
    expectTypeOf<HasKey<ViewProps, 'padding'>>().toEqualTypeOf<true>()
  })

  test('margin exists on ViewProps', () => {
    expectTypeOf<HasKey<ViewProps, 'margin'>>().toEqualTypeOf<true>()
  })

  test('width exists on ViewProps', () => {
    expectTypeOf<HasKey<ViewProps, 'width'>>().toEqualTypeOf<true>()
  })

  test('height exists on ViewProps', () => {
    expectTypeOf<HasKey<ViewProps, 'height'>>().toEqualTypeOf<true>()
  })

  test('opacity exists on ViewProps', () => {
    expectTypeOf<HasKey<ViewProps, 'opacity'>>().toEqualTypeOf<true>()
  })

  test('flex exists on ViewProps', () => {
    expectTypeOf<HasKey<ViewProps, 'flex'>>().toEqualTypeOf<true>()
  })

  test('borderRadius exists on ViewProps', () => {
    expectTypeOf<HasKey<ViewProps, 'borderRadius'>>().toEqualTypeOf<true>()
  })

  test('color on Text exists', () => {
    expectTypeOf<HasKey<TextProps, 'color'>>().toEqualTypeOf<true>()
  })

  test('fontSize on Text exists', () => {
    expectTypeOf<HasKey<TextProps, 'fontSize'>>().toEqualTypeOf<true>()
  })
})

describe('tamagui-and-tailwind mode - POSITIVE tests (shorthands should work)', () => {
  test('bg shorthand exists', () => {
    expectTypeOf<HasKey<ViewProps, 'bg'>>().toEqualTypeOf<true>()
  })

  test('p shorthand exists', () => {
    expectTypeOf<HasKey<ViewProps, 'p'>>().toEqualTypeOf<true>()
  })

  test('m shorthand exists', () => {
    expectTypeOf<HasKey<ViewProps, 'm'>>().toEqualTypeOf<true>()
  })

  test('w shorthand exists', () => {
    expectTypeOf<HasKey<ViewProps, 'w'>>().toEqualTypeOf<true>()
  })

  test('h shorthand exists', () => {
    expectTypeOf<HasKey<ViewProps, 'h'>>().toEqualTypeOf<true>()
  })
})

describe('tamagui-and-tailwind mode - POSITIVE tests (object pseudo/media should work)', () => {
  test('hoverStyle exists', () => {
    expectTypeOf<HasKey<ViewProps, 'hoverStyle'>>().toEqualTypeOf<true>()
  })

  test('pressStyle exists', () => {
    expectTypeOf<HasKey<ViewProps, 'pressStyle'>>().toEqualTypeOf<true>()
  })

  test('focusStyle exists', () => {
    expectTypeOf<HasKey<ViewProps, 'focusStyle'>>().toEqualTypeOf<true>()
  })

  test('$sm media object exists', () => {
    expectTypeOf<HasKey<ViewProps, '$sm'>>().toEqualTypeOf<true>()
  })

  test('$md media object exists', () => {
    expectTypeOf<HasKey<ViewProps, '$md'>>().toEqualTypeOf<true>()
  })
})

describe('tamagui-and-tailwind mode - POSITIVE tests (className should work)', () => {
  test('className exists on ViewProps', () => {
    expectTypeOf<HasKey<ViewProps, 'className'>>().toEqualTypeOf<true>()
  })

  test('className exists on TextProps', () => {
    expectTypeOf<HasKey<TextProps, 'className'>>().toEqualTypeOf<true>()
  })
})

describe('tamagui-and-tailwind mode - POSITIVE tests (base props should work)', () => {
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

describe('tamagui-and-tailwind mode - NEGATIVE tests (flat props should NOT exist)', () => {
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

describe('tamagui-and-tailwind mode - styled() components', () => {
  const Box = styled(View, {
    backgroundColor: 'red',
    padding: 10,
  })

  type BoxProps = GetProps<typeof Box>

  test('styled component has className', () => {
    expectTypeOf<HasKey<BoxProps, 'className'>>().toEqualTypeOf<true>()
  })

  test('styled component has backgroundColor', () => {
    expectTypeOf<HasKey<BoxProps, 'backgroundColor'>>().toEqualTypeOf<true>()
  })

  test('styled component has hoverStyle', () => {
    expectTypeOf<HasKey<BoxProps, 'hoverStyle'>>().toEqualTypeOf<true>()
  })

  test('styled component should NOT have $bg', () => {
    expectTypeOf<HasKey<BoxProps, '$bg'>>().toEqualTypeOf<false>()
  })
})

describe('tamagui-and-tailwind mode - JSX usage compile tests', () => {
  test('classic prop usage compiles', () => {
    const element = <View backgroundColor="red" padding={10} />
    expectTypeOf(element).toBeObject()
  })

  test('shorthand usage compiles', () => {
    const element = <View bg="red" p={10} />
    expectTypeOf(element).toBeObject()
  })

  test('className usage compiles', () => {
    const element = <View className="bg-red hover:bg-blue" />
    expectTypeOf(element).toBeObject()
  })

  test('object pseudo usage compiles', () => {
    const element = <View hoverStyle={{ backgroundColor: 'blue' }} />
    expectTypeOf(element).toBeObject()
  })

  test('object media usage compiles', () => {
    const element = <View $sm={{ padding: 10 }} />
    expectTypeOf(element).toBeObject()
  })

  // NOTE: These should be compile errors in tamagui-and-tailwind mode:
  // @ts-expect-error - $bg should not be allowed in tamagui-and-tailwind mode
  const badElement = <View $bg="red" />
})
