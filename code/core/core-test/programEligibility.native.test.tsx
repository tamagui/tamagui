// native scalar conditions resolve before they reach the host. structured
// transform parts keep their composite owner.

import { beforeAll, expect, test } from 'vitest'
import config from '../config-default'
import { Text, View, createTamagui, getSplitStyles } from '../web/src'

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

test('a shadowColor clause selects a plain native color', () => {
  expect(split({ shadowColor: 'red hover:blue' }).style?.shadowColor).toBe('red')
  expect(
    split({ shadowColor: 'red hover:blue' }, { hover: true }).style?.shadowColor
  ).toBe('blue')
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

test('pointerEvents enters the program engine on native', () => {
  const base = split({ pointerEvents: 'auto hover:none' })
  // repo pins RN 0.83: style.pointerEvents is the modern spelling
  expect(base.style?.pointerEvents).toBe('auto')
  expect(base.programStates?.has('hover')).toBe(true)
  const hovered = split({ pointerEvents: 'auto hover:none' }, { hover: true })
  expect(hovered.style?.pointerEvents).toBe('none')
})

test('boxShadow clauses evaluate on native and parse to RN objects', () => {
  const value = '0 0 10px red hover:0 0 20px blue'
  const base = split({ boxShadow: value })
  expect(base.style?.boxShadow).toEqual([
    { offsetX: 0, offsetY: 0, blurRadius: 10, color: 'red' },
  ])
  expect(base.programStates?.has('hover')).toBe(true)
  const hovered = split({ boxShadow: value }, { hover: true })
  expect(hovered.style?.boxShadow).toEqual([
    { offsetX: 0, offsetY: 0, blurRadius: 20, color: 'blue' },
  ])
})

test('textShadow clauses evaluate and expand to RN longhands', () => {
  const value = '1px 1px 2px red hover:2px 2px 4px blue'
  const hovered = getSplitStyles(
    { textShadow: value },
    Text.staticConfig,
    undefined as any,
    'light',
    { unmounted: false, hover: true } as any,
    { isAnimated: false, noClass: true, resolveValues: 'auto' } as any
  )
  expect(hovered.style?.textShadowColor).toBe('blue')
  expect(hovered.style?.textShadowRadius).toBe(4)
})
