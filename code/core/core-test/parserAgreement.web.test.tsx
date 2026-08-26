// Parser agreement.
//
// `@tamagui/style-grammar`'s `parseValue` owns what a flat value means, and
// since item 12 the three runtime scanners no longer re-implement the split:
//
//   - `directStyle.ts`'s `contributeStyleString`, for ordinary style props
//   - `propMapper.ts`'s `resolveVariants`, for a clause-bearing variant value
//   - `useComponentState.ts`'s `hasFlatModifier`, for the lifecycle decision
//
// all three drive `scanFlatValue`, the one lexer `parseValue` itself is built
// on. They still differ in what they DO with a segment, which is what this
// suite checks: it runs all four over the generated corpus the grammar's own
// fuzz test uses and compares what each one actually consumed. Nothing here
// reads source text: the prop and variant scanners are observed through the
// style object they produce with one clause's condition active at a time, and
// the lifecycle scanner through the `hasEnterStyle` the hook returns.
//
// The `agreement` block pins the cases that used to diverge, so a scanner that
// forks again fails here rather than in an app. The `divergences` block pins
// what still differs, with the reason each one is not a scanner fork.
import { renderHook } from '@testing-library/react'
import { createModifierRegistry, parseValue } from '@tamagui/style-grammar/tooling'
import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'
import {
  createTamagui,
  createVariantResolver,
  getConfig,
  StyleObjectRules,
  styled,
  View,
} from '../web/src'
import { useComponentState } from '../web/src/hooks/useComponentState'
import { constructCase, mulberry32 } from '../style-grammar/src/__tests__/valueCorpus'
import { simplifiedGetSplitStyles } from './utils'

// backgroundImage is the probe property on purpose: on web it carries a raw CSS
// component-value sequence with no shorthand expansion, no token category and
// no family lowering, so what lands in the style object is the payload the
// scanner cut out and nothing else.
const PROBE = 'backgroundImage'

// every modifier here is activatable from the state this test can construct,
// and no two of them overlap, so activating one clause's condition can never
// activate another clause's and hand the winner to clause precedence
const ACTIVATABLE = ['hover', 'press', 'focus', 'disabled', 'sm', 'md'] as const

let registry: ReturnType<typeof createModifierRegistry>['registry']

const ProbeVariant = styled(View, {
  variants: {
    kind: {
      string: createVariantResolver('string', (value: string) => ({
        [PROBE]: value,
      })),
    },
  } as const,
})

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig())
  const conf = getConfig()
  registry = createModifierRegistry({
    mediaNames: Object.keys(conf.media ?? {}),
    themeNames: Object.keys(conf.themes ?? {}),
  }).registry
})

function activation(modifiers: readonly string[]) {
  const componentState: Record<string, any> = {}
  const mediaState: Record<string, boolean> = {}
  const groupContext: Record<string, any> = {}
  for (const modifier of modifiers) {
    if (modifier === 'sm' || modifier === 'md') mediaState[modifier] = true
    else if (modifier.startsWith('group-')) {
      const slash = modifier.indexOf('/')
      const state = modifier.slice('group-'.length, slash === -1 ? undefined : slash)
      groupContext[slash === -1 ? 'true' : modifier.slice(slash + 1)] = {
        subscribe: () => () => {},
        state: {
          pseudo: {
            [state === 'active' ? 'press' : state]: true,
          },
        },
      }
    } else if (modifier === 'focus-visible') componentState.focusVisible = true
    else componentState[modifier] = true
  }
  return { componentState, groupContext, mediaState }
}

/** what `directStyle`'s scanner handed to the style object */
function propValue(source: string, modifiers: readonly string[] = [], property = PROBE) {
  return (
    simplifiedGetSplitStyles(
      View,
      { [property]: source },
      { noClass: true, ...activation(modifiers) }
    ).style?.[property] ?? null
  )
}

/** what `propMapper`'s variant scanner handed to the style object */
function variantValue(source: string, modifiers: readonly string[] = []) {
  return (
    simplifiedGetSplitStyles(
      ProbeVariant,
      { kind: source },
      { noClass: true, ...activation(modifiers) }
    ).style?.[PROBE] ?? null
  )
}

