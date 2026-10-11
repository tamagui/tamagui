// browser views accept canonical css for inheritance. native-only text fields
// remain consumed, and authored styles must never leak as dom attributes.

import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest'
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

describe.each([
  ['View', View],
  ['Text', Text],
])('%s color authoring', (_name, Component) => {
  test('a direct color emits atomic CSS without a host attribute', () => {
    const result = split({ color: 'red' }, Component.staticConfig)
    const className = result.classNames?.color
    expect(className).toMatch(/^_c-/)
    expect(result.rulesToInsert[className!]?.[4]).toEqual([`.${className}{color:red}`])
    expect(result.viewProps.color).toBeUndefined()
    expect(result.style?.color).toBeUndefined()
  })

  test('a style object retains inline color without a host attribute', () => {
    const result = split({ style: { color: 'red' } }, Component.staticConfig)
    expect(result.style).toEqual({ color: 'red' })
    expect(result.classNames?.color).toBeUndefined()
    expect(result.viewProps.color).toBeUndefined()
  })
})

test('View text decoration and CSS shadow emit rules without host attributes', () => {
  const result = split(
    { textDecorationColor: 'red', textShadow: '1px 2px 3px blue' },
    View.staticConfig
  )
  expect(result.viewProps.textDecorationColor).toBeUndefined()
  for (const [property, declaration] of [
    ['textDecorationColor', 'text-decoration-color:red'],
    ['textShadow', 'text-shadow:1px 2px 3px blue'],
  ]) {
    const rule = Object.entries(result.rulesToInsert).find(([identifier, style]) =>
      style[4].includes(`.${identifier}{${declaration}}`)
    )
    expect(rule, JSON.stringify(result)).toBeDefined()
    expect(Object.values(result.classNames)).toContain(rule![0])
    expect(result.viewProps[property]).toBeUndefined()
    expect(result.style?.[property]).toBeUndefined()
  }
})
