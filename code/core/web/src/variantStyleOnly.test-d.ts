/**
 * variants hold styles and aria/data attributes. styled() infers the variants literal, and
 * inference never flags an extra key, so without StyleOnlyVariants a theme or
 * handler set inside a variant type-checked and was then dropped at runtime.
 *
 * Run with: bun run test:web
 */

import { test } from 'vitest'
import { styled } from './styled'
import { View } from './views/View'

test('a variant value rejects keys that are not styles', () => {
  styled(View, {
    variants: {
      accent: {
        // @ts-expect-error theme belongs on the component one level up
        true: { theme: 'red', backgroundColor: 'red' },
      },
    } as const,
  })
  styled(View, {
    variants: {
      pressable: {
        // @ts-expect-error a handler is not a style
        true: { onPress: () => {}, backgroundColor: 'red' },
      },
    } as const,
  })
  styled(View, {
    variants: {
      junk: {
        // @ts-expect-error unknown key
        true: { notAStyle: 1 },
      },
    } as const,
  })
})

test('a variant value accepts styles, attributes, own variants, and parent variants', () => {
  const Parent = styled(View, {
    variants: {
      tone: { strong: { backgroundColor: 'red' } },
    } as const,
  })
  styled(Parent, {
    variants: {
      size: { large: { width: 20, opacity: '1 hover:0.5' } },
      big: { true: { size: 'large', tone: 'strong', pointerEvents: 'none' } },
      vertical: {
        true: { 'aria-orientation': 'vertical', 'data-orientation': 'vertical' },
      },
    } as const,
  })
  styled(View, {
    variants: {
      scale: styled.dynamic((value: number) => ({ width: value })),
    } as const,
  })
})

test('an input variant accepts the input color styles', () => {
  const Field = styled(View, { render: 'input' }, { isInput: true } as const)
  styled(Field, {
    variants: {
      muted: { true: { placeholderTextColor: 'red', selectionColor: 'red' } },
    } as const,
  })
  styled(View, {
    variants: {
      // @ts-expect-error a view is not an input
      muted: { true: { placeholderTextColor: 'red' } },
    } as const,
  })
})
