import { mergeProgramValues } from './programs'
import { parseValue } from './valueParser'
import type { ModifierRegistryView, ParsedValue } from './valueTypes'

/** Prints one parsed value without changing payloads, modifier order, or clause order. */
export function formatParsedValue(value: ParsedValue): string {
  const parts: string[] = []
  if (value.base !== null) parts.push(value.base)
  for (const clause of value.clauses) {
    parts.push(`${clause.modifiers.join(':')}:${clause.payload}`)
  }
  return parts.join(' ')
}

// merging only needs the parser to split a base from its clauses, and the
// parser consults the registry for exactly one thing: whether a modifier is
// registered at all. Nothing about the split depends on which kind comes back.
// An accepting view therefore parses identically to a configured one, and it
// keeps values whose modifiers this site cannot resolve (a config's media keys,
// sub-theme names) mergeable instead of quietly dropping their clauses.
const acceptAnyModifier: ModifierRegistryView = { get: () => 'state' }

/**
 * Combine two flat values for the same property, later winning.
 *
 * The merge unit is the clause, so a later `borderColor="green"` overrides the
 * earlier base without erasing an earlier `press:transparent`. Style values
 * that carry no clause take the cheap path and the later one simply wins,
 * which is every ordinary prop.
 */
export function mergeFlatValues(earlier: unknown, later: unknown): unknown {
  if (typeof earlier !== 'string' || typeof later !== 'string') return later
  // a clause needs a colon; skipping the parse here keeps ordinary props off
  // the grammar path entirely
  if (!earlier.includes(':') && !later.includes(':')) return later

  const earlierParsed = parseValue(earlier, acceptAnyModifier)
  if (!earlierParsed.ok) return later
  const laterParsed = parseValue(later, acceptAnyModifier)
  if (!laterParsed.ok) return later
  if (!earlierParsed.value.clauses.length && !laterParsed.value.clauses.length) {
    return later
  }

  return formatParsedValue(mergeProgramValues(earlierParsed.value, laterParsed.value))
}