/** what `useComponentState`'s scanner decided about lifecycle clauses */
function hasEnterStyle(source: unknown, property = PROBE) {
  const { result } = renderHook(() =>
    useComponentState(
      { [property]: source },
      undefined as any,
      (View as any).staticConfig,
      getConfig()
    )
  )
  return (result.current as any).hasEnterStyle as boolean
}

/** every CSS rule the class path emitted for the probe property */
function propRules(source: string) {
  const split = simplifiedGetSplitStyles(View, { [PROBE]: source })
  const rules: string[] = []
  for (const key in split.rulesToInsert) {
    for (const rule of (split.rulesToInsert as any)[key][StyleObjectRules] ?? []) {
      rules.push(rule)
    }
  }
  return rules
}

// The style object is not a string bag: a lone numeric payload is coerced to a
// number on its way in, on every render that is not the web class path. That is
// emission, not parsing, so both sides of a payload comparison go through it.
const numericWithUnit = /^-?(?:\d+\.?\d*|\.\d+)(?:px|dp)$/i
function asEmitted(payload: string): string | number {
  if (numericWithUnit.test(payload)) return Number.parseFloat(payload)
  if (payload !== '' && Number.isFinite(Number(payload))) return Number(payload)
  return payload
}

function agreementCorpus(seed: number, count: number) {
  const random = mulberry32(seed)
  const cases: ReturnType<typeof constructCase>[] = []
  while (cases.length < count) {
    const next = constructCase(random, 'valid', {
      modifiers: ACTIVATABLE,
      distinctSingleModifiers: true,
      escapes: 'delimiter-free',
    })
    // a value with neither a base nor a clause is an empty string; there is
    // nothing for two implementations to disagree about
    if (next.base === null && next.clauses.length === 0) continue
    cases.push(next)
  }
  return cases
}

