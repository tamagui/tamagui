import { grammarPlatformGroups } from './config'
import type { ModifierRegistryView, ParsedValue } from './valueTypes'

export interface ActiveConditions {
  states: ReadonlySet<string>
  themes: ReadonlySet<string>
  media: ReadonlySet<string>
  platform: string
  groups: (modifier: string) => boolean
}

export function evaluateProgram(
  value: ParsedValue,
  registry: ModifierRegistryView,
  active: ActiveConditions
): string | null {
  for (let clauseIndex = value.clauses.length - 1; clauseIndex >= 0; clauseIndex--) {
    const clause = value.clauses[clauseIndex]
    let matches = true

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
      } else if (kind === 'group') {
        matches = active.groups(modifier)
      } else {
        matches = false
      }

      if (!matches) break
    }

    if (matches) return clause.payload
  }

  return value.base
}
