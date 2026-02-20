/**
 * Type tests for Input component.
 *
 * Verifies that:
 * 1. Event handlers are typed with HTMLInputElement (not HTMLDivElement)
 * 2. HTML input-specific props are available (type, placeholder, etc.)
 * 3. Tamagui style props and variants still work
 * 4. Cross-platform props (autoCorrect, autoCapitalize) are present
 * 5. InputRef includes both HTMLInputElement and TextInput
 *
 * Run with: npx vitest typecheck --run
 */

import { expectTypeOf, describe, test } from 'vitest'
import type { GetProps } from '@tamagui/web'
import type { TextInput } from 'react-native'
import {
  Input,
  type InputProps,
  type InputRef,
  TextArea,
  type TextAreaProps,
} from './index'

// helper: extract event param type
type EventParam<T> = T extends (event: infer E) => any ? E : never
type IsAssignable<T, U> = T extends U ? true : false

// =============================================================================
// Test: event handlers are typed with HTMLInputElement
// =============================================================================

describe('Input event handler types', () => {
  test('onChange event uses HTMLInputElement', () => {
    type OnChange = NonNullable<InputProps['onChange']>
    type Event = EventParam<OnChange>
    expectTypeOf<Event['currentTarget']>().toMatchTypeOf<HTMLInputElement>()
  })

  test('onFocus event uses HTMLInputElement', () => {
    type OnFocus = NonNullable<InputProps['onFocus']>
    type Event = EventParam<OnFocus>
    expectTypeOf<Event['currentTarget']>().toMatchTypeOf<HTMLInputElement>()
  })

  test('onBlur event uses HTMLInputElement', () => {
    type OnBlur = NonNullable<InputProps['onBlur']>
    type Event = EventParam<OnBlur>
    expectTypeOf<Event['currentTarget']>().toMatchTypeOf<HTMLInputElement>()
  })

  test('onKeyDown event uses HTMLInputElement', () => {
    type OnKeyDown = NonNullable<InputProps['onKeyDown']>
    type Event = EventParam<OnKeyDown>
    expectTypeOf<Event['currentTarget']>().toMatchTypeOf<HTMLInputElement>()
  })

  test('onClick event uses HTMLInputElement', () => {
    type OnClick = NonNullable<InputProps['onClick']>
    type Event = EventParam<OnClick>
    expectTypeOf<Event['currentTarget']>().toMatchTypeOf<HTMLInputElement>()
  })

  test('onChange event is NOT typed with HTMLDivElement', () => {
    type OnChange = NonNullable<InputProps['onChange']>
    type Event = EventParam<OnChange>
    // HTMLDivElement should NOT be assignable to the currentTarget
    type DivMatchesCurrentTarget = IsAssignable<HTMLDivElement, Event['currentTarget']>
    expectTypeOf<DivMatchesCurrentTarget>().toEqualTypeOf<false>()
  })
})

// =============================================================================
// Test: HTML input-specific props
// =============================================================================

describe('Input HTML props', () => {
  test('accepts type prop', () => {
    expectTypeOf<InputProps>().toHaveProperty('type')
  })

  test('accepts placeholder prop', () => {
    expectTypeOf<InputProps>().toHaveProperty('placeholder')
  })

  test('accepts value prop', () => {
    expectTypeOf<InputProps>().toHaveProperty('value')
  })

  test('accepts defaultValue prop', () => {
    expectTypeOf<InputProps>().toHaveProperty('defaultValue')
  })

  test('accepts maxLength prop', () => {
    expectTypeOf<InputProps>().toHaveProperty('maxLength')
  })

  test('accepts pattern prop', () => {
    expectTypeOf<InputProps>().toHaveProperty('pattern')
  })

  test('accepts required prop', () => {
    expectTypeOf<InputProps>().toHaveProperty('required')
  })

  test('accepts readOnly prop', () => {
    expectTypeOf<InputProps>().toHaveProperty('readOnly')
  })

  test('accepts autoComplete prop', () => {
    expectTypeOf<InputProps>().toHaveProperty('autoComplete')
  })

  test('accepts name prop', () => {
    expectTypeOf<InputProps>().toHaveProperty('name')
  })
})

