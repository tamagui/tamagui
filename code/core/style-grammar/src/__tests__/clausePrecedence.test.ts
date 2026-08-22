import { describe, expect, test } from 'vitest'

import {
  clauseConditionSetKey,
  clauseSubjectClassRepetitions,
  clauseTargetClassSpecificity,
  compareClausePrecedence,
  createClausePrecedenceOrder,
  createModifierRegistry,
  getClausePrecedenceKey,
  grammarMaxNonPlatformDepth,
} from '..'

const { registry } = createModifierRegistry({
  mediaNames: ['sm', 'md', 'lg'],
  themeNames: { dark: {} },
})
const order = createClausePrecedenceOrder(['sm', 'md', 'lg'])
const key = (...modifiers: string[]) => getClausePrecedenceKey(modifiers, registry, order)

describe('fixed clause precedence key', () => {
  test('platform rank is outermost and uses the decided containment levels', () => {
    expect(key('native')).toEqual([1, 0, 0, 0])
    expect(key('web')).toEqual([1, 0, 0, 0])
    expect(key('ios')).toEqual([2, 0, 0, 0])
    expect(key('tvos')).toEqual([3, 0, 0, 0])
    expect(compareClausePrecedence(key('native'), key('sm', 'hover'))).toBeGreaterThan(0)
  })

  test('depth precedes category and within-category rank', () => {
    expect(compareClausePrecedence(key('sm', 'dark'), key('press'))).toBeGreaterThan(0)
    expect(compareClausePrecedence(key('dark'), key('@sm'))).toBeGreaterThan(0)
    expect(compareClausePrecedence(key('@sm'), key('sm'))).toBeGreaterThan(0)
  })

  test('media declaration order is deterministic', () => {
    expect(compareClausePrecedence(key('md'), key('sm'))).toBeGreaterThan(0)
  })

  test('own state beats group state and state lifecycle order is fixed', () => {
    expect(compareClausePrecedence(key('hover'), key('group-hover'))).toBeGreaterThan(0)
    expect(compareClausePrecedence(key('focus'), key('hover'))).toBeGreaterThan(0)
    expect(compareClausePrecedence(key('press'), key('focus-visible'))).toBeGreaterThan(0)
  })

  test('condition sets normalize spelling order and exact duplicates', () => {
    expect(clauseConditionSetKey(['dark', 'sm'])).toBe('dark:sm')
    expect(clauseConditionSetKey(['sm', 'dark'])).toBe('dark:sm')
    expect(clauseConditionSetKey(['hover', 'hover'])).toBe('hover')
    expect(clauseConditionSetKey(['active'])).toBe('press')
    expect(clauseConditionSetKey(['group-active/card'])).toBe('group-press/card')
  })
})

describe('CSS specificity encoding', () => {
  test('depth is the target class specificity and self states contribute naturally', () => {
    const media = key('sm')
    const state = key('hover')
    const nested = key('sm', 'hover')
    expect(clauseTargetClassSpecificity(media)).toBe(2)
    expect(clauseSubjectClassRepetitions(media, 0)).toBe(2)
    expect(clauseTargetClassSpecificity(state)).toBe(2)
    expect(clauseSubjectClassRepetitions(state, 1)).toBe(1)
    expect(clauseTargetClassSpecificity(nested)).toBe(3)
    expect(clauseSubjectClassRepetitions(nested, 1)).toBe(2)
  })

  test('the platform floor is above the deepest allowed non-platform clause', () => {
    const deepest = getClausePrecedenceKey(
      ['sm', '@sm', 'dark', 'group-hover', 'hover'],
      registry,
      order
    )
    expect(deepest[1]).toBe(grammarMaxNonPlatformDepth)
    expect(clauseTargetClassSpecificity(key('native'))).toBeGreaterThan(
      clauseTargetClassSpecificity(deepest)
    )
  })

  test('chains above the documented CSS emitter depth cap fail consistently', () => {
    expect(() => key('sm', 'md', 'lg', 'dark', '@sm', 'hover')).toThrow(
      `at most ${grammarMaxNonPlatformDepth} non-platform conditions`
    )
  })
})
