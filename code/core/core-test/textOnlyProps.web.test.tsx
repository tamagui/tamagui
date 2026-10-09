// browser views accept canonical css for inheritance. native-only text fields
// remain consumed, and authored styles must never leak as dom attributes.

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

test('color on a plain View emits inheritable CSS without a DOM attribute', () => {
  const result = split({ color: 'red' }, View.staticConfig)
  expect(result.viewProps.color).toBeUndefined()
  expect(result.style?.color).toBeUndefined()
  const className = result.classNames.color
  expect(className).toBeTruthy()
  expect(result.rulesToInsert[className]?.[4]).toEqual([`.${className}{color:red}`])
})

test('text colors never leak as DOM attributes on a View', () => {
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