// =============================================================================
// Test: Tamagui style props still work
// =============================================================================

describe('Input style props', () => {
  test('accepts padding style prop', () => {
    expectTypeOf<InputProps>().toHaveProperty('padding')
  })

  test('accepts backgroundColor style prop', () => {
    expectTypeOf<InputProps>().toHaveProperty('backgroundColor')
  })

  test('accepts borderRadius style prop', () => {
    expectTypeOf<InputProps>().toHaveProperty('borderRadius')
  })

  test('accepts text style props', () => {
    expectTypeOf<InputProps>().toHaveProperty('fontSize')
    expectTypeOf<InputProps>().toHaveProperty('fontWeight')
    expectTypeOf<InputProps>().toHaveProperty('color')
  })

  test('accepts size variant', () => {
    expectTypeOf<InputProps>().toHaveProperty('size')
  })

  test('accepts unstyled variant', () => {
    expectTypeOf<InputProps>().toHaveProperty('unstyled')
  })
})

// =============================================================================
// Test: cross-platform props
// =============================================================================

describe('Input cross-platform props', () => {
  test('autoCorrect accepts boolean and string', () => {
    expectTypeOf<InputProps['autoCorrect']>().toMatchTypeOf<
      boolean | 'on' | 'off' | undefined
    >()
  })

  test('autoCapitalize accepts native and web values', () => {
    expectTypeOf<InputProps['autoCapitalize']>().toMatchTypeOf<
      'none' | 'sentences' | 'words' | 'characters' | 'off' | 'on' | undefined
    >()
  })

  test('accepts onChangeText callback', () => {
    expectTypeOf<InputProps>().toHaveProperty('onChangeText')
    expectTypeOf<NonNullable<InputProps['onChangeText']>>().toMatchTypeOf<
      (text: string) => void
    >()
  })

  test('accepts onSubmitEditing callback', () => {
    expectTypeOf<InputProps>().toHaveProperty('onSubmitEditing')
  })

  test('accepts placeholderTextColor', () => {
    expectTypeOf<InputProps>().toHaveProperty('placeholderTextColor')
  })

  test('accepts selection prop', () => {
    expectTypeOf<InputProps>().toHaveProperty('selection')
  })
})

// =============================================================================
// Test: InputRef type
// =============================================================================

describe('InputRef type', () => {
  test('InputRef accepts TextInput', () => {
    const _ref: InputRef = {} as TextInput
  })

  test('InputRef rejects plain HTMLDivElement', () => {
    // @ts-expect-error - HTMLDivElement should not be assignable to InputRef
    const _ref: InputRef = {} as HTMLDivElement
  })
})

// =============================================================================
// Test: TextArea types
// =============================================================================

describe('TextArea types', () => {
  test('TextArea has rows prop', () => {
    expectTypeOf<TextAreaProps>().toHaveProperty('rows')
  })

  test('TextArea accepts style props', () => {
    expectTypeOf<TextAreaProps>().toHaveProperty('padding')
    expectTypeOf<TextAreaProps>().toHaveProperty('fontSize')
  })

  test('TextArea accepts HTML input props', () => {
    expectTypeOf<TextAreaProps>().toHaveProperty('placeholder')
    expectTypeOf<TextAreaProps>().toHaveProperty('value')
  })
})

// =============================================================================
// Test: InputProps derived from GetProps (not manually defined)
// =============================================================================

describe('InputProps derivation', () => {
  test('InputProps equals GetProps<typeof Input>', () => {
    type Derived = GetProps<typeof Input>
    expectTypeOf<InputProps>().toEqualTypeOf<Derived>()
  })

  test('TextAreaProps equals GetProps<typeof TextArea>', () => {
    type Derived = GetProps<typeof TextArea>
    expectTypeOf<TextAreaProps>().toEqualTypeOf<Derived>()
  })
})
