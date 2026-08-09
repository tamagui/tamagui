import { describe, expect, test } from 'vitest'
import {
  evaluateProgram,
  type ActiveConditions,
  type ModifierKind,
  type ModifierRegistryView,
  type ParsedValue,
} from '..'

const modifierKinds: Readonly<Record<string, ModifierKind>> = {
  hover: 'state',
  press: 'state',
  dark: 'theme',
  sm: 'media',
  native: 'platform',
  ios: 'platform',
  'group-hover': 'group',
  '@sm/layout': 'container',
}

const registry: ModifierRegistryView = {
  get(name) {
    return modifierKinds[name]
  },
}

const active = (conditions: Partial<ActiveConditions> = {}): ActiveConditions => ({
  states: new Set(),
  themes: new Set(),
  media: new Set(),
  platform: 'web',
  groups: () => false,
  containers: () => false,
  ...conditions,
})

describe('runtime program evaluation', () => {
  const planValue: ParsedValue = {
    base: 'red',
    clauses: [
      { modifiers: ['hover'], payload: 'green' },
      { modifiers: ['dark'], payload: 'gray' },
      { modifiers: ['dark', 'hover'], payload: 'blue' },
    ],
  }

  test.each([
    ['neither active', new Set<string>(), new Set<string>(), 'red'],
    ['hover active', new Set(['hover']), new Set<string>(), 'green'],
    ['dark active', new Set<string>(), new Set(['dark']), 'gray'],
    ['dark and hover active', new Set(['hover']), new Set(['dark']), 'blue'],
  ])('evaluates the plan example with %s', (_label, states, themes, expected) => {
    expect(evaluateProgram(planValue, registry, active({ states, themes }))).toBe(
      expected
    )
  })

  test('matches active media modifiers', () => {
    expect(
      evaluateProgram(
        {
          base: '4',
          clauses: [{ modifiers: ['sm'], payload: '6' }],
        },
        registry,
        active({ media: new Set(['sm']) })
      )
    ).toBe('6')
  })

  test.each([
    ['native', 'ios'],
    ['native', 'tvos'],
    ['tv', 'tvos'],
    ['ios', 'ios'],
    ['ios', 'tvos'],
    ['android', 'androidtv'],
  ])('matches the %s modifier on %s', (modifier, platform) => {
    expect(
      evaluateProgram(
        {
          base: 'web-value',
          clauses: [{ modifiers: [modifier], payload: 'platform-value' }],
        },
        {
          get(name) {
            return name === modifier ? 'platform' : undefined
          },
        },
        active({ platform })
      )
    ).toBe('platform-value')
  })

  test('delegates group modifier matching to the caller', () => {
    expect(
      evaluateProgram(
        {
          base: 'rest',
          clauses: [{ modifiers: ['group-hover'], payload: 'hovered' }],
        },
        registry,
        active({ groups: (modifier) => modifier === 'group-hover' })
      )
    ).toBe('hovered')
  })

  test('asks the host whether a container query holds', () => {
    const value: ParsedValue = {
      base: 'rest',
      clauses: [{ modifiers: ['@sm/layout'], payload: 'wide' }],
    }
    expect(
      evaluateProgram(
        value,
        registry,
        active({ containers: (modifier) => modifier === '@sm/layout' })
      )
    ).toBe('wide')
    expect(evaluateProgram(value, registry, active())).toBe('rest')
  })

  test('a container chains with a group as an AND', () => {
    const value: ParsedValue = {
      base: 'rest',
      clauses: [{ modifiers: ['@sm/layout', 'group-hover'], payload: 'both' }],
    }
    expect(
      evaluateProgram(
        value,
        registry,
        active({ containers: () => true, groups: () => true })
      )
    ).toBe('both')
    expect(
      evaluateProgram(
        value,
        registry,
        active({ containers: () => true, groups: () => false })
      )
    ).toBe('rest')
  })

  test('requires every modifier in a clause to match', () => {
    expect(
      evaluateProgram(
        {
          base: 'red',
          clauses: [{ modifiers: ['dark', 'hover'], payload: 'blue' }],
        },
        registry,
        active({ themes: new Set(['dark']) })
      )
    ).toBe('red')
  })

  test('returns the base for a base-only value', () => {
    expect(evaluateProgram({ base: 'red', clauses: [] }, registry, active())).toBe('red')
  })

  test('returns null when a clause-only value has no match', () => {
    expect(
      evaluateProgram(
        {
          base: null,
          clauses: [{ modifiers: ['hover'], payload: 'green' }],
        },
        registry,
        active()
      )
    ).toBeNull()
  })

  test('a later matching clause in the same slot wins', () => {
    expect(
      evaluateProgram(
        {
          base: 'red',
          clauses: [
            { modifiers: ['hover'], payload: 'green' },
            { modifiers: ['hover'], payload: 'blue' },
          ],
        },
        registry,
        active({ states: new Set(['hover']) })
      )
    ).toBe('blue')
  })

  test('state aliases match and merge as their canonical condition', () => {
    expect(
      evaluateProgram(
        {
          base: 'red',
          clauses: [{ modifiers: ['active'], payload: 'blue' }],
        },
        registry,
        active({ states: new Set(['press']) })
      )
    ).toBe('blue')
  })

  test('treats an unregistered modifier as non-matching', () => {
    expect(
      evaluateProgram(
        {
          base: 'red',
          clauses: [{ modifiers: ['missing'], payload: 'blue' }],
        },
        registry,
        active()
      )
    ).toBe('red')
  })
})

