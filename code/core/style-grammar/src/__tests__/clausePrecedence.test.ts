import { describe, expect, test } from 'vitest'

import {
  canonicalClauseModifier,
  clauseConditionSetKey,
  clauseSubjectClassRepetitions,
  clauseTargetClassSpecificity,
  createClausePrecedenceOrder,
  createModifierRegistry,
  getClausePrecedenceKey,
  grammarMaxNonPlatformDepth,
  grammarPlatformRank,
  packClausePrecedence,
  parseContainerModifier,
  parseGroupModifier,
  type ClausePrecedenceOrder,
  type ModifierKind,
} from '../tooling'

const { registry } = createModifierRegistry({
  mediaNames: ['sm', 'md', 'lg'],
  themeNames: { dark: {} },
})
const order = createClausePrecedenceOrder(['sm', 'md', 'lg'])
const key = (...modifiers: string[]) => getClausePrecedenceKey(modifiers, registry, order)

describe('fixed clause precedence key', () => {
  test('platform rank is outermost and uses the decided containment levels', () => {
    expect(key('native')).toBe(packClausePrecedence(1, []))
    expect(key('web')).toBe(packClausePrecedence(1, []))
    expect(key('ios')).toBe(packClausePrecedence(2, []))
    expect(key('tvos')).toBe(packClausePrecedence(3, []))
    expect(key('native')).toBeGreaterThan(key('sm', 'hover'))
  })

  test('depth precedes category and within-category rank', () => {
    expect(key('sm', 'dark')).toBeGreaterThan(key('press'))
    expect(key('dark')).toBeGreaterThan(key('@sm'))
    expect(key('@sm')).toBeGreaterThan(key('sm'))
  })

  test('media declaration order is deterministic', () => {
    expect(key('md')).toBeGreaterThan(key('sm'))
  })

  test('every atom participates after depth, including lower-ranked categories', () => {
    expect(key('md', 'hover')).toBeGreaterThan(key('sm', 'hover'))
    expect(key('md', 'dark', 'hover')).toBeGreaterThan(key('sm', 'dark', 'hover'))
  })

  test('own state beats group state and state lifecycle order is fixed', () => {
    expect(key('hover')).toBeGreaterThan(key('group-hover'))
    expect(key('focus')).toBeGreaterThan(key('hover'))
    expect(key('press')).toBeGreaterThan(key('focus-visible'))
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
    expect(clauseTargetClassSpecificity(deepest)).toBe(1 + grammarMaxNonPlatformDepth)
    expect(clauseTargetClassSpecificity(key('native'))).toBeGreaterThan(
      clauseTargetClassSpecificity(deepest)
    )
  })

  test('chains above the documented CSS emitter depth cap fail consistently', () => {
    expect(() => key('sm', 'md', 'lg', 'dark', '@sm', 'hover')).toThrow(
      `at most ${grammarMaxNonPlatformDepth} non-platform conditions`
    )
    // the cap counts non-platform conditions only: a platform modifier neither
    // consumes depth nor rescues a chain already over the cap
    expect(() => key('native', 'sm', 'md', 'lg', 'dark', '@sm', 'hover')).toThrow(
      `at most ${grammarMaxNonPlatformDepth} non-platform conditions`
    )
    expect(key('native', 'sm', 'md', 'lg', 'dark', '@sm')).toBe(
      packClausePrecedence(1, [1, 2, 3, 65, 129])
    )
  })
})

type TupleKey = readonly [number, number, number, number, number, number, number]

function compareTupleKeys(left: TupleKey, right: TupleKey): number {
  for (let index = 0; index < left.length; index++) {
    const difference = left[index] - right[index]
    if (difference) return difference
  }
  return 0
}

const referenceCategoryRanks: Record<string, number> = {
  media: 1,
  container: 65,
  theme: 129,
  group: 161,
  state: 225,
}

const referenceStateRanks: Record<string, number> = {
  hover: 0,
  'focus-within': 1,
  focus: 2,
  'focus-visible': 3,
  press: 4,
  active: 4,
  pressed: 4,
  disabled: 5,
  enter: 6,
  starting: 6,
  exit: 7,
  ending: 7,
}

function referenceAtomRank(
  modifier: string,
  kind: Exclude<ModifierKind, 'platform'>,
  mediaOrder: ClausePrecedenceOrder
): number {
  const base = referenceCategoryRanks[kind]
  if (kind === 'media') return base + Math.min(mediaOrder.get(modifier) ?? 0, 63)
  if (kind === 'container') {
    const container = parseContainerModifier(modifier)
    return base + (container ? Math.min(mediaOrder.get(container.size) ?? 0, 63) : 0)
  }
  if (kind === 'theme') return base
  if (kind === 'group') {
    const group = parseGroupModifier(modifier)
    return base + (group ? (referenceStateRanks[group.state] ?? 0) : 0)
  }
  return base + (referenceStateRanks[modifier] ?? 0)
}

