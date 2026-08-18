// Parser agreement.
//
// `@tamagui/style-grammar`'s `parseValue` owns what a flat value means, but it
// is not the implementation the runtime runs. Three more scanners re-implement
// the same left-to-right pass:
//
//   - `directStyle.ts`'s `contributeStyleString`, for ordinary style props
//   - `propMapper.ts`'s `resolveVariants`, for a clause-bearing variant value
//   - `useComponentState.ts`'s `hasFlatModifier`, for the lifecycle decision
//
// A second implementation of a grammar is an oracle for the first, so this runs
// all four over the generated corpus the grammar's own fuzz test uses and
// compares what each one actually consumed. Nothing here reads source text: the
// prop and variant scanners are observed through the style object they produce
// with one clause's condition active at a time, and the lifecycle scanner
// through the `hasEnterStyle` the hook returns.
//
// The `divergences` block below is the point of the suite. Each case is a value
// the four implementations do NOT agree on today; it pins the current behavior
// so a change to any one scanner is visible, and each one says whether it is a
// stale expectation or a defect.
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
      escapes: false,
    })
    // a value with neither a base nor a clause is an empty string; there is
    // nothing for two implementations to disagree about
    if (next.base === null && next.clauses.length === 0) continue
    cases.push(next)
  }
  return cases
}

describe('divergences', () => {
  // D1. `directStyle` abandons the whole declaration at the first top-level
  // `;`, `{` or `}` (directStyle.ts:1572), while `propMapper` has no such rule
  // and keeps splitting clauses around it, semicolon and all. The canonical
  // parser reports an invalid character. Three implementations, three answers,
  // and the value a variant produces is not the value the same string produces
  // as a prop.
  test('a top-level ";" ends the value for the prop scanner and not the variant scanner', () => {
    const source = 'none; hover:red'
    expect(parseValue(source, registry).ok).toBe(false)

    expect(propValue(source)).toBe(null)
    expect(propValue(source, ['hover'])).toBe(null)

    expect(variantValue(source)).toBe('none;')
    expect(variantValue(source, ['hover'])).toBe('red')
  })

  // D2. DEFECT. `contributeStyleString` returns early when the value holds no
  // top-level colon at all (directStyle.ts:1510), so the scanner that refuses
  // `;{}` never runs and the payload reaches CSS verbatim. valueParser.ts:14-19
  // states the reason those characters are refused: a payload is emitted
  // verbatim by contract, so refusing them is what makes rule and selector
  // injection structurally impossible. On this path it is not.
  test('a value with no top-level colon skips the character check entirely', () => {
    const source = 'none;}.injected{opacity 0'
    expect(parseValue(source, registry).ok).toBe(false)

    expect(propValue(source)).toBe(source)

    // one authored declaration, two emitted rule blocks
    const rules = propRules(source)
    expect(rules).toHaveLength(1)
    expect(rules[0].split('{')).toHaveLength(3)
  })

  // D3. DEFECT. The canonical parser treats a top-level backslash as an escape
  // (valueParser.ts:230), so `custom\:part` is payload content and the value is
  // valid. Neither runtime scanner has that branch: both read the escaped colon
  // as the clause separator, get `hover:custom\` as a modifier chain, and fail
  // to resolve it. `directStyle` then drops the entire declaration, including
  // the base it had already scanned, while `propMapper` drops only the clause.
  // In a development build `directStyle` throws instead (directStyle.ts:1608).
  test('a top-level backslash escapes the next character only in the canonical parser', () => {
    const source = 'none hover:custom\\:part'
    const parsed = parseValue(source, registry)
    expect(parsed.ok).toBe(true)
    expect(parsed.ok && parsed.value.clauses).toEqual([
      { modifiers: ['hover'], payload: 'custom\\:part' },
    ])

    expect(propValue(source)).toBe(null)
    expect(propValue(source, ['hover'])).toBe(null)

    expect(variantValue(source)).toBe('none')
    expect(variantValue(source, ['hover'])).toBe('none')
  })

  // D4. `hasFlatModifier` has no invalid-character branch either, so a value
  // the style scanner throws away can still put the component on the
  // should-enter path: it renders an enter frame for a style that never
  // arrives.
  test('the lifecycle scanner fires on a value the style scanner drops', () => {
    const source = '0; enter:1'
    expect(parseValue(source, registry).ok).toBe(false)
    expect(propValue(source, [], 'opacity')).toBe(null)

    expect(hasEnterStyle(source, 'opacity')).toBe(true)
  })

  // D5. Both runtime scanners refuse an unregistered modifier, but they refuse
  // different amounts of the value: the prop path loses the base it had already
  // scanned, the variant path keeps it.
  test('an unregistered modifier costs the prop scanner its base and the variant scanner nothing', () => {
    const source = 'none hver:red'
    expect(parseValue(source, registry).ok).toBe(false)

    expect(propValue(source)).toBe(null)
    expect(variantValue(source)).toBe('none')
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
      escapes: false,
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
