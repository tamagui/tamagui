/**
 * Type tests for config-driven control sizing.
 *
 * Verifies that:
 * 1. ComponentSize is exactly the five default rungs when unconfigured
 *    (never string, never any)
 * 2. An inferred config carries custom rung names through the sizing slot
 * 3. defaultSizing satisfies GenericSizing
 *
 * Run with: npx vitest typecheck --run
 */

import { describe, expectTypeOf, test } from 'vitest'
import { defaultSizing } from './helpers/resolveSizing'
import type { ComponentSize, GenericSizing, InferTamaguiConfig } from './types'

describe('ComponentSize', () => {
  test('is the five default rungs when unconfigured', () => {
    expectTypeOf<ComponentSize>().toEqualTypeOf<'xs' | 'sm' | 'md' | 'lg' | 'xl'>()
  })

  test('carries custom rungs from an inferred config', () => {
    const custom = {
      sizing: {
        default: 'md',
        sizes: {
          sm: {
            fontSize: 'sm',
            controlFontSize: 'sm',
            paddingInline: '3',
            paddingBlock: '1.5',
            gap: '1.5',
            radius: 'md',
          },
          xxl: {
            fontSize: 'lg',
            controlFontSize: 'xl',
            paddingInline: '8',
            paddingBlock: '2.5',
            gap: '2.5',
            radius: 'lg',
          },
        },
      },
    } as const
    type Inferred = InferTamaguiConfig<typeof custom>
    expectTypeOf<keyof Inferred['sizing']['sizes']>().toEqualTypeOf<'sm' | 'xxl'>()
  })
})

describe('defaultSizing', () => {
  test('satisfies GenericSizing', () => {
    expectTypeOf<typeof defaultSizing>().toMatchTypeOf<GenericSizing>()
  })
})
