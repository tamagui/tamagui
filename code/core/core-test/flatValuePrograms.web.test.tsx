// Lanes W1 + W2: string style values accumulate per-longhand programs through
// the forward pass and lower to program-block CSS. v3 cutover contract: a
// clause-free string is a base-only program resolving config-first; only
// unparseable colon-free strings keep the legacy path.

import { beforeAll, expect, test } from 'vitest'
import { H4 } from '../../ui/text/src/Headings'
import config from '../config-default'
import { Text, View, createTamagui, getSplitStyles, styled } from '../web/src'
import {
  flatValuePrecedenceFixtures,
  reverseFixtureProgram,
  type FlatValueFixtureConditions,
  type FlatValuePrecedenceFixture,
} from './flatValuePrecedenceFixtures'
import { simplifiedGetSplitStyles } from './utils'

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

const fixtureGroupEntry = (
  pseudo: Record<string, boolean> = {},
  layout?: { width: number; height: number }
) => ({
  subscribe: () => () => {},
  state: { pseudo, layout },
})

function fixtureOptions(active: FlatValueFixtureConditions) {
  const groupContext: Record<string, any> = {}
  for (const group of active.groups ?? []) {
    const match = /^group-([^/]+)(?:\/(.+))?$/.exec(group)
    if (match) {
      groupContext[match[2] ?? 'true'] = fixtureGroupEntry({
        [match[1] === 'active' ? 'press' : match[1]]: true,
      })
    }
  }
  for (const container of active.containers ?? []) {
    const match = /^@[^/]+(?:\/(.+))?$/.exec(container)
    groupContext[match?.[1] ? `@${match[1]}` : '@'] = fixtureGroupEntry(
      {},
      { width: 400, height: 100 }
    )
  }
  return {
    componentState: Object.fromEntries(
      (active.states ?? []).map((state) => [state === 'active' ? 'press' : state, true])
    ),
    groupContext,
    mediaState: Object.fromEntries((active.media ?? []).map((name) => [name, true])),
    mergeDefaultProps: true,
    noClass: true,
    themeName: active.themes?.at(-1) ?? 'light',
  }
}

function splitFixture(
  fixture: FlatValuePrecedenceFixture,
  active: FlatValueFixtureConditions,
  reversed: boolean
) {
  let Component: any = View
  const props: Record<string, string> = {}
  for (const layer of fixture.layers) {
    const value = reversed ? reverseFixtureProgram(layer.value) : layer.value
    if (layer.source === 'styled') {
      Component = styled(Component, { [fixture.property]: value })
    } else {
      props[fixture.property] = value
    }
  }
  return simplifiedGetSplitStyles(Component, props, fixtureOptions(active))
}

for (const fixture of flatValuePrecedenceFixtures) {
  for (const scenario of fixture.scenarios) {
    if (scenario.active.platform === 'ios') continue
    test(`precedence fixture ${fixture.id}: ${fixture.name} / ${scenario.name}`, () => {
      for (const reversed of [false, true]) {
        const result = splitFixture(fixture, scenario.active, reversed)
        expect(result.style?.[fixture.property]).toBe(
          reversed ? (scenario.reversedExpected ?? scenario.expected) : scenario.expected
        )
      }
    })
  }
}

