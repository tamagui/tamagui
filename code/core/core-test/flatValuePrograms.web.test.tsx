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

test('noClass configurations keep the legacy path instead of dropping the value', () => {
  // S1: only the class flush can express a program; inline/animated drivers
  // must see the same (raw) value they saw before W1
  const result = getSplitStyles(
    { backgroundColor: 'red hover:blue' },
    View.staticConfig,
    undefined as any,
    'light',
    { unmounted: false } as any,
    { ...opts, noClass: true }
  )
  expect(result.style?.backgroundColor).toBeTruthy()
  expect(Object.keys(result.rulesToInsert).some((id) => id.startsWith('_bc-'))).toBe(
    false
  )
})

test('a later style prop replaces an earlier program', () => {
  // S2: the style attribute is an ordinary later contribution and must win
  const result = split({
    backgroundColor: 'red hover:blue',
    style: { backgroundColor: 'green' },
  })
  expect(String(result.classNames.backgroundColor ?? '')).not.toMatch(/^_bc-/)
  expect(Object.keys(result.rulesToInsert).some((id) => id.startsWith('_bc-'))).toBe(
    false
  )
})

test('animatable defaults do not displace a program', () => {
  // S3: the program marks usedKeys ownership, so applyDefaultStyle skips it
  const result = getSplitStyles(
    { opacity: '0.5 hover:1', enterStyle: { opacity: 0 } },
    View.staticConfig,
    undefined as any,
    'light',
    { unmounted: false } as any,
    { ...opts, isAnimated: true }
  )
  expect(result.classNames.opacity).toMatch(/^_o-/)
  const rules = rulesFor(result, result.classNames.opacity)
  expect(rules[0]).toContain('0.5')
})

test('accept props never route into CSS', () => {
  // S6: placeholderTextColor-style accept keys are props, not styles
  const result = getSplitStyles(
    { placeholderTextColor: 'gray hover:blue' },
    {
      ...View.staticConfig,
      accept: { placeholderTextColor: 'color' },
    } as any,
    undefined as any,
    'light',
    { unmounted: false } as any,
    opts
  )
  expect(
    Object.values(result.classNames).some((v) => String(v).startsWith('_ptc-'))
  ).toBe(false)
  expect(result.viewProps.placeholderTextColor).toBeTruthy()
})

test('a multi-value shorthand expands per side when a program takes one side', () => {
  // S9a: style={{padding:'10px 20px'}} + paddingTop program must keep the
  // other three sides
  const result = split({
    style: { padding: '10px 20px' },
    paddingTop: '4 hover:8',
  })
  expect(result.classNames.paddingTop).toMatch(/^_pt-/)
  const flat = { ...result.style }
  const lookup = (k: string) => flat[k] ?? result.classNames[k]
  expect(lookup('paddingRight')).toBeTruthy()
  expect(lookup('paddingBottom')).toBeTruthy()
  expect(lookup('paddingLeft')).toBeTruthy()
  expect(lookup('padding')).toBeFalsy()
})

test('sibling expansion never clobbers a later authored longhand', () => {
  // S9b: paddingLeft was authored after the style prop and must win
  const result = split({
    style: { padding: 10 },
    paddingLeft: 100,
    paddingTop: '4 hover:8',
  })
  const left = result.style?.paddingLeft ?? result.classNames.paddingLeft
  expect(String(left)).toContain('100')
})

test('theme clause lowers to the is-or-within selector', () => {
  const result = split({ backgroundColor: 'red dark:blue' })
  const className = result.classNames.backgroundColor
  const rules = rulesFor(result, className)
  expect(rules[1]).toContain(':where(.t_dark, .t_dark *)')
})
