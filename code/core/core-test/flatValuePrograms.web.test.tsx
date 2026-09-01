// Lanes W1 + W2: string style values accumulate per-longhand programs through
// the forward pass and lower to program-block CSS. v3 cutover contract: a
// clause-free string is a base-only program resolving config-first; only
// unparseable colon-free strings keep the legacy path.

import { beforeAll, expect, test, vi } from 'vitest'
import { H4 } from '../../ui/text/src/Headings'
import config from '../config-default'
import { Text, View, createTamagui, getSplitStyles, styled } from '../web/src'
import {
  flatValuePrecedenceFixtures,
  reverseFixtureProgram,
  type FlatValueFixtureConditions,
  type FlatValuePrecedenceFixture,
} from './flatValuePrecedenceFixtures'
import { exposeClassProperties, simplifiedGetSplitStyles } from './utils'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig() as any)
})

const opts = { isAnimated: false, noClass: false, resolveValues: 'auto' } as any

const split = (props: Record<string, any>) =>
  exposeClassProperties(
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
  expect(className).toMatch(/^_b-/)
  const rules = rulesFor(result, className)
  expect(rules).toHaveLength(2)
  expect(rules[0]).toBe(`.${className}{background-color:red}`)
  expect(rules[1]).toBe(
    `@media (hover: hover) {.${className}:where(:hover){background-color:blue}}`
  )
})

test('flat conditional objects are the structured form of clause strings', () => {
  const object = split({
    bg: {
      default: 'red',
      hover: 'blue',
      sm: 'green',
      'sm:hover': 'purple',
      'dark:sm:hover': 'pink',
    },
  })
  const string = split({
    bg: 'red hover:blue sm:green sm:hover:purple dark:sm:hover:pink',
  })

  expect(object.classNames).toEqual(string.classNames)
  expect(object.rulesToInsert).toEqual(string.rulesToInsert)
  expect(object.programStates?.has('hover')).toBe(true)
  expect(object.hasMedia?.has('sm')).toBe(true)
})

test('flat conditional objects work through style props and styled variants', () => {
  const fromStyle = split({
    style: {
      backgroundColor: { default: 'red', 'sm:hover': 'blue' },
    },
  })
  expect(
    rulesFor(fromStyle, fromStyle.classNames.backgroundColor).some(
      (rule) => rule.startsWith('@media ') && rule.includes(':hover')
    )
  ).toBe(true)

  const Frame = styled(View, {
    variants: {
      tone: {
        danger: {
          bg: { default: 'orange', focus: 'yellow' },
        },
      },
    } as const,
  })
  const variant = simplifiedGetSplitStyles(
    Frame,
    { tone: 'danger' },
    {
      mergeDefaultProps: true,
    }
  )
  const rules = rulesFor(variant, variant.classNames.backgroundColor)
  expect(rules[0]).toContain('background-color:orange')
  expect(rules.some((rule) => rule.includes(':focus'))).toBe(true)
})

test('plain structured style values remain leaves', () => {
  const result = getSplitStyles(
    { shadowColor: 'red', shadowOffset: { width: 2, height: 4 } },
    View.staticConfig,
    undefined as any,
    'light',
    { unmounted: false } as any,
    { ...opts, noClass: true }
  )
  expect(result.style?.boxShadow).toContain('2px 4px')
})

test('flat conditional object enter clauses match strings on web', () => {
  const object = split({ opacity: { enter: 0 } })
  const string = split({ opacity: 'enter:0' })
  expect(object.classNames).toEqual(string.classNames)
  // rulesToInsert stores the raw payload too: `0` from the object, `"0"` from
  // the string slice — the produced CSS is what must agree
  const rules = rulesFor(object, object.classNames.opacity)
  expect(rules).toEqual(rulesFor(string, string.classNames.opacity))
  expect(rules.some((rule) => rule.includes('t_unmounted'))).toBe(true)
})

test('conditional web shadow parts need their composite property', () => {
  const object = split({ shadowColor: { default: 'red', hover: 'blue' } })
  const string = split({ shadowColor: 'red hover:blue' })
  expect(object.classNames).toEqual(string.classNames)
  expect(object.style?.shadowColor).toBe(undefined)
  expect(object.style?.boxShadow).toBe(undefined)
})

