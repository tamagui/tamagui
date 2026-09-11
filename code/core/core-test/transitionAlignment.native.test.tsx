// Phase 6 item 4 runtime wiring, native: no native driver consumes the
// transition IR yet, so a CSS transition string validates against the
// capability matrix (detected RN minor, no fallback) and drops with a note —
// never a silent approximation, never a leak to the host.

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
    { isAnimated: false, noClass: true, resolveValues: 'auto' } as any
  )

test('a CSS transition string never reaches the native host', () => {
  const result = split({ transition: 'opacity 200ms' })
  expect(result.style?.transition).toBeUndefined()
  expect(result.viewProps.transition).toBeUndefined()
})

test('transition longhands never reach the native host either', () => {
  const result = split({ transitionDuration: '150ms' })
  expect(result.style?.transitionDuration).toBeUndefined()
  expect(result.viewProps.transitionDuration).toBeUndefined()
})
