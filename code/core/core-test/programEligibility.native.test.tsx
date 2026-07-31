// review P0-2, native half: a clause-bearing string on an RN shadow part was
// forwarded verbatim into the style object (shadowColor: 'red hover:blue'
// reaching the host as a literal), and transform parts likewise. they drop
// with a diagnostic; plain values keep the legacy pipeline.

import { beforeAll, expect, test } from 'vitest'
import config from '../config-default'
import { View, createTamagui, getSplitStyles } from '../web/src'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig() as any)
})

const split = (props: Record<string, any>, state: Record<string, any> = {}) =>
  getSplitStyles(
    props,
    View.staticConfig,
    undefined as any,
    'light',
    { unmounted: false, ...state } as any,
    { isAnimated: false, noClass: true, resolveValues: 'auto' } as any
  )

test('a clause on shadowColor drops instead of reaching the host verbatim', () => {
  const result = split({ shadowColor: 'red hover:blue' })
  expect(result.style?.shadowColor).toBeUndefined()
})

test('a clause on a legacy transform part drops', () => {
  const result = split({ skewX: '10deg hover:20deg' })
  expect(JSON.stringify(result.style?.transform ?? [])).not.toContain('hover')
})

test('plain part values keep the legacy pipeline', () => {
  const shadow = split({ shadowColor: 'red' })
  expect(shadow.style?.shadowColor).toBe('red')
  const skew = split({ skewX: '10deg' })
  expect(JSON.stringify(skew.style?.transform ?? [])).toContain('10deg')
})
