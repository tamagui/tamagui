import { beforeAll, expect, test } from 'vitest'
import config from '../config-default'
import { View, createTamagui, getSplitStyles } from '../web/src'

beforeAll(() => {
  createTamagui({
    ...config.getDefaultTamaguiConfig(),
    settings: { styleMode: 'tamagui-and-tailwind' },
  } as any)
})

const opts = { isAnimated: false, noClass: false, resolveValues: 'auto' } as any

const split = (props: Record<string, any>) =>
  getSplitStyles(props, View.staticConfig, undefined as any, 'light', {
    unmounted: false,
  } as any, opts)

test('flat $group-name-pseudo:prop matches object form output', () => {
  const flat = split({ '$group-card-hover:opacity': 0.5 })
  const obj = split({ '$group-card-hover': { opacity: 0.5 } })
  expect(flat?.classNames).toEqual(obj?.classNames)
  expect(Object.keys(flat?.rulesToInsert || {})).toEqual(
    Object.keys(obj?.rulesToInsert || {})
  )
  // regression: this used to silently produce nothing
  expect(Object.keys(flat?.classNames || {}).length).toBeGreaterThan(0)
})

test('flat $group-name:prop (no pseudo) matches object form output', () => {
  const flat = split({ '$group-card:backgroundColor': 'red' })
  const obj = split({ '$group-card': { backgroundColor: 'red' } })
  expect(flat?.classNames).toEqual(obj?.classNames)
  expect(Object.keys(flat?.classNames || {}).length).toBeGreaterThan(0)
})
