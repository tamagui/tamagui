/**
 * Type tests for flat mode - tests actual ViewProps/TextProps
 *
 * This file tests that flat props ($bg, $hover:bg, $sm:bg, etc.)
 * are properly typed on View, Text, and styled() components.
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

describe('ViewProps - base flat props', () => {
  test('$bg exists', () => {
    expectTypeOf<HasKey<ViewProps, '$bg'>>().toEqualTypeOf<true>()
  })

  test('$backgroundColor exists', () => {
    expectTypeOf<HasKey<ViewProps, '$backgroundColor'>>().toEqualTypeOf<true>()
  })

  test('$p exists', () => {
    expectTypeOf<HasKey<ViewProps, '$p'>>().toEqualTypeOf<true>()
  })

  test('$padding exists', () => {
    expectTypeOf<HasKey<ViewProps, '$padding'>>().toEqualTypeOf<true>()
  })

  test('$m exists', () => {
    expectTypeOf<HasKey<ViewProps, '$m'>>().toEqualTypeOf<true>()
  })

  test('$margin exists', () => {
    expectTypeOf<HasKey<ViewProps, '$margin'>>().toEqualTypeOf<true>()
  })

  test('$w exists', () => {
    expectTypeOf<HasKey<ViewProps, '$w'>>().toEqualTypeOf<true>()
  })

  test('$h exists', () => {
    expectTypeOf<HasKey<ViewProps, '$h'>>().toEqualTypeOf<true>()
  })

  test('$opacity exists', () => {
    expectTypeOf<HasKey<ViewProps, '$opacity'>>().toEqualTypeOf<true>()
  })

  test('$flex exists', () => {
    expectTypeOf<HasKey<ViewProps, '$flex'>>().toEqualTypeOf<true>()
  })

  test('$zIndex exists', () => {
    expectTypeOf<HasKey<ViewProps, '$zIndex'>>().toEqualTypeOf<true>()
  })

  test('$br (borderRadius) exists', () => {
    expectTypeOf<HasKey<ViewProps, '$br'>>().toEqualTypeOf<true>()
  })
})

describe('ViewProps - pseudo flat props', () => {
  test('$hover:bg exists', () => {
    expectTypeOf<HasKey<ViewProps, '$hover:bg'>>().toEqualTypeOf<true>()
  })

  test('$hover:opacity exists', () => {
    expectTypeOf<HasKey<ViewProps, '$hover:opacity'>>().toEqualTypeOf<true>()
  })

  test('$press:bg exists', () => {
    expectTypeOf<HasKey<ViewProps, '$press:bg'>>().toEqualTypeOf<true>()
  })

  test('$press:opacity exists', () => {
    expectTypeOf<HasKey<ViewProps, '$press:opacity'>>().toEqualTypeOf<true>()
  })

  test('$focus:borderColor exists', () => {
    expectTypeOf<HasKey<ViewProps, '$focus:borderColor'>>().toEqualTypeOf<true>()
  })

  test('$focus-visible:outline exists', () => {
    expectTypeOf<HasKey<ViewProps, '$focus-visible:outline'>>().toEqualTypeOf<true>()
  })

  test('$disabled:opacity exists', () => {
    expectTypeOf<HasKey<ViewProps, '$disabled:opacity'>>().toEqualTypeOf<true>()
  })

  test('$enter:opacity exists', () => {
    expectTypeOf<HasKey<ViewProps, '$enter:opacity'>>().toEqualTypeOf<true>()
  })

  test('$exit:opacity exists', () => {
    expectTypeOf<HasKey<ViewProps, '$exit:opacity'>>().toEqualTypeOf<true>()
  })
})

describe('ViewProps - media flat props', () => {
  test('$sm:bg exists', () => {
    expectTypeOf<HasKey<ViewProps, '$sm:bg'>>().toEqualTypeOf<true>()
  })

  test('$sm:padding exists', () => {
    expectTypeOf<HasKey<ViewProps, '$sm:padding'>>().toEqualTypeOf<true>()
  })

  test('$md:bg exists', () => {
    expectTypeOf<HasKey<ViewProps, '$md:bg'>>().toEqualTypeOf<true>()
  })

  test('$lg:bg exists', () => {
    expectTypeOf<HasKey<ViewProps, '$lg:bg'>>().toEqualTypeOf<true>()
  })

  test('$sm:opacity exists', () => {
    expectTypeOf<HasKey<ViewProps, '$sm:opacity'>>().toEqualTypeOf<true>()
  })
})

describe('ViewProps - chained modifiers', () => {
  test('$sm:hover:bg exists', () => {
    expectTypeOf<HasKey<ViewProps, '$sm:hover:bg'>>().toEqualTypeOf<true>()
  })

  test('$md:press:opacity exists', () => {
    expectTypeOf<HasKey<ViewProps, '$md:press:opacity'>>().toEqualTypeOf<true>()
  })

  test('$lg:disabled:bg exists', () => {
    expectTypeOf<HasKey<ViewProps, '$lg:disabled:bg'>>().toEqualTypeOf<true>()
  })
})

describe('TextProps - flat props', () => {
  test('$color exists', () => {
    expectTypeOf<HasKey<TextProps, '$color'>>().toEqualTypeOf<true>()
  })

  test('$fontSize exists', () => {
    expectTypeOf<HasKey<TextProps, '$fontSize'>>().toEqualTypeOf<true>()
  })

  test('$fontWeight exists', () => {
    expectTypeOf<HasKey<TextProps, '$fontWeight'>>().toEqualTypeOf<true>()
  })

  test('$hover:color exists', () => {
    expectTypeOf<HasKey<TextProps, '$hover:color'>>().toEqualTypeOf<true>()
  })

  test('$sm:fontSize exists', () => {
    expectTypeOf<HasKey<TextProps, '$sm:fontSize'>>().toEqualTypeOf<true>()
  })
})

describe('styled() component - flat props', () => {
  const Box = styled(View, {
    backgroundColor: 'white',
  })

  type BoxProps = GetProps<typeof Box>

  test('styled component has $bg', () => {
    expectTypeOf<HasKey<BoxProps, '$bg'>>().toEqualTypeOf<true>()
  })

  test('styled component has $hover:bg', () => {
    expectTypeOf<HasKey<BoxProps, '$hover:bg'>>().toEqualTypeOf<true>()
  })

  test('styled component has $sm:bg', () => {
    expectTypeOf<HasKey<BoxProps, '$sm:bg'>>().toEqualTypeOf<true>()
  })

  test('styled component has $sm:hover:bg', () => {
    expectTypeOf<HasKey<BoxProps, '$sm:hover:bg'>>().toEqualTypeOf<true>()
  })
})

describe('backwards compatibility - object syntax still works', () => {
  test('backgroundColor still exists', () => {
    expectTypeOf<HasKey<ViewProps, 'backgroundColor'>>().toEqualTypeOf<true>()
  })

  test('hoverStyle still exists', () => {
    expectTypeOf<HasKey<ViewProps, 'hoverStyle'>>().toEqualTypeOf<true>()
  })

  test('$sm object still exists', () => {
    expectTypeOf<HasKey<ViewProps, '$sm'>>().toEqualTypeOf<true>()
  })
})

describe('value type correctness', () => {
  test('$opacity accepts number', () => {
    type OpacityValue = ViewProps['$opacity']
    type AcceptsNumber = number extends NonNullable<OpacityValue> ? true : false
    expectTypeOf<AcceptsNumber>().toEqualTypeOf<true>()
  })

  test('$bg accepts string', () => {
    type BgValue = ViewProps['$bg']
    type AcceptsString = string extends NonNullable<BgValue> ? true : false
    expectTypeOf<AcceptsString>().toEqualTypeOf<true>()
  })
})
