process.env.TAMAGUI_TARGET = 'web'

import { beforeAll, expect, test } from 'vitest'
import config from '../config-default'
import { View, createTamagui, getSplitStyles } from '../web/src'

// The transform family through contribution and lowering. `x`/`y` and the two
// scale axes write per-axis custom properties; one composing rule turns them into
// `translate`/`scale`, and both classes have to land on the element.

let conf: any
beforeAll(() => {
  conf = createTamagui(config.getDefaultTamaguiConfig() as any)
})

const split = (props: Record<string, any>) =>
  getSplitStyles(
    props,
    View.staticConfig,
    conf.themes.light,
    'light',
    { unmounted: false } as any,
    { isAnimated: false, noClass: false, resolveValues: 'auto' } as any
  )

const rulesFor = (result: any, identifier: string): string[] =>
  result.rulesToInsert[identifier]?.[4] ?? []

test('an x program writes its axis variable and ships the composing rule', () => {
  const result = split({ x: '0px hover:4px' })
  const axisClass = result.classNames['--t-x']
  expect(axisClass).toBeTruthy()
  expect(rulesFor(result, axisClass)).toEqual([
    `.${axisClass}{--t-x:0px}`,
    `@media (hover: hover) {.${axisClass}:where(:hover){--t-x:4px}}`,
  ])

  // the composing rule is its own class, keyed under the property it composes
  const composeClass = result.classNames.translate
  expect(composeClass).toBeTruthy()
  expect(rulesFor(result, composeClass)).toEqual([
    `:where(.${composeClass}){--t-x:0px;--t-y:0px}`,
    `.${composeClass}{translate:var(--t-x, 0px) var(--t-y, 0px)}`,
  ])

  // both classes reach the element, or the variable is set and nothing reads it
  expect(result.viewProps.className).toContain(axisClass)
  expect(result.viewProps.className).toContain(composeClass)
})

test('x and y share one composing class', () => {
  const result = split({ x: '1px hover:2px', y: '3px hover:4px' })
  expect(result.classNames['--t-x']).toBeTruthy()
  expect(result.classNames['--t-y']).toBeTruthy()
  expect(result.classNames['--t-x']).not.toBe(result.classNames['--t-y'])
  // one translate composition for both axes
  const composeClass = result.classNames.translate
  expect(rulesFor(result, composeClass)).toEqual([
    `:where(.${composeClass}){--t-x:0px;--t-y:0px}`,
    `.${composeClass}{translate:var(--t-x, 0px) var(--t-y, 0px)}`,
  ])
})

test('uniform scale expands to both axis programs behind one scale composition', () => {
  const result = split({ scale: '1 enter:0.9' })
  const x = result.classNames['--t-scale-x']
  const y = result.classNames['--t-scale-y']
  expect(x).toBeTruthy()
  expect(y).toBeTruthy()
  expect(rulesFor(result, x)).toEqual([
    `.${x}{--t-scale-x:1}`,
    `.${x}:where(.t_unmounted, .t_unmounted *){--t-scale-x:0.9}`,
  ])
  expect(rulesFor(result, y)[1]).toBe(
    `.${y}:where(.t_unmounted, .t_unmounted *){--t-scale-y:0.9}`
  )
  const composeClass = result.classNames.scale
  expect(rulesFor(result, composeClass)).toEqual([
    `:where(.${composeClass}){--t-scale-x:1;--t-scale-y:1}`,
    `.${composeClass}{scale:var(--t-scale-x, 1) var(--t-scale-y, 1)}`,
  ])
})

test('scale then scaleX replaces only its axis through the forward merge', () => {
  const result = split({ scale: '1 hover:2', scaleX: '1 hover:3' })
  const x = result.classNames['--t-scale-x']
  const y = result.classNames['--t-scale-y']
  // the later scaleX owns X; the uniform scale still owns Y
  expect(rulesFor(result, x)[1]).toBe(
    `@media (hover: hover) {.${x}:where(:hover){--t-scale-x:3}}`
  )
  expect(rulesFor(result, y)[1]).toBe(
    `@media (hover: hover) {.${y}:where(:hover){--t-scale-y:2}}`
  )
})

