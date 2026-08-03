import { grammarPlatformGroups, grammarPlatformRank } from './config'
import type { ModifierRegistryView, ParsedValue } from './valueTypes'

export interface ActiveConditions {
  states: ReadonlySet<string>
  themes: ReadonlySet<string>
  media: ReadonlySet<string>
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
 * Resolves a program to one payload, mirroring the runtime directStyle
 * contract: clauses apply in authored order, except that platform-bearing
 * clauses with the same non-platform condition set compete by platform
 * specificity (grammarPlatformRank), where a more specific earlier clause
 * survives a less specific later one and equal ranks keep authored order.
 */
export function evaluateProgram(
  value: ParsedValue,
  registry: ModifierRegistryView,
  active: ActiveConditions
): string | null {
  let payload: string | null = null
  let found = false
  // best platform rank seen per non-platform condition set; mirrors the
  // runtime gate keyed by property + specificityGroup in directStyle
  let groupBest: Map<string, number> | undefined

  for (let clauseIndex = 0; clauseIndex < value.clauses.length; clauseIndex++) {
    const clause = value.clauses[clauseIndex]
    let matches = true
    let rank = 0
    let others: string[] | undefined

    for (
      let modifierIndex = 0;
      modifierIndex < clause.modifiers.length;
      modifierIndex++
    ) {
      const modifier = clause.modifiers[modifierIndex]
      const kind = registry.get(modifier)

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
        if (matches) rank = Math.max(rank, grammarPlatformRank(modifier))
      } else if (kind === 'group') {
        matches = active.groups(modifier)
      } else if (kind === 'container') {
        matches = active.containers(modifier)
      } else {
        matches = false
      }

      if (!matches) break
      if (kind !== 'platform') (others ||= []).push(modifier)
    }

    if (!matches) continue

    if (rank) {
      const groupKey = others ? others.sort().join(':') : ''
      const best = groupBest?.get(groupKey) ?? 0
      if (rank < best) continue
      ;(groupBest ||= new Map()).set(groupKey, rank)
    }

    payload = clause.payload
    found = true
  }

  return found ? payload : value.base
}
