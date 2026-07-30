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
    ['tv', 'tvos'],
    ['ios', 'ios'],
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

  test('backward iteration makes a later matching clause win', () => {
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