describe('agreement', () => {
  test('good clauses before and after a bad clause survive in both paths', () => {
    const source = 'base hover:before hver:bad press:after'
    expect(parseValue(source, registry)).toMatchObject({
      ok: false,
      value: {
        base: 'base',
        clauses: [
          { modifiers: ['hover'], payload: 'before' },
          { modifiers: ['press'], payload: 'after' },
        ],
      },
    })

    for (const read of [propValue, variantValue]) {
      expect(read(source)).toBe('base')
      expect(read(source, ['hover'])).toBe('before')
      expect(read(source, ['press'])).toBe('after')
    }
  })

  test('a bad base and bad clause payload do not hide a later clause', () => {
    const source = 'bad; hover:also;bad press:after'
    expect(parseValue(source, registry)).toMatchObject({
      ok: false,
      value: {
        base: null,
        clauses: [{ modifiers: ['press'], payload: 'after' }],
      },
    })

    for (const read of [propValue, variantValue]) {
      expect(read(source)).toBe(null)
      expect(read(source, ['hover'])).toBe(null)
      expect(read(source, ['press'])).toBe('after')
    }
  })

  // D6. Was: the canonical parser reads a top-level backslash as an escape, so
  // `safe\;tail` is one payload with an escaped semicolon in it and the value
  // parses, while the injection guard had no escape branch and refused it. The
  // guard is gone, so both sides read the escape the same way.
  test('a top-level escaped ";" is payload content for parser and prop path alike', () => {
    const source = 'safe\\;tail'
    const parsed = parseValue(source, registry)
    expect(parsed.ok).toBe(true)
    expect(parsed.ok && parsed.value.base).toBe('safe\\;tail')

    expect(propValue(source)).toBe('safe\\;tail')
  })

  // D3. Was: a top-level backslash escaped the next character only in the
  // canonical parser, so both runtime scanners read `custom\:part`'s escaped
  // colon as the clause separator, produced `hover:custom\` as a modifier
  // chain, and failed to resolve it. The shared lexer has the escape branch, so
  // the escaped colon is payload content everywhere.
  test('a top-level backslash escapes the next character for every scanner', () => {
    const source = 'none hover:custom\\:part'
    const parsed = parseValue(source, registry)
    expect(parsed.ok).toBe(true)
    expect(parsed.ok && parsed.value.clauses).toEqual([
      { modifiers: ['hover'], payload: 'custom\\:part' },
    ])

    expect(propValue(source)).toBe('none')
    expect(propValue(source, ['hover'])).toBe('custom\\:part')

    expect(variantValue(source)).toBe('none')
    expect(variantValue(source, ['hover'])).toBe('custom\\:part')
  })

  test('a bad base does not hide a later enter clause', () => {
    const source = '0; enter:1'
    expect(parseValue(source, registry).ok).toBe(false)
    // with no valid base, the lifecycle-only clause synthesizes opacity's
    // resting target for inline animation drivers
    expect(propValue(source, [], 'opacity')).toBe(1)

    expect(hasEnterStyle(source, 'opacity')).toBe(true)
  })

  test('flat conditional object keys drive the lifecycle decision like strings', () => {
    expect(hasEnterStyle({ enter: 0 }, 'opacity')).toBe(true)
    expect(hasEnterStyle({ starting: 0 }, 'opacity')).toBe(true)
    expect(hasEnterStyle({ default: 1, 'sm:enter': 0 }, 'opacity')).toBe(true)
    expect(hasEnterStyle({ default: 1, hover: 0 }, 'opacity')).toBe(false)
    // a structured leaf has no modifier-named key
    expect(hasEnterStyle({ width: 2, height: 4 }, 'shadowOffset')).toBe(false)
    // an object transition is the driver's per-lifecycle timing config, not an
    // enter style — flipping the lifecycle on it remounted shared tooltips
    expect(
      hasEnterStyle({ default: 'quickest', enter: 'quickest', exit: '0ms' }, 'transition')
    ).toBe(false)
  })

  test('an unregistered modifier drops only its clause for both scanners', () => {
    const source = 'none hver:red'
    expect(parseValue(source, registry).ok).toBe(false)

    expect(propValue(source)).toBe('none')
    expect(variantValue(source)).toBe('none')
  })

  test('an empty payload drops only its clause for both scanners', () => {
    const source = 'none hover: press:after'
    expect(parseValue(source, registry).ok).toBe(false)

    expect(propValue(source)).toBe('none')
    expect(variantValue(source)).toBe('none')
    expect(propValue(source, ['press'])).toBe('after')
    expect(variantValue(source, ['press'])).toBe('after')
  })

  // `pressed`, `starting` and `ending` were spelled out inline in the runtime's
  // condition resolver and absent from the grammar's alias table, so the
  // canonical parser called them unregistered while the runtime styled them.
  // The alias table owns all four spellings now.
  test.each([
    ['active', 'press'],
    ['pressed', 'press'],
  ])(
    '"%s:" is an alias of "%s:" for the parser and the runtime alike',
    (alias, canonical) => {
      const source = `none ${alias}:red`
      expect(parseValue(source, registry).ok).toBe(true)

      expect(propValue(source)).toBe('none')
      expect(propValue(source, [canonical])).toBe('red')
      expect(variantValue(source, [canonical])).toBe('red')
    }
  )

  // the lifecycle aliases cannot be activated from the state this file can
  // construct, so they are checked the other way round: the value resolves at
  // all, where one letter off drops only its clause
  test.each(['starting', 'ending'])(
    '"%s:" resolves where a typo of it does not',
    (alias) => {
      expect(parseValue(`none ${alias}:red`, registry).ok).toBe(true)
      expect(parseValue(`none ${alias}g:red`, registry).ok).toBe(false)

      expect(propValue(`none ${alias}:red`)).not.toBe(null)
      expect(propValue(`none ${alias}g:red`)).toBe('none')
      expect(variantValue(`none ${alias}:red`)).not.toBe(null)
      expect(variantValue(`none ${alias}g:red`)).toBe('none')
    }
  )

  test('an aliased lifecycle modifier puts the component on the enter path', () => {
    expect(hasEnterStyle('1 starting:0', 'opacity')).toBe(true)
  })

  test.each(['group-enter', 'group-exit/card', 'group-starting/card', 'group-ending'])(
    'group lifecycle modifier "%s:" is refused by the parser and prop path',
    (modifier) => {
      const source = `none ${modifier}:red`
      expect(parseValue(source, registry).ok).toBe(false)
      expect(propValue(source)).toBe('none')
    }
  )

  test('group names outside the shared identifier grammar refuse without subscribing', () => {
    for (const modifier of ['group-hover/a.b', 'group-hover/a/b', 'group-hover/café']) {
      const source = `none ${modifier}:red`
      expect(parseValue(source, registry).ok, modifier).toBe(false)

      const result = simplifiedGetSplitStyles(
        View,
        { [PROBE]: source },
        { noClass: true }
      )
      expect(result.style?.[PROBE] ?? null, modifier).toBe('none')
      expect(result.pseudoGroups?.size ?? 0, modifier).toBe(0)
    }
  })

  test('unconfigured Object.prototype spellings refuse without throwing', () => {
    for (const modifier of [
      'constructor',
      '__defineGetter__',
      '__defineSetter__',
      'hasOwnProperty',
      '__lookupGetter__',
      '__lookupSetter__',
      'isPrototypeOf',
      'propertyIsEnumerable',
      'toString',
      'valueOf',
      '__proto__',
      'toLocaleString',
    ]) {
      const source = `none ${modifier}:red`
      expect(parseValue(source, registry).ok, modifier).toBe(false)
      expect(() => propValue(source), modifier).not.toThrow()
      expect(propValue(source), modifier).toBe('none')
    }
  })

  test.each([
    ['none active:active:red', ['press']],
    ['none sm:hover:hover:red', ['hover', 'sm']],
    ['none hover:sm:red', ['hover', 'sm']],
    ['none group-active/card:group-active/card:red', ['group-press/card']],
  ])(
    'aliases, duplicates, reordered sets, and group spellings agree for %s',
    (source, active) => {
      const parsed = parseValue(source, registry)
      expect(parsed.ok).toBe(true)
      expect(propValue(source, active)).toBe('red')
      expect(variantValue(source, active)).toBe('red')
    }
  )

  test('duplicate chains stay unbounded while distinct non-platform conditions stay capped', () => {
    const duplicateChain = `${Array(40).fill('hover').join(':')}:red`
    expect(propValue(duplicateChain, ['hover'])).toBe('red')
    expect(variantValue(duplicateChain, ['hover'])).toBe('red')

    const tooDeep = 'hover:focus:disabled:sm:md:dark:red'
    expect(() => propValue(tooDeep, ['hover', 'focus', 'disabled', 'sm', 'md'])).toThrow(
      'at most 5 non-platform conditions'
    )
    expect(() =>
      variantValue(tooDeep, ['hover', 'focus', 'disabled', 'sm', 'md'])
    ).toThrow('at most 5 non-platform conditions')
  })
})