test('a clause-valued variant with an object definition composes the chains', () => {
  const Frame = styled(View, {
    variants: {
      tone: {
        danger: {
          bg: { default: 'orange', hover: 'yellow' },
        },
      },
    } as const,
  })
  const result = simplifiedGetSplitStyles(
    Frame,
    { tone: 'sm:danger' },
    { mergeDefaultProps: true }
  )
  const rules = rulesFor(result, result.classNames.backgroundColor)
  expect(
    rules.some(
      (rule) =>
        rule.startsWith('@media ') &&
        rule.includes('background-color:orange') &&
        !rule.includes(':hover')
    )
  ).toBe(true)
  expect(
    rules.some(
      (rule) =>
        rule.startsWith('@media ') &&
        rule.includes(':hover') &&
        rule.includes('background-color:yellow')
    )
  ).toBe(true)
})

test('a null first nested condition does not lend its condition to the next entry', () => {
  const Frame = styled(View, {
    variants: {
      tone: {
        danger: {
          bg: { hover: null, focus: 'yellow' },
        },
      },
    } as const,
  })
  const result = simplifiedGetSplitStyles(
    Frame,
    { tone: 'sm:danger' },
    { mergeDefaultProps: true }
  )
  const rules = rulesFor(result, result.classNames.backgroundColor)
  expect(rules).toHaveLength(1)
  expect(rules[0]).toContain(':where(:focus)')
  expect(rules[0]).not.toContain(':hover')
})

test('tokens resolve to variables and media clauses wrap', () => {
  const result = split({ p: '4 sm:6' })
  const className = result.classNames.padding
  const rules = rulesFor(result, className)
  expect(rules).toHaveLength(2)
  expect(rules[0]).toContain('padding:var(--')
  expect(rules[1]).toMatch(/^@media /)
})

test('bare tokens resolve in conditional flat values', () => {
  const colors = split({ backgroundColor: 'white hover:black' })
  const colorClass = colors.classNames.backgroundColor
  expect(rulesFor(colors, colorClass)).toEqual([
    `.${colorClass}{background-color:var(--c-white)}`,
    `@media (hover: hover) {.${colorClass}:where(:hover){background-color:var(--c-black)}}`,
  ])

  const padding = split({ padding: '4 hover:8' })
  const paddingClass = padding.classNames.padding
  expect(rulesFor(padding, paddingClass)).toEqual([
    `.${paddingClass}{padding:var(--t-space-4)}`,
    `@media (hover: hover) {.${paddingClass}:where(:hover){padding:var(--t-space-8)}}`,
  ])

  const background = split({ background: 'white hover:black' })
  const backgroundClass = background.classNames.backgroundColor
  expect(rulesFor(background, backgroundClass)).toEqual([
    `.${backgroundClass}{background-color:var(--c-white)}`,
    `@media (hover: hover) {.${backgroundClass}:where(:hover){background-color:var(--c-black)}}`,
  ])
})

test('variant props resolve each conditional flat-value branch', () => {
  const Frame = styled(View, {
    variants: {
      density: {
        compact: { height: 20, paddingHorizontal: 8 },
        roomy: { height: 40, paddingHorizontal: 16 },
      },
    } as const,
  })

  const compact = simplifiedGetSplitStyles(
    Frame,
    { density: 'compact sm:roomy' },
    {
      mergeDefaultProps: true,
      noClass: true,
    }
  )
  expect(compact.style?.height).toBe(20)
  expect(compact.style?.paddingInline).toBe(8)

  const roomy = simplifiedGetSplitStyles(
    Frame,
    { density: 'compact sm:roomy' },
    {
      mediaState: { sm: true },
      mergeDefaultProps: true,
      noClass: true,
    }
  )
  expect(roomy.style?.height).toBe(40)
  expect(roomy.style?.paddingInline).toBe(16)
})

test('nested variant clauses keep array payloads via the object form', () => {
  const Frame = styled(View, {
    variants: {
      motion: {
        still: { transform: [{ scale: 1 }] },
        pressed: { transform: [{ scale: 0.8 }] },
      },
      state: {
        interactive: { motion: { default: 'still', hover: 'pressed' } },
      },
    } as const,
  })

  const base = simplifiedGetSplitStyles(
    Frame,
    { state: 'interactive' },
    { mergeDefaultProps: true, noClass: true }
  )
  expect(JSON.stringify(base.style?.transform)).toContain('1')

  const hovered = simplifiedGetSplitStyles(
    Frame,
    { state: 'interactive' },
    { componentState: { hover: true }, mergeDefaultProps: true, noClass: true }
  )
  expect(JSON.stringify(hovered.style?.transform)).toContain('0.8')
})