function referenceTupleKey(modifiers: readonly string[]): TupleKey {
  let platformRank = 0
  const seen = new Set<string>()
  const ranks: number[] = []

  for (const raw of modifiers) {
    const modifier = canonicalClauseModifier(raw)
    const kind = registry.get(modifier)
    if (!kind || seen.has(modifier)) continue
    seen.add(modifier)
    if (kind === 'platform') {
      platformRank = Math.max(platformRank, grammarPlatformRank(modifier))
      continue
    }
    ranks.push(referenceAtomRank(modifier, kind, order))
  }
  ranks.sort((left, right) => right - left)
  return [
    platformRank,
    ranks.length,
    ranks[0] || 0,
    ranks[1] || 0,
    ranks[2] || 0,
    ranks[3] || 0,
    ranks[4] || 0,
  ]
}

describe('packed key reproduces full-condition precedence exactly', () => {
  test('representative rank vectors preserve lexicographic order and specificity', () => {
    const rankVectors = [
      [],
      [1],
      [2],
      [65],
      [129],
      [161],
      [225],
      [232],
      [225, 1],
      [225, 2],
      [229, 1],
      [225, 129, 2],
      [232, 229, 225, 161, 129],
    ]
    const keys: { tuple: TupleKey; packed: number }[] = []
    for (let platform = 0; platform <= 3; platform++) {
      for (const ranks of rankVectors) {
        const sorted = ranks.slice().sort((left, right) => right - left)
        keys.push({
          tuple: [
            platform,
            sorted.length,
            sorted[0] || 0,
            sorted[1] || 0,
            sorted[2] || 0,
            sorted[3] || 0,
            sorted[4] || 0,
          ],
          packed: packClausePrecedence(platform, ranks),
        })
      }
    }

    let orderMismatches = 0
    let specificityMismatches = 0
    for (const { tuple, packed } of keys) {
      if (
        clauseTargetClassSpecificity(packed) !==
        1 + tuple[1] + tuple[0] * (grammarMaxNonPlatformDepth + 1)
      ) {
        specificityMismatches++
      }
    }
    for (let left = 0; left < keys.length; left++) {
      for (let right = 0; right < keys.length; right++) {
        const packedSign = Math.sign(keys[left].packed - keys[right].packed)
        const tupleSign = Math.sign(compareTupleKeys(keys[left].tuple, keys[right].tuple))
        if (packedSign !== tupleSign) orderMismatches++
      }
    }
    expect(orderMismatches).toBe(0)
    expect(specificityMismatches).toBe(0)
  })

  test('every pair of real modifier chains agrees with the reference tuple', () => {
    const modifiers = [
      'sm',
      'md',
      'lg',
      '@sm',
      '@md/card',
      'dark',
      'hover',
      'press',
      'active',
      'pressed',
      'focus',
      'focus-visible',
      'focus-within',
      'disabled',
      'enter',
      'starting',
      'exit',
      'ending',
      'group-hover',
      'group-press/card',
      'native',
      'web',
      'ios',
      'android',
      'tv',
      'tvos',
      'androidtv',
    ]
    const tripleSubset = [
      'sm',
      'lg',
      '@sm',
      'dark',
      'hover',
      'press',
      'group-hover',
      'native',
      'ios',
      'tvos',
    ]
    const chains: string[][] = modifiers.map((modifier) => [modifier])
    for (const first of modifiers) {
      for (const second of modifiers) chains.push([first, second])
    }
    for (const first of tripleSubset) {
      for (const second of tripleSubset) {
        for (const third of tripleSubset) chains.push([first, second, third])
      }
    }

    const keys = chains.map((chain) => ({
      tuple: referenceTupleKey(chain),
      packed: getClausePrecedenceKey(chain, registry, order),
    }))

    let mismatches = 0
    for (let left = 0; left < keys.length; left++) {
      for (let right = 0; right < keys.length; right++) {
        const packedSign = Math.sign(keys[left].packed - keys[right].packed)
        const tupleSign = Math.sign(compareTupleKeys(keys[left].tuple, keys[right].tuple))
        if (packedSign !== tupleSign) mismatches++
      }
    }
    expect(mismatches).toBe(0)
  })
})