test('a clause value lowers to one program block', () => {
  const result = split({ backgroundColor: 'red hover:blue' })
  const className = result.classNames.backgroundColor
  expect(className).toMatch(/^_bc-/)
  const rules = rulesFor(result, className)
  expect(rules).toHaveLength(2)
  expect(rules[0]).toBe(`.${className}{background-color:red}`)
  expect(rules[1]).toBe(
    `@media (hover: hover) {.${className}:hover{background-color:blue}}`
  )
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

test('bare tokens resolve in conditional flat values', () => {
  const colors = split({ backgroundColor: 'white hover:black' })
  const colorClass = colors.classNames.backgroundColor
  expect(rulesFor(colors, colorClass)).toEqual([
    `.${colorClass}{background-color:var(--c-white)}`,
    `@media (hover: hover) {.${colorClass}:hover{background-color:var(--c-black)}}`,
  ])

  const padding = split({ padding: '4 hover:8' })
  for (const [longhand, cssProperty] of [
    ['paddingTop', 'padding-top'],
    ['paddingRight', 'padding-right'],
    ['paddingBottom', 'padding-bottom'],
    ['paddingLeft', 'padding-left'],
  ] as const) {
    const className = padding.classNames[longhand]
    expect(rulesFor(padding, className), longhand).toEqual([
      `.${className}{${cssProperty}:var(--t-space-4)}`,
      `@media (hover: hover) {.${className}:hover{${cssProperty}:var(--t-space-8)}}`,
    ])
  }

  const background = split({ background: 'white hover:black' })
  const backgroundClass = background.classNames.backgroundColor
  expect(rulesFor(background, backgroundClass)).toEqual([
    `.${backgroundClass}{background-color:var(--c-white)}`,
    `@media (hover: hover) {.${backgroundClass}:hover{background-color:var(--c-black)}}`,
  ])
})

test('an unknown bare lookup miss stays literal on web', () => {
  const warnings: string[] = []
  const original = console.warn
  const previousNodeEnv = process.env.NODE_ENV
  process.env.NODE_ENV = 'development'
  console.warn = (message: string) => warnings.push(String(message))
  try {
    const result = split({ backgroundColor: 'missing-web-base hover:black' })
    const className = result.classNames.backgroundColor
    expect(rulesFor(result, className)).toEqual([
      `.${className}{background-color:missing-web-base}`,
      `@media (hover: hover) {.${className}:hover{background-color:var(--c-black)}}`,
    ])
    expect(warnings).toEqual([])
  } finally {
    console.warn = original
    process.env.NODE_ENV = previousNodeEnv
  }
})

test('bare tokens reach conditional border-family splitting intact', () => {
  const result = split({ border: '4 solid white hover:8 dashed black' })

  const widthClass = result.classNames.borderTopWidth
  expect(rulesFor(result, widthClass)).toEqual([
    `.${widthClass}{border-top-width:var(--t-space-4)}`,
    `@media (hover: hover) {.${widthClass}:hover{border-top-width:var(--t-space-8)}}`,
  ])

  const styleClass = result.classNames.borderTopStyle
  expect(rulesFor(result, styleClass)).toEqual([
    `.${styleClass}{border-top-style:solid}`,
    `@media (hover: hover) {.${styleClass}:hover{border-top-style:dashed}}`,
  ])

  const colorClass = result.classNames.borderTopColor
  expect(rulesFor(result, colorClass)).toEqual([
    `.${colorClass}{border-top-color:var(--c-white)}`,
    `@media (hover: hover) {.${colorClass}:hover{border-top-color:var(--c-black)}}`,
  ])
})

test('a later plain value restates the base; the hover survives (decision 21)', () => {
  const result = split({ backgroundColor: 'red hover:blue', bg: 'green' })
  const className = result.classNames.backgroundColor
  expect(className).toMatch(/^_bc-/)
  const rules = rulesFor(result, className)
  expect(rules[0]).toBe(`.${className}{background-color:green}`)
  expect(rules[1]).toBe(
    `@media (hover: hover) {.${className}:hover{background-color:blue}}`
  )
})

test('a later program replaces the plain value wholesale', () => {
  const result = split({ bg: 'green', backgroundColor: 'red hover:blue' })
  expect(result.classNames.backgroundColor).toMatch(/^_bc-/)
  expect(result.style?.backgroundColor).toBeUndefined()
})

test('clause-free strings are base-only programs resolving config-first', () => {
  // a plain CSS value becomes a base-only program block
  const result = split({ backgroundColor: 'red' })
  const className = result.classNames.backgroundColor
  expect(className).toMatch(/^_bc-/)
  expect(rulesFor(result, className)).toEqual([`.${className}{background-color:red}`])

  // a configured bare numeric string resolves through the token category
  // (`p="4"` is the space token exactly like `p="4"` was)
  const tokens = split({ p: '4' })
  for (const longhand of ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft']) {
    const tokenClass = tokens.classNames[longhand]
    expect(tokenClass, longhand).toBeTruthy()
    expect(rulesFor(tokens, tokenClass)[0]).toContain('var(--')
  }
})

test('a configured name wins over the same-spelled CSS literal', () => {
  // the design of record's collision rule ("V6 candidate naming" /
  // config-first resolution): `black` is a configured color token in the
  // default config, so it resolves to the token variable, not the CSS keyword.
  // CSS-wide keywords (none, auto, transparent, ...) are reserved at config
  // creation and can never collide.
  const result = split({ backgroundColor: 'black' })
  const className = result.classNames.backgroundColor
  expect(rulesFor(result, className)[0]).toBe(
    `.${className}{background-color:var(--c-black)}`
  )
})

test('an overloaded-family mismatch is a diagnostic, never a silent bind', () => {
  // `width="black"`: 'black' lives in the color category, width binds size.
  // the shared candidate-target validator diagnoses the mismatch; the value
  // ships raw (visible breakage) instead of binding the color variable
  const warnings: string[] = []
  const original = console.warn
  const previousNodeEnv = process.env.NODE_ENV
  process.env.NODE_ENV = 'development'
  console.warn = (message: string) => warnings.push(String(message))
  try {
    const result = split({ width: 'black' })
    const className = result.classNames.width
    expect(rulesFor(result, className)[0]).toBe(`.${className}{width:black}`)
    expect(
      warnings.some((warning) =>
        warning.includes('"black" contributes to "color", not "width"')
      )
    ).toBe(true)
  } finally {
    console.warn = original
    process.env.NODE_ENV = previousNodeEnv
  }
})

test('aspectRatio colon values pass through; other parse failures throw in dev', () => {
  // RN accepts aspectRatio="16:9"; it is the one legitimate colon value
  const result = split({ aspectRatio: '16:9' })
  const className = result.classNames.aspectRatio
  expect(rulesFor(result, className)[0]).toContain('aspect-ratio:16:9')

  // v3 cutover: a clause-shaped typo is loud where the author can see it
  const previousNodeEnv = process.env.NODE_ENV
  process.env.NODE_ENV = 'development'
  try {
    expect(() => split({ backgroundColor: 'red hver:blue' })).toThrow(/does not parse/)
  } finally {
    process.env.NODE_ENV = previousNodeEnv
  }
})

test('a program displaces a uniform geometric shorthand per longhand', () => {
  const result = split({ padding: 10, paddingTop: '4 hover:8' })
  expect(result.classNames.paddingTop).toMatch(/^_pt-/)
  // the other three sides survive as plain values
  expect(result.style?.paddingRight ?? result.classNames.paddingRight).toBeTruthy()
  expect(result.style?.paddingTop).toBeUndefined()
})

test('noClass configurations evaluate programs inline like native', () => {
  // The animated-inline path uses the same shared precedence evaluation as
  // native: the base applies now, states re-evaluate through re-renders, and
  // no program classes are inserted.
  const result = getSplitStyles(
    { backgroundColor: 'red hover:blue' },
    View.staticConfig,
    undefined as any,
    'light',
    { unmounted: false } as any,
    { ...opts, noClass: true }
  )
  expect(result.style?.backgroundColor).toBe('red')
  expect(result.programStates?.has('hover')).toBe(true)
  expect(Object.keys(result.rulesToInsert).some((id) => id.startsWith('_bc-'))).toBe(
    false
  )

  const hovered = getSplitStyles(
    { backgroundColor: 'red hover:blue' },
    View.staticConfig,
    undefined as any,
    'light',
    { unmounted: false, hover: true } as any,
    { ...opts, noClass: true }
  )
  expect(hovered.style?.backgroundColor).toBe('blue')
})

test('web platform clauses apply on the inline path; native ones do not', () => {
  const result = getSplitStyles(
    { backgroundColor: 'red native:green web:blue' },
    View.staticConfig,
    undefined as any,
    'light',
    { unmounted: false } as any,
    { ...opts, noClass: true }
  )
  expect(result.style?.backgroundColor).toBe('blue')
})

test('web platform clauses sort last and carry the platform specificity floor', () => {
  const result = split({ backgroundColor: 'sm:hover:blue web:red' })
  const className = result.classNames.backgroundColor
  const rules = rulesFor(result, className)
  expect(rules).toHaveLength(2)
  expect(rules[0]).toContain(':hover{background-color:blue}')
  expect(rules[1]).toContain('background-color:red')
  expect(rules[1].match(new RegExp(`\\.${className}`, 'g'))).toHaveLength(7)
})

test('a later style prop restates the base; the hover survives (decision 21)', () => {
  const result = split({
    backgroundColor: 'red hover:blue',
    style: { backgroundColor: 'green' },
  })
  const className = result.classNames.backgroundColor
  expect(className).toMatch(/^_bc-/)
  const rules = rulesFor(result, className)
  expect(rules[0]).toContain('green')
  expect(rules[1]).toContain(':hover')
})

test('styled same-key programs merge by clause slot through call-site props', () => {
  const Frame = styled(View, {
    bg: 'gray hover:blue',
    p: '4 sm:6',
    variants: {
      tone: {
        danger: {
          bg: 'orange focus:yellow',
        },
      },
    } as const,
  })

  const spread = { bg: 'red', p: '2' } as const
  const callSite = <Frame tone="danger" {...spread} pl="1" />
  const callSiteLast = simplifiedGetSplitStyles(Frame, callSite.props, {
    mergeDefaultProps: true,
  })
  const backgroundClass = callSiteLast.classNames.backgroundColor
  const backgroundRules = rulesFor(callSiteLast, backgroundClass)
  expect(backgroundRules[0]).toContain('background-color:red')
  expect(
    backgroundRules.some((rule) => rule.includes(':focus') && rule.includes('yellow'))
  ).toBe(true)
  expect(
    backgroundRules.some((rule) => rule.includes(':hover') && rule.includes('blue'))
  ).toBe(true)

  const paddingLeftClass = callSiteLast.classNames.paddingLeft
  const paddingLeftRules = rulesFor(callSiteLast, paddingLeftClass)
  expect(paddingLeftRules[0]).toContain('var(--t-space-1)')
  expect(
    paddingLeftRules.some(
      (rule) => rule.startsWith('@media ') && rule.includes('var(--t-space-6)')
    )
  ).toBe(true)

  const variantLastCallSite = <Frame {...{ bg: 'red' }} tone="danger" />
  const variantLast = simplifiedGetSplitStyles(Frame, variantLastCallSite.props, {
    mergeDefaultProps: true,
  })
  const variantLastRules = rulesFor(variantLast, variantLast.classNames.backgroundColor)
  expect(variantLastRules[0]).toContain('background-color:orange')
  expect(
    variantLastRules.some((rule) => rule.includes(':hover') && rule.includes('blue'))
  ).toBe(true)
  expect(
    variantLastRules.some((rule) => rule.includes(':focus') && rule.includes('yellow'))
  ).toBe(true)
})

test('animatable defaults do not displace a program', () => {
  // S3: the program marks usedKeys ownership, so applyDefaultStyle skips it
  const result = getSplitStyles(
    { opacity: '0.5 hover:1 enter:0' },
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
  const left = result.classNames.paddingLeft
  expect(rulesFor(result, left)[0]).toContain('padding-left:100px')
})

test('container clauses lower to @container queries', () => {
  const result = split({ backgroundColor: 'red @sm:blue' })
  const className = result.classNames.backgroundColor
  const rules = rulesFor(result, className)
  expect(rules[1]).toMatch(/^@container \(/)

  const named = split({ backgroundColor: 'red @sm/card:blue' })
  const namedRules = rulesFor(named, named.classNames.backgroundColor)
  expect(namedRules[1]).toMatch(/^@container card \(/)
})

test('the boolean container prop establishes an inline-size container', () => {
  const result = split({ container: true, backgroundColor: 'red' })
  const rules = rulesFor(result, 't_container')
  expect(rules[0]).toBe('.t_container { container-type: inline-size; }')
  expect(String(result.viewProps.className)).toContain('t_container')
})

test('theme clause lowers to the is-or-within selector', () => {
  const result = split({ backgroundColor: 'red dark:blue' })
  const className = result.classNames.backgroundColor
  const rules = rulesFor(result, className)
  expect(rules[1]).toContain(':where(.t_dark, .t_dark *)')
})

test('a styled clause default survives a call-site override (decision 21)', () => {
  const Frame = styled(View, {
    backgroundColor: 'gray hover:blue',
  })
  const result = simplifiedGetSplitStyles(
    Frame,
    { backgroundColor: 'red' },
    { mergeDefaultProps: true }
  )
  const className = result.classNames.backgroundColor
  const rules = result.rulesToInsert[className]?.[4] ?? []
  // the call-site value restates the base; the styled hover clause survives
  expect(rules[0]).toBe(`.${className}{background-color:red}`)
  expect(rules[1]).toContain(':hover{background-color:blue}')
})

test('caller longhands override styled-base shorthands and same-key defaults', () => {
  const Heading = styled(Text, {
    margin: 0,
    fontWeight: '700',
  })
  const result = simplifiedGetSplitStyles(
    Heading,
    { mt: '8', fontWeight: '400' },
    { mergeDefaultProps: true }
  )

  const marginRules = rulesFor(result, result.classNames.marginTop)
  const weightRules = rulesFor(result, result.classNames.fontWeight)
  expect(marginRules[0]).toContain('var(--t-space-8)')
  expect(weightRules[0]).toContain('font-weight:400')
})

test('heading caller spacing survives the inherited size variant chain', () => {
  const result = simplifiedGetSplitStyles(
    H4,
    {
      mt: '8',
      mb: '2',
      color: 'color8',
      fontWeight: '400',
      size: '8',
    },
    { mergeDefaultProps: true }
  )

  expect(rulesFor(result, result.classNames.marginTop)[0]).toContain('var(--t-space-8)')
})

test('a base swallowed by a conditional payload is a diagnostic, not silence', () => {
  const warnings: string[] = []
  const original = console.warn
  const previousNodeEnv = process.env.NODE_ENV
  process.env.NODE_ENV = 'development'
  console.warn = (message: string) => warnings.push(String(message))
  try {
    // 'red' after 'sm:green' joins the clause payload; the program has no
    // base and the browser drops the two-color declaration entirely
    split({ backgroundColor: 'sm:green red' })
    expect(
      warnings.some((warning) => warning.includes('before the first conditional'))
    ).toBe(true)
  } finally {
    console.warn = original
    process.env.NODE_ENV = previousNodeEnv
  }
})

test('geometric shorthand payloads distribute by slot (p="4 8")', () => {
  const result = split({ p: '4 8' })
  const top = result.classNames.paddingTop
  const right = result.classNames.paddingRight
  expect(rulesFor(result, top)[0]).toContain('padding-top:var(--t-space-4)')
  expect(rulesFor(result, right)[0]).toContain('padding-right:var(--t-space-8)')
  expect(rulesFor(result, result.classNames.paddingBottom)[0]).toContain(
    'padding-bottom:var(--t-space-4)'
  )
  expect(rulesFor(result, result.classNames.paddingLeft)[0]).toContain(
    'padding-left:var(--t-space-8)'
  )
})
