// review P1: the View-color ruling (text-only style props on a non-text host
// are a dev diagnostic + drop, never a leaked DOM attribute) landed with only
// positive rebaselines, so nothing pinned the negative case — and the guard
// never actually ran for a plain View. these are the negative pins.

import { afterEach, beforeAll, expect, test, vi } from 'vitest'
import config from '../config-default'
import { Text, View, createTamagui, getSplitStyles } from '../web/src'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig() as any)
})

afterEach(() => {
  vi.restoreAllMocks()
})

const opts = { isAnimated: false, noClass: false, resolveValues: 'auto' } as any

const split = (props: Record<string, any>, staticConfig: any) =>
  getSplitStyles(
    props,
    staticConfig,
    undefined as any,
    'light',
    { unmounted: false } as any,
    opts
  )

test('color on a plain View is dropped, never leaked to the DOM', () => {
  // the diagnostic half is dev-only and NODE_ENV=test compiles it out; the
  // behavioral pin is the drop itself
  const result = split({ color: 'red' }, View.staticConfig)
  expect(result.viewProps.color).toBeUndefined()
  expect(result.style?.color).toBeUndefined()
  expect(result.classNames?.color).toBeUndefined()
})

test('textDecorationColor and textShadowColor on a View are dropped too', () => {
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  const result = split(
    { textDecorationColor: 'red', textShadowColor: 'blue' },
    View.staticConfig
  )
  expect(result.viewProps.textDecorationColor).toBeUndefined()
  expect(result.viewProps.textShadowColor).toBeUndefined()
})

test('color on Text still works', () => {
  const result = split({ color: 'red' }, Text.staticConfig)
  const className = result.classNames?.color
  expect(className).toBeTruthy()
})
