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
    expect(key('native')).toBe(packClausePrecedence(1, 0, 0, 0))
    expect(key('web')).toBe(packClausePrecedence(1, 0, 0, 0))
    expect(key('ios')).toBe(packClausePrecedence(2, 0, 0, 0))
    expect(key('tvos')).toBe(packClausePrecedence(3, 0, 0, 0))
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
      packClausePrecedence(1, 5, 2, 0)
    )
  })
})

// ---------------------------------------------------------------------------
// Exhaustive proof that the packed integer reproduces the total order of the
// 4-tuple key it replaced: [platformRank, depth, categoryRank,
// withinCategoryRank] compared lexicographically. The reference below is the
// deleted implementation, kept verbatim as the spec.
// ---------------------------------------------------------------------------

type TupleKey = readonly [number, number, number, number]

function compareTupleKeys(left: TupleKey, right: TupleKey): number {
  for (let index = 0; index < 4; index++) {
    const difference = left[index] - right[index]
    if (difference) return difference
  }
  return 0
}

const referenceCategoryRanks: Record<string, number> = {
  media: 0,
  container: 1,
  theme: 2,
  group: 3,
  state: 4,
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
  open: 8,
  checked: 9,
  highlighted: 10,
  selected: 11,
  invalid: 12,
}

function referenceWithinCategoryRank(
  modifier: string,
  kind: Exclude<ModifierKind, 'platform'>,
  mediaOrder: ClausePrecedenceOrder
): number {
  if (kind === 'media') return mediaOrder.get(modifier) ?? 0
  if (kind === 'container') {
    const container = parseContainerModifier(modifier)
    return container ? (mediaOrder.get(container.size) ?? 0) : 0
  }
  if (kind === 'theme') return 0
  if (kind === 'group') {
    const group = parseGroupModifier(modifier)
    return group ? (referenceStateRanks[group.state] ?? 0) : 0
  }
  return referenceStateRanks[modifier] ?? 0
}

function referenceTupleKey(modifiers: readonly string[]): TupleKey {
  let platformRank = 0
  let categoryRank = 0
  let highestWithinCategoryRank = 0
  const nonPlatform = new Set<string>()

  for (const raw of modifiers) {
    const modifier = canonicalClauseModifier(raw)
    const kind = registry.get(modifier)
    if (!kind) continue
    if (kind === 'platform') {
      platformRank = Math.max(platformRank, grammarPlatformRank(modifier))
      continue
    }
    nonPlatform.add(modifier)
    const nextCategoryRank = referenceCategoryRanks[kind]
    const nextWithinCategoryRank = referenceWithinCategoryRank(modifier, kind, order)
    if (nextCategoryRank > categoryRank) {
      categoryRank = nextCategoryRank
      highestWithinCategoryRank = nextWithinCategoryRank
    } else if (nextCategoryRank === categoryRank) {
      highestWithinCategoryRank = Math.max(
        highestWithinCategoryRank,
        nextWithinCategoryRank
      )
    }
  }

  return [platformRank, nonPlatform.size, categoryRank, highestWithinCategoryRank]
}

describe('packed key reproduces the 4-tuple total order exactly', () => {
  test('every pair over the full component space agrees, including ties', () => {
    // within-category rank covers the whole state table plus media declaration
    // indexes, which are only bounded by the packing's 20 bits
    const withinSamples = [
      ...Array.from({ length: 17 }, (_, index) => index),
      17,
      255,
      4096,
      2 ** 20 - 1,
    ]
    const keys: { tuple: TupleKey; packed: number }[] = []
    for (let platform = 0; platform <= 3; platform++) {
      for (let depth = 0; depth <= grammarMaxNonPlatformDepth; depth++) {
        for (let category = 0; category <= 4; category++) {
          for (const within of withinSamples) {
            keys.push({
              tuple: [platform, depth, category, within],
              packed: packClausePrecedence(platform, depth, category, within),
            })
          }
        }
      }
    }
    expect(keys.length).toBe(4 * 6 * 5 * withinSamples.length)

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

  test('every pair of real modifier chains agrees with the deleted tuple path', () => {
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
      'open',
      'checked',
      'highlighted',
      'selected',
      'invalid',
      'group-hover',
      'group-press/card',
      'group-checked',
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
      'checked',
      'invalid',
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
