// review P0-2: clause-bearing values on RN part props (shadow parts,
// non-family transform parts) have no program home by design — the composite
// property owns the clause spelling. they must drop with a diagnostic, never
// forward into malformed CSS or a mangled native string. plain values keep
// their legacy pipelines untouched.

import { beforeAll, expect, test } from 'vitest'
import config from '../config-default'
import { View, createTamagui, getSplitStyles } from '../web/src'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig() as any)
})

const split = (props: Record<string, any>) =>
  getSplitStyles(
    props,
    View.staticConfig,
    undefined as any,
    'light',
    { unmounted: false } as any,
    { isAnimated: false, noClass: false, resolveValues: 'auto' } as any
  )

const emitted = (result: any) =>
  JSON.stringify(result.rulesToInsert) +
  JSON.stringify(result.style ?? {}) +
  JSON.stringify(result.viewProps ?? {})

test('a clause on a shadow part prop drops instead of emitting malformed CSS', () => {
  const result = split({ shadowColor: 'red hover:blue', shadowRadius: 10 })
  expect(emitted(result)).not.toContain('hover')
})

test('a clause on a legacy transform part drops instead of leaking', () => {
  const result = split({ skewX: '10deg hover:20deg' })
  expect(emitted(result)).not.toContain('hover')
})

test('plain shadow part values keep the legacy composition', () => {
  const result = split({ shadowColor: 'red', shadowRadius: 10, shadowOpacity: 1 })
  // styleToCSS combines the parts into a box-shadow rule
  expect(JSON.stringify(result.rulesToInsert)).toContain('box-shadow')
})

test('pointerEvents lowers as a program on web', () => {
  const result = split({ pointerEvents: 'auto hover:none' })
  const className = result.classNames?.pointerEvents
  expect(className).toBeTruthy()
  const rules = result.rulesToInsert[className]?.[4] ?? []
  expect(rules.join('')).toContain('pointer-events:auto')
  expect(rules.join('')).toContain(':where(:hover){pointer-events:none}')
})
