/**
 * Type tests for Progress size.
 *
 * Verifies that:
 * 1. ProgressSize accepts the named xs-xl rungs, size tokens, numbers, booleans
 * 2. The size prop carries ProgressSize (never any) through frame and HOC
 *
 * Run with: npx vitest typecheck --run
 */

import { describe, expectTypeOf, test } from 'vitest'
import { type ProgressProps, type ProgressSize } from './index'

describe('ProgressSize', () => {
  test('accepts the named rungs', () => {
    expectTypeOf<'xs' | 'sm' | 'md' | 'lg' | 'xl'>().toMatchTypeOf<ProgressSize>()
  })

  test('accepts size tokens, numbers, and booleans', () => {
    expectTypeOf<'4' | 8 | true | false>().toMatchTypeOf<ProgressSize>()
  })
})

describe('Progress size prop', () => {
  test('carries the named rungs', () => {
    expectTypeOf<'sm'>().toMatchTypeOf<NonNullable<ProgressProps['size']>>()
  })

  test('is never any', () => {
    expectTypeOf<ProgressProps['size']>().not.toEqualTypeOf<any>()
  })
})
