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
  styleProps: Record<string, any> = {},
  groupContext?: Record<string, any>
) =>
  getSplitStyles(
    props,
    View.staticConfig,
    undefined as any,
    themeName,
    { unmounted: false, ...state } as any,
    { isAnimated: false, noClass: true, resolveValues: 'auto', ...styleProps } as any,
    undefined,
    undefined,
    groupContext as any
  )

// a parent group/container entry as createComponent provides it
const groupEntry = (
  pseudo: Record<string, boolean> = {},
  layout?: { width: number; height: number }
) => ({
  subscribe: () => () => {},
  state: { pseudo, layout },
})

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

test('exit clauses source from isExiting', () => {
  const normal = split({ opacity: '1 exit:0' })
  expect(normal.style?.opacity).toBe(1)

  const exiting = split({ opacity: '1 exit:0' }, {}, 'light', { isExiting: true })
  expect(exiting.style?.opacity).toBe(0)
})

test('component-tier states are skipped, not phantom-attached', () => {
  const result = split({ backgroundColor: 'gray checked:blue' })
  expect(result.style?.backgroundColor).toBe('gray')
  expect(result.programStates?.has('checked') ?? false).toBe(false)
})

test('the gap family resolves to native numbers', () => {
  const result = split({ gap: '16px hover:24px' })
  expect(result.style?.rowGap).toBe(16)
  expect(result.style?.columnGap).toBe(16)
})

test('program values run through native fixStyles like plain values', () => {
  // borderWidth programs must receive the borderStyle default
  const result = split({ borderWidth: '1 hover:2' })
  expect(result.style?.borderTopWidth ?? result.style?.borderWidth).toBeTruthy()
  expect(result.style?.borderStyle).toBe('solid')
})

test('group clauses read the parent group state and register the subscription', () => {
  const value = { backgroundColor: 'red group-hover:blue' }

  // context initial snapshot, before the first subscribed update
  const idle = split(value, {}, 'light', {}, { true: groupEntry({ hover: false }) })
  expect(idle.style?.backgroundColor).toBe('red')
  expect(idle.pseudoGroups?.has('true')).toBe(true)

  const hovered = split(value, {}, 'light', {}, { true: groupEntry({ hover: true }) })
  expect(hovered.style?.backgroundColor).toBe('blue')

  // once subscribed, componentState.group wins over the context snapshot
  const subscribed = split(
    value,
    { group: { true: { pseudo: { hover: true } } } },
    'light',
    {},
    { true: groupEntry({ hover: false }) }
  )
  expect(subscribed.style?.backgroundColor).toBe('blue')
})

test('named group clauses read the named entry; active maps to press', () => {
  const ctx = { card: groupEntry({ press: true }) }
  const result = split({ opacity: '1 group-active/card:0.5' }, {}, 'light', {}, ctx)
  expect(result.style?.opacity).toBe(0.5)
  expect(result.pseudoGroups?.has('card')).toBe(true)
})

test('container clauses measure the nearest container layout', () => {
  const value = { backgroundColor: 'red @sm:blue' }

  // sm is maxWidth 800 in the default config; the container, not the viewport
  const narrow = split(value, {}, 'light', {}, { '@': groupEntry({}, { width: 400, height: 100 }) })
  expect(narrow.style?.backgroundColor).toBe('blue')

  const wide = split(value, {}, 'light', {}, { '@': groupEntry({}, { width: 1000, height: 100 }) })
  expect(wide.style?.backgroundColor).toBe('red')

  // registration: the context key subscribes, the size feeds the layout math
  expect(narrow.pseudoGroups?.has('@')).toBe(true)
  expect(narrow.mediaGroups?.has('sm')).toBe(true)
})

test('named container clauses target the named entry and prefer subscribed state', () => {
  const value = { backgroundColor: 'red @sm/card:blue' }

  const byLayout = split(value, {}, 'light', {}, {
    '@card': groupEntry({}, { width: 500, height: 100 }),
  })
  expect(byLayout.style?.backgroundColor).toBe('blue')
  expect(byLayout.pseudoGroups?.has('@card')).toBe(true)

  // a subscribed media result beats the raw layout snapshot
  const subscribed = split(
    value,
    { group: { '@card': { media: { sm: false } } } },
    'light',
    {},
    { '@card': groupEntry({}, { width: 500, height: 100 }) }
  )
  expect(subscribed.style?.backgroundColor).toBe('red')
})

test('a later plain value restates the base on native; the hover survives', () => {
  const idle = split({ backgroundColor: 'red hover:blue', bg: 'green' })
  expect(idle.style?.backgroundColor).toBe('green')

  const hovered = split({ backgroundColor: 'red hover:blue', bg: 'green' }, { hover: true })
  expect(hovered.style?.backgroundColor).toBe('blue')
})