test('a caller property program replaces the styled property program', () => {
  const ObjectFrame = styled(View, {
    backgroundColor: { default: 'red', hover: 'blue' },
  })
  const StringFrame = styled(View, {
    backgroundColor: 'red hover:blue',
  })

  for (const Frame of [ObjectFrame, StringFrame]) {
    const result = simplifiedGetSplitStyles(
      Frame,
      { backgroundColor: 'green' },
      { componentState: { hover: true }, mergeDefaultProps: true, noClass: true }
    )
    expect(result.style?.backgroundColor).toBe('green')
  }

  // a clause-only caller program has no base of its own, so it layers over
  // the styled base instead of replacing it
  const PlainFrame = styled(View, { backgroundColor: 'red' })
  for (const caller of ['hover:blue', { hover: 'blue' }] as const) {
    const resting = simplifiedGetSplitStyles(
      PlainFrame,
      { backgroundColor: caller },
      { mergeDefaultProps: true, noClass: true }
    )
    expect(resting.style?.backgroundColor).toBe('red')

    const hovered = simplifiedGetSplitStyles(
      PlainFrame,
      { backgroundColor: caller },
      { mergeDefaultProps: true, noClass: true, componentState: { hover: true } }
    )
    expect(hovered.style?.backgroundColor).toBe('blue')
  }
})

test('variant props accept the flat object spelling', () => {
  const Frame = styled(View, {
    variants: {
      density: {
        compact: { height: 20, paddingHorizontal: 8 },
        roomy: { height: 40, paddingHorizontal: 16 },
      },
      pad: (val: { x: number }) => ({ paddingHorizontal: val.x }),
    } as const,
  })

  const objectProp = { density: { default: 'compact', sm: 'roomy' } }

  const compact = simplifiedGetSplitStyles(Frame, objectProp, {
    mergeDefaultProps: true,
    noClass: true,
  })
  expect(compact.style?.height).toBe(20)
  expect(compact.style?.paddingInline).toBe(8)

  const roomy = simplifiedGetSplitStyles(Frame, objectProp, {
    mediaState: { sm: true },
    mergeDefaultProps: true,
    noClass: true,
  })
  expect(roomy.style?.height).toBe(40)
  expect(roomy.style?.paddingInline).toBe(16)

  // a functional variant's own object argument is not a conditional object
  const fn = simplifiedGetSplitStyles(
    Frame,
    { pad: { x: 12 } },
    { mergeDefaultProps: true, noClass: true }
  )
  expect(fn.style?.paddingInline).toBe(12)
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
      `@media (hover: hover) {.${className}:where(:hover){background-color:var(--c-black)}}`,
    ])
    expect(warnings).toEqual([])
  } finally {
    console.warn = original
    process.env.NODE_ENV = previousNodeEnv
  }
})

test('bare tokens reach conditional border-family splitting intact', () => {
  const result = split({ border: '4 solid white hover:8 dashed black' })
  const className = result.classNames.border
  expect(rulesFor(result, className)).toEqual([
    `.${className}{border:var(--t-space-4) solid var(--c-white)}`,
    `@media (hover: hover) {.${className}:where(:hover){border:var(--t-space-8) dashed var(--c-black)}}`,
  ])
})

test('a later plain value restates the base; the hover survives (decision 21)', () => {
  const result = split({ backgroundColor: 'red hover:blue', bg: 'green' })
  const className = result.classNames.backgroundColor
  expect(className).toMatch(/^_b-/)
  const rules = rulesFor(result, className)
  expect(rules[0]).toBe(`.${className}{background-color:green}`)
  expect(rules[1]).toBe(
    `@media (hover: hover) {.${className}:where(:hover){background-color:blue}}`
  )
})

test('a later program replaces the plain value wholesale', () => {
  const result = split({ bg: 'green', backgroundColor: 'red hover:blue' })
  expect(result.classNames.backgroundColor).toMatch(/^_b-/)
  expect(result.style?.backgroundColor).toBeUndefined()
})

