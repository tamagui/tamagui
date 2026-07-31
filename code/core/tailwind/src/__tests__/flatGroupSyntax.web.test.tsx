import { beforeAll, expect, test } from 'vitest'
import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { createTamagui } from '@tamagui/web'
import { View } from '../index'
import { splitTailwindStyles } from './utils'

beforeAll(() => {
  createTamagui(getDefaultTamaguiConfig())
})

const split = (props: Record<string, any>) =>
  splitTailwindStyles(View, props, { themeName: 'light' })

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

test('the shared group-hover kind still reaches the legacy flat adapter', () => {
  const flat = split({ '$group-hover:opacity': 0.5 })
  const obj = split({ '$group-hover': { opacity: 0.5 } })
  expect(flat?.classNames).toEqual(obj?.classNames)
  expect(Object.keys(flat?.rulesToInsert || {})).toEqual(
    Object.keys(obj?.rulesToInsert || {})
  )
  expect(Object.keys(flat?.classNames || {}).length).toBeGreaterThan(0)
})

test('flat $group-name:prop (no pseudo) matches object form output', () => {
  const flat = split({ '$group-card:backgroundColor': 'red' })
  const obj = split({ '$group-card': { backgroundColor: 'red' } })
  expect(flat?.classNames).toEqual(obj?.classNames)
  expect(Object.keys(flat?.classNames || {}).length).toBeGreaterThan(0)
})
