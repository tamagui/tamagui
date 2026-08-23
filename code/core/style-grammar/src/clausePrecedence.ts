import { grammarPlatformRank } from './config'
import {
  canonicalClauseModifier,
  clauseConditionSetKey,
  parseGroupModifier,
} from './clauseIdentity'
import { parseContainerModifier } from './modifierRegistry'

export { canonicalClauseModifier, clauseConditionSetKey } from './clauseIdentity'
import {
  grammarMaxNonPlatformDepth,
  type ModifierKind,
  type ModifierRegistryView,
} from './valueTypes'

export { grammarMaxNonPlatformDepth } from './valueTypes'

/**
 * One clause's precedence as a single integer: a higher key wins, so
 * comparison is plain `>`. Four bounded fields pack most-significant first:
 *
 * - bits 26-27: platform rank — none 0; web/native 1; ios/android/tv 2;
 *   tvos/androidtv 3
 * - bits 23-25: depth — distinct non-platform conditions, capped at 5
 * - bits 20-22: category rank — media 0 < container 1 < theme 2 < group 3
 *   < state 4
 * - bits 0-19: rank inside the highest category — the state lifecycle table,
 *   or a media/container key's config declaration index (a config would need
 *   over a million media keys to overflow these bits)
 *
 * The CSS emitter deliberately caps a condition chain at five distinct
 * non-platform conditions. The parser can represent longer chains, but they
 * cannot be lowered while also giving platform clauses a finite specificity
 * floor above every platform-less clause, so the shared key builder rejects
 * them consistently on every surface.
 */
export type ClausePrecedenceKey = number

const categoryShift = 20
const depthShift = 23
const platformShift = 26

export function packClausePrecedence(
  platformRank: number,
  depth: number,
  categoryRank: number,
  withinCategoryRank: number
): ClausePrecedenceKey {
  return (
    (platformRank << platformShift) |
    (depth << depthShift) |
    (categoryRank << categoryShift) |
    withinCategoryRank
  )
}

export type OrderedModifierNames =
  | readonly string[]
  | ReadonlySet<string>
  | Readonly<Record<string, unknown>>

export type ClausePrecedenceOrder = ReadonlyMap<string, number>

const categoryRanks: Readonly<Record<Exclude<ModifierKind, 'platform'>, number>> = {
  media: 0,
  container: 1,
  theme: 2,
  group: 3,
  state: 4,
}

// Later lifecycle entries win. Component-tier states follow the interaction
// states in the order of states.ts's component vocabulary.
const stateRanks: Readonly<Record<string, number>> = Object.freeze({
  hover: 0,
  'focus-within': 1,
  focus: 2,
  'focus-visible': 3,
  press: 4,
  disabled: 5,
  enter: 6,
  exit: 7,
  open: 8,
  checked: 9,
  highlighted: 10,
  selected: 11,
  invalid: 12,
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

function withinCategoryRank(
  modifier: string,
  kind: Exclude<ModifierKind, 'platform'>,
  order: ClausePrecedenceOrder
): number {
  if (kind === 'media') return order.get(modifier) ?? 0
  if (kind === 'container') {
    const container = parseContainerModifier(modifier)
    return container ? (order.get(container.size) ?? 0) : 0
  }
  if (kind === 'theme') return 0
  if (kind === 'group') {
    const group = parseGroupModifier(modifier)
    return group ? (stateRanks[group.state] ?? 0) : 0
  }
  return stateRanks[modifier] ?? 0
}

export function getClausePrecedenceKeyFromKinds(
  modifiers: readonly string[],
  kinds: readonly (ModifierKind | undefined)[],
  order: ClausePrecedenceOrder
): ClausePrecedenceKey {
  let platformRank = 0
  let categoryRank = 0
  let highestWithinCategoryRank = 0
  const nonPlatform = new Set<string>()

  for (let index = 0; index < modifiers.length; index++) {
    const modifier = canonicalClauseModifier(modifiers[index])
    const kind = kinds[index]
    if (!kind) continue
    if (kind === 'platform') {
      platformRank = Math.max(platformRank, grammarPlatformRank(modifier))
      continue
    }

    nonPlatform.add(modifier)
    const nextCategoryRank = categoryRanks[kind]
    const nextWithinCategoryRank = withinCategoryRank(modifier, kind, order)
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

  const depth = nonPlatform.size
  if (depth > grammarMaxNonPlatformDepth) {
    throw new Error(
      `a flat value clause supports at most ${grammarMaxNonPlatformDepth} non-platform conditions; received ${depth} in "${modifiers.join(':')}:"`
    )
  }

  return packClausePrecedence(
    platformRank,
    depth,
    categoryRank,
    highestWithinCategoryRank
  )
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
  const depth = (key >>> depthShift) & 7
  const platformRank = key >>> platformShift
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