test('clause-free strings are base-only programs resolving config-first', () => {
  // a plain CSS value becomes a base-only program block
  const result = split({ backgroundColor: 'red' })
  const className = result.classNames.backgroundColor
  expect(className).toMatch(/^_b-/)
  expect(rulesFor(result, className)).toEqual([`.${className}{background-color:red}`])

  // a configured bare numeric string resolves through the token category
  // (`p="4"` is the space token exactly like `p="4"` was)
  const tokens = split({ p: '4' })
  const tokenClass = tokens.classNames.padding
  expect(rulesFor(tokens, tokenClass)[0]).toContain('padding:var(--')
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

test('an overloaded-family mismatch warns without blocking theme resolution', () => {
  // `width="black"`: 'black' lives in the color category, width binds size,
  // and the active theme also defines black. development diagnoses the authored
  // mismatch while the ordinary category-miss theme fallback stays intact.
  const warnings: string[] = []
  const original = console.warn
  const previousNodeEnv = process.env.NODE_ENV
  process.env.NODE_ENV = 'development'
  console.warn = (message: string) => warnings.push(String(message))
  try {
    const result = split({ width: 'black' })
    const className = result.classNames.width
    expect(rulesFor(result, className)[0]).toBe(`.${className}{width:var(--black)}`)
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

test('aspectRatio colon values pass through; other parse failures warn in dev', () => {
  // RN accepts aspectRatio="16:9"; it is the one legitimate colon value
  const result = split({ aspectRatio: '16:9' })
  const className = result.classNames.aspectRatio
  expect(rulesFor(result, className)[0]).toContain('aspect-ratio:16:9')

  // v3 cutover: a clause-shaped typo is loud where the author can see it.
  //
  // It warns rather than throws since item 12. A style value is an ordinary
  // place to put a string the app did not write (an image URL, a colour from a
  // CMS), so a refusal is reachable from content, and an exception on content
  // takes the whole render down for one bad prop.
  //
  // The bad clause is dropped while the valid base survives, and the report
  // carries everything needed to find and fix it.
  const previousNodeEnv = process.env.NODE_ENV
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  process.env.NODE_ENV = 'development'
  try {
    const badRatio = split({ aspectRatio: '1 unknown:2' })
    const badRatioClass = badRatio.classNames.aspectRatio
    expect(rulesFor(badRatio, badRatioClass)).toEqual([
      `.${badRatioClass}{aspect-ratio:1}`,
    ])

    const typo = split({ backgroundColor: 'red hver:blue' })
    const typoClass = typo.classNames.backgroundColor
    expect(rulesFor(typo, typoClass)).toEqual([`.${typoClass}{background-color:red}`])

    // the property, the whole authored value, and WHICH modifier failed. The
    // throw it replaced said "unknown modifier" without naming one.
    const reported = warn.mock.calls.map(String).join('\n')
    expect(reported).toContain('aspectRatio="1 unknown:2"')
    expect(reported).toContain('unknown')
    expect(reported).toContain('backgroundColor')
    expect(reported).toContain('red hver:blue')
    expect(reported).toContain('hver')

    // repeating the same mistake stays at one line...
    warn.mockClear()
    split({ backgroundColor: 'red hver:blue' })
    expect(warn.mock.calls).toHaveLength(0)

    // ...but a DIFFERENT mistake in the same property still reports, which is
    // what keying the warning on the property alone used to swallow
    warn.mockClear()
    const second = split({ backgroundColor: 'red fcus:blue' })
    expect(second.classNames.backgroundColor).toMatch(/^_b-/)
    expect(warn.mock.calls.map(String).join('\n')).toContain('fcus')
  } finally {
    process.env.NODE_ENV = previousNodeEnv
    warn.mockRestore()
  }
})

test('a program displaces a uniform geometric shorthand per longhand', () => {
  const result = split({ padding: 10, paddingTop: '4 hover:8' })
  expect(result.classNames.paddingTop).toMatch(/^_p-/)
  expect(result.classNames.padding).toBeTruthy()
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

test('web platform clauses sort after conditional clauses', () => {
  const result = split({ backgroundColor: 'sm:hover:blue web:red' })
  const className = result.classNames.backgroundColor
  const rules = rulesFor(result, className)
  expect(rules).toHaveLength(2)
  expect(rules[0]).toContain(':where(:hover){background-color:blue}')
  expect(rules[1]).toContain('background-color:red')
  expect(rules[1].match(new RegExp(`\\.${className}`, 'g'))).toHaveLength(1)
})

test('the style prop replaces a direct property program', () => {
  const result = split({
    backgroundColor: 'red hover:blue',
    style: { backgroundColor: 'green' },
  })
  const className = result.classNames.backgroundColor
  expect(className).toMatch(/^_b-/)
  const rules = rulesFor(result, className)
  expect(rules).toEqual([`.${className}{background-color:green}`])
})

test('direct properties replace styled and variant property programs', () => {
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
  expect(backgroundRules).toEqual([`.${backgroundClass}{background-color:red}`])

  const paddingLeftClass = callSiteLast.classNames.paddingLeft
  const paddingLeftRules = rulesFor(callSiteLast, paddingLeftClass)
  expect(paddingLeftRules.some((rule) => rule.includes('padding:var(--t-space-2)'))).toBe(
    true
  )
  expect(
    paddingLeftRules.some((rule) => rule.includes('padding-left:var(--t-space-1)'))
  ).toBe(true)

  const variantLastCallSite = <Frame {...{ bg: 'red' }} tone="danger" />
  const variantLast = simplifiedGetSplitStyles(Frame, variantLastCallSite.props, {
    mergeDefaultProps: true,
  })
  const variantLastRules = rulesFor(variantLast, variantLast.classNames.backgroundColor)
  expect(variantLastRules).toEqual([
    `.${variantLast.classNames.backgroundColor}{background-color:red}`,
  ])
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
  expect(result.classNames.paddingTop).toMatch(/^_p-/)
  const rules = rulesFor(result, result.classNames.padding)
  expect(rules.some((rule) => rule.includes('padding:10px 20px'))).toBe(true)
  expect(rules.some((rule) => rule.includes('padding-top:var(--t-space-4)'))).toBe(true)
})

test('the style layer owns its expanded longhands', () => {
  const result = split({
    style: { padding: 10 },
    paddingLeft: 100,
    paddingTop: '4 hover:8',
  })
  const left = result.classNames.paddingLeft
  const rules = rulesFor(result, left)
  expect(rules.at(-1)).toContain('padding:10px')
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
  const identifier = result.classNames.containerType
  expect(rulesFor(result, identifier)[0]).toContain('container-type:inline-size')
  expect(String(result.viewProps.className)).toContain(identifier)
})

test('a named container prop emits the convenient container shorthand', () => {
  const result = split({ container: 'main' })
  const identifier = result.classNames.container
  expect(rulesFor(result, identifier)[0]).toContain('container:main / inline-size')
})

test('an explicit container type wins and is folded into the named shorthand', () => {
  const result = split({ container: 'main', containerType: 'size' })
  const identifier = result.classNames.container
  expect(rulesFor(result, identifier)[0]).toContain('container:main / size')
})

test('container longhands win by property while the shorthand fills the rest', () => {
  const result = split({
    container: 'main',
    containerName: 'shell',
    style: { containerType: 'size' },
  })
  const identifier = result.classNames.container
  expect(rulesFor(result, identifier)[0]).toContain('container:shell / size')
})

test.each([false, undefined])(
  'container=%s contributes no container style',
  (container) => {
    const result = split({ container })
    expect(result.classNames.container).toBeUndefined()
    expect(result.classNames.containerType).toBeUndefined()
    expect(Object.values(result.rulesToInsert)).toHaveLength(0)
  }
)

test('theme clause lowers to the is-or-within selector', () => {
  const result = split({ backgroundColor: 'red dark:blue' })
  const className = result.classNames.backgroundColor
  const rules = rulesFor(result, className)
  expect(rules[1]).toContain(':where(.t_dark, .t_dark *)')
})

test('a call-site property program replaces the styled property program', () => {
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
  expect(rules).toEqual([`.${className}{background-color:red}`])
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
  expect(marginRules.some((rule) => rule.includes('margin-top:var(--t-space-8)'))).toBe(
    true
  )
  expect(weightRules[0]).toContain('font-weight:400')
})

test('a caller variant beats a default variant nested output', () => {
  // the Headings shape: unstyled defaults to false and its branch nests
  // size='9'. An explicit caller size must win over that nested default
  // output (the site's colors demo captions rendered as size-9 headings
  // when it did not).
  const Framed = styled(View, {
    variants: {
      tone: {
        a: { backgroundColor: 'red' },
        b: { backgroundColor: 'blue' },
        c: { backgroundColor: 'green' },
      },
      boxed: {
        false: { tone: 'b' },
      },
    } as const,
    defaultVariants: {
      tone: 'a',
      boxed: false,
    },
  })

  // no caller value: the later default's nested tone wins within the base tier
  const defaulted = simplifiedGetSplitStyles(
    Framed,
    {},
    { mergeDefaultProps: true, noClass: true }
  )
  expect(defaulted.style?.backgroundColor).toBe('blue')

  // an explicit caller tone dispatches at the call-site tier and beats the
  // nested default output
  const called = simplifiedGetSplitStyles(
    Framed,
    { tone: 'c' },
    { mergeDefaultProps: true, noClass: true }
  )
  expect(called.style?.backgroundColor).toBe('green')
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

  expect(
    rulesFor(result, result.classNames.marginTop).some((rule) =>
      rule.includes('margin-top:var(--t-space-8)')
    )
  ).toBe(true)
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
  expect(rulesFor(result, result.classNames.padding)[0]).toContain(
    'padding:var(--t-space-4) var(--t-space-8)'
  )
})
