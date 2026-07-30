// Lane W3: on native, clause-bearing values evaluate last-matching-clause
// against live conditions and land in the plain style object.

import { beforeAll, expect, test } from 'vitest'
import config from '../config-default'
import { View, createTamagui, getSplitStyles } from '../web/src'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig() as any)
})

const split = (
  props: Record<string, any>,
  state: Record<string, any> = {},
  themeName = 'light',
  styleProps: Record<string, any> = {}
) =>
  getSplitStyles(
    props,
    View.staticConfig,
    undefined as any,
    themeName,
    { unmounted: false, ...state } as any,
    { isAnimated: false, noClass: true, resolveValues: 'auto', ...styleProps } as any
  )

test('base applies and the hover clause waits for the state', () => {
  const base = split({ backgroundColor: 'red hover:blue' })
  expect(base.style?.backgroundColor).toBe('red')
  expect(base.programStates?.has('hover')).toBe(true)

  const hovered = split({ backgroundColor: 'red hover:blue' }, { hover: true })
  expect(hovered.style?.backgroundColor).toBe('blue')
})

test('press state matches press and active spellings', () => {
  const pressed = split({ opacity: '0.5 press:1' }, { press: true })
  expect(pressed.style?.opacity).toBe(1)
})

test('theme clauses follow the theme name chain', () => {
  const light = split({ backgroundColor: 'red dark:blue' })
  expect(light.style?.backgroundColor).toBe('red')

  const dark = split({ backgroundColor: 'red dark:blue' }, {}, 'dark')
  expect(dark.style?.backgroundColor).toBe('blue')

  const subTheme = split({ backgroundColor: 'red dark:blue' }, {}, 'dark_blue')
  expect(subTheme.style?.backgroundColor).toBe('blue')
})

test('media clauses read the media state and register the subscription', () => {
  const off = split({ backgroundColor: 'red sm:blue' })
  expect(off.style?.backgroundColor).toBe('red')
  expect(off.hasMedia instanceof Set && off.hasMedia.has('sm')).toBe(true)

  const on = split({ backgroundColor: 'red sm:blue' }, {}, 'light', {
    mediaState: { sm: true },
  })
  expect(on.style?.backgroundColor).toBe('blue')
})

test('native platform clauses apply through containment', () => {
  const result = split({ backgroundColor: 'red native:blue web:green' })
  expect(result.style?.backgroundColor).toBe('blue')
})

test('tokens resolve to numbers through the theme getter', () => {
  const result = split({ p: '4 hover:6' })
  expect(result.style?.paddingTop).toBe(18)
  expect(result.style?.paddingLeft).toBe(18)

  const hovered = split({ p: '4 hover:6' }, { hover: true })
  expect(hovered.style?.paddingTop).toBe(32)
})

test('px payloads become unitless numbers', () => {
  const result = split({ marginTop: '10px hover:20px' })
  expect(result.style?.marginTop).toBe(10)
})

test('a later plain value still replaces the program on native', () => {
  const result = split({ backgroundColor: 'red hover:blue', bg: 'green' }, { hover: true })
  expect(result.style?.backgroundColor).toBe('green')
})
