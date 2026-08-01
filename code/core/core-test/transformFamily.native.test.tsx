import { beforeAll, expect, test } from 'vitest'

import config from '../config-default'
import { View, createTamagui, getSplitStyles } from '../web/src'

// The transform family on native. There are no CSS individual transform
// properties in RN, so every family program composes into ONE array in the fixed
// CSS order — translate, rotate, scale — with the raw legacy transform entries as
// the tail. The order is semantic: array entries are matrix-multiplied in
// authored order, so it is never sorted.

let conf: any
beforeAll(() => {
  const defaultConfig = config.getDefaultTamaguiConfig('native')
  conf = createTamagui({
    ...defaultConfig,
    settings: {
      ...defaultConfig.settings,
    },
  } as any)
})

const split = (props: Record<string, any>, state: Record<string, any> = {}) =>
  getSplitStyles(
    props,
    View.staticConfig,
    conf.themes.light,
    'light',
    { unmounted: false, ...state } as any,
    { isAnimated: false, noClass: true, resolveValues: 'auto' } as any
  )

const keysOf = (transform: any): string[] =>
  (transform ?? []).map((entry: any) => Object.keys(entry)[0])

test('family programs compose one array in translate, rotate, scale order', () => {
  const result = split({
    // authored in a deliberately scrambled order
    scale: '2 hover:3',
    rotate: '45deg hover:46deg',
    y: '20px hover:21px',
    x: '10px hover:11px',
  })
  expect(keysOf(result.style?.transform)).toEqual([
    'translateX',
    'translateY',
    'rotate',
    'scale',
  ])
  expect(result.style?.transform).toEqual([
    { translateX: 10 },
    { translateY: 20 },
    { rotate: '45deg' },
    { scale: 2 },
  ])
})

test('a clause evaluates per state and recomposes the array', () => {
  const rest = split({ x: '0px hover:10px' })
  expect(rest.style?.transform).toEqual([{ translateX: 0 }])
  const hovered = split({ x: '0px hover:10px' }, { hover: true })
  expect(hovered.style?.transform).toEqual([{ translateX: 10 }])
  expect(hovered.programStates?.has('hover')).toBe(true)
})

test('x resolves space tokens to points', () => {
  const result = split({ x: '4 hover:8' })
  expect(result.style?.transform).toEqual([
    { translateX: conf.tokensParsed.space['$4'].val },
  ])
  const hovered = split({ x: '4 hover:8' }, { hover: true })
  expect(hovered.style?.transform).toEqual([
    { translateX: conf.tokensParsed.space['$8'].val },
  ])
})

test('a legacy raw transform is the tail, after the family entries', () => {
  const result = split({
    x: '5px hover:6px',
    transform: [{ skewX: '10deg' }],
  })
  expect(keysOf(result.style?.transform)).toEqual(['translateX', 'skewX'])
})

test('legacy non-family parts stay in the tail rather than being dropped', () => {
  const result = split({ x: '5px hover:6px', skewY: '3deg', perspective: 100 })
  const keys = keysOf(result.style?.transform)
  // the family composes first, then whatever the family does not own yet
  expect(keys[0]).toBe('translateX')
  expect(keys).toContain('skewY')
  expect(keys).toContain('perspective')
})

test('a program displaces a legacy uniform scale onto the other axis', () => {
  const result = split({ scale: 2, scaleX: '1 hover:3' })
  // uniform 2 survives on Y, the program owns X, so the axes differ and stay split
  expect(result.style?.transform).toEqual([{ scaleX: 1 }, { scaleY: 2 }])
  const hovered = split({ scale: 2, scaleX: '1 hover:3' }, { hover: true })
  expect(hovered.style?.transform).toEqual([{ scaleX: 3 }, { scaleY: 2 }])
})

test('a later plain uniform scale replaces both axis programs', () => {
  const result = split({ scaleX: '1 hover:3', scale: 2 })
  expect(result.style?.transform).toEqual([{ scale: 2 }])
})

test('equal axes collapse to one scale entry, matching the v1 array', () => {
  const result = split({ scale: '0.9 hover:0.8' })
  expect(result.style?.transform).toEqual([{ scale: 0.9 }])
  expect(split({ scale: '0.9 hover:0.8' }, { hover: true }).style?.transform).toEqual([
    { scale: 0.8 },
  ])
})

test('clause-free transform values compose through the family in CSS order', () => {
  // v3 cutover: clause-free strings and family numerics are base-only
  // programs, so the whole family composes in the canonical CSS order —
  // translate, rotate, scale — regardless of authored order or value type.
  // (translateX/translateY commute, and uniform scale commutes with rotate,
  // so rendering matches the legacy reverse-alphabetical output here.)
  const result = split({ scale: 2, rotate: '45deg', y: 20, x: 10 })
  expect(result.style?.transform).toEqual([
    { translateX: 10 },
    { translateY: 20 },
    { rotate: '45deg' },
    { scale: 2 },
  ])
})

test('unrepresentable values are diagnosed, not forwarded', () => {
  // turn has no native lowering; the entry is dropped rather than mangled
  const result = split({ rotate: '0deg hover:0.25turn' }, { hover: true })
  expect(result.style?.transform ?? []).toEqual([])
})

test('the plan example: enterStyle scale converts and evaluates end to end', () => {
  // enterStyle={{ scale: 0.9 }} is the shape the whole campaign started from
  const props = { scale: 1, enterStyle: { scale: 0.9 } }

  const entering = split(props, { unmounted: true })
  expect(entering.style?.transform).toEqual([{ scale: 0.9 }])

  const mounted = split(props, { unmounted: false })
  expect(mounted.style?.transform).toEqual([{ scale: 1 }])
})

test('the plan example with y, the other common codemod flag', () => {
  const props = { y: 0, enterStyle: { y: 10 } }
  expect(split(props, { unmounted: true }).style?.transform).toEqual([{ translateY: 10 }])
  expect(split(props, { unmounted: false }).style?.transform).toEqual([{ translateY: 0 }])
})

test('a component with no transform props pays nothing new', () => {
  const result = split({ backgroundColor: 'red' })
  expect(result.style?.transform).toBeUndefined()
})

test('a raw transform program parses once into the RN array', () => {
  const result = split({ transform: 'skewX(10deg)' })
  expect(result.style?.transform).toEqual([{ skewX: '10deg' }])

  const hovered = split({ transform: 'skewX(10deg) hover:skewX(20deg)' }, { hover: true })
  expect(hovered.style?.transform).toEqual([{ skewX: '20deg' }])
})

test('family programs compose before the raw transform program', () => {
  const result = split({ x: 10, transform: 'skewX(10deg)' })
  expect(result.style?.transform).toEqual([{ translateX: 10 }, { skewX: '10deg' }])
})