describe('comments', () => {
  // The lexer used to have no comment state, so a `:` inside a comment read as
  // a clause separator. `red /* hover:x */ blue` split into base `red /*` and a
  // `hover` clause with payload `x */ blue`, and BOTH halves emitted. The base
  // rule then ended in an unterminated `/*`, which in the joined SSR blob
  // swallows every rule after it until some later `*/` turns them back on.
  test('a colon inside a comment is not a clause boundary', () => {
    const source = 'red /* hover:x */ blue'
    const parsed = parseValue(source, registry)
    expect(parsed.ok).toBe(true)
    expect(parsed.ok && parsed.value.base).toBe(source)
    expect(parsed.ok && parsed.value.clauses).toEqual([])

    expect(propValue(source)).toBe(source)
    // the hover clause was fiction, so nothing is conditional on hover
    expect(propValue(source, ['hover'])).toBe(source)

    const rules = propRules(source)
    expect(rules).toHaveLength(1)
    expect(rules[0]).toContain(source)
  })

  // No rule may leave a comment open, whatever the value did, because
  // `getAllRules()` joins them into one blob for SSR.
  //
  // Counting delimiters in the rule text only answers this for values where a
  // `/*` really is a comment opener, so `url(a/*b.png)` is deliberately absent:
  // its `/*` is URL content and is covered by its own test below.
  test('no emitted rule leaves a comment open', () => {
    for (const source of [
      'red /* hover:x */ blue',
      'red /* ; } { */ blue',
      'red hover:blue /* a:b */',
      'calc(1px /* pad */ + 2px)',
    ]) {
      for (const rule of propRules(source)) {
        const opens = rule.split('/*').length - 1
        const closes = rule.split('*/').length - 1
        expect({ rule, opens, closes }).toEqual({ rule, opens, closes: opens })
      }
    }
  })

  // `;`, `{` and `}` are ordinary text inside a comment, so refusing them there
  // was the mirror-image bug: a legitimate authored value produced nothing.
  test('a rule-breaking character inside a comment is ordinary content', () => {
    const source = 'red /* ; } { */ blue'
    expect(parseValue(source, registry).ok).toBe(true)
    expect(propValue(source)).toBe(source)
  })

  // A comment sitting in a payload belongs to that payload, and the clause
  // around it still resolves.
  test('a comment inside a payload stays in the payload', () => {
    const source = 'red hover:blue /* a:b */'
    const parsed = parseValue(source, registry)
    expect(parsed.ok).toBe(true)
    expect(parsed.ok && parsed.value.clauses).toEqual([
      { modifiers: ['hover'], payload: 'blue /* a:b */' },
    ])

    expect(propValue(source)).toBe('red')
    expect(propValue(source, ['hover'])).toBe('blue /* a:b */')
  })

  // A comment is lexical, so it opens inside parens too: `calc()` may hold one.
  test('a comment opens at any paren depth', () => {
    const source = 'calc(1px /* pad */ + 2px)'
    expect(parseValue(source, registry).ok).toBe(true)
    expect(propValue(source)).toBe(source)
  })

  // `url()` is the one function CSS does not tokenize the contents of, so a
  // `/*` or a quote inside an unquoted url is part of the URL. Chromium parses
  // `url(a/*b.png)` as that URL and the rule after it survives, so treating it
  // as a comment would be the fix broken the other way.
  test('a comment opener inside an unquoted url is part of the url', () => {
    for (const source of ['url(a/*b.png)', 'url(a"b.png)']) {
      expect(parseValue(source, registry).ok).toBe(true)
      expect(propValue(source)).toBe(source)
    }
  })

  // A string outranks a comment opener, and a comment outranks a quote.
  test('strings and comments nest by CSS precedence, not by appearance', () => {
    for (const source of ['"/*" red', '/* " */ red']) {
      expect(parseValue(source, registry).ok).toBe(true)
      expect(propValue(source)).toBe(source)
    }
  })

  test('an unterminated tail drops only the segment the lexer consumed', () => {
    for (const source of [
      'base hover:before press:"bad',
      'base hover:before press:calc(1px',
      'base hover:before press:bad/* sm:lost',
    ]) {
      expect(parseValue(source, registry)).toMatchObject({
        ok: false,
        value: {
          base: 'base',
          clauses: [{ modifiers: ['hover'], payload: 'before' }],
        },
      })
      expect(propValue(source)).toBe('base')
      expect(propValue(source, ['hover'])).toBe('before')
      expect(variantValue(source)).toBe('base')
      expect(variantValue(source, ['hover'])).toBe('before')
    }
  })

  test('a newline makes an unterminated string recoverable at the next clause', () => {
    const source = 'base hover:"bad\n press:after'
    expect(parseValue(source, registry)).toMatchObject({
      ok: false,
      value: {
        base: 'base',
        clauses: [{ modifiers: ['press'], payload: 'after' }],
      },
    })
    expect(propValue(source, ['press'])).toBe('after')
    expect(variantValue(source, ['press'])).toBe('after')
  })

  test('unterminated base constructs do not invent a later clause boundary', () => {
    for (const source of ['"bad hover:lost', 'calc(1px hover:lost', 'bad/* hover:lost']) {
      expect(parseValue(source, registry)).toMatchObject({
        ok: false,
        value: { base: null, clauses: [] },
      })
      expect(propValue(source)).toBe(null)
      expect(variantValue(source)).toBe(null)
    }
  })

  test('a stray comment close drops its segment and later clauses recover', () => {
    const source = 'base hover:bad*/ press:after'
    expect(parseValue(source, registry)).toMatchObject({
      ok: false,
      value: {
        base: 'base',
        clauses: [{ modifiers: ['press'], payload: 'after' }],
      },
    })
    expect(propValue(source, ['press'])).toBe('after')
    expect(variantValue(source, ['press'])).toBe('after')
  })
})

