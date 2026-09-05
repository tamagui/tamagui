// Geometric shorthand slot semantics for program values (design record,
// "Bare numbers resolve config-first ... and per component value:
// `p="4 8"` resolves both"). A multi-component payload on a geometric
// shorthand distributes by the CSS slot pattern — sides alternate for two
// values, three values mirror the second, four map directly — producing one
// SINGLE-component program per longhand. Without this, every side received
// the whole multi-value payload and the browser dropped the declaration
// silently.
//
// Function values and slash syntax (`borderRadius="8px / 4px"`) do not
// distribute faithfully and return an error, which keeps the value on the
// single-program path where the payload-shape diagnostic reports it.

import { splitTopLevelComponents } from './backgroundFamily'
import { longhandExpansionTable } from '../programs/programs'
import type { ParsedClause, ParsedValue } from '../ast/valueTypes'

// identical index patterns for box sides (T/R/B/L) and radius corners
// (TL/TR/BR/BL); two-slot pairs (horizontal/vertical, gap) take one or two
const slotPatterns: Record<number, Record<number, readonly number[]>> = {
  4: { 1: [0, 0, 0, 0], 2: [0, 1, 0, 1], 3: [0, 1, 2, 1], 4: [0, 1, 2, 3] },
  2: { 1: [0, 0], 2: [0, 1] },
}

export interface GeometricShorthandError {
  code: 'unsupported-geometric-payload'
  payload: string
  where: 'base' | number
}

/**
 * Splits a geometric shorthand's parsed program into per-longhand programs by
 * slot. Returns null when `prop` is not a geometric shorthand, or when every
 * payload is single-component (nothing to distribute — the caller's ordinary
 * expansion handles that identically and cheaper).
 */
export function splitGeometricShorthandValue(
  prop: string,
  value: ParsedValue
): {
  entries: Array<{ property: string; value: ParsedValue }>
  errors: GeometricShorthandError[]
} | null {
  const longhands = longhandExpansionTable[prop]
  if (!longhands) return null
  const patterns = slotPatterns[longhands.length]
  if (!patterns) return null

  // fast path: nothing multi-component, nothing to do
  let hasMulti = false
  const payloadComponents: string[][] = []
  for (let index = -1; index < value.clauses.length; index++) {
    const payload = index === -1 ? value.base : value.clauses[index].payload
    if (payload === null) {
      payloadComponents.push([])
      continue
    }
    if (payload.includes('/')) return null
    const components = splitTopLevelComponents(payload)
    payloadComponents.push(components)
    if (components.length > 1) hasMulti = true
  }
  if (!hasMulti) return null

  const errors: GeometricShorthandError[] = []
  // per longhand: pick this slot's component from every payload
  const perLonghand: Array<{ base: string | null; clauses: ParsedClause[] }> =
    longhands.map(() => ({ base: null, clauses: [] }))

  for (let index = -1; index < value.clauses.length; index++) {
    const payload = index === -1 ? value.base : value.clauses[index].payload
    if (payload === null) continue
    const components = payloadComponents[index + 1]
    const pattern = patterns[components.length]
    if (!pattern) {
      errors.push({
        code: 'unsupported-geometric-payload',
        payload,
        where: index === -1 ? 'base' : index,
      })
      continue
    }
    for (let slot = 0; slot < longhands.length; slot++) {
      const component = components[pattern[slot]]
      if (index === -1) {
        perLonghand[slot].base = component
      } else {
        perLonghand[slot].clauses.push({
          modifiers: value.clauses[index].modifiers,
          payload: component,
        })
      }
    }
  }

  if (errors.length) return { entries: [], errors }

  return {
    entries: longhands.map((longhand, slot) => ({
      property: longhand,
      value: { base: perLonghand[slot].base, clauses: perLonghand[slot].clauses },
    })),
    errors,
  }
}
