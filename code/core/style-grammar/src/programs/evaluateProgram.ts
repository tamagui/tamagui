import { grammarPlatformGroups } from '../tooling/config'
import {
  canonicalClauseModifier,
  createClausePrecedenceOrder,
  getClausePrecedenceKeyFromKinds,
  type ClausePrecedenceOrder,
} from '../runtime/clausePrecedence'
import type { ModifierKind, ModifierRegistryView, ParsedValue } from '../ast/valueTypes'

export interface ActiveConditions {
  states: ReadonlySet<string>
  themes: ReadonlySet<string>
  media: ReadonlySet<string>
  /** config declaration order; falls back to `media` insertion order in tests */
  mediaOrder?: ClausePrecedenceOrder
  platform: string
  groups: (modifier: string) => boolean
  /**
   * whether a container query modifier (`@sm`, `@sm/card`) currently holds.
   * Like groups, this is a callback because the answer lives with the component
   * tree: resolving it needs the measured size of the nearest or named
   * container, whose measurement timing is its own design item.
   */
  containers: (modifier: string) => boolean
}

/**
 * Resolves a program to one payload using the shared fixed precedence key.
 * Authored order only breaks exact-key ties, so a later restatement of the
 * same normalized condition set wins while distinct condition sets are stable
 * under reordering.
 */
export function evaluateProgram(
  value: ParsedValue,
  registry: ModifierRegistryView,
  active: ActiveConditions
): string | null {
  let payload: string | null = null
  let best = -1
  const order = active.mediaOrder ?? createClausePrecedenceOrder(active.media)

  for (let clauseIndex = 0; clauseIndex < value.clauses.length; clauseIndex++) {
    const clause = value.clauses[clauseIndex]
    let matches = true
    const kinds: (ModifierKind | undefined)[] = []

    for (
      let modifierIndex = 0;
      modifierIndex < clause.modifiers.length;
      modifierIndex++
    ) {
      const modifier = canonicalClauseModifier(clause.modifiers[modifierIndex])
      const kind = registry.get(modifier)
      kinds.push(kind)

      if (kind === 'state') {
        matches = active.states.has(modifier)
      } else if (kind === 'theme') {
        matches = active.themes.has(modifier)
      } else if (kind === 'media') {
        matches = active.media.has(modifier)
      } else if (kind === 'platform') {
        matches =
          modifier === active.platform ||
          (grammarPlatformGroups.get(modifier)?.has(active.platform) ?? false)
      } else if (kind === 'group') {
        matches = active.groups(modifier)
      } else if (kind === 'container') {
        matches = active.containers(modifier)
      } else {
        matches = false
      }

      if (!matches) break
    }

    if (!matches) continue

    const precedence = getClausePrecedenceKeyFromKinds(clause.modifiers, kinds, order)
    if (precedence < best) continue

    payload = clause.payload
    best = precedence
  }

  return best === -1 ? value.base : payload
}