describe('divergences', () => {
  // D2. `contributeStyleString` returns early when the value holds no top-level
  // colon, so the clause scanner below it never runs. The `;{}` refusal that
  // scanner would have applied used to live in `emitValue`, the one point every
  // contributor reaches; that guard was removed by owner decision, on the
  // grounds that a style value is authored rather than user input. So a
  // colonless value the canonical parser refuses now reaches CSS verbatim, and
  // a payload carrying `;}` closes its own rule and opens another.
  //
  // This is the cost of dropping the guard, pinned so it stays a decision
  // rather than a surprise: do not put a user-controlled string in a style
  // value.
  test('a colonless value the canonical parser refuses still emits verbatim', () => {
    const source = 'none;}.injected{opacity 0'
    expect(parseValue(source, registry).ok).toBe(false)

    expect(propValue(source)).toBe(source)
    expect(propRules(source).length).toBeGreaterThan(0)
  })

  // D7 remains until the main pass owns resolved lifecycle flags. This scanner
  // has no config-aware modifier resolver, so a separate bad clause does not
  // hide a valid enter clause beside it.
  test('a good enter clause beside a bad clause still sets hasEnterStyle', () => {
    const source = '0 hver:1 enter:2'
    expect(parseValue(source, registry).ok).toBe(false)
    expect(propValue(source, [], 'opacity')).toBe(2)

    expect(hasEnterStyle(source, 'opacity')).toBe(true)
  })

  test('an empty or malformed enter payload does not set hasEnterStyle', () => {
    expect(hasEnterStyle('0 enter:', 'opacity')).toBe(false)
    expect(hasEnterStyle('0 enter:1;', 'opacity')).toBe(false)
  })
})

