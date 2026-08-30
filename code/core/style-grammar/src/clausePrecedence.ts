import { grammarPlatformRank } from './config'
import {
  canonicalClauseModifier,
  clauseConditionSetKey,
  containerModifierSizeEnd,
  parseGroupModifier,
} from './clauseIdentity'

export { canonicalClauseModifier, clauseConditionSetKey } from './clauseIdentity'
import {
  grammarMaxNonPlatformDepth,
  type ModifierKind,
  type ModifierRegistryView,
} from './valueTypes'

export { grammarMaxNonPlatformDepth } from './valueTypes'

/** one packed key compared as platform, depth, then every canonical atom rank */
export type ClausePrecedenceKey = number

const rankBase = 256
const rankTailScale = rankBase ** grammarMaxNonPlatformDepth

export function packClausePrecedence(
  platformRank: number,
  atomRanks: readonly number[]
): ClausePrecedenceKey {
  if (atomRanks.length > grammarMaxNonPlatformDepth) {
    throw new Error(
      `a flat value clause supports at most ${grammarMaxNonPlatformDepth} non-platform conditions; received ${atomRanks.length}`
    )
  }
  const ranks = atomRanks.slice().sort((left, right) => right - left)
  let key = platformRank * (grammarMaxNonPlatformDepth + 1) + ranks.length
  for (let index = 0; index < grammarMaxNonPlatformDepth; index++) {
    key = key * rankBase + (ranks[index] || 0)
  }
  return key
}

export type OrderedModifierNames =
  | readonly string[]
  | ReadonlySet<string>
  | Readonly<Record<string, unknown>>

export type ClausePrecedenceOrder = ReadonlyMap<string, number>

const categoryRanks: Readonly<Record<Exclude<ModifierKind, 'platform'>, number>> = {
  media: 1,
  container: 65,
  theme: 129,
  group: 161,
  state: 225,
}

// later lifecycle entries win
const stateRanks: Readonly<Record<string, number>> = Object.freeze({
  hover: 0,
  'focus-within': 1,
  focus: 2,
  'focus-visible': 3,
  press: 4,
  disabled: 5,
  enter: 6,
  exit: 7,
})

export function createClausePrecedenceOrder(
  names: OrderedModifierNames | undefined
): ClausePrecedenceOrder {
  const ranks = new Map<string, number>()
  if (!names) return ranks
  let rank = 0
  if (Array.isArray(names)) {
    for (const name of names) ranks.set(name, rank++)
  } else if (names instanceof Set) {
    for (const name of names) ranks.set(name, rank++)
  } else {
    for (const name in names as Readonly<Record<string, unknown>>) {
      ranks.set(name, rank++)
    }
  }
  return ranks
}

function atomRank(
  modifier: string,
  kind: Exclude<ModifierKind, 'platform'>,
  order: ClausePrecedenceOrder
): number {
  const base = categoryRanks[kind]
  if (kind === 'media') return base + Math.min(order.get(modifier) ?? 0, 63)
  if (kind === 'container') {
    const sizeEnd = containerModifierSizeEnd(modifier)
    return (
      base +
      (sizeEnd === -1 ? 0 : Math.min(order.get(modifier.slice(1, sizeEnd)) ?? 0, 63))
    )
  }
  if (kind === 'theme') return base
  if (kind === 'group') {
    const group = parseGroupModifier(modifier)
    return base + (group ? (stateRanks[group.state] ?? 0) : 0)
  }
  return base + (stateRanks[modifier] ?? 0)
}

export function getClausePrecedenceKeyFromKinds(
  modifiers: readonly string[],
  kinds: readonly (ModifierKind | undefined)[],
  order: ClausePrecedenceOrder
): ClausePrecedenceKey {
  let platformRank = 0
  const seen = new Set<string>()
  const ranks: number[] = []

  for (let index = 0; index < modifiers.length; index++) {
    const modifier = canonicalClauseModifier(modifiers[index])
    const kind = kinds[index]
    if (!kind || seen.has(modifier)) continue
    seen.add(modifier)
    if (kind === 'platform') {
      platformRank = Math.max(platformRank, grammarPlatformRank(modifier))
      continue
    }
    ranks.push(atomRank(modifier, kind, order))
  }

  if (ranks.length > grammarMaxNonPlatformDepth) {
    throw new Error(
      `a flat value clause supports at most ${grammarMaxNonPlatformDepth} non-platform conditions; received ${ranks.length} in "${modifiers.join(':')}:"`
    )
  }

  return packClausePrecedence(platformRank, ranks)
}

export function getClausePrecedenceKey(
  modifiers: readonly string[],
  registry: ModifierRegistryView,
  order: ClausePrecedenceOrder
): ClausePrecedenceKey {
  const kinds: (ModifierKind | undefined)[] = []
  for (let index = 0; index < modifiers.length; index++) {
    kinds.push(registry.get(modifiers[index]))
  }
  return getClausePrecedenceKeyFromKinds(modifiers, kinds, order)
}

/** Target CSS class specificity, excluding IDs/elements: (0, result, 0). */
export function clauseTargetClassSpecificity(key: ClausePrecedenceKey): number {
  const head = Math.floor(key / rankTailScale)
  const depth = head % (grammarMaxNonPlatformDepth + 1)
  const platformRank = Math.floor(head / (grammarMaxNonPlatformDepth + 1))
  return 1 + depth + platformRank * (grammarMaxNonPlatformDepth + 1)
}

/**
 * Subject-class repetitions needed after self-state selectors contribute
 * their pseudo/attribute specificity naturally. Theme and group scopes use
 * :where(), while media/container wrappers contribute zero.
 */
export function clauseSubjectClassRepetitions(
  key: ClausePrecedenceKey,
  selfStateSpecificity: number
): number {
  return clauseTargetClassSpecificity(key) - selfStateSpecificity
}
