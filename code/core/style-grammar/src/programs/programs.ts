import { clauseConditionSetKey } from '../runtime/clausePrecedence'
import type { LonghandProgram, ParsedClause, ParsedValue } from '../ast/valueTypes'

export const longhandExpansionTable: Readonly<Record<string, readonly string[]>> = {
  padding: ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
  paddingHorizontal: ['paddingLeft', 'paddingRight'],
  paddingVertical: ['paddingTop', 'paddingBottom'],
  margin: ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'],
  marginHorizontal: ['marginLeft', 'marginRight'],
  marginVertical: ['marginTop', 'marginBottom'],
  inset: ['top', 'right', 'bottom', 'left'],
  borderWidth: [
    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',
  ],
  borderColor: [
    'borderTopColor',
    'borderRightColor',
    'borderBottomColor',
    'borderLeftColor',
  ],
  borderStyle: [
    'borderTopStyle',
    'borderRightStyle',
    'borderBottomStyle',
    'borderLeftStyle',
  ],
  borderRadius: [
    'borderTopLeftRadius',
    'borderTopRightRadius',
    'borderBottomRightRadius',
    'borderBottomLeftRadius',
  ],
  overflow: ['overflowX', 'overflowY'],
  gap: ['rowGap', 'columnGap'],
}

export function expandToLonghands(
  prop: string,
  shorthands?: Record<string, string>
): readonly string[] {
  const resolvedProp = shorthands?.[prop] ?? prop
  return longhandExpansionTable[resolvedProp] ?? [resolvedProp]
}

/**
 * The merge unit is the clause, keyed by its exact condition set (decision
 * 21): the later contribution replaces the base only when it restates one,
 * replaces the clauses whose condition sets it restates, and its clauses
 * append after the surviving earlier ones so last-match-wins holds. A styled
 * `bg="gray hover:blue"` overridden by a call-site `bg="red"` keeps the
 * hover clause, matching tailwind-merge's per-variant conflict groups.
 */
export function mergeProgramValues(
  earlier: ParsedValue,
  later: ParsedValue
): ParsedValue {
  const base = later.base ?? earlier.base
  if (!earlier.clauses.length) {
    return base === later.base ? later : { base, clauses: later.clauses }
  }
  if (!later.clauses.length) {
    return base === earlier.base ? earlier : { base, clauses: earlier.clauses }
  }
  const restated = new Set<string>()
  for (const clause of later.clauses) {
    restated.add(clauseConditionSetKey(clause.modifiers))
  }
  const clauses: ParsedClause[] = []
  for (const clause of earlier.clauses) {
    if (!restated.has(clauseConditionSetKey(clause.modifiers))) clauses.push(clause)
  }
  for (const clause of later.clauses) clauses.push(clause)
  return { base, clauses }
}

export function mergePrograms(
  entries: ReadonlyArray<{ prop: string; value: ParsedValue }>,
  shorthands?: Record<string, string>
): Map<string, LonghandProgram> {
  const programs = new Map<string, LonghandProgram>()

  for (const { prop, value } of entries) {
    for (const property of expandToLonghands(prop, shorthands)) {
      const existing = programs.get(property)
      const merged = existing ? mergeProgramValues(existing.value, value) : value
      programs.delete(property)
      programs.set(property, { property, value: merged, sourceProp: prop })
    }
  }

  return programs
}
