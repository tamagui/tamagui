// The atomic engine treats a class identifier as the identity of its CSS:
// insertStyleRules inserts the first rule set it sees for an identifier and
// ignores every later one, and getCSSStylesAtomic reuses the rules it already
// built for an identifier instead of rebuilding them. Both are wrong the moment
// two different rule sets can share an identifier, and the failure is silent —
// a component gets another clause's CSS.
//
// These tests fail if that ever becomes possible. They check both directions:
// distinct clauses over the same declaration must produce distinct identifiers,
// and each identifier's rules must carry its own clause's selector.

import { beforeAll, expect, test } from 'vitest'

import config from '../config-default'
import { View, createTamagui, getSplitStyles, styled } from '../web/src'
import { exposeClassProperties } from './utils'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig() as any)
})

const opts = { isAnimated: false, noClass: false, resolveValues: 'auto' } as any

const split = (props: Record<string, any>, componentState: Record<string, any> = {}) =>
  exposeClassProperties(
    getSplitStyles(
      props,
      View.staticConfig,
      undefined as any,
      'light',
      { unmounted: false, ...componentState } as any,
      opts
    ) as any
  )

const rulesFor = (result: any, identifier: string): string[] =>
  result.rulesToInsert[identifier]?.[4] ?? []

/** every rule emitted for this render, keyed by identifier */
const allRulesFor = (result: any): Record<string, string[]> => {
  const out: Record<string, string[]> = {}
  for (const identifier in result.rulesToInsert) {
    out[identifier] = result.rulesToInsert[identifier][4] ?? []
  }
  return out
}

// one declaration, every clause the grammar can put in front of it. the value is
// identical in all of them, so the ONLY thing that can distinguish the emitted
// identifiers is the clause.
const clauses = [
  { clause: '', selector: '', wrapper: '' },
  { clause: 'hover:', selector: ':hover', wrapper: '@media (hover: hover)' },
  { clause: 'press:', selector: ':active', wrapper: '' },
  { clause: 'focus:', selector: ':focus', wrapper: '' },
  { clause: 'focus-within:', selector: ':focus-within', wrapper: '' },
  { clause: 'disabled:', selector: '', wrapper: '' },
  { clause: 'sm:', selector: '', wrapper: '@media' },
  { clause: 'md:', selector: '', wrapper: '@media' },
  { clause: 'gtSm:', selector: '', wrapper: '@media' },
  { clause: 'short:', selector: '', wrapper: '@media' },
  { clause: 'dark:', selector: '.t_dark', wrapper: '' },
  { clause: 'group-hover:', selector: '.t_group_', wrapper: '@media (hover: hover)' },
  { clause: 'sm:hover:', selector: ':hover', wrapper: '@media' },
] as const

test('every distinct clause over one declaration gets its own identifier', () => {
  const seen = new Map<string, string>()

  for (const { clause } of clauses) {
    // base value first so the clause is an override, which is how the engine
    // actually accumulates a multi-clause atomic
    const result = split({ backgroundColor: `red ${clause}blue`.trim() })
    const identifier = result.classNames.backgroundColor
    expect(identifier, `clause "${clause}" emitted no class`).toBeTruthy()

    const previous = seen.get(identifier)
    expect(
      previous,
      `clause "${clause}" reused the identifier ${identifier} already emitted for clause "${previous}"`
    ).toBeUndefined()
    seen.set(identifier, clause)
  }

  expect(seen.size).toBe(clauses.length)
})

test(`each clause's rules carry that clause's own selector`, () => {
  for (const { clause, selector, wrapper } of clauses) {
    if (!clause) continue
    const result = split({ backgroundColor: `red ${clause}blue` })
    const identifier = result.classNames.backgroundColor
    const css = rulesFor(result, identifier).join('\n')

    expect(css, `clause "${clause}" emitted no rules`).toContain('background-color')
    expect(css, `clause "${clause}" lost its blue override`).toContain('blue')
    if (selector) {
      expect(css, `clause "${clause}" is missing selector ${selector}`).toContain(
        selector
      )
    }
    if (wrapper) {
      expect(css, `clause "${clause}" is missing wrapper ${wrapper}`).toContain(wrapper)
    }
  }
})

test('the same clause over different declarations gets different identifiers', () => {
  // longhands only: a shorthand like borderColor expands into several
  // longhands and never gets a class of its own, and color is text-only
  const properties = [
    'backgroundColor',
    'borderTopColor',
    'borderBottomColor',
    'borderLeftColor',
    'outlineColor',
  ]
  const seen = new Map<string, string>()

  for (const property of properties) {
    const result = split({ [property]: 'red hover:blue' })
    const identifier = result.classNames[property]
    expect(identifier, `${property} emitted no class`).toBeTruthy()
    const previous = seen.get(identifier)
    expect(
      previous,
      `${property} reused the identifier ${identifier} already emitted for ${previous}`
    ).toBeUndefined()
    seen.set(identifier, property)
  }
})

test('identifiers stay stable and rules stay correct across repeated renders', () => {
  // the second render is the one served from the identifier keyed reuse. it has
  // to produce byte-identical rules, or the engine's insertion invariant is a
  // lie for every component after the first.
  const props = {
    backgroundColor: 'red hover:blue dark:green sm:purple',
    padding: '4 hover:8',
    borderColor: 'black focus:white',
  }

  const first = split(props)
  const second = split(props)

  expect(second.classNames).toEqual(first.classNames)
  expect(allRulesFor(second)).toEqual(allRulesFor(first))
})

test('a clause matrix over one styled component keeps every rule set distinct', () => {
  // widest realistic surface in a single render: several declarations, several
  // clauses each, states both active and inactive. if any two of those atomics
  // collided the map below would be smaller than the number of classes.
  const Matrix = styled(View, {
    backgroundColor: 'red hover:blue press:green focus:purple dark:black',
    borderColor: 'black hover:white sm:red md:blue',
    outlineColor: 'gray focus-within:black disabled:silver',
    padding: '4 hover:8 sm:12',
    borderWidth: '1 hover:2',
  })

  const result = split(
    { ...(Matrix as any).staticConfig.defaultProps },
    { hover: true, focus: true }
  )

  const rules = allRulesFor(result)
  const byText = new Map<string, string>()
  for (const identifier in rules) {
    const text = rules[identifier].join('\n')
    // every rule must be selected by its own identifier, never another's
    for (const rule of rules[identifier]) {
      expect(rule, `${identifier} emitted a rule that does not select it`).toContain(
        `.${identifier}`
      )
    }
    const previous = byText.get(text)
    expect(
      previous,
      `${identifier} and ${previous} emitted identical rule text under different identifiers`
    ).toBeUndefined()
    byText.set(text, identifier)
  }

  expect(byText.size).toBe(4)
})
