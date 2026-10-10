import type { ParsedValue } from '../ast/valueTypes'

/** Prints one parsed value without changing payloads, modifier order, or clause order. */
export function formatParsedValue(value: ParsedValue): string {
  const parts: string[] = []
  if (value.base !== null) parts.push(value.base)
  for (const clause of value.clauses) {
    parts.push(`${clause.modifiers.join(':')}:${clause.payload}`)
  }
  return parts.join(' ')
}
