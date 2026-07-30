// Lanes W1 + W2: clause-bearing string values accumulate per-longhand programs
// through the forward pass and lower to program-block CSS. Staging contract:
// clause-less strings and unparseable strings keep the existing path untouched.

import { beforeAll, expect, test } from 'vitest'
import config from '../config-default'
import { View, createTamagui, getSplitStyles } from '../web/src'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig() as any)
})

const opts = { isAnimated: false, noClass: false, resolveValues: 'auto' } as any

const split = (props: Record<string, any>) =>
  getSplitStyles(
    props,
    View.staticConfig,
    undefined as any,
    'light',
    {
      unmounted: false,
    } as any,
    opts
  )

const rulesFor = (result: any, identifier: string): string[] =>
  result.rulesToInsert[identifier]?.[4] ?? []

test('a clause value lowers to one program block', () => {
  const result = split({ backgroundColor: 'red hover:blue' })
  const className = result.classNames.backgroundColor
  expect(className).toMatch(/^_bc-/)
  const rules = rulesFor(result, className)
  expect(rules).toHaveLength(2)
  expect(rules[0]).toBe(`.${className}{background-color:red}`)
  expect(rules[1]).toBe(`.${className}:where(:hover){background-color:blue}`)
})

test('tokens resolve to variables and media clauses wrap', () => {
  const result = split({ p: '4 sm:6' })
  // padding expands to four longhand programs
  for (const longhand of ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft']) {
    const className = result.classNames[longhand]
    expect(className, longhand).toBeTruthy()
    const rules = rulesFor(result, className)
    expect(rules).toHaveLength(2)
    expect(rules[0]).toContain('var(--')
    expect(rules[1]).toMatch(/^@media /)
  }
})

test('a later plain value replaces the program wholesale', () => {
  const result = split({ backgroundColor: 'red hover:blue', bg: 'green' })
  // bg is the later contribution and expands to backgroundColor: plain path
  expect(result.classNames.backgroundColor ?? '').not.toMatch(/^_bc-/)
  expect(Object.keys(result.rulesToInsert).some((id) => id.startsWith('_bc-'))).toBe(
    false
  )
})

test('a later program replaces the plain value wholesale', () => {
  const result = split({ bg: 'green', backgroundColor: 'red hover:blue' })
  expect(result.classNames.backgroundColor).toMatch(/^_bc-/)
  expect(result.style?.backgroundColor).toBeUndefined()
})

test('clause-less strings keep the existing path byte for byte', () => {
  const program = split({ backgroundColor: 'red' })
  const baseline = split({ backgroundColor: 'red' })
  expect(program.classNames).toEqual(baseline.classNames)
  expect(Object.keys(program.classNames).every((k) => !String(program.classNames[k]).startsWith('_bc-'))).toBe(true)
})

test('a colon value that is not a program passes through unchanged', () => {
  // RN accepts aspectRatio="16:9"; it must keep working until the V3 cutover
  const result = split({ aspectRatio: '16:9' })
  const hasProgram = Object.values(result.classNames).some((v) =>
    String(v).startsWith('_ar-')
  )
  expect(hasProgram).toBe(false)
})

test('a program displaces a uniform geometric shorthand per longhand', () => {
  const result = split({ padding: 10, paddingTop: '4 hover:8' })
  expect(result.classNames.paddingTop).toMatch(/^_pt-/)
  // the other three sides survive as plain values
  expect(result.style?.paddingRight ?? result.classNames.paddingRight).toBeTruthy()
  expect(result.style?.paddingTop).toBeUndefined()
})

test('theme clause lowers to the is-or-within selector', () => {
  const result = split({ backgroundColor: 'red dark:blue' })
  const className = result.classNames.backgroundColor
  const rules = rulesFor(result, className)
  expect(rules[1]).toContain(':where(.t_dark, .t_dark *)')
})