describe('platform precedence', () => {
  const platformRegistry: ModifierRegistryView = {
    get(name) {
      return (
        {
          native: 'platform',
          web: 'platform',
          android: 'platform',
          ios: 'platform',
          tv: 'platform',
          androidtv: 'platform',
          tvos: 'platform',
          hover: 'state',
        } as Readonly<Record<string, ModifierKind>>
      )[name]
    },
  }

  const evaluate = (
    clauses: ParsedValue['clauses'],
    conditions: Partial<ActiveConditions> = {}
  ) =>
    evaluateProgram(
      { base: 'base', clauses },
      platformRegistry,
      active({ platform: 'androidtv', ...conditions })
    )

  test('androidtv beats android regardless of authored order', () => {
    expect(
      evaluate([
        { modifiers: ['android'], payload: 'android' },
        { modifiers: ['androidtv'], payload: 'androidtv' },
      ])
    ).toBe('androidtv')
    expect(
      evaluate([
        { modifiers: ['androidtv'], payload: 'androidtv' },
        { modifiers: ['android'], payload: 'android' },
      ])
    ).toBe('androidtv')
  })

  test('rank cascade native < android < androidtv is order-independent', () => {
    expect(
      evaluate([
        { modifiers: ['androidtv'], payload: 'androidtv' },
        { modifiers: ['tv'], payload: 'tv' },
        { modifiers: ['native'], payload: 'native' },
      ])
    ).toBe('androidtv')
    expect(
      evaluate([
        { modifiers: ['android'], payload: 'android' },
        { modifiers: ['native'], payload: 'native' },
      ])
    ).toBe('android')
  })

  test('equal precedence keeps authored order (later wins)', () => {
    expect(
      evaluate([
        { modifiers: ['android'], payload: 'android' },
        { modifiers: ['tv'], payload: 'tv' },
      ])
    ).toBe('tv')
    expect(
      evaluate([
        { modifiers: ['tv'], payload: 'tv' },
        { modifiers: ['android'], payload: 'android' },
      ])
    ).toBe('android')
  })

  test('platform rank dominates different non-platform condition sets', () => {
    expect(
      evaluate(
        [
          { modifiers: ['androidtv'], payload: 'androidtv' },
          { modifiers: ['hover', 'android'], payload: 'hover-android' },
        ],
        { states: new Set(['hover']) }
      )
    ).toBe('androidtv')
    expect(
      evaluate(
        [
          { modifiers: ['hover', 'androidtv'], payload: 'hover-androidtv' },
          { modifiers: ['hover', 'android'], payload: 'hover-android' },
        ],
        { states: new Set(['hover']) }
      )
    ).toBe('hover-androidtv')
  })

  test('a platform clause beats a deeper platform-less clause', () => {
    expect(
      evaluate(
        [
          { modifiers: ['androidtv'], payload: 'androidtv' },
          { modifiers: ['hover'], payload: 'hover' },
        ],
        { states: new Set(['hover']) }
      )
    ).toBe('androidtv')
  })
})