test('rotate lowers to the individual property with no composition', () => {
  const result = split({ rotate: '0deg hover:45deg' })
  const rotateClass = result.classNames.rotate
  expect(rulesFor(result, rotateClass)).toEqual([
    `.${rotateClass}{rotate:0deg}`,
    `@media (hover: hover) {.${rotateClass}:where(:hover){rotate:45deg}}`,
  ])
  expect(result.classNames.translate).toBeUndefined()
})

test('x resolves space tokens like padding does', () => {
  const result = split({ x: '4 hover:8' })
  const axisClass = result.classNames['--t-x']
  const rules = rulesFor(result, axisClass)
  expect(rules[0]).toBe(`.${axisClass}{--t-x:${conf.tokensParsed.space['4'].variable}}`)
  expect(rules[1]).toContain(conf.tokensParsed.space['8'].variable)
})

test('clause-free transform values are base-only axis programs', () => {
  // v3 cutover: family numerics contribute programs too, so nothing is left
  // for the legacy atomic transform class
  const result = split({ scale: 2, x: 10 })
  const scaleX = result.classNames['--t-scale-x']
  const x = result.classNames['--t-x']
  expect(rulesFor(result, scaleX)[0]).toBe(`.${scaleX}{--t-scale-x:2}`)
  expect(rulesFor(result, x)[0]).toBe(`.${x}{--t-x:10px}`)
  expect(result.classNames.transform).toBeUndefined()
})

test('a scaleX program merges over an earlier plain uniform scale', () => {
  // plain scale: 2 contributes base programs on both axes; the later scaleX
  // restates the X base (decision 21) while Y keeps the uniform value
  const result = split({ scale: 2, scaleX: '1 hover:3' })
  const x = result.classNames['--t-scale-x']
  expect(x).toBeTruthy()
  expect(rulesFor(result, x)[0]).toBe(`.${x}{--t-scale-x:1}`)
  expect(rulesFor(result, x)[1]).toBe(
    `@media (hover: hover) {.${x}:where(:hover){--t-scale-x:3}}`
  )
  const y = result.classNames['--t-scale-y']
  expect(rulesFor(result, y)[0]).toBe(`.${y}{--t-scale-y:2}`)
})

test('a later plain transform value restates the base; the hover survives', () => {
  // the plain uniform scale restates both axis bases (decision 21)
  const result = split({ scaleX: '1 hover:3', scale: 2 })
  const xClass = result.classNames['--t-scale-x']
  expect(xClass).toBeTruthy()
  const rules = result.rulesToInsert[xClass]?.[4] ?? []
  expect(rules[0]).toContain('2')
  expect(rules[1]).toContain(':where(:hover)')
  expect(result.classNames['--t-scale-y']).toBeTruthy()
})

test('non-family transform parts stay legacy', () => {
  const result = split({ skewX: '10deg', perspective: 100 })
  expect(result.classNames['--t-x']).toBeUndefined()
  expect(result.classNames.translate).toBeUndefined()
})

test('a raw transform value is one ordinary program', () => {
  const result = split({ transform: 'skewX(10deg) hover:skewX(20deg)' })
  const className = result.classNames.transform
  expect(className).toBeTruthy()
  const rules = rulesFor(result, className)
  expect(rules[0]).toBe(`.${className}{transform:skewX(10deg)}`)
  expect(rules[1]).toContain(':where(:hover){transform:skewX(20deg)}')
})

test('a legacy part prop beside a transform program drops with a diagnostic', () => {
  const warnings: string[] = []
  const original = console.warn
  const previousNodeEnv = process.env.NODE_ENV
  process.env.NODE_ENV = 'development'
  console.warn = (message: string) => warnings.push(String(message))
  try {
    const result = split({ skewY: '3deg', transform: 'skewX(10deg) hover:skewX(20deg)' })
    // the program owns the transform property wholesale
    expect(result.classNames.transform).toMatch(/^_t/)
    expect(
      warnings.some((warning) => warning.includes('legacy transform part "skewY"'))
    ).toBe(true)
  } finally {
    console.warn = original
    process.env.NODE_ENV = previousNodeEnv
  }
})
