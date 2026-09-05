/**
 * Regression type tests for issue #2787.
 *
 * `TextStylePropsBase` inherited react-native's mutable `fontVariant?: FontVariant[]`.
 * Under the `as const` that the variants docs call for, `fontVariant: ['common-ligatures']`
 * becomes a `readonly` tuple, which is not assignable to a mutable array — so the whole
 * variants literal missed the `VariantDefinitions` constraint and inference silently fell
 * back to the constraint default. The failure is not a squiggle on `fontVariant`: styled()
 * sees no variants at all and *every* variant prop disappears from the component.
 *
 * Run with: bun run test:web
 */

import { describe, expectTypeOf, test } from 'vitest'
import { styled } from './styled'
import { Text } from './views/Text'
import type { FlatStyleValue, GetProps } from './types'

// a variant prop is the branch keys widened with the conditional flat forms
type Cond<T> = FlatStyleValue<T> | undefined

const Typography = styled(Text, {
  variants: {
    tabular: {
      true: {
        fontFamily: 'heading',
        fontVariant: ['common-ligatures'],
      },
    },
  } as const,
})

// a variant that touches no array-valued style prop — the control
const Control = styled(Text, {
  variants: {
    bold: {
      true: {
        fontWeight: '700',
      },
    },
  } as const,
})

describe('fontVariant in an as-const variant', () => {
  test('the variant survives inference', () => {
    expectTypeOf<GetProps<typeof Typography>['tabular']>().toEqualTypeOf<Cond<boolean>>()
  })

  test('the control variant behaves the same', () => {
    expectTypeOf<GetProps<typeof Control>['bold']>().toEqualTypeOf<Cond<boolean>>()
  })

  test('fontVariant still accepts a mutable array as a plain prop', () => {
    const mutable: ('common-ligatures' | 'tabular-nums')[] = ['tabular-nums']
    expectTypeOf(mutable).toMatchTypeOf<GetProps<typeof Text>['fontVariant']>()
  })
})