test('the prop scanner consumes exactly the canonical split', () => {
  let clauseChecks = 0
  for (const [index, testCase] of agreementCorpus(0xa9ee01, 400).entries()) {
    const label = `case ${index}: ${JSON.stringify(testCase.source)}`
    const parsed = parseValue(testCase.source, registry)
    expect(parsed.ok, label).toBe(true)
    if (!parsed.ok) continue

    expect(propValue(testCase.source), label).toBe(
      testCase.base === null ? null : asEmitted(testCase.base)
    )
    for (const clause of parsed.value.clauses) {
      expect(
        propValue(testCase.source, clause.modifiers),
        `${label} @${clause.modifiers}`
      ).toBe(asEmitted(clause.payload))
      clauseChecks++
    }
  }
  expect(clauseChecks).toBeGreaterThan(300)
})

test('the variant scanner consumes exactly the canonical split', () => {
  let clauseChecks = 0
  for (const [index, testCase] of agreementCorpus(0xb17e02, 400).entries()) {
    const label = `case ${index}: ${JSON.stringify(testCase.source)}`
    const parsed = parseValue(testCase.source, registry)
    expect(parsed.ok, label).toBe(true)
    if (!parsed.ok) continue

    expect(variantValue(testCase.source), label).toBe(
      testCase.base === null ? null : asEmitted(testCase.base)
    )
    for (const clause of parsed.value.clauses) {
      expect(
        variantValue(testCase.source, clause.modifiers),
        `${label} @${clause.modifiers}`
      ).toBe(asEmitted(clause.payload))
      clauseChecks++
    }
  }
  expect(clauseChecks).toBeGreaterThan(300)
})

test('the lifecycle scanner fires on exactly the values with an enter clause', () => {
  const random = mulberry32(0xc0de03)
  let entering = 0
  for (let index = 0; index < 200; index++) {
    const testCase = constructCase(random, 'valid', {
      modifiers: ['enter', 'hover', 'sm'],
      distinctSingleModifiers: true,
      escapes: 'delimiter-free',
    })
    const label = `case ${index}: ${JSON.stringify(testCase.source)}`
    const parsed = parseValue(testCase.source, registry)
    expect(parsed.ok, label).toBe(true)
    if (!parsed.ok) continue
    const expected = parsed.value.clauses.some((clause) =>
      clause.modifiers.includes('enter')
    )
    expect(hasEnterStyle(testCase.source), label).toBe(expected)
    if (expected) entering++
  }
  expect(entering).toBeGreaterThan(50)
})
