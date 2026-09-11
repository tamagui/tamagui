/**
 * Runtime-table / public-type parity for the grammar-era style key additions.
 *
 * The class this pins (host spot-check, 2026-07-31): a key the runtime tables
 * accept and evaluate but the public type omits reads as "rejected" to any
 * type-keyed consumer — the host resolver classified a working
 * `textDecoration` site needs-relocation because `TextStylePropsBase` never
 * gained the key when the runtime did. A stale type that CONTRADICTS errors
 * loudly; one that merely OMITS says nothing, which is why this list is
 * pinned in both directions: each key must be in the runtime table (runtime
 * half) and accepted by the public style type (type half, enforced because
 * this suite runs under vitest --typecheck).
 *
 * When a grammar tranche adds a style key, it gets added HERE with its table
 * and its type in the same commit, or this file fails.
 */

import { stylePropsAll, stylePropsText, stylePropsView } from '@tamagui/helpers'
import { describe, expect, expectTypeOf, test } from 'vitest'
import type { StackStyleBase, TextStylePropsBase } from './types'

// keys valid on every host (ExtraStyleProps -> both bases)
const sharedAdditions = [
  'border',
  'borderBlock',
  'borderInline',
  'containerName',
  'outline',
  'overflowWrap',
  'wordWrap',
  'resize',
  'pointerEvents',
] as const

// text-only composites (TextStylePropsBase)
const textAdditions = ['textDecoration', 'font', 'textShadow'] as const

describe('grammar-era style keys: runtime tables and public types agree', () => {
  test('every shared addition is in the view and text tables', () => {
    for (const key of sharedAdditions) {
      expect(key in stylePropsView, key).toBe(true)
      expect(key in stylePropsText, key).toBe(true)
    }
  })

  test('every text addition is in the text table and not the view table', () => {
    for (const key of textAdditions) {
      expect(key in stylePropsText, key).toBe(true)
      expect(key in stylePropsAll, key).toBe(true)
      expect(key in stylePropsView, key).toBe(false)
    }
  })

  test('the public types carry the same keys', () => {
    // Pick fails to COMPILE when a key is absent from the type — a mapped
    // type with optional keys would be satisfied by absence, which is
    // exactly the omission this file exists to catch
    type _stackPin = Pick<StackStyleBase, (typeof sharedAdditions)[number]>
    type _textPin = Pick<
      TextStylePropsBase,
      (typeof sharedAdditions)[number] | (typeof textAdditions)[number]
    >
    // and the text-only composites stay OFF the view type
    expectTypeOf<StackStyleBase>().not.toHaveProperty('textDecoration')
    expectTypeOf<StackStyleBase>().not.toHaveProperty('font')
  })
})
