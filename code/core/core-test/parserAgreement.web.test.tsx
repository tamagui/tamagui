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
import { createModifierRegistry, parseValue } from '@tamagui/style-grammar'
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
  for (const modifier of modifiers) {
    if (modifier === 'sm' || modifier === 'md') mediaState[modifier] = true
    else if (modifier === 'focus-visible') componentState.focusVisible = true
    else componentState[modifier] = true
  }
  return { componentState, mediaState }
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
function hasEnterStyle(source: string, property = PROBE) {
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
  // D1. Was: the prop scanner abandoned the declaration at the first top-level
  // `;` while the variant scanner kept splitting clauses around it, so the
  // variant path styled `hover:red` from a value the grammar rejects. Both now
  // refuse the value the way `parseValue` reports it: as one failure over the
  // whole value, with no good half.
  test('a top-level ";" refuses the whole value for both scanners', () => {
    const source = 'none; hover:red'
    expect(parseValue(source, registry).ok).toBe(false)

    expect(propValue(source)).toBe(null)
    expect(propValue(source, ['hover'])).toBe(null)

    expect(variantValue(source)).toBe(null)
    expect(variantValue(source, ['hover'])).toBe(null)
  })

  // D2. `contributeStyleString` still returns early when the value holds no
  // top-level colon, so the clause scanner below it never runs, but the `;{}`
  // refusal that scanner would have applied lives in `emitValue`, the one point
  // every contributor reaches. valueParser.ts states why: a payload is emitted
  // verbatim by contract, so refusing those characters is what makes rule and
  // selector injection structurally impossible. It is. Every emit path is
  // pinned in styleInjection.web.test.tsx.
  test('a value with no top-level colon is refused like every other value', () => {
    const source = 'none;}.injected{opacity 0'
    expect(parseValue(source, registry).ok).toBe(false)

    expect(propValue(source)).toBe(null)
    expect(propRules(source)).toEqual([])
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

  // D4, the user-visible one. Was: `hasFlatModifier` had no invalid-character
  // branch, so a value the style scanner threw away still put the component on
  // the should-enter path and it rendered an enter frame for a style that never
  // arrived, reported as an animation bug and caused by a value parser.
  test('the lifecycle scanner does not fire on a value the style scanner drops', () => {
    const source = '0; enter:1'
    expect(parseValue(source, registry).ok).toBe(false)
    expect(propValue(source, [], 'opacity')).toBe(null)

    expect(hasEnterStyle(source, 'opacity')).toBe(false)
  })

  // D5. Was: both runtime scanners refused an unregistered modifier but lost
  // different amounts of the value, because one resolved the next chain before
  // flushing the previous payload and the other flushed first.
  test('an unregistered modifier refuses the whole value for both scanners', () => {
    const source = 'none hver:red'
    expect(parseValue(source, registry).ok).toBe(false)

    expect(propValue(source)).toBe(null)
    expect(variantValue(source)).toBe(null)
  })

  // A clause with no payload is `empty-payload` to the canonical parser. Both
  // runtime scanners used to skip the empty segment and keep the rest.
  test('a clause with no payload refuses the whole value for both scanners', () => {
    const source = 'none hover:'
    expect(parseValue(source, registry).ok).toBe(false)

    expect(propValue(source)).toBe(null)
    expect(variantValue(source)).toBe(null)
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
  // all, where one letter off refuses the whole thing
  test.each(['starting', 'ending'])(
    '"%s:" resolves where a typo of it does not',
    (alias) => {
      expect(parseValue(`none ${alias}:red`, registry).ok).toBe(true)
      expect(parseValue(`none ${alias}g:red`, registry).ok).toBe(false)

      expect(propValue(`none ${alias}:red`)).not.toBe(null)
      expect(propValue(`none ${alias}g:red`)).toBe(null)
      expect(variantValue(`none ${alias}:red`)).not.toBe(null)
      expect(variantValue(`none ${alias}g:red`)).toBe(null)
    }
  )

  test('an aliased lifecycle modifier puts the component on the enter path', () => {
    expect(hasEnterStyle('1 starting:0', 'opacity')).toBe(true)
  })
})

describe('divergences', () => {
  // D6. The canonical parser reads a top-level backslash as an escape, so
  // `safe\;tail` is one payload with an escaped semicolon in it and the value
  // parses. `carriesTopLevelInjection` has no escape branch and refuses it.
  //
  // The guard is deliberately the stricter of the two and stays that way. CSS
  // only honours `\;` as an escape inside an ident or a string, a backslash
  // before a newline is not a valid escape at all, and the guard is the last
  // thing standing between an authored value and text interpolated straight
  // into a rule. Refusing a rare valid value costs an author one edit; teaching
  // the guard to trust an escape costs a bypass. So this stays a divergence,
  // and the corpus generates delimiter-free escapes for that reason.
  test('the injection guard refuses an escaped ";" the canonical parser accepts', () => {
    const source = 'safe\\;tail'
    const parsed = parseValue(source, registry)
    expect(parsed.ok).toBe(true)
    expect(parsed.ok && parsed.value.base).toBe('safe\\;tail')

    expect(propValue(source)).toBe(null)
    expect(propRules(source)).toEqual([])
  })

  // D7. `hasFlatModifier` runs the shared lexer but not the shared modifier
  // resolver: it answers before any style state exists, so it has no
  // `getCondition` to ask and pulling the canonical registry into @tamagui/web
  // would put the completion trie and its tables in every app bundle for one
  // boolean. So an unregistered modifier ANYWHERE in a value still leaves an
  // `enter:` clause elsewhere in it visible to the lifecycle scanner, and the
  // component enters for a style the refusal means never arrives.
  //
  // Same shape as D4, much narrower: it takes a typo'd modifier next to a real
  // enter clause, where D4 took any rule-breaking character.
  test('the lifecycle scanner fires on a value an unregistered modifier refuses', () => {
    const source = '0 hver:1 enter:2'
    expect(parseValue(source, registry).ok).toBe(false)
    expect(propValue(source, [], 'opacity')).toBe(null)

    expect(hasEnterStyle(source, 'opacity')).toBe(true)
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
